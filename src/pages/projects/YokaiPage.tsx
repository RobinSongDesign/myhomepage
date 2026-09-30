import { ProjectHero, ProjectBody, Section, P, Img } from '../../components/project'

export default function YokaiPage() {
  return (
    <div>
      <ProjectHero
        image="https://pic1.imgdb.cn/item/697160cc1404c8e205f11a46.None"
        title="Yokai Hall"
        subtitle="Traditional Performing Arts Information Center"
      />
      <ProjectBody>
        <Section title="Project Overview">
          <P>
            This project takes inspiration from the Cubism approach to form and space by renowned architect Le
            Corbusier. Situated in the district of Chiyoda in Tokyo, the "Traditional Performing Arts Information
            Center" not only serves as a building but as a nexus between the past and present, the static and the
            dynamic.
          </P>
          <P>
            Drawing inspiration from Japan's traditional performing arts, particularly the mystical 'Yokai', the
            project transforms cultural symbols into unique spatial experiences, reflecting respect for Japanese
            traditional culture while incorporating modern architectural language.
          </P>
        </Section>

        <Section title="Creative Process & Site Analysis">
          <P>
            I began by exploring the intriguing aspects of Japan's traditional performing arts, particularly the
            mystical 'Yokai.' Using hands-on collage techniques, I transformed these elements into distinct symbols,
            setting the stage for an art form deeply connected to cultural shapes and motifs.
          </P>
          <P>
            The Traditional Arts Information Center is located on the opposite side of the National Theater from the
            Uchibori-dori, where the main entrance of the National Theater is situated. It's on the National
            Theater-dori side. When you proceed on the National Theater-dori from Hanzomon, you'll find a slope
            designed to avoid steps. By going up this slope, you enter the premises of the National Theater.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160cd1404c8e205f11a49.None" alt="Creative process and site analysis" />
        </Section>

        <Section title="Spatial Composition">
          <P>
            The building consists of multiple functional areas, including the Main Exhibition Hall, Equipment room,
            Circulation tube, Secondary Exhibition Hall, Restroom, External Entrance, Archive Room, and Multimedia
            Hall. From these two-dimensional designs, my personal insights and reflections helped morph these concepts
            into three-dimensional forms, merging traditional narratives with spatial dynamics.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160a61404c8e205f11a30.None" alt="Spatial composition" />
        </Section>

        <Section title="Form Inspiration & Materials">
          <P>
            Inspired by Japan's traditional arts and the tales of 'Yokai', this space melds simple shapes with modern
            design. The central circulation shaft takes the form of a Reuleaux triangle, a unique shape that
            complements the overlapping structures, showcasing the transformation of flat designs into a vibrant
            three-dimensional space. Natural light filters in, casting gentle shadows and crafting a serene, welcoming
            ambiance.
          </P>
          <P>
            Exterior materials include brushed aluminum panels, with light steel for the structure truss. Interior
            materials feature wood grain aluminum panels, while wall materials consist of cement fiberboard, white
            emulsion paint, and light steel structure.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160cb1404c8e205f11a44.None" alt="Form inspiration and materials" />
        </Section>

        <Section title="Le Corbusier's Influence">
          <P>
            Based on Cubism, Le Corbusier pioneered the Pure Modernism movement. He believed in the deconstruction and
            abstraction of natural elements, asserting that everything in the world can be abstracted into regular,
            orderly patterns. This perspective deeply influenced his architectural characteristics, integrating form
            into space, especially by introducing natural light to craft the aesthetic beauty within his designs.
          </P>
        </Section>

        <Section title="Structure and Texture">
          <P>
            Intuitively, people find it hard to perceive a building as beautiful if its structure seems illogical,
            regardless of how much it's embellished. It would still feel like a castle in the air. Structures can be
            likened to the human skeleton, where the depth and dimension of a face depend on the shape of the skull.
            The same principle applies to architecture. Therefore, in my quest for form and aesthetics, I delved deep
            into the outer shell's design. I employed brushed aluminum panels for the facade, creating a coherent
            structural framework, while the interior features wood-grain metal panels, evoking a sense of transparency
            and tranquility.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160bb1404c8e205f11a3c.None" alt="Structure and texture" />
        </Section>

        <Section title="Reflections on Spatial Form">
          <P>
            This subject led to questions on spatial form: What defines a logical space? What shapes possess aesthetic
            appeal? How can one strike a harmonious balance between the beauty of form and the practicality of space?
          </P>
          <P>
            After numerous attempts to experiment with various forms, I found it challenging to precisely convey the
            spatial experience I envisioned. It was at this moment I realized that for an aesthetic form to
            effectively blend into a tangible space, a sound structural foundation is paramount.
          </P>
          <Img src="https://pic1.imgdb.cn/item/6971610b1404c8e205f11a56.None" alt="Spatial form reflection" />
        </Section>
      </ProjectBody>
    </div>
  )
}
