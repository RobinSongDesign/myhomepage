import FluidSim from '../../components/FluidSim'
import { ProjectBody, Section, P, Img } from '../../components/project'

export default function StableShapePage() {
  return (
    <div>
      {/* 流体模拟 Hero */}
      <div className="relative w-full h-[70vh] sm:h-[85vh]">
        <FluidSim>
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <h1 className="text-white text-4xl sm:text-6xl font-light mb-8 opacity-90 drop-shadow-lg">StableShape</h1>
              <div className="flex justify-center space-x-2">
                <a
                  href="https://github.com/Robin-Song-Design/StableShape"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-4 rounded-lg hover:bg-white/30 transition-all duration-300 pointer-events-auto"
                >
                  <i className="fab fa-github text-xl" />
                </a>
                <a
                  href="/files/StableShape v0.9.zip"
                  download="StableShape"
                  className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-4 rounded-lg hover:bg-white/30 transition-all duration-300 space-x-3 pointer-events-auto"
                >
                  <i className="fas fa-download" />
                  <span>Download Latest Release</span>
                </a>
              </div>
            </div>
          </div>
        </FluidSim>
      </div>

      <ProjectBody>
        {/* LinkedIn 视频 */}
        <div className="max-w-6xl mx-auto grid grid-cols-12 mb-12">
          <div className="col-span-12">
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7340807801595641858?compact=1"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                title="Embedded post"
              />
            </div>
          </div>
        </div>

        <Section title="Algorithm Framework">
          <P>
            The core of the StableShape algorithm includes two main components: the StableFluid class and the
            ParticleSystem class. The StableFluid class manages velocity and density fields, resolving the
            Navier-Stokes equations through methods like diffusion, advection, and pressure projection. These methods
            ensure the stability of fluid dynamics simulation.
          </P>
          <P>
            The ParticleSystem class operates on a mesh of particles connected by springs, allowing for tension
            calculations and mesh reconstruction. By treating mesh vertices as particles influenced by a stable
            velocity field, this framework achieves realistic fluid behavior simulation.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160961404c8e205f11a2e.None" alt="Algorithm Framework" />
        </Section>

        <Section title="From Field to Morphology">
          <P>
            The project explores the transformation from scalar fields to morphology. In science, a field is a physical
            quantity, represented by a scalar, vector, or tensor, that has a value for each point in space and time.
            Examples of scalar fields are electric or magnetic fields, containing values for each point on a 2D plane.
            In the fluid case, our scalar field represents fluid density.
          </P>
          <P>
            In three dimensions, the equipotential space of a scalar field is two-dimensional, that is, equipotential
            surfaces. We can use these equipotential surfaces to represent three-dimensional fluid, which differs from
            a 2D height field. Here, any equipotential surface is a three-dimensional closed body, equivalent to a
            contour line.
          </P>
        </Section>

        <Section title="Morphogenesis Methods">
          <Img src="https://pic1.imgdb.cn/item/697161351404c8e205f11a62.None" alt="Morphogenesis Methods" />
          <P>
            StableShape offers two methods for generating morphology: the VDB method and the mesh method. The VDB
            method uses the Dendro plugin to convert density points to volumes. The mesh method employs the particle
            system to process meshes. Through these two methods, complex fluid forms can be evolved from simple
            primitive shapes.
          </P>
          <P>
            The project utilizes the Grasshopper interface for interactive design, including components such as grid
            construction, VDB processing, StableFluid solver, and ParticleSystem solver. This workflow allows designers
            to directly manipulate and observe the evolution of forms in real-time.
          </P>
        </Section>

        <Section title="Implementation Process">
          <Img src="https://pic1.imgdb.cn/item/697160a71404c8e205f11a32.None" alt="Implementation Process" />
          <P>
            The implementation process of the fluid solver includes four main steps: initialization, adding density,
            updating the velocity field, and updating the density field. In each time step, the algorithm resolves the
            Navier-Stokes equations through diffusion, projection, and advection operations, ensuring physical
            accuracy and numerical stability of the fluid simulation.
          </P>
          <P>
            The mesh solver processes the particle system, including mesh topology processing, particle movement,
            tension application, and mesh reconstruction. Through these steps, the system can generate fluid forms
            that evolve over time, providing new possibilities for architectural and design exploration.
          </P>
        </Section>
      </ProjectBody>
    </div>
  )
}
