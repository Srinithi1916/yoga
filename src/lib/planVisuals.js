const PLAN_VISUALS = {
  BEGINNER_PLAN: {
    typeLabel: 'Yoga + Consultation',
    gradientClass: 'from-rose-500 via-pink-500 to-fuchsia-500',
    surfaceClass: 'from-rose-50 via-white to-pink-50/80',
    badgeClass: 'bg-rose-100 text-rose-700',
    mutedClass: 'text-rose-700/80',
    primaryButtonClass: 'bg-rose-600 text-white hover:bg-rose-700',
    borderClass: 'border-rose-200',
  },
  INTERMEDIATE_PLAN: {
    typeLabel: 'Yoga + Diet',
    gradientClass: 'from-amber-500 via-orange-500 to-yellow-500',
    surfaceClass: 'from-amber-50 via-white to-yellow-50/80',
    badgeClass: 'bg-amber-100 text-amber-700',
    mutedClass: 'text-amber-800/80',
    primaryButtonClass: 'bg-amber-500 text-white hover:bg-amber-600',
    borderClass: 'border-amber-200',
  },
  ADVANCED_PLAN: {
    typeLabel: 'Yoga + Meditation',
    gradientClass: 'from-cyan-500 via-teal-500 to-sky-500',
    surfaceClass: 'from-cyan-50 via-white to-sky-50/80',
    badgeClass: 'bg-cyan-100 text-cyan-700',
    mutedClass: 'text-cyan-800/80',
    primaryButtonClass: 'bg-cyan-600 text-white hover:bg-cyan-700',
    borderClass: 'border-cyan-200',
  },
  PREMIUM_WELLNESS_PLAN: {
    typeLabel: 'Full Wellness',
    gradientClass: 'from-emerald-500 via-teal-500 to-lime-500',
    surfaceClass: 'from-emerald-50 via-white to-lime-50/80',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    mutedClass: 'text-emerald-800/80',
    primaryButtonClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
    borderClass: 'border-emerald-200',
  },
};

const DEFAULT_PLAN_VISUAL = PLAN_VISUALS.BEGINNER_PLAN;

const SERVICE_VISUALS = {
  yoga: {
    label: 'Yoga',
    className: 'bg-rose-100 text-rose-700',
  },
  consultation: {
    label: 'Consultation',
    className: 'bg-amber-100 text-amber-700',
  },
  diet: {
    label: 'Diet',
    className: 'bg-emerald-100 text-emerald-700',
  },
  meditation: {
    label: 'Meditation',
    className: 'bg-sky-100 text-sky-700',
  },
  nidra: {
    label: 'Yoga Nidra',
    className: 'bg-violet-100 text-violet-700',
  },
  support: {
    label: 'Support',
    className: 'bg-fuchsia-100 text-fuchsia-700',
  },
  routine: {
    label: 'Tracking',
    className: 'bg-orange-100 text-orange-700',
  },
};

const SERVICE_ORDER = ['yoga', 'consultation', 'diet', 'meditation', 'nidra', 'support', 'routine'];

function inferServiceKey(feature) {
  const normalized = String(feature || '').toLowerCase();

  if (normalized.includes('diet')) {
    return 'diet';
  }

  if (normalized.includes('consult')) {
    return 'consultation';
  }

  if (normalized.includes('meditation')) {
    return 'meditation';
  }

  if (normalized.includes('nidra')) {
    return 'nidra';
  }

  if (
    normalized.includes('support')
    || normalized.includes('follow-up')
    || normalized.includes('personalized')
    || normalized.includes('choice')
  ) {
    return 'support';
  }

  if (normalized.includes('dashboard') || normalized.includes('track')) {
    return 'routine';
  }

  return 'yoga';
}

export function getPlanVisual(planKey) {
  return PLAN_VISUALS[planKey] || DEFAULT_PLAN_VISUAL;
}

export function getServiceTags(features = []) {
  const seen = new Set();

  features.forEach((feature) => {
    seen.add(inferServiceKey(feature));
  });

  if (!seen.size) {
    seen.add('yoga');
  }

  return SERVICE_ORDER
    .filter((key) => seen.has(key))
    .map((key) => ({
      key,
      label: SERVICE_VISUALS[key].label,
      className: SERVICE_VISUALS[key].className,
    }));
}
