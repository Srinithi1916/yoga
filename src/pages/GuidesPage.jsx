import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { guideCollections } from '../data/siteData';

function GuideGrid({ items, accent }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: index * 0.08 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-card rounded-[2rem] p-6 shadow-bloom"
        >
          <div className={`mb-5 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${accent}`}>
            Resource
          </div>
          <h3 className="font-display text-4xl text-rose-950">{item.title}</h3>
          <p className="mt-4 text-sm leading-8 text-rose-900/80">{item.description}</p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">
            Request Access
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

export default function GuidesPage() {
  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Guides"
            title="Free PDFs + Premium E-Books"
            description="Helpful resources that make Jeevanam 360 feel like a full wellness brand, not just a class schedule."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Free"
          title="Complimentary Wellness PDFs"
          description="Simple, useful guides for people who want to begin gently and build trust in the process."
        />
        <GuideGrid items={guideCollections.free} accent="bg-white/65 text-rose-600" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Premium"
          title="Paid E-Books"
          description="More complete guided resources with structure, routine planning, and brand-level polish."
        />
        <GuideGrid items={guideCollections.premium} accent="bg-rose-200/70 text-rose-700" />
      </div>

      <div className="mx-auto max-w-6xl">
        <GlassPanel className="rounded-[2.5rem] px-6 py-10 shadow-bloom sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-5xl text-rose-950">Why Guides Matter</h2>
              <p className="mt-4 text-base leading-8 text-rose-900/82">
                Guides extend the Jeevanam 360 experience beyond live sessions. They keep the brand
                feeling thoughtful, professional, and supportive even between classes.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Create extra value for free trial users',
                'Support daily consistency at home',
                'Strengthen trust in your premium brand positioning',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 px-5 py-4 text-sm leading-7 text-rose-900/82">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
