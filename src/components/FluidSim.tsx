import { useEffect, useRef } from 'react'

interface FluidConfig {
  NU: number
  PRESSURE: number
  DISPLAY: string
  RADIUS: number
  VELOCITY_DISSIPATION: number
  DYE_DISSIPATION: number
  SIM_RESOLUTION: number
  DYE_RESOLUTION: number
  SPLAT_FORCE: number
}

const logScale = (value: number, a: number, b: number) => a * Math.pow(b / a, value)
const viscosityTransform = (v: number) => logScale(v, 0.0001, 1000)
const radiusTransform = (v: number) => logScale(v, 0.0001, 0.01)
const dissipationTransform = (v: number) => 1 - logScale(v, 0.001, 0.1)

function defaultConfig(): FluidConfig {
  return {
    NU: viscosityTransform(0.5),
    PRESSURE: 0.25,
    DISPLAY: 'dye',
    RADIUS: radiusTransform(0.5),
    VELOCITY_DISSIPATION: dissipationTransform(0.25),
    DYE_DISSIPATION: dissipationTransform(0.25),
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    SPLAT_FORCE: 20,
  }
}

export default function FluidSim({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<FluidConfig>(defaultConfig())

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    if (!canvas) return
    const gl: WebGL2RenderingContext = canvas.getContext('webgl2')!
    if (!gl) return
    gl.getExtension('EXT_color_buffer_float')

    const config = configRef.current

    // ---- Shaders (from SF.js) ----
    const utilityNeighbors = `
struct Neighbors { vec4 l; vec4 r; vec4 t; vec4 b; vec4 c; };
Neighbors tex_neighbors(sampler2D tex, ivec2 pos) {
  vec4 b = texelFetch(tex, pos - ivec2(0, 1), 0);
  vec4 t = texelFetch(tex, pos + ivec2(0, 1), 0);
  vec4 l = texelFetch(tex, pos - ivec2(1, 0), 0);
  vec4 r = texelFetch(tex, pos + ivec2(1, 0), 0);
  vec4 c = texelFetch(tex, pos, 0);
  return Neighbors(l, r, t, b, c);
}`

    const baseVs = `#version 300 es
in vec2 a_position;
out vec2 v_position;
void main() { v_position = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0, 1); }`

    const advectionFs = `#version 300 es
precision highp float;
uniform sampler2D u_v; uniform sampler2D u_x; uniform float u_dt; uniform float u_dissipation;
out vec4 res;
vec4 bilerp(sampler2D tex, vec2 x_norm, vec2 size) {
  vec2 x = x_norm * size - 0.5; vec2 fx = fract(x); ivec2 ix = ivec2(floor(x));
  vec4 x00 = texelFetch(tex, ix + ivec2(0,0), 0); vec4 x01 = texelFetch(tex, ix + ivec2(0,1), 0);
  vec4 x10 = texelFetch(tex, ix + ivec2(1,0), 0); vec4 x11 = texelFetch(tex, ix + ivec2(1,1), 0);
  return mix(mix(x00, x10, fx.x), mix(x01, x11, fx.x), fx.y);
}
void main() {
  vec2 size_v = vec2(textureSize(u_v, 0)); vec2 size_x = vec2(textureSize(u_x, 0));
  vec2 aspect_ratio = vec2(size_x.x / size_x.y, 1.0);
  vec2 normalized_pos = gl_FragCoord.xy / size_x;
  vec2 prev = normalized_pos - u_dt * bilerp(u_v, normalized_pos, size_v).xy / aspect_ratio;
  res = u_dissipation * bilerp(u_x, prev, size_x);
}`

    const jacobiFs = `#version 300 es
precision highp float;
uniform sampler2D u_x; uniform sampler2D u_b; uniform float u_alpha; uniform float u_beta;
out vec4 res;
${utilityNeighbors}
void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy);
  Neighbors n = tex_neighbors(u_x, pos); vec4 b = texelFetch(u_b, pos, 0);
  res = (n.b + n.t + n.l + n.r + u_alpha * b) / u_beta;
}`

    const subtractGradFs = `#version 300 es
precision highp float;
uniform sampler2D u_v; uniform sampler2D u_p;
out vec4 res;
${utilityNeighbors}
void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy); Neighbors n = tex_neighbors(u_p, pos);
  vec4 grad = vec4(n.r.x - n.l.x, n.t.x - n.b.x, 0, 0) / 2.;
  vec4 init_v = texelFetch(u_v, pos, 0);
  res = init_v - grad;
}`

    const divFs = `#version 300 es
precision highp float;
uniform sampler2D u_x;
out vec4 res;
${utilityNeighbors}
void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy); Neighbors n = tex_neighbors(u_x, pos);
  float div = (n.r.x - n.l.x + n.t.y - n.b.y) / 2.;
  res = vec4(div, 0, 0, 1);
}`

    const boundaryFs = `#version 300 es
precision highp float;
in vec2 v_position;
uniform sampler2D u_x; uniform vec2 u_res; uniform float u_alpha;
out vec4 res;
void main() {
  vec2 dir = vec2(0, 0);
  dir += vec2(lessThan(v_position, u_res)); dir -= vec2(greaterThan(v_position, vec2(1.0) - u_res));
  float coef = length(dir) > 0.0 ? u_alpha : 1.0;
  res = coef * texture(u_x, v_position + dir * u_res);
}`

    const displayFs = `#version 300 es
precision highp float;
in vec2 v_position; uniform sampler2D u_x; uniform float u_alpha; out vec4 res;
void main() { res = u_alpha * texture(u_x, v_position); }`

    const splatFs = `#version 300 es
precision highp float;
in vec2 v_position;
uniform sampler2D u_x; uniform vec2 u_point; uniform vec3 u_value; uniform float u_radius; uniform float u_ratio;
out vec4 res;
void main() {
  vec4 init = texture(u_x, v_position);
  vec2 v = v_position - u_point; v.x *= u_ratio;
  vec3 force = exp(-dot(v, v) / u_radius) * u_value;
  res = vec4(init.xyz + force, 1.);
}`

    function compileShader(type: number, source: string) {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    function createProgram(vs: string, fs: string) {
      const vsShader = compileShader(gl.VERTEX_SHADER, vs)!
      const fsShader = compileShader(gl.FRAGMENT_SHADER, fs)!
      const program = gl.createProgram()!
      gl.attachShader(program, vsShader)
      gl.attachShader(program, fsShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
      }
      gl.bindAttribLocation(program, 0, 'a_position')
      const uniforms: Record<string, WebGLUniformLocation | null> = {}
      const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
      for (let i = 0; i < n; ++i) {
        const info = gl.getActiveUniform(program, i)!
        uniforms[info.name] = gl.getUniformLocation(program, info.name)
      }
      return { program, uniforms }
    }

    const advectionProgram = createProgram(baseVs, advectionFs)
    const jacobiProgram = createProgram(baseVs, jacobiFs)
    const subtractGradProgram = createProgram(baseVs, subtractGradFs)
    const divProgram = createProgram(baseVs, divFs)
    const boundaryProgram = createProgram(baseVs, boundaryFs)
    const displayProgram = createProgram(baseVs, displayFs)
    const splatProgram = createProgram(baseVs, splatFs)

    const POSITION_LOCATION = 0
    let aspectRatio = 1
    let simWidth = 0
    let simHeight = 0
    let dyeWidth = 0
    let dyeHeight = 0

    function getSize(targetSize: number) {
      if (aspectRatio < 1) return { width: targetSize, height: Math.round(targetSize / aspectRatio) }
      return { width: Math.round(targetSize * aspectRatio), height: targetSize }
    }

    function setupSizes() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      aspectRatio = w / h
      if (canvas.width === w && canvas.height === h) return false
      canvas.width = w
      canvas.height = h
      const simSize = getSize(config.SIM_RESOLUTION)
      const dyeSize = getSize(config.DYE_RESOLUTION)
      simWidth = simSize.width
      simHeight = simSize.height
      dyeWidth = dyeSize.width
      dyeHeight = dyeSize.height
      return true
    }

    // geometry
    const fullVao = gl.createVertexArray()!
    gl.bindVertexArray(fullVao)
    const positionBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const fullPos = new Float32Array([-1, -1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1])
    gl.bufferData(gl.ARRAY_BUFFER, fullPos, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(POSITION_LOCATION)
    gl.vertexAttribPointer(POSITION_LOCATION, 2, gl.FLOAT, false, 0, 0)

    function createFbo(w: number, h: number, internalFormat: number, format: number, type: number, filter: number) {
      const texture = gl.createTexture()!
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
      const fb = gl.createFramebuffer()!
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      return {
        tex: texture,
        fb,
        bind: () => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
          gl.viewport(0, 0, w, h)
        },
        bindTex: (i: number) => {
          gl.activeTexture(gl.TEXTURE0 + i)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          return i
        },
      }
    }

    function createFboPair(w: number, h: number, internalFormat: number, format: number, type: number, filter: number) {
      return {
        read: createFbo(w, h, internalFormat, format, type, filter),
        write: createFbo(w, h, internalFormat, format, type, filter),
        swap() {
          const tmp = this.read
          this.read = this.write
          this.write = tmp
        },
      }
    }

    function render(fbo: { bind: () => void } | null, count: number, clear = false) {
      gl.bindVertexArray(fullVao)
      if (fbo) fbo.bind()
      else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      if (clear) {
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
      gl.drawArrays(gl.TRIANGLES, 0, count)
    }

    function resizeFbo(src: any, w: number, h: number, internalFormat: number, format: number, type: number, filter: number) {
      const newFbo = createFbo(w, h, internalFormat, format, type, filter)
      gl.useProgram(displayProgram.program)
      gl.uniform1i(displayProgram.uniforms.u_x, src.bindTex(0))
      render(newFbo, 6)
      return newFbo
    }

    function resizeFboPair(src: any, w: number, h: number, internalFormat: number, format: number, type: number, filter: number) {
      const newFbo = createFboPair(w, h, internalFormat, format, type, filter)
      newFbo.read = resizeFbo(src.read, w, h, internalFormat, format, type, filter)
      newFbo.write = resizeFbo(src.write, w, h, internalFormat, format, type, filter)
      return newFbo
    }

    setupSizes()

    let velocity = createFboPair(simWidth, simHeight, gl.RG32F, gl.RG, gl.FLOAT, gl.NEAREST)
    let pressure = createFboPair(simWidth, simHeight, gl.R32F, gl.RED, gl.FLOAT, gl.NEAREST)
    let tmp1f = createFbo(simWidth, simHeight, gl.R32F, gl.RED, gl.FLOAT, gl.NEAREST)
    let dye = createFboPair(dyeWidth, dyeHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST)

    function setupFbos() {
      velocity = resizeFboPair(velocity, simWidth, simHeight, gl.RG32F, gl.RG, gl.FLOAT, gl.NEAREST)
      pressure = resizeFboPair(pressure, simWidth, simHeight, gl.R32F, gl.RED, gl.FLOAT, gl.NEAREST)
      dye = resizeFboPair(dye, dyeWidth, dyeHeight, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST)
      tmp1f = createFbo(simWidth, simHeight, gl.R32F, gl.RED, gl.FLOAT, gl.NEAREST)
    }

    function renderScreen(fbo: any) {
      gl.useProgram(displayProgram.program)
      gl.uniform1i(displayProgram.uniforms.u_x, fbo.bindTex(0))
      gl.uniform1f(displayProgram.uniforms.u_alpha, 1.0)
      render(null, 6)
    }

    function setBoundary(fboPair: any, alpha: number) {
      gl.useProgram(boundaryProgram.program)
      gl.uniform2f(boundaryProgram.uniforms.u_res, 1 / simWidth, 1 / simHeight)
      gl.uniform1i(boundaryProgram.uniforms.u_x, fboPair.read.bindTex(0))
      gl.uniform1f(boundaryProgram.uniforms.u_alpha, alpha)
      render(fboPair.write, 6)
      fboPair.swap()
    }

    function stepSim(dt: number) {
      setBoundary(velocity, -1.0)
      gl.useProgram(advectionProgram.program)
      gl.uniform1i(advectionProgram.uniforms.u_v, 0)
      gl.uniform1i(advectionProgram.uniforms.u_x, velocity.read.bindTex(0))
      gl.uniform1f(advectionProgram.uniforms.u_dt, dt)
      gl.uniform1f(advectionProgram.uniforms.u_dissipation, config.VELOCITY_DISSIPATION)
      render(velocity.write, 6)
      velocity.swap()

      setBoundary(dye, 0)
      gl.useProgram(advectionProgram.program)
      gl.uniform1i(advectionProgram.uniforms.u_v, velocity.read.bindTex(0))
      gl.uniform1i(advectionProgram.uniforms.u_x, dye.read.bindTex(1))
      gl.uniform1f(advectionProgram.uniforms.u_dt, dt)
      gl.uniform1f(advectionProgram.uniforms.u_dissipation, config.DYE_DISSIPATION)
      render(dye.write, 6)
      dye.swap()

      setBoundary(velocity, -1.0)
      gl.useProgram(jacobiProgram.program)
      const factor = 1 / (config.NU * dt)
      gl.uniform1f(jacobiProgram.uniforms.u_alpha, factor)
      gl.uniform1f(jacobiProgram.uniforms.u_beta, factor + 4.0)
      for (let i = 0; i < 20; i++) {
        gl.uniform1i(jacobiProgram.uniforms.u_x, velocity.read.bindTex(0))
        gl.uniform1i(jacobiProgram.uniforms.u_b, velocity.read.bindTex(0))
        render(velocity.write, 6)
        velocity.swap()
      }

      setBoundary(velocity, -1)
      gl.useProgram(divProgram.program)
      gl.uniform1i(divProgram.uniforms.u_x, velocity.read.bindTex(0))
      render(tmp1f, 6)

      gl.useProgram(displayProgram.program)
      gl.uniform1i(displayProgram.uniforms.u_x, pressure.read.bindTex(0))
      gl.uniform1f(displayProgram.uniforms.u_alpha, config.PRESSURE)
      render(pressure.write, 6)
      pressure.swap()

      for (let i = 0; i < 50; i++) {
        setBoundary(pressure, 1)
        gl.useProgram(jacobiProgram.program)
        gl.uniform1i(jacobiProgram.uniforms.u_b, tmp1f.bindTex(0))
        gl.uniform1i(jacobiProgram.uniforms.u_x, pressure.read.bindTex(1))
        gl.uniform1f(jacobiProgram.uniforms.u_alpha, -1.0)
        gl.uniform1f(jacobiProgram.uniforms.u_beta, 4.0)
        render(pressure.write, 6)
        pressure.swap()
      }

      setBoundary(velocity, -1)
      setBoundary(pressure, 1)
      gl.useProgram(subtractGradProgram.program)
      gl.uniform1i(subtractGradProgram.uniforms.u_p, pressure.read.bindTex(0))
      gl.uniform1i(subtractGradProgram.uniforms.u_v, velocity.read.bindTex(1))
      render(velocity.write, 6)
      velocity.swap()
    }

    // pointers
    const pointers: any[] = []
    function createPointer(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      return {
        id: e.pointerId,
        x: (e.clientX - rect.left) / canvas.clientWidth,
        y: 1 - (e.clientY - rect.top) / canvas.clientHeight,
        dx: 0,
        dy: 0,
        color: [Math.random(), Math.random(), Math.random()],
      }
    }
    function stepUser() {
      pointers.forEach((p) => {
        gl.useProgram(splatProgram.program)
        gl.uniform1i(splatProgram.uniforms.u_x, velocity.read.bindTex(0))
        gl.uniform2fv(splatProgram.uniforms.u_point, [p.x, p.y])
        gl.uniform3fv(splatProgram.uniforms.u_value, [p.dx * aspectRatio, p.dy, 0].map((c) => c * config.SPLAT_FORCE))
        gl.uniform1f(splatProgram.uniforms.u_radius, config.RADIUS)
        gl.uniform1f(splatProgram.uniforms.u_ratio, aspectRatio)
        render(velocity.write, 6)
        velocity.swap()
        gl.uniform1i(splatProgram.uniforms.u_x, dye.read.bindTex(0))
        gl.uniform3fv(splatProgram.uniforms.u_value, p.color.map((c: number) => c * 0.2))
        render(dye.write, 6)
        dye.swap()
      })
    }

    const onPointerDown = (e: PointerEvent) => pointers.push(createPointer(e))
    const onPointerUp = (e: PointerEvent) => {
      const idx = pointers.findIndex((p) => p.id === e.pointerId)
      if (idx >= 0) pointers.splice(idx, 1)
    }
    const onPointerMove = (e: PointerEvent) => {
      const idx = pointers.findIndex((p) => p.id === e.pointerId)
      if (idx < 0) return
      const np = createPointer(e)
      const old = pointers[idx]
      np.color = old.color
      np.dx = np.x - old.x
      np.dy = np.y - old.y
      pointers[idx] = np
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointermove', onPointerMove)

    let lastTime = 0
    let rafId = 0
    function loop(t: number) {
      const dt = (t - lastTime) / 1000
      lastTime = t
      if (setupSizes()) setupFbos()
      stepUser()
      stepSim(dt)
      renderScreen(
        config.DISPLAY === 'velocity' ? velocity.read : config.DISPLAY === 'pressure' ? pressure.read : dye.read,
      )
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ backgroundColor: 'black', touchAction: 'none', cursor: 'crosshair' }}
      />

      {/* 鼠标引导 */}
      <div className="mouse-guide hidden sm:block">
        <svg width="20" height="28" viewBox="0 0 20 28" fill="currentColor" className="mx-auto">
          <rect x="2" y="2" width="16" height="24" rx="8" ry="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M2 10 L2 8 C2 5.2 4.2 3 7 3 L10 3 L10 14 L4 14 C2.9 14 2 13.1 2 12 L2 10 Z" fill="currentColor" />
          <path d="M10 3 L13 3 C15.8 3 18 5.2 18 8 L18 10 L18 12 C18 13.1 17.1 14 16 14 L10 14 L10 3 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <rect x="9" y="6" width="2" height="4" rx="1" fill="currentColor" opacity="0.6" />
        </svg>
        <div className="text-sm mt-2 opacity-90">Click and Drag</div>
      </div>

      {/* 参数面板 */}
      <form
        className="absolute bottom-0 right-0 flex flex-col items-end text-sm p-4 bg-black/50 text-white z-20"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="hidden sm:flex items-center gap-2">
          <label className="whitespace-nowrap">viscosity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            defaultValue="0.50"
            className="slider w-32"
            onChange={(e) => (configRef.current.NU = viscosityTransform(Number(e.target.value)))}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <label className="whitespace-nowrap">pressure</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            defaultValue="0.25"
            className="slider w-32"
            onChange={(e) => (configRef.current.PRESSURE = Number(e.target.value))}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <label className="whitespace-nowrap">radius</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.5"
            className="slider w-32"
            onChange={(e) => (configRef.current.RADIUS = radiusTransform(Number(e.target.value)))}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <label className="whitespace-nowrap">velocity dissipation</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            defaultValue="0.25"
            className="slider w-32"
            onChange={(e) => (configRef.current.VELOCITY_DISSIPATION = dissipationTransform(Number(e.target.value)))}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <label className="whitespace-nowrap">density dissipation</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            defaultValue="0.25"
            className="slider w-32"
            onChange={(e) => (configRef.current.DYE_DISSIPATION = dissipationTransform(Number(e.target.value)))}
          />
        </div>
      </form>

      {children}
    </div>
  )
}
