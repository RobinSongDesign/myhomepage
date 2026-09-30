import {
  ProjectHero,
  ProjectBody,
  Section,
  SubSection,
  P,
  Img,
  BulletList,
  StatCard,
  HeroButton,
} from '../../components/project'

export default function BuildingGeneratorPage() {
  return (
    <div>
      <ProjectHero
        image="https://pic1.imgdb.cn/item/6971607d1404c8e205f11a24.None"
        title="RL-Building Generator"
        subtitle="Agent-based Reinforcement Learning to Increase Housing Density in London"
      >
        <HeroButton
          href="/files/AC_DigitalStudio_WrittenReport_03-27.pdf"
          icon="fas fa-download"
          download
        >
          Download Paper
        </HeroButton>
      </ProjectHero>

      <ProjectBody>
        <Section title="Project Overview">
          <P>
            This research project addresses London's critical housing crisis through innovative application of
            agent-based reinforcement learning. With housing prices rising 130% between 2005-2023 and the city meeting
            only a fraction of its housing expansion targets, our study proposes an AI-driven solution to optimize
            urban density while maintaining livability standards.
          </P>
          <P>
            The project combines advanced machine learning techniques with urban planning principles, utilizing
            multi-agent systems to identify optimal densification strategies. Through comprehensive site
            digitalization and intelligent agent behavior modeling, we create automated tools that can support
            planners, architects, and policymakers in making data-driven decisions for sustainable urban development.
          </P>
        </Section>

        <Section title="Housing Crisis in London">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Price Surge" value="130%" note="Housing price increase between January 2005 and January 2023" />
            <StatCard label="Low Delivery Rate" value="< 50%" note="Of original housing expansion plan met in 2023" />
          </div>
          <P>
            London faces the highest rents in the country, with particularly acute challenges in areas like Waltham
            Forest, which has the fourth highest overcrowding rate in Outer London at 18% of homes classified as
            overcrowded. This project targets these critical areas for intelligent densification solutions.
          </P>
        </Section>

        <Section title="Methodology">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Site Digitalization" value="2D/3D mapping, land use analysis, building indexing" />
            <StatCard label="Agent Modeling" value="Multi-agent systems with ground and roof agents" />
            <StatCard label="RL Training" value="120,000 step training runs with reward optimization" />
            <StatCard label="Optimization" value="Density increase while maintaining livability" />
          </div>
          <P>
            Our approach integrates comprehensive site analysis with intelligent agent-based modeling. The
            digitalization process captures multiple data layers including land use patterns, building functions,
            solar exposure, and spatial relationships through quadtree algorithms for empty space identification.
          </P>
          <P>
            The multi-agent reinforcement learning system employs distinct agent types — ground agents for horizontal
            expansion and roof agents for vertical densification — each trained through extensive simulation runs to
            optimize housing density while preserving environmental quality and regulatory compliance.
          </P>
        </Section>

        <Section title="Site Digitalization & Agent Types">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
              <h4 className="font-semibold mb-2">Land Use Analysis</h4>
              <BulletList
                items={['Residential areas identification', 'Commercial zone mapping', 'Green space preservation']}
              />
            </div>
            <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
              <h4 className="font-semibold mb-2">Building Index</h4>
              <BulletList items={['Height and density mapping', 'Function classification']} />
            </div>
            <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
              <h4 className="font-semibold mb-2">Solar Analysis</h4>
              <BulletList items={['Ground radiation mapping', 'Shadow impact assessment']} />
            </div>
          </div>
        </Section>

        <Section title="Agent">
          <SubSection title="Action">
            <BulletList items={['Move: 6 directions (up, down, front, back, left, right)', 'Occupy: 2 options (occupied or not)']} />
          </SubSection>
          <SubSection title="Observation">
            <BulletList items={['Coordinate: 6 directions', 'Neighbor: 25 + 8 + 1 positions, also check cell types']} />
          </SubSection>
          <SubSection title="Reward Rules">
            <BulletList
              items={[
                'Neighbors underneath: +0.04 × underbuildingCell; exactly above: +2.0; none: -2.0',
                'Neighbors surrounding: +1.0 / -1.0; the first cube always gets reward',
                "Footprint in residential area: +1.0 / -1.0",
                'Footprint away from building: +distance - 2.0',
                'On ground: +0.4 - (0.1 × floor); only the first six cubes',
                'BoundingBox: Compactness = volumeRatio - diagonalRatio (reward if > 0)',
                'Mean Solar Index: SolarDelta = (MeanSunIndex - InitialMeanSunIndex) × 50; cast ray to sun per hour using winter solstice sunlight vector in London',
              ]}
            />
          </SubSection>
        </Section>

        <Section title="Training Results">
          <SubSection title="Orthogonal Building Plot">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Img src="https://pic1.imgdb.cn/item/697160af1404c8e205f11a34.None" alt="Orthogonal before training" caption="Before Training" />
              <Img src="https://pic1.imgdb.cn/item/6971607e1404c8e205f11a27.None" alt="Orthogonal after training" caption="After Training" />
            </div>
          </SubSection>
          <SubSection title="Non-orthogonal Building Plot">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Img src="https://pic1.imgdb.cn/item/6971607c1404c8e205f11a22.None" alt="Non-orthogonal before" caption="Before Training" />
              <Img src="https://pic1.imgdb.cn/item/6971607c1404c8e205f11a23.None" alt="Non-orthogonal after" caption="After Training" />
            </div>
          </SubSection>
        </Section>

        <Section title="Key Performance Metrics">
          <BulletList
            items={[
              'Training Parameters: 120,000 steps per run, ~1.2 hours, 400×400×40m site, 8×8×8 voxel resolution',
              'Optimization Targets: maximize housing density, improve sunlight access, maintain plot ratio compliance, preserve green spaces',
            ]}
          />
        </Section>

        <Section title="Case Study: Waltham Forest">
          <SubSection title="Site Selection Criteria">
            <BulletList
              items={[
                'Mixed land use covering residential, commercial, and green spaces',
                'Well-connected transportation networks and road junctions',
                'Sufficient site dimension (400×400×40m) for comprehensive analysis',
                'Representative of broader London housing challenges',
              ]}
            />
          </SubSection>
        </Section>

        <Section title="Application & Optimization">
          <SubSection title="Agent Performance">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard label="Ground Agents" value="257.48 (smoothed)" />
              <StatCard label="Roof Agents" value="-648.56 (optimizing)" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Training duration: 1.2 hours per 120,000 steps</p>
          </SubSection>
          <SubSection title="Optimization Results">
            <BulletList
              items={[
                'Density Optimization: ✓ Achieved',
                'Sunlight Access: ✓ Improved',
                'Regulatory Compliance: ✓ Maintained',
                'Green Space Preservation: ✓ Protected',
              ]}
            />
          </SubSection>
        </Section>
      </ProjectBody>
    </div>
  )
}
