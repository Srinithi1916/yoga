import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassPanel from './GlassPanel';
import SectionHeading from './SectionHeading';
import { useAuth } from '../context/AuthContext';
import {
  buildContactPlanHref,
  buildWhatsappUrl,
  specialOffers,
} from '../data/siteData';
import { fetchMyMembership } from '../lib/membershipApi';
import { fetchMyPaymentRequests } from '../lib/paymentApi';

const offerStyles = {
  FIRST_TRIAL_99: {
    shellClass: 'border-rose-200/70 bg-[linear-gradient(135deg,rgba(255,244,247,0.92),rgba(255,255,255,0.85))]',
    badgeClass: 'bg-rose-100 text-rose-700',
    priceClass: 'text-rose-600',
    buttonClass: 'bg-rose-600 text-white hover:bg-rose-700',
  },
  YOGA_DIET_149: {
    shellClass: 'border-emerald-200/70 bg-[linear-gradient(135deg,rgba(240,253,247,0.95),rgba(255,255,255,0.88))]',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    priceClass: 'text-emerald-600',
    buttonClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
  },
  BEGINNER_LAUNCH_999: {
    shellClass: 'border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,251,235,0.92),rgba(255,255,255,0.85))]',
    badgeClass: 'bg-amber-100 text-amber-700',
    priceClass: 'text-amber-600',
    buttonClass: 'bg-amber-600 text-white hover:bg-amber-700',
  },
};

function normalizeSelectionTitle(value) {
  return String(value || '').trim().toLowerCase();
}

function resolveVisibleOffers({ membership, payments }) {
  const paymentList = Array.isArray(payments) ? payments : [];
  const hasUserPaymentHistory = paymentList.length > 0;
  const hasMembershipHistory = Boolean(membership);
  const hasExistingHistory = hasMembershipHistory || hasUserPaymentHistory;

  return specialOffers.filter((offer) => {
    const alreadyClaimed = paymentList.some(
      (payment) => normalizeSelectionTitle(payment.selectedPlan) === normalizeSelectionTitle(offer.title),
    );

    if (alreadyClaimed) {
      return false;
    }

    if (offer.newUserOnly) {
      return !hasExistingHistory;
    }

    return true;
  });
}

function buildOfferWhatsappMessage(offer) {
  return `Hi, I want the ${offer.title} offer. Please guide me.`;
}

function OfferCard({ offer }) {
  const style = offerStyles[offer.offerKey] || offerStyles.FIRST_TRIAL_99;
  const contactHref = buildContactPlanHref(offer);
  const whatsappHref = buildWhatsappUrl(buildOfferWhatsappMessage(offer));

  return (
    <div className={`rounded-[2rem] border p-5 shadow-glass ${style.shellClass}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] ${style.badgeClass}`}>
            {offer.badge}
          </span>
          <h3 className="mt-4 font-display text-3xl text-rose-950">{offer.title}</h3>
          {offer.durationLabel ? <p className="mt-2 text-sm font-semibold text-rose-900/72">{offer.durationLabel}</p> : null}
        </div>
        <p className={`text-3xl font-bold ${style.priceClass}`}>{offer.price}</p>
      </div>

      <p className="mt-3 text-sm leading-7 text-rose-900/76">{offer.description}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary">
          WhatsApp
        </a>
        <Link
          to={contactHref}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition duration-300 hover:scale-[1.02] ${style.buttonClass}`}
        >
          {offer.cta}
        </Link>
      </div>
    </div>
  );
}

export default function SpecialOfferSection({
  eyebrow = 'Offers',
  title = 'Special Offers',
  description = 'Simple offers for first-time joining and quick start support.',
  panelClassName = '',
}) {
  const { isReady, isAuthenticated, token } = useAuth();
  const [visibleOffers, setVisibleOffers] = useState(specialOffers);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOffers() {
      if (!isReady) {
        return;
      }

      if (!isAuthenticated) {
        setVisibleOffers(specialOffers);
        return;
      }

      setIsLoading(true);

      try {
        const [membership, payments] = await Promise.all([
          fetchMyMembership(token).catch(() => null),
          fetchMyPaymentRequests(token).catch(() => []),
        ]);

        if (!cancelled) {
          setVisibleOffers(resolveVisibleOffers({ membership, payments }));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadOffers();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isReady, token]);

  const hasOffers = useMemo(() => visibleOffers.length > 0, [visibleOffers]);

  if (!hasOffers && !isLoading) {
    return null;
  }

  return (
    <GlassPanel className={`rounded-[2.5rem] px-6 py-8 shadow-bloom sm:px-8 ${panelClassName}`}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      {isLoading ? (
        <div className="mt-6 rounded-[1.75rem] border border-white/55 bg-white/60 px-5 py-5 text-sm leading-7 text-rose-900/75 shadow-glass">
          Checking your offers...
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visibleOffers.map((offer) => (
            <OfferCard key={offer.offerKey} offer={offer} />
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
