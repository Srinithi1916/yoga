import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import ImageSlideshow from '../components/ImageSlideshow';
import ReviewSection from '../components/ReviewSection';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import { BlossomSpray, FloralCorner, LeafWisp, LotusBloom } from '../components/Decorations';
import {
  aboutPreviewPoints,
  brandDetails,
  buildContactPlanHref,
  communitySlides,
  contactDetails,
  heroSlides,
  premiumPlan,
  pricingPlans,
  progressFeatures,
  specialPrograms,
  testimonials,
  timingHighlights,
  trialBenefits,
  whatsappCommunityFeatures,
  whyChooseUs,
  yogaTypes,
} from '../data/siteData';
import { useAuth } from '../context/AuthContext';
import { startRazorpayCheckout } from '../lib/razorpay';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7 },
};

const homeReviewItems = [
  yogaTypes[0],
  yogaTypes[4],
  specialPrograms[0],
  specialPrograms[1],
  pricingPlans[0],
  premiumPlan,
].map((item) => ({
  title: item.title,
  reviewItemId: item.reviewItemId,
  reviewItemType: item.reviewItemType,
  reviewItemTypeLabel: item.reviewItemTypeLabel,
}));

function PaymentStatus({ status }) {
  if (status.type === 'idle') {
    return null;
  }

  const palette =
    status.type === 'success'
      ? 'border-emerald-200/70 bg-emerald-50/70 text-emerald-900'
      : status.type === 'error'
        ? 'border-rose-200/70 bg-rose-50/70 text-rose-900'
        : 'border-white/60 bg-white/60 text-rose-900';

  return (
    <div className={`mt-5 rounded-[1.75rem] border px-5 py-4 text-sm leading-7 shadow-glass ${palette}`}>
      {status.message}
    </div>
  );
}

