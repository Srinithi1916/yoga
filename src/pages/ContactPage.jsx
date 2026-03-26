import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { ContactIllustration } from '../components/Illustrations';
import {
  brandDetails,
  contactSelectionOptions,
  getContactSelectionOption,
  timingHighlights,
  trialBenefits,
} from '../data/siteData';
import { useAuth } from '../context/AuthContext';
import {
  buildContactWhatsappUrl,
  sendContactEmail,
  submitContactMessage,
  submitPaymentRequest,
} from '../lib/contactWorkflow';

const emptyForm = {
  whatsapp: '',
  selectedPlan: '',
  planPrice: '',
  amount: '',
  message: '',
};

function createFormFromParams(searchParams, phone = '') {
  return {
    ...emptyForm,
    whatsapp: phone,
    selectedPlan: searchParams.get('plan') || '',
    planPrice: searchParams.get('planPrice') || '',
    amount: searchParams.get('amount') || '',
  };
}

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const [form, setForm] = useState(() => createFormFromParams(searchParams, user?.phone || ''));
  const [status, setStatus] = useState({ type: 'idle', message: '', whatsappUrl: '' });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      whatsapp: current.whatsapp || user?.phone || '',
      selectedPlan: searchParams.get('plan') || current.selectedPlan,
      planPrice: searchParams.get('planPrice') || current.planPrice,
      amount: searchParams.get('amount') || current.amount,
    }));
  }, [searchParams, user]);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === 'selectedPlan') {
      const option = getContactSelectionOption(value);
      setForm((current) => ({
        ...current,
        selectedPlan: value,
        planPrice: option?.planPrice || '',
        amount: option?.amount ? String(option.amount) : '',
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      name: user.name,
      email: user.email,
      source: 'website-contact-form',
    };
    const whatsappUrl = buildContactWhatsappUrl(payload);

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setStatus({
      type: 'submitting',
      message: 'Opening WhatsApp and sending your enquiry...',
      whatsappUrl,
    });

    const [contactResult, paymentResult, emailResult] = await Promise.allSettled([
      submitContactMessage(payload, token),
      submitPaymentRequest(payload, token),
      sendContactEmail(payload),
    ]);

    const contactSaved = contactResult.status === 'fulfilled';
    const paymentSaved = paymentResult.status === 'fulfilled';
    const emailSent = emailResult.status === 'fulfilled';

    const messages = ['WhatsApp opened.'];

    if (contactSaved) {
      const storageStatus = contactResult.value?.storageStatus;
      if (storageStatus) {
        messages.push(storageStatus);
      }
    } else {
      messages.push('Could not save your enquiry.');
    }

    if (emailSent) {
      messages.push('Email sent successfully.');
    } else {
      messages.push('Email failed. Please use WhatsApp.');
    }

    if (paymentSaved && form.selectedPlan) {
      messages.push('Payment request saved.');
    }

    setStatus({
      type: contactSaved && emailSent ? 'success' : 'error',
      message: messages.join(' '),
      whatsappUrl,
    });

    if (contactSaved && emailSent) {
      setForm(createFormFromParams(searchParams, user?.phone || ''));
    }
  }

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Contact"
            title="Contact & Booking"
            description="Your saved details are ready. Send your message here."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassPanel className="rounded-[2.5rem] p-8 shadow-bloom">
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-5xl text-rose-950">{brandDetails.promise}</h2>
              <p className="mt-4 text-base leading-8 text-rose-900/82">
                Your saved details are ready. Share your goal or question.
              </p>
            </div>
            <div className="space-y-3 rounded-[1.75rem] bg-white/55 px-5 py-5 text-sm leading-7 text-rose-900/82 shadow-glass">
              <p>
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">WhatsApp:</span> {user.phone}
              </p>
              {form.selectedPlan ? (
                <p>
                  <span className="font-semibold">Plan:</span> {form.selectedPlan}
                </p>
              ) : null}
            </div>
            <div className="space-y-3">
              <Link to="/pricing" className="btn-secondary inline-flex">
                View Pricing
              </Link>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              {[...timingHighlights.slice(0, 2), trialBenefits[0], brandDetails.supportLine].map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 px-4 py-4 text-sm leading-7 text-rose-900/82 shadow-glass">
                  {item}
                </div>
              ))}
            </div>
            <ContactIllustration className="mx-auto mt-6 w-full max-w-sm" />
          </div>
        </GlassPanel>

        <GlassPanel className="rounded-[2.5rem] p-8 shadow-bloom">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="whatsapp" className="mb-2 block text-sm font-semibold text-rose-900">
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
              />
            </div>
            <div>
              <label htmlFor="selectedPlan" className="mb-2 block text-sm font-semibold text-rose-900">
                Plan / Program
              </label>
              <select
                id="selectedPlan"
                name="selectedPlan"
                value={form.selectedPlan}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
              >
                {contactSelectionOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-rose-900">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
              />
            </div>
            <button
              type="submit"
              disabled={status.type === 'submitting'}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.type === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            {status.type !== 'idle' ? (
              <div className="rounded-2xl bg-white/60 px-4 py-4 text-sm leading-7 text-rose-900/85">
                <p>{status.message}</p>
                {status.whatsappUrl ? (
                  <a
                    href={status.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary mt-4 inline-flex"
                  >
                    Open WhatsApp
                  </a>
                ) : null}
              </div>
            ) : null}
          </form>
        </GlassPanel>
      </div>
    </div>
  );
}
