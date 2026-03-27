function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function withReviewMeta(items, type, label, prefix) {
  return items.map((item) => ({
    ...item,
    reviewItemId: `${prefix}-${slugify(item.title)}`,
    reviewItemType: type,
    reviewItemTypeLabel: label,
  }));
}

export const brandDetails = {
  name: 'JEEVANAM 360',
  supportLine: 'Yoga | Wellness | Balance',
  promise: 'Harmony for Body, Mind & Soul',
};

export const navigationLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Guides', href: '/guides' },
  { label: 'Contact', href: '/contact' },
];

export const siteImages = {
  about:
    'https://images.pexels.com/photos/8436572/pexels-photo-8436572.jpeg?auto=compress&cs=tinysrgb&w=1200',
  programs:
    'https://images.pexels.com/photos/29788476/pexels-photo-29788476.jpeg?auto=compress&cs=tinysrgb&w=1200',
  guides:
    'https://images.pexels.com/photos/9065234/pexels-photo-9065234.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export const heroSlides = [
  {
    title: 'Yoga | Wellness | Balance',
    description: 'Personalized yoga, care, and support for real life.',
    imageUrl:
      'https://images.pexels.com/photos/9225395/pexels-photo-9225395.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imageAlt: 'Man and woman practicing yoga on a deck in a peaceful forest setting',
  },
  {
    title: 'Harmony for Body, Mind & Soul',
    description: 'Calm wellness for students, professionals, and families.',
    imageUrl:
      'https://images.pexels.com/photos/29841240/pexels-photo-29841240.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imageAlt: 'Man meditating outdoors in a quiet green setting',
  },
  {
    title: 'Support that stays personal',
    description: 'Weekly follow-up and WhatsApp support keep you on track.',
    imageUrl:
      'https://images.pexels.com/photos/9065234/pexels-photo-9065234.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imageAlt: 'Supportive wellness consultation between two adults',
  },
];

export const communitySlides = [
  {
    title: 'Outdoor wellness sessions',
    description: 'Guided practice that feels calm, open, and energizing.',
    imageUrl:
      'https://images.pexels.com/photos/4965343/pexels-photo-4965343.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Man and woman practicing yoga outdoors together',
  },
  {
    title: 'Partner and family encouragement',
    description: 'Consistency grows faster with support around you.',
    imageUrl:
      'https://images.pexels.com/photos/7593022/pexels-photo-7593022.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Man and woman doing yoga together indoors',
  },
  {
    title: 'Community class energy',
    description: 'Shared practice builds discipline, confidence, and connection.',
    imageUrl:
      'https://images.pexels.com/photos/14175839/pexels-photo-14175839.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Group of adults practicing yoga together in a sunlit space',
  },
];

export const aboutPreviewPoints = [
  'Personalized Programs',
  'Flexible Timings',
  'Expert Guidance',
];

const yogaTypeItems = [
  {
    title: 'Hatha Yoga',
    benefit: 'Builds strength and flexibility.',
    imageUrl:
      'https://images.pexels.com/photos/8436938/pexels-photo-8436938.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Adult practicing hatha yoga in a calm studio setting',
  },
  {
    title: 'Vinyasa Yoga',
    benefit: 'Improves flow, stamina, and energy.',
    imageUrl:
      'https://images.pexels.com/photos/4534688/pexels-photo-4534688.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Adult moving through a vinyasa yoga flow',
  },
  {
    title: 'Face Yoga',
    benefit: 'Supports tone and natural glow.',
    imageUrl:
      'https://images.pexels.com/photos/6633667/pexels-photo-6633667.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Person practicing face yoga with a self-care tool',
  },
  {
    title: 'Pregnancy Yoga',
    benefit: 'Supports comfort and confidence.',
    imageUrl:
      'https://images.pexels.com/photos/7055646/pexels-photo-7055646.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Pregnant woman practicing a gentle yoga pose indoors',
  },
  {
    title: 'Meditation',
    benefit: 'Builds calm and focus.',
    imageUrl:
      'https://images.pexels.com/photos/29841240/pexels-photo-29841240.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Man meditating outdoors in nature',
  },
  {
    title: 'Kids Yoga',
    benefit: 'Builds focus, flexibility, and discipline.',
    imageUrl:
      'https://images.pexels.com/photos/6288103/pexels-photo-6288103.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Family practicing yoga together at home',
  },
  {
    title: 'Pranayama',
    benefit: 'Improves breath and lowers stress.',
    imageUrl:
      'https://images.pexels.com/photos/6648543/pexels-photo-6648543.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Man and woman practicing breathing exercises together',
  },
  {
    title: 'Therapeutic Yoga',
    benefit: 'Supports natural recovery.',
    imageUrl:
      'https://images.pexels.com/photos/4534600/pexels-photo-4534600.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Adult practicing a restorative therapeutic yoga pose',
  },
  {
    title: 'Yoga Nidra',
    benefit: 'Promotes deep rest and better sleep.',
    imageUrl:
      'https://images.pexels.com/photos/7350283/pexels-photo-7350283.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Adult resting in a supported yoga nidra pose',
  },
];

