import { buildWhatsappUrl, brandDetails } from '../data/siteData';
import { apiRequest } from './api';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const CONTACT_EMAIL = 'srinithisrinithi09@gmail.com';

function sanitizePayload(payload) {
  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    whatsapp: payload.whatsapp.trim(),
    selectedPlan: (payload.selectedPlan || '').trim(),
    planPrice: (payload.planPrice || '').trim(),
    paymentMethod: (payload.paymentMethod || '').trim(),
    transactionReference: (payload.transactionReference || '').trim(),
    amount: payload.amount ? Number(payload.amount) : null,
    message: (payload.message || '').trim(),
    source: payload.source || 'website-contact-form',
  };
}

function formatSubmittedAt(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function buildEmailTemplateParams(payload) {
  const clean = sanitizePayload(payload);

  return {
    brand_name: brandDetails.name,
    to_name: brandDetails.name,
    to_email: CONTACT_EMAIL,
    from_name: clean.name,
    from_email: clean.email,
    reply_to: clean.email,
    whatsapp_number: clean.whatsapp,
    selected_plan: clean.selectedPlan || 'General enquiry',
    plan_price: clean.planPrice || 'To be discussed',
    amount: clean.amount != null ? String(clean.amount) : 'TBD',
    message: clean.message,
    submitted_at: formatSubmittedAt(),
  };
}

export function buildWhatsappMessage(payload) {
  const clean = sanitizePayload(payload);
  const planLine = clean.selectedPlan ? `Plan / Program: ${clean.selectedPlan}` : 'Plan / Program: General enquiry';
  const priceLine = clean.planPrice ? `Price / Duration: ${clean.planPrice}` : 'Price / Duration: To be discussed';
  const paymentLine = clean.paymentMethod ? `Payment Method: ${clean.paymentMethod}` : null;
  const transactionLine = clean.transactionReference ? `Transaction Reference: ${clean.transactionReference}` : null;

  return [
    'Hi, I want to join Jeevanam 360.',
    '',
    `Name: ${clean.name}`,
    `Email: ${clean.email}`,
    `WhatsApp: ${clean.whatsapp}`,
    planLine,
    priceLine,
    paymentLine,
    transactionLine,
    'Message:',
    clean.message || 'Please guide me with the next step.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildContactWhatsappUrl(payload) {
  return buildWhatsappUrl(buildWhatsappMessage(payload));
}

export async function sendContactEmail(payload) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('Frontend email service is not configured.');
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: buildEmailTemplateParams(payload),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Could not send the email from the website.');
  }

  return { success: true };
}

export function submitContactMessage(payload, token) {
  const clean = sanitizePayload(payload);

  return apiRequest('/contact-messages', {
    method: 'POST',
    token,
    body: {
      whatsapp: clean.whatsapp,
      selectedPlan: clean.selectedPlan,
      planPrice: clean.planPrice,
      amount: clean.amount,
      message: clean.message || 'Website contact request',
      source: clean.source,
    },
  });
}

export function submitPaymentRequest(payload, token) {
  const clean = sanitizePayload(payload);

  if (!clean.selectedPlan || !clean.paymentMethod || !clean.transactionReference) {
    return Promise.resolve(null);
  }

  return apiRequest('/payment-requests', {
    method: 'POST',
    token,
    body: {
      name: clean.name,
      email: clean.email,
      whatsapp: clean.whatsapp,
      selectedPlan: clean.selectedPlan,
      planPrice: clean.planPrice,
      paymentMethod: clean.paymentMethod,
      transactionReference: clean.transactionReference,
      amount: clean.amount,
      currency: 'INR',
      note: clean.message,
    },
  });
}
