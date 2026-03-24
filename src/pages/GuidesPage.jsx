import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassPanel from '../components/GlassPanel';
import ImageSlideshow from '../components/ImageSlideshow';
import SectionHeading from '../components/SectionHeading';
import { communitySlides, guideCollections, siteImages } from '../data/siteData';

function GuideGrid({ items, isPremium = false }) {
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
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${
              isPremium ? 'bg-rose-200/70 text-rose-700' : 'bg-white/65 text-rose-600'
            }`}>
              {item.format}
            </span>
            {item.price ? <span className="text-sm font-bold text-rose-700">{item.price}</span> : null}
          </div>
          <h3 className="font-display text-4xl text-rose-950">{item.title}</h3>
          <p className="mt-4 text-sm leading-8 text-rose-900/80">{item.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {!isPremium ? (
              <a href={item.actionHref} download className="btn-primary inline-flex">
                {item.actionLabel}
              </a>
            ) : (
              <>
                <a href={item.previewHref} target="_blank" rel="noreferrer" className="btn-secondary inline-flex">
                  Preview
                </a>
                <Link to={item.actionHref} className="btn-primary inline-flex">
                  Request E-Book
                </Link>
              </>
            )}
          </div>
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
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Guides"
                title="Free PDFs + Paid E-Books"
                description="Helpful resources that make Jeevanam 360 feel like a full wellness brand, not just a class schedule."
              />
              <p className="section-copy max-w-2xl">
                These resources support people between sessions with guided routines, trackers,
                breathing support, and structured premium e-books for deeper practice.
              </p>
              <Link to="/contact" className="btn-primary inline-flex">
                Start Free Trial
              </Link>
            </div>
            <div className="overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/35 p-3 shadow-glass">
              <img
                src={siteImages.guides}
                alt="Wellness guide consultation and planning"
                className="h-[320px] w-full rounded-[1.75rem] object-cover"
              />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Free"
          title="Complimentary Wellness PDFs"
          description="Simple, practical downloads for people who want to start gently and build trust in the process."
        />
        <GuideGrid items={guideCollections.free} />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Premium"
          title="Paid E-Books"
          description="More complete resources with structure, routine planning, and premium brand-level polish."
        />
        <GuideGrid items={guideCollections.premium} isPremium />
      </div>

      <div className="mx-auto max-w-7xl grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <ImageSlideshow slides={communitySlides} imageClassName="h-[360px] sm:h-[420px]" />
        <GlassPanel className="rounded-[2.5rem] px-6 py-10 shadow-bloom sm:px-10">
          <div className="space-y-4">
            <h2 className="font-display text-5xl text-rose-950">Why Guides Matter</h2>
            <p className="text-base leading-8 text-rose-900/82">
              Guides extend the Jeevanam 360 experience beyond live sessions. They add extra value
              for free trial users, support daily consistency at home, and strengthen trust in the brand.
            </p>
            <div className="space-y-3 pt-2">
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
            <Link to="/contact" className="btn-primary mt-3 inline-flex">
              Start Free Trial
            </Link>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