export const yogaTypes = withReviewMeta(yogaTypeItems, 'YOGA_TYPE', 'Yoga Type', 'yoga');

const specialProgramItems = [
  {
    title: 'Postpartum Recovery',
    duration: 'From 1 week',
    audience: 'Recovery support for new mothers.',
    results: 'Guided recovery with regular review.',
  },
  {
    title: 'Yoga for Stress Management',
    duration: 'From 1 week',
    audience: 'For stress, burnout, and overload.',
    results: 'Better calm, breath, and balance.',
  },
  {
    title: 'Yoga for Exam Focus',
    duration: 'From 1 week',
    audience: 'For students who need better focus.',
    results: 'Sharper focus with regular support.',
  },
  {
    title: 'Yoga for Weight Loss',
    duration: 'From 1 week',
    audience: 'For mindful weight loss and routine.',
    results: 'Progress tracked week by week.',
  },
];

export const specialPrograms = withReviewMeta(specialProgramItems, 'SPECIAL_PROGRAM', 'Special Program', 'program');

const pricingPlanItems = [
  {
    planKey: 'BEGINNER_PLAN',
    title: 'Beginner Plan',
    price: '30 Days - Rs. 1999',
    amount: 1999,
    durationDays: 30,
    description: 'Yoga classes with weekly consultation for a steady start.',
    features: [
      'Guided yoga classes',
      'Weekly consultation',
      'Simple routine support',
      'Progress dashboard',
    ],
    workflowSteps: [
      'Attend your yoga class',
      'Track practice progress',
      'Join the weekly consultation',
      'Review your weekly growth',
    ],
    cta: 'Choose Plan',
    paymentEnabled: true,
  },
  {
    planKey: 'INTERMEDIATE_PLAN',
    title: 'Intermediate Plan',
    price: '15 Days (2 Sessions / Day)',
    amount: null,
    durationDays: 15,
    description: 'Yoga classes with a diet plan for stronger daily discipline.',
    features: [
      'Guided yoga classes',
      'Diet plan',
      'Daily food follow-up',
      'Progress dashboard',
    ],
    workflowSteps: [
      'Follow the yoga schedule',
      'Track your diet check-ins',
      'Update daily progress',
      'Complete guided follow-up',
    ],
    cta: 'Choose Plan',
    paymentEnabled: true,
  },
  {
    planKey: 'ADVANCED_PLAN',
    title: 'Advanced Plan',
    price: 'Fully Personalized',
    amount: null,
    durationDays: 30,
    description: 'Yoga, personalized meditation, and diet support in one plan.',
    features: [
      'Personalized yoga',
      'Personalized meditation',
      'Diet guidance',
      'Progress review',
    ],
    workflowSteps: [
      'Complete yoga practice',
      'Follow the meditation routine',
      'Track diet consistency',
      'Review guided progress',
    ],
    cta: 'Choose Plan',
    paymentEnabled: true,
  },
];

export const pricingPlans = withReviewMeta(pricingPlanItems, 'PLAN', 'Membership Plan', 'plan');

export const premiumPlan = {
  planKey: 'PREMIUM_WELLNESS_PLAN',
  title: 'Premium Wellness Plan',
  price: 'Rs. 3000 / Month',
  amount: 3000,
  durationDays: 30,
  description: 'Full personal guidance with yoga, meditation, yoga nidra, diet, and weekly consultation.',
  features: [
    'Personalized yoga',
    'Diet plan',
    'Weekly consultation',
    'Meditation support',
    'Yoga nidra',
    'Choice-based yoga path',
  ],
  workflowSteps: [
    'Follow your personalized yoga flow',
    'Track diet and wellness goals',
    'Complete meditation or yoga nidra',
    'Attend weekly review and consultation',
  ],
  includes: [
    'Personalized yoga',
    'Diet plan weekly',
    'Weekly consultation',
    'Meditation support',
    'Yoga Nidra',
    'Any choice of yoga',
  ],
  cta: 'Choose Plan',
  paymentEnabled: true,
  reviewItemId: 'plan-premium-wellness-plan',
  reviewItemType: 'PLAN',
  reviewItemTypeLabel: 'Membership Plan',
};

export const trialBenefits = [
  'Free 1-Day Trial',
  'Free weekend consultation on monthly plans',
  'Rewards on yearly plans',
];

export const timingHighlights = [
  'Flexible timing',
  'Morning and evening slots',
  'Sessions all week',
];

export const whyChooseUs = [
  {
    title: 'Personalized Sessions',
    description: 'Sessions matched to your body and goals.',
  },
  {
    title: 'BNYS-Based Approach',
    description: 'Natural wellness for body and mind.',
  },
  {
    title: 'Flexible Timing',
    description: 'Plans that fit study, work, and family life.',
  },
  {
    title: 'Progress Tracking',
    description: 'Clear reviews and visible progress.',
  },
];

