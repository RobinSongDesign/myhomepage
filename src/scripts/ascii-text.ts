/**
 * Re-types text as ASCII, in the spirit of the logo. A canvas laid over the
 * element draws it; the real text stays in place, transparent, for layout,
 * selection and screen readers.
 *
 *   data-ascii="art"   the text is drawn large and filled with characters by
 *                      coverage, like the planet in the logo
 *   data-ascii="type"  every character is redrawn as itself
 *
 * A word marked data-ascii-alt="…" dissolves into the alternative, one
 * character at a time, while the pointer is over it (or on tap) — and back
 * again. Characters the pointer passes over swell up and settle back, leaving
 * a short trail.
 */

const RAMP = ' .:-=+*#%@';
const NOISE = '#%&*+=-:;/\\|<>?!$@';
const MONO = '"Geist Mono Variable", ui-monospace, Menlo, monospace';
const SS = 2; // subsamples per cell, per axis, when rasterising art
const SWEEP = 560; // ms for a dissolve to cross the word, left to right
const JITTER = 260; // random extra delay per cell, so they turn one by one
const SETTLE = 0.22; // s for a swollen character to shrink back by ~63%

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const fontOf = (el: Element) => {
  const cs = getComputedStyle(el);
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
};
const rgb = (hex: string) => {
  const m = /^#([\da-f]{6})$/i.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

interface Cell {
  /** Centre, in canvas px. */
  x: number;
  y: number;
  /** The character for the text as written, and with the alternatives swapped in. */
  base: string;
  alt: string;
  /** What it shows at rest, what it is heading for, and when it scrambles in between. */
  shown: string;
  target: string;
  start: number;
  end: number;
  seed: number;
  /** How swollen it is, 0–1. */
  heat: number;
}

interface Glyph {
  ch: string;
  /** Box of the character on the page, in canvas px. */
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One pointer for every text on the page. */
const pointer = { x: 0, y: 0, inside: false, touch: false };

class AsciiText {
  el: HTMLElement;
  art: boolean;
  canvas = document.createElement('canvas');
  ctx = this.canvas.getContext('2d')!;
  off = document.createElement('canvas');
  octx = this.off.getContext('2d', { willReadFrequently: true })!;
  cells: Cell[] = [];

  width = 0;
  height = 0;
  dpr = 1;
  font = '';
  /** Drop from a cell's centre to the baseline its glyph is drawn on. */
  oy = 0;
  /** How close the pointer must pass to swell a character, and how big it gets. */
  reach = 0;
  grow = 1;
  halo = 0;
  /** Where hovering brings in the alternative, in canvas px. */
  zone: { left: number; top: number; right: number; bottom: number } | null = null;
  useAlt = false;

  ink = '';
  accent = '';
  paper = '';
  mix: (t: number) => string = () => this.accent;

  /** The pointer last frame, in canvas px, so a quick sweep still swells every character it crossed. */
  last: { x: number; y: number } | null = null;
  until = 0; // when the last scheduled scramble ends
  dirty = true;
  entered = false;

  constructor(el: HTMLElement) {
    this.el = el;
    this.art = el.dataset.ascii === 'art';
    this.canvas.setAttribute('aria-hidden', 'true');
    // The canvas overhangs the element, so it opts out of the global max-width.
    // Chrome also lets canvas text inherit the element's letter-spacing; the
    // display type's negative tracking would otherwise squeeze every cell.
    Object.assign(this.canvas.style, { position: 'absolute', maxWidth: 'none', pointerEvents: 'none', letterSpacing: '0px' });
    el.append(this.canvas);
    this.readTheme();
    this.layout();
    el.classList.add('is-ascii');
  }

  readTheme() {
    this.ink = cssVar('--ink');
    this.accent = cssVar('--accent');
    this.paper = cssVar('--paper');
    // Swollen characters warm from ink to the accent.
    const a = rgb(this.ink);
    const b = rgb(this.accent);
    this.mix = a && b ? (t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})` : () => this.accent;
    this.dirty = true;
  }

  layout() {
    const size = parseFloat(getComputedStyle(this.el).fontSize);
    const c = this.ctx;
    let cellW = 0;
    let cellH = 0;
    let glyphPx = size;
    if (this.art) {
      // Cells shrink with the type, so the letters stay several rows tall.
      glyphPx = Math.max(5, Math.min(9, Math.round(size / 17.5)));
      this.font = `${glyphPx}px ${MONO}`;
      c.font = this.font;
      cellW = c.measureText('M').width || glyphPx * 0.6;
      cellH = Math.round(glyphPx * 1.15 * 10) / 10;
      this.reach = cellW * 1.8;
      this.grow = 3.4;
    } else {
      this.font = fontOf(this.el);
      c.font = this.font;
      this.reach = c.measureText('M').width * 1.1;
      this.grow = 2.1;
    }
    this.halo = glyphPx * 0.22;

    // Room around the text for descenders and swollen characters.
    const bleed = Math.ceil(Math.max(this.art ? size * 0.3 : 0, glyphPx * this.grow * 0.7));
    const rect = this.el.getBoundingClientRect();
    this.width = rect.width + 2 * bleed;
    this.height = rect.height + 2 * bleed;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    Object.assign(this.canvas.style, {
      left: `${-bleed}px`,
      top: `${-bleed}px`,
      width: `${this.width}px`,
      height: `${this.height}px`,
    });
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    const origin = { left: rect.left - bleed, top: rect.top - bleed };

    const before = new Map(this.cells.map((cell) => [`${cell.x},${cell.y}`, cell]));
    if (this.art) this.rasterize(origin, cellW, cellH);
    else this.typeset(origin);

    // Cells that didn't move keep whatever they were doing (a re-layout often
    // changes nothing); the rest start at rest.
    for (const cell of this.cells) {
      const old = before.get(`${cell.x},${cell.y}`);
      if (old && old.base === cell.base && old.alt === cell.alt) {
        Object.assign(cell, { shown: old.shown, target: old.target, start: old.start, end: old.end, seed: old.seed, heat: old.heat });
      } else {
        cell.target = cell.shown = this.useAlt ? cell.alt : cell.base;
      }
    }
    this.last = null;
    if (this.art && !this.entered && !reduced) this.enter();
    this.entered = true;
    this.dirty = true;
  }

  /** Every character as laid out on the page — or, with `alt`, with the alternatives swapped in. */
  glyphs(alt: boolean, origin: { left: number; top: number }): Glyph[] {
    const swaps = alt ? [...this.el.querySelectorAll<HTMLElement>('[data-ascii-alt]')] : [];
    const saved = swaps.map((s) => s.textContent ?? '');
    swaps.forEach((s) => (s.textContent = s.dataset.asciiAlt ?? ''));

    const out: Glyph[] = [];
    const range = document.createRange();
    const walker = document.createTreeWalker(this.el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? '';
      for (let i = 0; i < text.length; i++) {
        if (/\s/.test(text[i])) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (!r.width) continue;
        out.push({ ch: text[i], x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });
      }
    }

    swaps.forEach((s, i) => (s.textContent = saved[i]));
    return out;
  }

  /** Paint the text, and again with its alternatives, small; then type each cell by coverage. */
  rasterize(origin: { left: number; top: number }, cellW: number, cellH: number) {
    const cols = Math.ceil(this.width / cellW);
    const rows = Math.ceil(this.height / cellH);
    const o = this.octx;
    this.off.width = cols * SS;
    this.off.height = rows * SS;
    o.font = fontOf(this.el);
    o.textAlign = 'left';
    o.textBaseline = 'alphabetic';
    // A character's box on the page starts at the font's ascent above its baseline.
    const ascent = o.measureText('H').fontBoundingBoxAscent;

    // One pass per version, both in white: Chrome antialiases text differently
    // per colour, so painting them into separate channels would make the shared
    // letters come out slightly different.
    const cover = (glyphs: Glyph[]) => {
      o.setTransform(1, 0, 0, 1, 0, 0);
      o.fillStyle = '#000';
      o.fillRect(0, 0, this.off.width, this.off.height);
      o.setTransform(SS / cellW, 0, 0, SS / cellH, 0, 0);
      o.fillStyle = '#fff';
      for (const g of glyphs) o.fillText(g.ch, g.x, g.y + ascent);
      return o.getImageData(0, 0, this.off.width, this.off.height).data;
    };
    const base = cover(this.glyphs(false, origin));
    const alt = this.el.querySelector('[data-ascii-alt]') ? cover(this.glyphs(true, origin)) : base;

    const ow = this.off.width;
    const norm = 255 * SS * SS;
    const type = (sum: number) => {
      const c = sum / norm;
      return c > 0.06 ? RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(c * (RAMP.length - 1)))] : ' ';
    };
    this.cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let a = 0;
        let b = 0;
        for (let sy = 0; sy < SS; sy++) {
          let i = ((row * SS + sy) * ow + col * SS) * 4;
          for (let sx = 0; sx < SS; sx++, i += 4) {
            a += base[i];
            b += alt[i];
          }
        }
        const chA = type(a);
        const chB = type(b);
        if (chA === ' ' && chB === ' ') continue;
        this.cells.push(this.cell((col + 0.5) * cellW, (row + 0.5) * cellH, chA, chB));
      }
    }
    this.oy = 0;

    // Hovering anywhere over the cells that change brings in the alternative.
    const changing = this.cells.filter((c) => c.base !== c.alt);
    this.zone = changing.length
      ? {
          left: Math.min(...changing.map((c) => c.x)) - cellW,
          top: Math.min(...changing.map((c) => c.y)) - cellH,
          right: Math.max(...changing.map((c) => c.x)) + cellW,
          bottom: Math.max(...changing.map((c) => c.y)) + cellH,
        }
      : null;
  }

  /** One cell per character, where the page put it. */
  typeset(origin: { left: number; top: number }) {
    const glyphs = this.glyphs(false, origin);
    // Resizing the canvas reset its font, so set it again before measuring.
    this.ctx.font = this.font;
    const ascent = this.ctx.measureText('H').fontBoundingBoxAscent;
    this.cells = glyphs.map((g) => this.cell(g.x + g.w / 2, g.y + g.h / 2, g.ch, g.ch));
    this.oy = glyphs.length ? ascent - glyphs[0].h / 2 : 0;
  }

  cell(x: number, y: number, base: string, alt: string): Cell {
    const seed = (Math.random() * 2 ** 31) | 0;
    return { x, y, base, alt, shown: base, target: base, start: Infinity, end: Infinity, seed, heat: 0 };
  }

  /** First appearance: every character scrambles in, sweeping left to right. */
  enter() {
    const now = performance.now();
    for (const cell of this.cells) {
      if (cell.target === ' ') continue;
      cell.shown = ' ';
      cell.start = now + (cell.x / this.width) * 700 + rand(0, 300);
      cell.end = cell.start + rand(140, 420);
      this.until = Math.max(this.until, cell.end);
    }
  }

  setAlt(on: boolean) {
    if (on === this.useAlt) return;
    this.useAlt = on;
    const now = performance.now();
    const z = this.zone!;
    for (const cell of this.cells) {
      if (cell.base === cell.alt) continue;
      cell.target = on ? cell.alt : cell.base;
      if (reduced) {
        cell.shown = cell.target;
        continue;
      }
      if (now >= cell.start && now < cell.end) {
        // Already scrambling: keep going and land on the new target.
        cell.end = now + rand(120, 320);
      } else if (cell.shown === cell.target) {
        // Its turn hadn't come yet; nothing to change after all.
        cell.start = cell.end = Infinity;
        continue;
      } else {
        cell.start = now + ((cell.x - z.left) / (z.right - z.left)) * SWEEP + rand(0, JITTER);
        cell.end = cell.start + rand(140, 360);
      }
      this.until = Math.max(this.until, cell.end);
    }
    this.dirty = true;
  }

  tap(x: number, y: number) {
    const r = this.canvas.getBoundingClientRect();
    const z = this.zone;
    if (z && x - r.left >= z.left && x - r.left <= z.right && y - r.top >= z.top && y - r.top <= z.bottom) {
      this.setAlt(!this.useAlt);
    }
  }

  /** Advance one frame; returns whether another is needed. */
  frame(now: number, dt: number) {
    const r = this.canvas.getBoundingClientRect();
    const px = pointer.x - r.left;
    const py = pointer.y - r.top;
    const near = pointer.inside && !pointer.touch && px >= 0 && py >= 0 && px <= r.width && py <= r.height;
    const z = this.zone;
    if (z && !pointer.touch) this.setAlt(near && px >= z.left && px <= z.right && py >= z.top && py <= z.bottom);

    // Swell what the pointer crossed since last frame; let everything else settle back.
    const from = this.last ?? { x: px, y: py };
    const sx = px - from.x;
    const sy = py - from.y;
    const len2 = sx * sx + sy * sy;
    const sweep = near && !reduced;
    const settle = Math.exp(-dt / SETTLE);
    const rise = 1 - Math.exp(-dt * 40);
    let changed = false;
    for (const cell of this.cells) {
      let heat = cell.heat * settle;
      if (sweep) {
        const t = len2 ? Math.max(0, Math.min(1, ((cell.x - from.x) * sx + (cell.y - from.y) * sy) / len2)) : 1;
        const dist = Math.hypot(cell.x - from.x - sx * t, cell.y - from.y - sy * t);
        if (dist < this.reach) {
          const k = 1 - dist / this.reach;
          const want = k * k * (3 - 2 * k);
          if (want > heat) heat = Math.max(cell.heat, heat + (want - heat) * rise);
        }
      }
      if (heat < 0.005) heat = 0;
      changed ||= Math.abs(heat - cell.heat) > 0.001;
      cell.heat = heat;
    }
    this.last = near ? { x: px, y: py } : null;

    // One frame past the last scramble, so every cell lands.
    const animating = now < this.until + 40;
    if (this.dirty || changed || animating) {
      this.draw(now);
      this.dirty = false;
    }
    return changed || animating;
  }

  draw(now: number) {
    const c = this.ctx;
    const { dpr } = this;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, this.width, this.height);
    c.font = this.font;
    c.textAlign = 'center';
    c.textBaseline = this.art ? 'middle' : 'alphabetic';
    c.lineJoin = 'round';

    const tick = Math.floor(now / 70);
    const swollen: { cell: Cell; ch: string; noise: boolean }[] = [];
    let fill = '';
    for (const cell of this.cells) {
      let ch = cell.shown;
      let noise = false;
      if (now >= cell.start) {
        if (now >= cell.end) {
          cell.shown = cell.target;
          cell.start = cell.end = Infinity;
          ch = cell.shown;
        } else {
          ch = NOISE[(Math.imul(cell.seed ^ tick, 2654435761) >>> 0) % NOISE.length];
          noise = true;
        }
      }
      if (ch === ' ') continue;
      if (cell.heat > 0) {
        swollen.push({ cell, ch, noise });
        continue;
      }
      const color = noise ? this.accent : this.ink;
      if (color !== fill) c.fillStyle = fill = color;
      c.fillText(ch, cell.x, cell.y + this.oy);
    }

    // Swollen characters on top, the biggest last, each cut out of what lies beneath.
    swollen.sort((a, b) => a.cell.heat - b.cell.heat);
    c.strokeStyle = this.paper;
    c.lineWidth = this.halo;
    for (const { cell, ch, noise } of swollen) {
      const s = 1 + (this.grow - 1) * cell.heat;
      c.setTransform(dpr * s, 0, 0, dpr * s, dpr * cell.x, dpr * cell.y);
      c.strokeText(ch, 0, this.oy);
      c.fillStyle = noise ? this.accent : this.mix(cell.heat);
      c.fillText(ch, 0, this.oy);
    }
  }
}

const texts: AsciiText[] = [];
let raf = 0;
let last = 0;

function tick(now: number) {
  // A frame's timestamp can predate the event that asked for it, so the first
  // frame after waking counts as a whole one.
  const dt = last ? Math.min(Math.max((now - last) / 1000, 0.001), 0.05) : 1 / 60;
  last = now;
  let busy = false;
  for (const text of texts) busy = text.frame(now, dt) || busy;
  raf = busy ? requestAnimationFrame(tick) : 0;
}

function wake() {
  if (raf) return;
  last = 0;
  raf = requestAnimationFrame(tick);
}

function start(els: HTMLElement[]) {
  for (const el of els) texts.push(new AsciiText(el));

  let pending = 0;
  const relayout = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      texts.forEach((t) => t.layout());
      wake();
    });
  };
  const resize = new ResizeObserver(relayout);
  els.forEach((el) => resize.observe(el));
  document.fonts.addEventListener('loadingdone', relayout);

  new MutationObserver(() => {
    texts.forEach((t) => t.readTheme());
    wake();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      pointer.touch = e.pointerType === 'touch';
      wake();
    },
    { passive: true },
  );
  // No hover on touch screens: a tap swaps the word instead.
  addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType !== 'touch') return;
      pointer.touch = true;
      texts.forEach((t) => t.tap(e.clientX, e.clientY));
      wake();
    },
    { passive: true },
  );
  const leave = () => {
    pointer.inside = false;
    wake();
  };
  document.addEventListener('pointerout', (e) => e.relatedTarget || leave());
  addEventListener('blur', leave);
  addEventListener('scroll', () => pointer.inside && wake(), { passive: true });

  wake();
}

const els = [...document.querySelectorAll<HTMLElement>('[data-ascii]')];
if (els.length) {
  // Measure with the real fonts, not the fallbacks.
  Promise.all([document.fonts.load(`10px ${MONO}`), ...els.map((el) => document.fonts.load(fontOf(el)))])
    .catch(() => {})
    .then(() => start(els));
}
