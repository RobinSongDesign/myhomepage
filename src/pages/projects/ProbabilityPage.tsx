import { ProjectHero, ProjectBody, Section, P, Img } from '../../components/project'

export default function ProbabilityPage() {
  return (
    <div>
      <ProjectHero
        image="https://pic1.imgdb.cn/item/697160631404c8e205f11a21.None"
        title="Probability"
        subtitle="Collective residential building generated using Wave Function Collapse algorithm"
      />
      <ProjectBody>
        <Section title="Project Overview">
          <P>
            This project focuses on researching and applying the Wave Function Collapse algorithm to architectural
            design, aiming to create innovative, algorithm-driven modular layouts. This exploration is pivotal in
            advancing architectural computation, integrating sustainability and functionality in modern urban
            development.
          </P>
          <P>
            WFC is not a growth algorithm — it always generates a complete valid aggregate (or no solution at all),
            leaving no slots empty. It has important implications for design, architecture and urban planning: the
            aggregates are not branching, but create rhizomatic structures; there is no overlapping; there are no
            untreated areas.
          </P>
        </Section>

        <Section title="Logical Coherence">
          <P>
            When assessing different tools for discrete design, the WFC algorithm shows clear advantages in logical
            coherence, rule complexity, and design diversity. It can not only simulate natural processes but also
            offers user interactivity and computational efficiency.
          </P>
          <Img
            src="https://pic1.imgdb.cn/item/6971610c1404c8e205f11a5a.None"
            alt="Logical coherence diagram"
          />
        </Section>

        <Section title="Modules and Rules">
          <P>
            The project developed various module types, including residential modules (double rooms, single rooms,
            offices), connection modules (platforms, elevators, staircases), and connectors in various directions.
            For given specific shapes of slots, the algorithm can identify and provide solutions for the current
            condition of the slots.
          </P>
          <Img src="https://pic1.imgdb.cn/item/697160bc1404c8e205f11a3d.None" alt="Modules and rules" />
        </Section>

        <Section title="Master Plan">
          <Img src="https://pic1.imgdb.cn/item/6971608c1404c8e205f11a29.None" alt="Master plan" />
        </Section>

        <Section title="Elevations & Sections">
          <Img
            src="https://pic1.imgdb.cn/item/6971608d1404c8e205f11a2d.None"
            alt="Elevations and sections"
          />
        </Section>
      </ProjectBody>
    </div>
  )
}
