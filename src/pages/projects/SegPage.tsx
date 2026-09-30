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

export default function SegPage() {
  return (
    <div>
      <ProjectHero
        image="https://pic1.imgdb.cn/item/697160a71404c8e205f11a33.None"
        title="Optimizing Urban Perception"
        subtitle="Integrating Image Segmentation and Machine Learning in London"
      >
        <HeroButton href="http://seg.robinsong.top" icon="fas fa-external-link-alt">
          View Demo
        </HeroButton>
        <HeroButton
          href="/files/1.Report_Optimizing Urban Perception Integrating Image Segmentation_Wenshuo Zhang_Lewen Zhang_Robin Song.pdf"
          icon="fas fa-download"
          download
        >
          Download Paper
        </HeroButton>
      </ProjectHero>

      <ProjectBody>
        <Section title="Project Overview">
          <P>
            This research explores the relationship between street view imagery and crime rates in London using
            advanced computer vision and machine learning techniques. By analyzing the visual characteristics of urban
            environments, we aim to identify patterns that correlate with criminal activity and develop predictive
            models for urban safety assessment.
          </P>
          <P>
            The project combines image segmentation, regression analysis, and reinforcement learning to create an
            automated framework for crime rate prediction based on street view data. This approach provides valuable
            insights for urban planning, policy-making, and community safety initiatives.
          </P>
        </Section>

        <Section title="Research Question">
          <SubSection title="Core Question">
            <BulletList
              items={[
                'How can we quantify the correlation between street views and crime rates?',
                'Can visual features in urban environments predict areas with higher crime incidence?',
              ]}
            />
          </SubSection>
          <SubSection title="Research Goal">
            <BulletList
              items={[
                'Develop automated tools for crime rate prediction using street view imagery',
                'Create actionable insights for urban planning and safety improvement',
              ]}
            />
          </SubSection>
        </Section>

        <Section title="Methodology">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Data Collection" value="Crime data & Street view images from London" />
            <StatCard label="Segmentation" value="PSPNet with ADE20k dataset for image analysis" />
            <StatCard label="Regression" value="Random Forest & XGBoost for prediction" />
            <StatCard label="Optimization" value="SAC reinforcement learning for improvement" />
          </div>
        </Section>

        <Section title="Image Segmentation">
          <SubSection title="Original & Segmented Street View">
            <Img src="https://pic1.imgdb.cn/item/697160f41404c8e205f11a54.None" alt="Original and segmented street view" />
          </SubSection>
          <SubSection title="PSPNet Architecture">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="PSPNet" value="Pyramid Scene Parsing Network with Pyramid Pooling Module for semantic segmentation" />
              <StatCard label="ResNet-50" value="50-layer CNN backbone with residual connections to avoid vanishing gradients" />
              <StatCard label="ADE20k Dataset" value="20,000+ images with 150 semantic categories for comprehensive scene understanding" />
            </div>
          </SubSection>
        </Section>

        <Section title="Regression Analysis">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
              <h4 className="font-semibold mb-2">Linear Regression</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">R²: 0.348 · Adjusted R²: 0.343</p>
              <p className="text-sm text-red-500 dark:text-red-400 mt-2">Status: Rejected due to low performance</p>
            </div>
            <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
              <h4 className="font-semibold mb-2">Random Forest</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">R²: 0.451 · Var Explained: 44.32%</p>
              <p className="text-sm text-primary-600 dark:text-magenta-400 mt-2">Status: Accepted for low-middle crime rates</p>
            </div>
            <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
              <h4 className="font-semibold mb-2">XGBoost</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">R²: 0.451 · Distribution: Even spread</p>
              <p className="text-sm text-primary-600 dark:text-magenta-400 mt-2">Status: Accepted for higher crime rates</p>
            </div>
          </div>
        </Section>

        <Section title="Reinforcement Learning Optimization">
          <SubSection title="SAC (Soft Actor-Critic)">
            <BulletList
              items={[
                'Actor Network generates actions for image modification',
                'Dual-Q Network evaluates action values',
                'Guides optimization for crime rate reduction',
              ]}
            />
          </SubSection>
          <SubSection title="Reward Mechanism">
            <BulletList
              items={[
                'Score Improvement: Sigmoid function',
                'Color Ratio Reward: Weighted by correlation',
                'Trend Reward: 5-step regression',
              ]}
            />
          </SubSection>
        </Section>

        <Section title="Interactive Platform">
          <SubSection title="Platform Features">
            <BulletList
              items={[
                'Upload street view images',
                'Real-time image segmentation',
                'Crime rate prediction',
                'AI-powered optimization',
              ]}
            />
          </SubSection>
          <SubSection title="Technical Stack">
            <BulletList
              items={[
                'Backend: Flask server, PyTorch models, OpenCV processing',
                'Frontend: React interface, Real-time updates, Interactive visualization',
              ]}
            />
          </SubSection>
        </Section>

        <Section title="Results & Evaluation">
          <SubSection title="Key Achievements">
            <BulletList
              items={[
                'Successfully correlated street view features with crime rates',
                'Developed automated workflow for crime analysis',
                'Innovative reward mechanisms in reinforcement learning',
                'Created scalable platform for real-time analysis',
              ]}
            />
          </SubSection>
          <SubSection title="Limitations">
            <BulletList
              items={[
                'Limited database scale and diversity',
                'Segmentation model precision needs improvement',
                'Overall R-squared values below 0.5',
                'Reinforcement learning requires optimization',
              ]}
            />
          </SubSection>
        </Section>
      </ProjectBody>
    </div>
  )
}
