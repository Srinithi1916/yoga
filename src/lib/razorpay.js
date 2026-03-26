import { buildWhatsappUrl } from '../data/siteData';

const BRAND_NAME = 'Jeevanam 360';
const PAYMENT_UNAVAILABLE_MESSAGE =
  'Online payment is unavailable right now. Please contact us on WhatsApp.';

function ensureAmount(plan) {
  const amount = Number(plan?.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('This plan does not have a fixed payment amount yet.');
  }

  return amount;
}

function buildPaymentMessage(plan, customer = {}) {
  const lines = [
    `Hi, I want to pay for ${plan.title}.`,
    '',
    `Brand: ${BRAND_NAME}`,
    `Plan: ${plan.title}`,
    `Price: ${plan.price}`,
  ];

  if (customer.name) {
    lines.push(`Name: ${customer.name}`);
  }

  if (customer.email) {
    lines.push(`Email: ${customer.email}`);
  }

  if (customer.whatsapp) {
    lines.push(`WhatsApp: ${customer.whatsapp}`);
  }

  lines.push('', 'Online payment showed an error. Please help me complete this on WhatsApp.');
  return lines.join('\n');
}

export function isPayablePlan(plan) {
  return Number.isFinite(Number(plan?.amount)) && Number(plan.amount) > 0;
}

export async function loadRazorpayScript() {
  return false;
}

export async function createRazorpayOrder() {
  throw new Error(PAYMENT_UNAVAILABLE_MESSAGE);
}

export async function verifyRazorpayPayment() {
  return {
    verified: false,
    message: PAYMENT_UNAVAILABLE_MESSAGE,
  };
}

export async function startRazorpayCheckout({ plan, customer = {}, onStatusChange }) {
  ensureAmount(plan);

  const whatsappUrl = buildWhatsappUrl(buildPaymentMessage(plan, customer));
  onStatusChange?.('error', PAYMENT_UNAVAILABLE_MESSAGE);

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return { whatsappUrl };
}
