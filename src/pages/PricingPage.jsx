import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { buildContactPlanHref, premiumPlan, pricingPlans, timingHighlights, trialBenefits } from '../data/siteData';
import { startRazorpayCheckout } from '../lib/razorpay';

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
    <div className={`mt-6 rounded-[1.75rem] border px-5 py-4 text-sm leading-7 shadow-glass ${palette}`}>
      {status.message}
    </div>
  );
}

export default function PricingPage() {
  const [paymentStatus, setPaymentStatus] = useState({ type: 'idle', message: '' });

  async function handleCheckout(plan) {
    try {
      await startRazorpayCheckout({
        plan,
        onStatusChange: (type, message) => setPaymentStatus({ type, message }),
      });
    } catch (error) {
      setPaymentStatus({
        type: 'error',
        message: error.message || 'Razorpay could not open right now.',
      });
    }
  }

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <SectionHeading
              eyebrow="Pricing"
              title="Plans for Every Stage"
              description="Start gently, go deeper with structured routines, or choose full personalization with premium care."
            />
            <Link to="/contact" className="btn-primary">
              Start Free Trial
            </Link>
          </div>
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 xl:grid-cols-[repeat(3,minmax(0,1fr))_1.05fr]">
          {pricingPlans.map((plan, index) => (
            <motion.article
              key={plan.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-[2rem] p-7 shadow-bloom"
            >
              <h3 className="font-display text-4xl font-semibold text-rose-950">{plan.title}</h3>
              <p className="mt-5 text-2xl font-bold text-rose-800">{plan.price}</p>
              <p className="mt-4 text-base font-medium leading-8 text-rose-900/82">{plan.description}</p>
              {plan.amount ? (
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
                  Secure online payment with Razorpay
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
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.22 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="rounded-[2rem] border border-white/50 bg-white/55 p-7 shadow-[0_28px_80px_-30px_rgba(193,83,131,0.55)] backdrop-blur-xl"
          >
            <h3 className="font-display text-5xl font-semibold leading-none text-rose-950">
              Premium
              <span className="mt-1 block text-[2.25rem] leading-none">Wellness Plan</span>
            </h3>
            <p className="mt-6 text-3xl font-bold text-rose-800">{premiumPlan.price}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-rose-500">
              Highlighted Plan
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
              Pay with Razorpay
            </button>
          </motion.article>
        </div>
        <PaymentStatus status={paymentStatus} />
      </div>

      <div className="mx-auto max-w-7xl grid gap-5 lg:grid-cols-2">
        <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
          <h2 className="font-display text-4xl font-semibold text-rose-950">Free Trial + Offers</h2>
          <div className="mt-5 space-y-4">
            {trialBenefits.map((offer) => (
              <div key={offer} className="rounded-2xl bg-white/55 px-4 py-4 text-sm font-medium leading-7 text-rose-900/82">
                {offer}
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
          <h2 className="font-display text-4xl font-semibold text-rose-950">Timings</h2>
          <div className="mt-5 space-y-4">
            {timingHighlights.map((item) => (
              <div key={item} className="rounded-2xl bg-white/55 px-4 py-4 text-sm font-medium leading-7 text-rose-900/82">
                {item}
              </div>
            ))}
          </div>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">
            Start Free Trial
          </Link>
        </GlassPanel>
      </div>
    </div>
  );
}
