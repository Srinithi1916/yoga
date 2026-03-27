import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import {
  brandDetails,
  contactSelectionOptions,
  getContactSelectionOption,
} from '../data/siteData';
import { useAuth } from '../context/AuthContext';
import {
  buildContactWhatsappUrl,
  submitContactMessage,
  submitPaymentRequest,
} from '../lib/contactWorkflow';

const paymentMethods = ['UPI Transfer', 'Bank Transfer', 'WhatsApp Confirmation'];

const emptyForm = {
  whatsapp: '',
  selectedPlan: '',
  planPrice: '',
  amount: '',
  paymentMethod: 'UPI Transfer',
  transactionReference: '',
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

  const selectedOption = useMemo(
    () => getContactSelectionOption(form.selectedPlan),
    [form.selectedPlan],
  );
  const requiresPayment = Boolean(selectedOption?.paymentEnabled);

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
        paymentMethod: option?.paymentEnabled ? current.paymentMethod : 'UPI Transfer',
        transactionReference: option?.paymentEnabled ? current.transactionReference : '',
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
      source: requiresPayment ? 'website-plan-activation' : 'website-contact-form',
    };
    const whatsappUrl = buildContactWhatsappUrl(payload);

    setStatus({
      type: 'submitting',
      message: requiresPayment ? 'Submitting your payment for review...' : 'Sending your message...',
      whatsappUrl,
    });

    try {
      if (requiresPayment) {
        const [paymentResult, contactResult] = await Promise.allSettled([
          submitPaymentRequest(payload, token),
          submitContactMessage(payload, token),
        ]);

        const paymentSaved = paymentResult.status === 'fulfilled' && paymentResult.value;
        const contactSaved = contactResult.status === 'fulfilled';

        if (!paymentSaved) {
          throw new Error(
            paymentResult.status === 'rejected'
              ? paymentResult.reason?.message || 'Could not submit your payment request.'
              : 'Could not submit your payment request.',
          );
        }

        setStatus({
          type: 'success',
          message: contactSaved
            ? 'Payment request submitted. Admin will review it, then your plan will activate on your dashboard.'
            : 'Payment request submitted. Admin will review it, then your plan will activate on your dashboard.',
          whatsappUrl,
        });
      } else {
        const response = await submitContactMessage(payload, token);
        setStatus({
          type: response?.stored ? 'success' : 'error',
          message: response?.storageStatus || 'Your message was sent.',
          whatsappUrl,
        });
      }

      setForm(createFormFromParams(searchParams, user?.phone || ''));
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Could not submit your request right now.',
        whatsappUrl,
      });
    }
  }

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Contact"
            title={requiresPayment ? 'Plan Activation & Payment Review' : 'Contact & Booking'}
            description="Use your saved account details to send a message or submit a plan payment reference for activation."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <GlassPanel className="rounded-[2.5rem] p-8 shadow-bloom">
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-5xl text-rose-950">{brandDetails.promise}</h2>
              <p className="mt-4 text-base leading-8 text-rose-900/82">
                Your saved account details are ready. Submit your plan payment or share your question here.
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
                  <span className="font-semibold">Selected Plan:</span> {form.selectedPlan}
                </p>
              ) : null}
              {form.planPrice ? (
                <p>
                  <span className="font-semibold">Price / Duration:</span> {form.planPrice}
                </p>
              ) : null}
            </div>

            <div className="rounded-[1.75rem] bg-white/60 px-5 py-5 text-sm leading-7 text-rose-900/82 shadow-glass">
              Payment reference and WhatsApp details are enough here. Admin review happens after you submit.
            </div>

            <Link to="/pricing" className="btn-secondary inline-flex">
              Back to Pricing
            </Link>
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

            {requiresPayment ? (
              <>
                <div>
                  <label htmlFor="paymentMethod" className="mb-2 block text-sm font-semibold text-rose-900">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="transactionReference" className="mb-2 block text-sm font-semibold text-rose-900">
                    Transaction Reference / UTR
                  </label>
                  <input
                    id="transactionReference"
                    name="transactionReference"
                    value={form.transactionReference}
                    onChange={handleChange}
                    required={requiresPayment}
                    placeholder="Enter the payment reference"
                    className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
                  />
                </div>
              </>
            ) : null}

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-rose-900">
                {requiresPayment ? 'Note for admin' : 'Message'}
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required={!requiresPayment}
                placeholder={requiresPayment ? 'Add any extra note for admin review.' : 'Write your message here.'}
                className="w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
              />
            </div>
            <button
              type="submit"
              disabled={status.type === 'submitting'}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.type === 'submitting'
                ? 'Submitting...'
                : requiresPayment
                  ? 'Submit Payment For Review'
                  : 'Send Message'}
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
                    Contact on WhatsApp
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