export const progressFeatures = [
  'Weekly review',
  'Personal feedback',
  'Visible progress',
  'Goal-based tracking',
];

export const whatsappCommunityFeatures = [
  'Daily reminders',
  'Ongoing support',
  'Direct support',
  'Simple wellness tips',
];

export const testimonials = [
  {
    name: 'Ananya R.',
    quote: 'I found a routine that felt calm, personal, and sustainable.',
  },
  {
    name: 'Rahul M.',
    quote: 'The weekly follow-up improved my focus and recovery.',
  },
  {
    name: 'Divya K.',
    quote: 'The Premium plan connected yoga, food, and progress clearly.',
  },
];

export const guideCollections = {
  free: [
    {
      title: 'Morning Reset Guide',
      description: 'A simple routine for movement, hydration, and breath.',
      format: 'Free PDF',
      actionLabel: 'Download PDF',
      actionHref: '/guides/morning-reset-guide.pdf',
    },
    {
      title: 'Stress Relief Breathing Guide',
      description: 'Easy breathing steps for busy or stressful days.',
      format: 'Free PDF',
      actionLabel: 'Download PDF',
      actionHref: '/guides/stress-relief-breathing-guide.pdf',
    },
    {
      title: 'Beginner Yoga Tracker',
      description: 'A printable tracker for daily practice.',
      format: 'Free PDF',
      actionLabel: 'Download PDF',
      actionHref: '/guides/beginner-yoga-tracker.pdf',
    },
  ],
  premium: [
    {
      title: '7-Day Wellness Reset E-Book',
      description: 'A reset for movement, food, and recovery.',
      format: 'Paid E-Book',
      price: 'Rs. 299',
      previewHref: '/guides/7-day-wellness-reset-preview.pdf',
      actionHref: '/contact?plan=7-Day%20Wellness%20Reset%20E-Book&planPrice=Rs.%20299',
    },
    {
      title: "Women's Balance Companion",
      description: 'A guide for calmer cycles and steady energy.',
      format: 'Paid E-Book',
      price: 'Rs. 349',
      previewHref: '/guides/womens-balance-companion-preview.pdf',
      actionHref: '/contact?plan=Women%27s%20Balance%20Companion&planPrice=Rs.%20349',
    },
    {
      title: 'Exam Focus Routine Planner',
      description: 'A planner for focus, energy, and steady study.',
      format: 'Paid E-Book',
      price: 'Rs. 249',
      previewHref: '/guides/exam-focus-routine-planner-preview.pdf',
      actionHref: '/contact?plan=Exam%20Focus%20Routine%20Planner&planPrice=Rs.%20249',
    },
  ],
};

export const contactDetails = {
  email: 'srinithisrinithi09@gmail.com',
  phone: '7904049837',
  whatsappNumber: '917904049837',
  whatsappLink:
    'https://wa.me/917904049837?text=Hi%20I%20want%20to%20join%20Jeevanam%20360',
  tagline: brandDetails.supportLine,
};

export const socialLinks = [
  { label: 'WhatsApp', href: 'https://wa.me/917904049837?text=Hi%20I%20want%20to%20join%20Jeevanam%20360', external: true },
  { label: 'Email', href: 'mailto:srinithisrinithi09@gmail.com', external: true },
  { label: 'Guides', href: '/guides', external: false },
  { label: 'Free Trial', href: '/contact', external: false },
];

export const contactSelectionOptions = [
  {
    label: 'General Enquiry',
    value: '',
    planPrice: '',
    amount: null,
    paymentEnabled: false,
  },
  ...pricingPlans.map((plan) => ({
    label: `${plan.title} - ${plan.price}`,
    value: plan.title,
    planPrice: plan.price,
    amount: plan.amount,
    durationDays: plan.durationDays,
    paymentEnabled: plan.paymentEnabled,
  })),
  {
    label: `${premiumPlan.title} - ${premiumPlan.price}`,
    value: premiumPlan.title,
    planPrice: premiumPlan.price,
    amount: premiumPlan.amount,
    durationDays: premiumPlan.durationDays,
    paymentEnabled: premiumPlan.paymentEnabled,
  },
  ...specialPrograms.map((program) => ({
    label: `${program.title} - ${program.duration}`,
    value: program.title,
    planPrice: program.duration,
    amount: null,
    paymentEnabled: false,
  })),
  ...yogaTypes.map((type) => ({
    label: `${type.title} - Custom Consultation`,
    value: type.title,
    planPrice: 'Custom Consultation',
    amount: null,
    paymentEnabled: false,
  })),
];

export function getContactSelectionOption(value) {
  return contactSelectionOptions.find((option) => option.value === value) || null;
}

export function buildWhatsappUrl(message) {
  return `https://wa.me/${contactDetails.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildContactPlanHref(plan) {
  const params = new URLSearchParams({
    plan: plan.title,
    planPrice: plan.price,
  });

  if (plan.amount) {
    params.set('amount', String(plan.amount));
  }

  return `/contact?${params.toString()}`;
}




