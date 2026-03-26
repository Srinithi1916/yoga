import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import ImageSlideshow from '../components/ImageSlideshow';
import SectionHeading from '../components/SectionHeading';
import { communitySlides, heroSlides } from '../data/siteData';

const pillars = [
  {
    title: 'Body',
    description: 'Movement, posture, breath, recovery, and energy support chosen around your physical needs.',
  },
  {
    title: 'Mind',
    description: 'Focused routines that reduce overthinking, improve clarity, and create steadier emotional space.',
  },
  {
    title: 'Emotion',
    description: 'A calmer practice style that supports confidence, patience, consistency, and overall wellbeing.',
  },
];

const audienceGroups = [
  'Men and women building sustainable wellness habits',
  'Students needing focus, confidence, and stress support',
  'Working professionals balancing energy, movement, and recovery',
  'Families looking for practical, human-centered guidance',
];

export default function AboutPage() {
  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="About"
                title="What is Jeevanam 360?"
                description="Yoga, guidance, and lifestyle support in one place."
              />
              <p className="section-copy max-w-2xl">
                The right practice, at the right time, for the right person.
              </p>
              <p className="rounded-[1.75rem] bg-white/55 px-5 py-5 text-base font-semibold leading-8 text-rose-950/88 shadow-glass">
                Simple, personal, and practical care for recovery, focus, strength, and balance.
              </p>
              <Link to="/contact" className="btn-primary inline-flex">
                Start Free Trial
              </Link>
            </div>
            <ImageSlideshow slides={heroSlides} imageClassName="h-[420px] sm:h-[480px]" />
          </div>
        </GlassPanel>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
          <h2 className="font-display text-4xl font-semibold text-rose-950">Our Mission</h2>
          <p className="mt-4 text-base font-medium leading-8 text-rose-900/80">
            Help people feel better through calm, consistent wellness.
          </p>
        </GlassPanel>
        <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
          <h2 className="font-display text-4xl font-semibold text-rose-950">Our Approach</h2>
          <p className="mt-4 text-base font-medium leading-8 text-rose-900/80">
            We combine yoga, breath, routine support, and feedback.
          </p>
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 pt-2">
        <SectionHeading
          eyebrow="Three Pillars"
          title="A Human-Centered Method"
          description="A calm, practical method for daily life."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-[2rem] p-7 text-center shadow-bloom"
            >
              <h3 className="font-display text-4xl font-semibold text-rose-950">{pillar.title}</h3>
              <p className="mt-4 text-sm font-medium leading-7 text-rose-900/80">{pillar.description}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <GlassPanel className="rounded-[2.5rem] p-8 shadow-bloom">
          <SectionHeading
            align="left"
            eyebrow="Who It Helps"
            title="Who Jeevanam 360 Is For"
            description="Flexible support for different goals and schedules."
          />
          <div className="mt-6 space-y-3">
            {audienceGroups.map((item) => (
              <div key={item} className="rounded-2xl bg-white/55 px-4 py-4 text-sm leading-7 text-rose-900/82">
                {item}
              </div>
            ))}
          </div>
        </GlassPanel>
        <ImageSlideshow slides={communitySlides} imageClassName="h-[380px] sm:h-[430px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.5rem] px-6 py-10 shadow-bloom sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="BNYS"
                title="BNYS-Based Guidance"
                description="Natural healing and lifestyle care guide the method."
              />
            </div>
            <div className="space-y-4 text-sm font-medium leading-8 text-rose-900/82">
              <p>
                Sessions consider rest, breath, food, stress, and routine.
              </p>
              <p>
                Care stays personal, simple, and trustworthy.
              </p>
              <Link to="/contact" className="btn-primary mt-2 inline-flex">
                Start Free Trial
              </Link>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
