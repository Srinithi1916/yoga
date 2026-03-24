import { buildWhatsappUrl } from '../data/siteData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_8eusket';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_a3wn0ko';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Lq-b9zkDDo2as94ms';
const CONTACT_EMAIL = 'srinithisrinithi09@gmail.com';
const BRAND_NAME = 'Jeevanam 360';

function sanitizePayload(payload) {
  return {
    name: payload.name.trim(),
    email: payload.email.trim(),
    whatsapp: payload.whatsapp.trim(),
    selectedPlan: (payload.selectedPlan || '').trim(),
    planPrice: (payload.planPrice || '').trim(),
    amount: payload.amount ? Number(payload.amount) : null,
    message: payload.message.trim(),
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
    brand_name: BRAND_NAME,
    to_name: BRAND_NAME,
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

  return [
    'Hi, I want to join Jeevanam 360.',
    '',
    `Name: ${clean.name}`,
    `Email: ${clean.email}`,
    `WhatsApp: ${clean.whatsapp}`,
    planLine,
    priceLine,
    'Message:',
    clean.message,
  ].join('\n');
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

export async function submitContactMessage(payload) {
  const response = await fetch(`${API_BASE_URL}/contact-messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sanitizePayload(payload)),
  });

  if (!response.ok) {
    throw new Error('Could not save the contact message.');
  }

  return response.json();
}

export async function submitPaymentRequest(payload) {
  const clean = sanitizePayload(payload);

  if (!clean.selectedPlan) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/payment-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: clean.name,
      email: clean.email,
      whatsapp: clean.whatsapp,
      selectedPlan: clean.selectedPlan,
      planPrice: clean.planPrice,
      amount: clean.amount,
      currency: 'INR',
      note: clean.message,
    }),
  });

  if (!response.ok) {
    throw new Error('Could not create the payment request.');
  }

  return response.json();
}
