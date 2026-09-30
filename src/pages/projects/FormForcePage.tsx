import { ProjectHero, ProjectBody, Section, P, Img } from '../../components/project'

export default function FormForcePage() {
  return (
    <div>
      <ProjectHero image="/images/project/ff/1.png" title="Form and Force" subtitle="Research and design based on graphic statics" />
      <ProjectBody>
        <Section title="Project Overview">
          <P>
            The aim of this project is to investigate the correspondence between force and form using graphical
            statics, and to find a new design method to invert form by designing force diagrams.
          </P>
          <P>
            Force corresponds to form and can be vectorized, leading to graphic statics. The information age has
            transformed engineering design with computer-aided graphics, offering convenience and precision. Today's
            architectural innovation challenges the fusion of form and mechanics, prompting scholars and practitioners
            to adopt graphic statics as a vital tool in architectural education and practice, seeking its revival.
          </P>
        </Section>

        <Section title="2D Topology Experiments">
          <P>
            Force corresponds to form and can be vectorized, leading to graphic statics. The information age has
            transformed engineering design with computer-aided graphics, offering convenience and precision. Today's
            architectural innovation challenges the fusion of form and mechanics, prompting scholars and practitioners
            to adopt graphic statics as a vital tool in architectural education and practice, seeking its revival.
          </P>
          <Img
            src="/images/project/ff/Portfolio_Qizhen_Song_compressed_pages-to-jpg-0010.jpg"
            alt="2D topology experiments"
          />
        </Section>

        <Section title="3D Topology Experiments">
          <P>
            Unlike 2D, in 3D graphic statics, the force diagram is represented by a surface, not a vector. The normal
            direction of this surface indicates the direction of the force, and the area represents its magnitude.
            Every form diagram has a corresponding force diagram. Therefore, we can design the force diagram to deduce
            the form, inverting the traditional process of deriving the force diagram from the form for validation.
          </P>
          <Img
            src="/images/project/ff/Portfolio_Qizhen_Song_compressed_pages-to-jpg-0011.jpg"
            alt="3D topology experiments"
          />
        </Section>

        <Section title="Master Plan">
          <P>
            1. Offices &nbsp; 2. Meeting Rooms &nbsp; 3. Elevator Rooms &nbsp; 4. Restrooms &nbsp; 5. Corridors &nbsp;
            6. Triangular Stairs &nbsp; 7. Entrance Garden
          </P>
          <Img
            src="/images/project/ff/Portfolio_Qizhen_Song_compressed_pages-to-jpg-0012.jpg"
            alt="Master plan"
          />
        </Section>

        <Section title="The Reflections of Each Parts">
          <P>
            Utilizing Grasshopper, I've crafted a series of cells composed of precise surfaces, each designed to align
            with a meticulously accurate form. Subsequently, by employing the Polyframe plugin to calculate internal
            forces, the ultimate form emerges.
          </P>
          <Img
            src="/images/project/ff/Portfolio_Qizhen_Song_compressed_pages-to-jpg-0013.jpg"
            alt="Reflections of each parts"
          />
        </Section>

        <Section title="Renders">
          <Img
            src="/images/project/ff/Portfolio_Qizhen_Song_compressed_pages-to-jpg-0014.jpg"
            alt="Renders"
          />
        </Section>
      </ProjectBody>
    </div>
  )
}