export default function HomePage() {
  const [paymentStatus, setPaymentStatus] = useState({ type: 'idle', message: '' });
  const { user } = useAuth();

  async function handleCheckout(plan) {
    try {
      await startRazorpayCheckout({
        plan,
        customer: user ? { name: user.name, email: user.email, whatsapp: user.phone } : {},
        onStatusChange: (type, message) => setPaymentStatus({ type, message }),
      });
    } catch (error) {
      setPaymentStatus({
        type: 'error',
        message: error.message || 'Online payment is unavailable. Please contact us on WhatsApp.',
      });
    }
  }

  return (
    <div className="space-y-2">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GlassPanel className="relative rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 sm:py-14 lg:px-12 lg:py-16">
            <div className="absolute inset-0 bg-hero-wash opacity-90" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,241,247,0.6)_100%)]" />
            <FloralCorner className="absolute -bottom-4 left-0 h-36 w-36 opacity-70 md:h-44 md:w-44" />
            <FloralCorner className="absolute -bottom-4 right-0 h-40 w-40 -scale-x-100 opacity-70 md:h-48 md:w-48" />
            <BlossomSpray className="absolute left-[7%] top-[18%] hidden h-28 w-28 opacity-85 md:block" tone="rose" />
            <BlossomSpray className="absolute right-[6%] top-[24%] hidden h-28 w-28 opacity-80 md:block" tone="lavender" />
            <BlossomSpray className="absolute right-[14%] bottom-[14%] hidden h-24 w-24 opacity-80 lg:block" tone="peach" />
            <LotusBloom className="absolute bottom-1 left-1/2 hidden h-20 w-36 -translate-x-1/2 opacity-55 md:block" />
            <LeafWisp className="absolute left-4 top-20 hidden h-40 w-28 opacity-50 lg:block" />
            <LeafWisp className="absolute right-2 top-24 hidden h-40 w-28 -scale-x-100 opacity-50 lg:block" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <motion.div {...reveal} className="space-y-6">
                <p className="max-w-xl text-xl font-semibold leading-[1.65] text-rose-950/90 md:text-[2rem] md:leading-[1.45]">
                  Personalized yoga, care, and support for daily life.
                </p>
                <div className="space-y-3">
                  <h1 className="font-display text-6xl font-semibold leading-none text-rose-950 text-shadow-soft sm:text-7xl md:text-[5.5rem]">
                    {brandDetails.name}
                  </h1>
                  <p className="font-display text-3xl font-semibold text-rose-900/90 md:text-[2.65rem]">
                    {brandDetails.supportLine}
                  </p>
                  <p className="max-w-xl text-lg font-medium leading-8 text-rose-900/82">
                    {brandDetails.promise}. Personalized care with yoga, guidance, and steady support.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/contact"
                    className="btn-secondary min-w-[158px] bg-purple-400/70 text-white hover:bg-purple-400/85"
                  >
                    Start Trial
                  </Link>
                  <a
                    href={contactDetails.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary min-w-[158px]"
                  >
                    WhatsApp
                  </a>
                </div>
              </motion.div>

              <motion.div
                {...reveal}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="relative mx-auto w-full max-w-[40rem]"
              >
                <div className="absolute inset-0 rounded-[3rem] bg-white/35 blur-2xl" />
                <ImageSlideshow slides={heroSlides} />
              </motion.div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <WaveDivider className="-mt-2" />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <SectionHeading
            title="About Jeevanam 360"
            description="Personalized yoga for body, mind, and balance."
          />
          <GlassPanel className="px-6 py-8 sm:px-8">
            <div className="space-y-6 text-center">
              <p className="mx-auto max-w-4xl text-lg font-semibold leading-8 text-rose-950/88 md:text-xl md:leading-9">
                Every session is built around your goals, routine, and pace.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {aboutPreviewPoints.map((point, index) => (
                  <motion.div
                    key={point}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="rounded-[1.75rem] border border-white/50 bg-white/55 px-5 py-5 text-center text-base font-semibold text-rose-900 shadow-glass"
                    transition={{ duration: 0.25 }}
                  >
                    <span className="text-rose-400">0{index + 1}. </span>
                    {point}
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center">
                <Link to="/about" className="btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Yoga Types"
            title="Types of Yoga"
            description="Nine yoga paths, tailored for you."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {yogaTypes.map((type, index) => (
              <motion.article
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group glass-card overflow-hidden rounded-[2rem] p-3 shadow-bloom"
              >
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <img
                    src={type.imageUrl}
                    alt={type.imageAlt}
                    className="h-48 w-full rounded-[1.5rem] object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0)_30%,rgba(83,35,61,0.08)_100%)]" />
                </div>
                <div className="px-2 pb-2 pt-4 text-center">
                  <h3 className="font-display text-[2rem] font-semibold text-rose-950">{type.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-rose-900/80">{type.benefit}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Special Care"
            title="Special Programs"
            description="Focused care for recovery, calm, focus, and change."
          />
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
            {specialPrograms.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-[2rem] p-6 shadow-bloom"
              >
                <h3 className="font-display text-3xl font-semibold text-rose-950">{program.title}</h3>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-rose-500">
                  {program.duration}
                </p>
                <p className="mt-3 text-sm font-medium leading-7 text-rose-900/82">{program.audience}</p>
                <p className="mt-4 rounded-2xl bg-white/50 px-4 py-3 text-sm leading-6 text-rose-900/82">
                  {program.results}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider className="pt-6" fill="rgba(255, 246, 251, 0.42)" />

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Membership"
            title="Plans & Pricing"
            description="Simple plans with personal guidance."
          />
          <div className="grid gap-5 xl:grid-cols-[repeat(3,minmax(0,1fr))_1.05fr]">
            {pricingPlans.map((plan, index) => (
              <motion.article
                key={plan.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card rounded-[2rem] p-6 shadow-bloom"
              >
                <h3 className="font-display text-4xl font-semibold text-rose-950">{plan.title}</h3>
                <p className="mt-5 text-2xl font-bold text-rose-800">{plan.price}</p>
                <p className="mt-4 text-base font-medium leading-7 text-rose-900/82">{plan.description}</p>
                {plan.amount ? (
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                    Payment support on WhatsApp
                  </p>
                ) : null}
                {plan.amount ? (
                  <button
                    type="button"
                    onClick={() => handleCheckout(plan)}
                    className="btn-primary mt-8 w-full justify-center"
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link to={buildContactPlanHref(plan)} className="btn-primary mt-8 w-full justify-center">
                    {plan.cta}
                  </Link>
                )}
              </motion.article>
            ))}

            <motion.article
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/55 p-7 shadow-[0_28px_80px_-30px_rgba(193,83,131,0.55)] backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-fuchsia-400 via-rose-300 to-orange-200" />
              <p className="font-display text-5xl font-semibold leading-none text-rose-950">
                Premium
                <span className="mt-1 block text-[2.25rem] leading-none">Wellness Plan</span>
              </p>
              <p className="mt-6 text-3xl font-bold text-rose-800">{premiumPlan.price}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                Payment support on WhatsApp
              </p>
              <div className="mt-6 space-y-3">
                {premiumPlan.includes.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-rose-900/85">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-200/80 text-xs font-bold text-rose-700">
                      +
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleCheckout(premiumPlan)}
                className="btn-primary mt-8 w-full justify-center"
              >
                Pay Now
              </button>
            </motion.article>
          </div>
          <PaymentStatus status={paymentStatus} />

          <div className="grid gap-5 lg:grid-cols-2">
            <GlassPanel className="rounded-[2.25rem] p-7 shadow-bloom">
              <h3 className="font-display text-4xl text-rose-950">Benefits</h3>
              <div className="mt-5 space-y-3">
                {trialBenefits.map((benefit) => (
                  <div key={benefit} className="rounded-2xl bg-white/55 px-4 py-4 text-sm font-medium leading-7 text-rose-900/82">
                    {benefit}
                  </div>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="rounded-[2.25rem] p-7 shadow-bloom">
              <h3 className="font-display text-4xl text-rose-950">Timings</h3>
              <div className="mt-5 space-y-3">
                {timingHighlights.map((timing) => (
                  <div key={timing} className="rounded-2xl bg-white/55 px-4 py-4 text-sm font-medium leading-7 text-rose-900/82">
                    {timing}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Why Jeevanam 360"
            title="Why Choose Us"
            description="Personal care, flexible timing, and clear progress."
          />
          <div className="grid gap-5 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-[2rem] p-6 text-center shadow-bloom"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/70 font-display text-3xl text-rose-500 shadow-glass">
                  {index + 1}
                </div>
                <h3 className="font-display text-3xl font-semibold text-rose-950">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-rose-900/82">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Support System"
            title="Progress + WhatsApp Support"
            description="Weekly reviews and daily support to keep you consistent."
          />
          <div className="grid gap-5 lg:grid-cols-[0.9fr_0.9fr_1.1fr] lg:items-stretch">
            <GlassPanel className="rounded-[2.25rem] p-7 shadow-bloom">
              <h3 className="font-display text-4xl text-rose-950">Progress Tracking</h3>
              <div className="mt-5 space-y-3">
                {progressFeatures.map((feature) => (
                  <div key={feature} className="rounded-2xl bg-white/55 px-4 py-4 text-sm leading-7 text-rose-900/82">
                    {feature}
                  </div>
                ))}
              </div>
            </GlassPanel>
            <GlassPanel className="rounded-[2.25rem] p-7 shadow-bloom">
              <h3 className="font-display text-4xl text-rose-950">WhatsApp Community</h3>
              <div className="mt-5 space-y-3">
                {whatsappCommunityFeatures.map((feature) => (
                  <div key={feature} className="rounded-2xl bg-white/55 px-4 py-4 text-sm leading-7 text-rose-900/82">
                    {feature}
                  </div>
                ))}
              </div>
            </GlassPanel>
            <ImageSlideshow slides={communitySlides} imageClassName="h-[420px] sm:h-[460px]" />
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Results"
            title="Testimonials"
            description="Member feedback from Jeevanam 360."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-[2rem] p-6 shadow-bloom"
              >
                <p className="font-display text-5xl leading-none text-rose-300">&quot;</p>
                <p className="-mt-3 text-base font-medium leading-8 text-rose-900/82">{testimonial.quote}</p>
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-rose-600/75">
                  {testimonial.name}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Member Reviews"
            title="Public Reviews"
            description="Read member feedback."
          />
          <ReviewSection
            anchorId="home-featured-reviews"
            title="Featured Reviews"
            description="Yoga, programs, and plans."
            items={homeReviewItems}
          />
        </div>
      </section>

      <section className="px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <GlassPanel className="rounded-[2.75rem] px-6 py-10 text-center shadow-bloom sm:px-10 sm:py-12">
            <h2 className="font-display text-5xl font-semibold text-rose-950 md:text-6xl">
              Start Your Free Trial Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-rose-900/82">
              Start with one step and build a steady routine.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/contact" className="btn-primary min-w-[220px] justify-center text-lg">
                Start Free Trial
              </Link>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
