import { buildWhatsappUrl } from '../data/siteData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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