const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const BRAND_NAME = 'Jeevanam 360';

let razorpayScriptPromise;

function ensureAmount(plan) {
  const amount = Number(plan?.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('This plan does not have a fixed online payment amount yet.');
  }

  return amount;
}

export function isPayablePlan(plan) {
  return Number.isFinite(Number(plan?.amount)) && Number(plan.amount) > 0;
}

export async function loadRazorpayScript() {
  if (typeof window === 'undefined') {
    throw new Error('Razorpay checkout can only open in the browser.');
  }

  if (window.Razorpay) {
    return true;
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Razorpay checkout could not load.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay checkout could not load.'));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'The payment request could not be completed.');
  }

  return data;
}

export async function createRazorpayOrder({ plan, customer = {} }) {
  const amount = ensureAmount(plan);

  return postJson('/payments/razorpay/order', {
    selectedPlan: plan.title,
    planPrice: plan.price,
    amount,
    currency: 'INR',
    customerName: customer.name || null,
    customerEmail: customer.email || null,
    customerWhatsapp: customer.whatsapp || null,
  });
}

export async function verifyRazorpayPayment(payload) {
  return postJson('/payments/razorpay/verify', payload);
}

export async function startRazorpayCheckout({ plan, customer = {}, onStatusChange, onSuccess }) {
  const amount = ensureAmount(plan);
  onStatusChange?.('loading', `Preparing secure checkout for ${plan.title}...`);

  await loadRazorpayScript();
  const order = await createRazorpayOrder({ plan, customer });

  const razorpay = new window.Razorpay({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    name: BRAND_NAME,
    description: plan.title,
    order_id: order.orderId,
    prefill: {
      name: customer.name || '',
      email: customer.email || '',
      contact: customer.whatsapp || '',
    },
    notes: {
      selected_plan: plan.title,
      plan_price: plan.price,
      brand: BRAND_NAME,
    },
    theme: {
      color: '#db5f95',
    },
    modal: {
      ondismiss: () => {
        onStatusChange?.('idle', 'Razorpay checkout was closed before payment was completed.');
      },
    },
    handler: async (response) => {
      try {
        onStatusChange?.('verifying', 'Payment received. Verifying it securely...');
        const verification = await verifyRazorpayPayment({
          orderId: order.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        if (!verification.verified) {
          throw new Error(verification.message || 'Payment verification failed.');
        }

        onStatusChange?.('success', `${plan.title} payment completed successfully.`);
        onSuccess?.({ order, verification, response, amount });
      } catch (error) {
        onStatusChange?.(
          'error',
          error.message || 'Payment verification failed. Please contact support with your payment details.',
        );
      }
    },
  });

  razorpay.on('payment.failed', (event) => {
    const reason = event?.error?.description || event?.error?.reason || 'Payment failed before completion.';
    onStatusChange?.('error', reason);
  });

  razorpay.open();
}