import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { LotusIcon } from '../components/Illustrations';
import { siteImages } from '../data/siteData';

const pillars = [
  {
    title: 'Body',
    description: 'Movement, posture, breath, and recovery chosen around your physical needs.',
  },
  {
    title: 'Mind',
    description: 'Focused routines that calm overthinking and build clarity from within.',
  },
  {
    title: 'Emotion',
    description: 'A softer practice experience that supports confidence, calmness, and balance.',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="About"
                title="What is Jeevanam 360?"
                description="Jeevanam 360 combines yoga, food guidance, progress tracking, and personalized care in one gentle premium experience."
              />
              <p className="section-copy max-w-2xl">
                The mission is simple: offer the right yoga for the right person at the right time.
                Instead of one fixed routine for everyone, each plan adapts to your body, your goals,
                and your schedule.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="pill-chip">Personalized Care</span>
                <span className="pill-chip">Human Guidance</span>
                <span className="pill-chip">Premium Wellness</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2.75rem] border border-white/60 bg-white/35 p-3 shadow-glass">
              <img
                src={siteImages.about}
                alt="Woman meditating outdoors as part of a wellness routine"
                className="h-[420px] w-full rounded-[2.2rem] object-cover"
              />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
          <h2 className="font-display text-4xl font-semibold text-rose-950">Our Mission</h2>
          <p className="mt-4 text-base font-medium leading-8 text-rose-900/80">
            To help women and families improve daily life through consistent, intentional wellness.
            Every session is designed to feel calming, personal, and sustainable.
          </p>
        </GlassPanel>
        <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
          <h2 className="font-display text-4xl font-semibold text-rose-950">Our Approach</h2>
          <p className="mt-4 text-base font-medium leading-8 text-rose-900/80">
            Jeevanam 360 works on the complete picture: body, mind, and emotion. Yoga postures,
            breathwork, food awareness, and personal feedback move together inside one care path.
          </p>
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 pt-2">
        <SectionHeading
          eyebrow="Three Pillars"
          title="A Human-Centered Method"
          description="The practice style stays grounded, feminine, and practical so wellness can fit beautifully into real life."
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
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-rose-500 shadow-glass">
                <LotusIcon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-4xl font-semibold text-rose-950">{pillar.title}</h3>
              <p className="mt-4 text-sm font-medium leading-7 text-rose-900/80">{pillar.description}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.5rem] px-6 py-10 shadow-bloom sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="BNYS"
                title="BNYS-Based Guidance"
                description="The Jeevanam 360 method is shaped by a BNYS-based wellness approach, keeping natural healing and lifestyle correction at the center of care."
              />
            </div>
            <div className="space-y-4 text-sm font-medium leading-8 text-rose-900/82">
              <p>
                Sessions are not only about poses. They are designed with awareness of rest,
                digestion, breath, stress, routine, and long-term balance.
              </p>
              <p>
                The result is a supportive experience that feels personal and trustworthy rather
                than textbook or clinical.
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