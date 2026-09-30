import { ProjectHero, ProjectBody, Section, P, Img } from '../../components/project'

export default function StillPage() {
  return (
    <div>
      <ProjectHero
        image="https://pic1.imgdb.cn/item/6971603d1404c8e205f11a1f.None"
        title="Still"
        subtitle="Climber's shelter design on the top of the Polish mountain"
      />
      <ProjectBody>
        <Section title="Project Overview">
          <P>
            Exploring the application of sustainable materials and architectural structures, designing a shelter for
            climbers in the Jowada Mountains of Poland. The project utilized locally sourced cedar wood and green
            concrete, easy to construct and dismantle, emphasizing natural, functional, and psychological
            sustainability.
          </P>
          <P>
            The project is located on the top of the Jezowa Woda mountain, serving as a rest and leisure spot for
            mountaineers, as well as a viewing terrace for sightseeing. By considering the needs of climbers, the
            project determines the area required for each functional area of the building. Through transformations in
            form, the final architectural shape was obtained.
          </P>
        </Section>

        <Section title="Location and Layout">
          <P>
            The project is located on the top of Jezowa Woda mountain, where the elevation provides an excellent
            viewing position. The building is divided into two main parts: the main part and the spring part. The main
            part contains the restaurant, viewing terrace, and accommodation areas, while the spring part provides
            spaces for rest and relaxation.
          </P>
          <P>
            By considering the specific needs of climbers, the size and location of each functional area have been
            carefully arranged to provide the optimal user experience, while considering the special nature of the
            mountaintop environment and sustainable use of resources.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160a61404c8e205f11a31.None" alt="Location and layout" />
        </Section>

        <Section title="Spatial Configuration">
          <P>
            The shelter design includes various functional spaces: rest area, bathroom, bathing facilities, locker
            room, restaurant and viewing terrace, lobby, etc. The spatial layout considers the climbers' behavioral
            paths and activity needs, forming a smooth spatial experience from entering the lobby to resting, dining,
            and viewing.
          </P>
          <P>
            Through the transformation of form, the building ultimately forms an appearance and internal spatial
            layout that echoes the mountain environment, providing a practical and comfortable shelter environment.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160081404c8e205f11a1a.None" alt="Spatial configuration" />
        </Section>

        <Section title="Structural Details">
          <P>
            The project employs various wood structural connection techniques, including dovetail joints for staircase
            pillar structures, roof purlin overlap structures, secondary roof purlin overlap structures, and more. The
            ground diagonal brace and concrete metal linkage structures, column and concrete metal connection
            structures, and normal beam-column overlap structures are all carefully designed to ensure structural
            stability and durability.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160d71404c8e205f11a4c.None" alt="Structural details" />
        </Section>

        <Section title="Material Application">
          <P>
            The main materials used in the project include: 20mm thick veneer lumber, 20mm thick plasticized glass,
            30mm thick fir wood planks, thermal insulation material, 120mm side length fir columns, 120×240mm fir
            secondary beams, 20mm thick veneer lumber, C15 360 steel-concrete beams and columns, etc. The wood used is
            birch wood planks, the concrete parts use PVC panels coated with mixed mature lime acrylic, and the glass
            parts use transparent acrylic panels.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160cc1404c8e205f11a47.None" alt="Material application" />
        </Section>
      </ProjectBody>
    </div>
  )
}
