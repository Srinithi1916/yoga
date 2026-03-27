import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import ReviewSection from '../components/ReviewSection';
import SectionHeading from '../components/SectionHeading';
import { buildContactPlanHref, buildWhatsappUrl, premiumPlan, pricingPlans } from '../data/siteData';
import { getPlanVisual, getServiceTags } from '../lib/planVisuals';

const allPlans = [...pricingPlans, premiumPlan];

const pricingReviewItems = allPlans.map((item) => ({
  title: item.title,
  reviewItemId: item.reviewItemId,
  reviewItemType: item.reviewItemType,
  reviewItemTypeLabel: item.reviewItemTypeLabel,
}));

function buildPlanWhatsappMessage(plan) {
  return `Hi, I want to join the ${plan.title}. Please guide me on the next step.`;
}

function PlanSelectorButton({ plan, isActive, onSelect }) {
  const visual = getPlanVisual(plan.planKey);
  const serviceTags = getServiceTags(plan.features).slice(0, 3);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={[
        'rounded-[2rem] border bg-white/72 p-5 text-left shadow-glass transition duration-300',
        isActive ? `${visual.borderClass} ring-2 ring-white/80 shadow-[0_26px_55px_-28px_rgba(15,23,42,0.36)]` : 'border-white/55 hover:border-white/80',
      ].join(' ')}
    >
      <span className={`inline-flex rounded-full bg-gradient-to-r ${visual.gradientClass} px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white`}>
        {visual.typeLabel}
      </span>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl text-rose-950">{plan.title}</h2>
          <p className={`mt-2 text-sm font-semibold ${visual.mutedClass}`}>{plan.price}</p>
        </div>
        {isActive ? <span className="rounded-full bg-rose-950 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white">Selected</span> : null}
      </div>
      <p className="mt-3 text-sm leading-7 text-rose-900/76">{plan.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {serviceTags.map((tag) => (
          <span key={tag.key} className={`rounded-full px-3 py-1 text-xs font-semibold ${tag.className}`}>
            {tag.label}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

export default function PricingPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState(allPlans[0].planKey);

  const selectedPlan = useMemo(
    () => allPlans.find((plan) => plan.planKey === selectedPlanKey) || allPlans[0],
    [selectedPlanKey],
  );

  const selectedVisual = getPlanVisual(selectedPlan.planKey);
  const selectedServiceTags = getServiceTags(selectedPlan.features);
  const contactHref = buildContactPlanHref(selectedPlan);
  const whatsappHref = buildWhatsappUrl(buildPlanWhatsappMessage(selectedPlan));

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Pricing"
              title="Choose Your Service"
              description="Select a plan by color, review the details, and continue by WhatsApp or plan selection."
            />

            <div className="grid gap-4 lg:grid-cols-4">
              {allPlans.map((plan) => (
                <PlanSelectorButton
                  key={plan.planKey}
                  plan={plan}
                  isActive={selectedPlan.planKey === plan.planKey}
                  onSelect={() => setSelectedPlanKey(plan.planKey)}
                />
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          key={selectedPlan.planKey}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <GlassPanel className={`rounded-[2.5rem] border ${selectedVisual.borderClass} bg-gradient-to-br ${selectedVisual.surfaceClass} p-6 shadow-bloom sm:p-8`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <span className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${selectedVisual.badgeClass}`}>
                  {selectedVisual.typeLabel}
                </span>
                <h1 className="mt-4 font-display text-5xl text-rose-950">{selectedPlan.title}</h1>
                <p className={`mt-3 text-xl font-semibold ${selectedVisual.mutedClass}`}>{selectedPlan.price}</p>
                <p className="mt-4 max-w-2xl text-base leading-8 text-rose-900/80">{selectedPlan.description}</p>
              </div>

              <div className="rounded-[1.75rem] border border-white/70 bg-white/75 px-5 py-5 shadow-glass lg:min-w-[15rem]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600/70">Duration</p>
                <p className="mt-3 text-3xl font-bold text-rose-950">
                  {selectedPlan.durationDays ? `${selectedPlan.durationDays} Days` : 'Custom'}
                </p>
                <p className="mt-2 text-sm leading-7 text-rose-900/75">Manual payment support is available for this plan.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {selectedServiceTags.map((tag) => (
                <span key={tag.key} className={`rounded-full px-4 py-2 text-sm font-semibold ${tag.className}`}>
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {selectedPlan.features.map((feature) => (
                <div key={feature} className="rounded-[1.5rem] border border-white/65 bg-white/70 px-4 py-4 text-sm font-medium text-rose-900/82 shadow-glass">
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary">
                WhatsApp Communication
              </a>
              <Link to={contactHref} className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-[0.95rem] font-bold tracking-[0.02em] shadow-dream transition duration-300 hover:scale-[1.03] ${selectedVisual.primaryButtonClass}`}>
                Choose Plan
              </Link>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      <ReviewSection
        anchorId="pricing-reviews"
        title="Plan Reviews"
        description=""
        items={pricingReviewItems}
      />
    </div>
  );
}
