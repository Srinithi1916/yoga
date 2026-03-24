import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { siteImages, specialPrograms, yogaTypes } from '../data/siteData';

export default function ProgramsPage() {
  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Programs"
                title="Yoga Types + Special Programs"
                description="Explore all nine yoga types and the focused wellness programs inside Jeevanam 360."
              />
              <p className="section-copy max-w-2xl">
                These offerings are designed for men and women across different goals: flexibility,
                recovery, emotional calmness, strength, breath support, focus, and long-term lifestyle change.
              </p>
              <Link to="/contact" className="btn-primary inline-flex">
                Start Free Trial
              </Link>
            </div>
            <div className="overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/35 p-3 shadow-glass">
              <img
                src={siteImages.programs}
                alt="Inclusive group wellness session in a calm studio"
                className="h-[320px] w-full rounded-[1.75rem] object-cover"
              />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="All 9 Types"
          title="Yoga for Different Needs"
          description="Each format is personalized so the benefit connects clearly to your body, mind, and everyday rhythm."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {yogaTypes.map((type, index) => (
            <motion.article
              key={type.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass-card rounded-[2rem] p-3 shadow-bloom"
            >
              <div className="overflow-hidden rounded-[1.5rem]">
                <img
                  src={type.imageUrl}
                  alt={type.imageAlt}
                  className="h-48 w-full rounded-[1.5rem] object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-2 pb-2 pt-4 text-center">
                <h3 className="font-display text-3xl font-semibold text-rose-950">{type.title}</h3>
                <p className="mt-2 text-sm font-medium leading-7 text-rose-900/80">{type.benefit}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Focused Care"
          title="Special Programs"
          description="Each special program clearly shows who it is for and the kind of progress you can expect from regular practice."
        />
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {specialPrograms.map((program, index) => (
            <motion.article
              key={program.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-[2rem] p-6 shadow-bloom"
            >
              <h3 className="font-display text-3xl font-semibold text-rose-950">{program.title}</h3>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-rose-500">
                {program.duration}
              </p>
              <p className="mt-4 text-sm font-medium leading-7 text-rose-900/80">
                <span className="font-semibold">Who it is for:</span> {program.audience}
              </p>
              <p className="mt-4 rounded-2xl bg-white/50 px-4 py-4 text-sm leading-7 text-rose-900/84">
                <span className="font-semibold">Expected result:</span> {program.results}
              </p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <GlassPanel className="rounded-[2.5rem] px-6 py-10 text-center shadow-bloom sm:px-10">
          <h2 className="font-display text-5xl font-semibold text-rose-950">Need help choosing the right program?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-rose-900/82">
            Start with the free trial and get a recommendation based on your goals, pace, schedule, and current wellness needs.
          </p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">
            Start Free Trial
          </Link>
        </GlassPanel>
      </div>
    </div>
  );
}
