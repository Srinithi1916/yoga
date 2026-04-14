import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import {
  buildWhatsappUrl,
  brandDetails,
  contactSelectionOptions,
  getContactSelectionOption,
  paymentDetails,
} from '../data/siteData';
import { useAuth } from '../context/AuthContext';
import {
  buildContactWhatsappUrl,
  submitContactMessage,
  submitPaymentRequest,
} from '../lib/contactWorkflow';

const paymentMethodOptions = [
  {
    value: 'UPI Transfer',
    label: 'UPI / GPay',
    hint: 'UPI ID + Google Pay',
    activeClass: 'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-[0_18px_40px_-28px_rgba(16,185,129,0.75)]',
    idleClass: 'border-white/55 bg-white/72 text-rose-900 hover:border-emerald-200 hover:bg-emerald-50/70',
  },
  {
    value: 'Bank Transfer',
    label: 'Bank',
    hint: 'Account + IFSC',
    activeClass: 'border-sky-300 bg-sky-50 text-sky-900 shadow-[0_18px_40px_-28px_rgba(14,165,233,0.7)]',
    idleClass: 'border-white/55 bg-white/72 text-rose-900 hover:border-sky-200 hover:bg-sky-50/70',
  },
  {
    value: 'WhatsApp Confirmation',
    label: 'WhatsApp',
    hint: 'Chat and confirm',
    activeClass: 'border-amber-300 bg-amber-50 text-amber-900 shadow-[0_18px_40px_-28px_rgba(245,158,11,0.7)]',
    idleClass: 'border-white/55 bg-white/72 text-rose-900 hover:border-amber-200 hover:bg-amber-50/70',
  },
];

const emptyForm = {
  whatsapp: '',
  selectedPlan: '',
  planPrice: '',
  amount: '',
  paymentMethod: 'UPI Transfer',
  transactionReference: '',
  message: '',
};

function PaymentInfoRow({ label, value, onCopy }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-[1.4rem] border border-white/60 bg-white/78 px-4 py-3 shadow-glass">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-rose-600/72">{label}</p>
          <p className="mt-2 break-all text-sm font-semibold text-rose-950">{value}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(value)}
          className="rounded-full border border-white/65 bg-white/85 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-rose-700 transition hover:bg-rose-50"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

function PaymentMethodButton({ option, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`rounded-[1.5rem] border px-4 py-4 text-left transition duration-300 ${active ? option.activeClass : option.idleClass}`}
    >
      <p className="text-sm font-bold uppercase tracking-[0.18em]">{option.label}</p>
      <p className="mt-2 text-xs font-medium opacity-80">{option.hint}</p>
    </button>
  );
}

function formatAmount(amount) {
  if (!amount) {
    return '';
  }

  return `Rs. ${amount}`;
}

function formatPhoneDisplay(number) {
  if (!number) {
    return '';
  }

  return number.startsWith('+') ? number : `+91 ${number}`;
}

function buildUpiIntent({ upiId, name, amount, note }) {
  if (!upiId) {
    return '';
  }

  const params = new URLSearchParams({
    pa: upiId,
    pn: name || '',
    tn: note || 'Jeevanam 360',
  });

  if (amount) {
    params.set('am', String(amount));
  }

  return `upi://pay?${params.toString()}`;
}

function buildGooglePayIntent({ upiId, name, amount, note }) {
  const upiIntent = buildUpiIntent({ upiId, name, amount, note });
  if (!upiIntent) {
    return '';
  }

  return upiIntent.replace('upi://pay?', 'tez://upi/pay?');
}

function buildQrCodeUrl(data) {
  if (!data) {
    return '';
  }

  return `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(data)}`;
}

function PaymentQrCard({ amount, selectedPlan }) {
  const upiIntentUrl = buildUpiIntent({
    upiId: paymentDetails.upiId,
    name: paymentDetails.accountHolderName || paymentDetails.bankTransfer?.accountName,
    amount,
    note: selectedPlan,
  });
  const gpayIntentUrl = buildGooglePayIntent({
    upiId: paymentDetails.upiId,
    name: paymentDetails.accountHolderName || paymentDetails.bankTransfer?.accountName,
    amount,
    note: selectedPlan,
  });
  const qrCodeUrl = buildQrCodeUrl(upiIntentUrl);

  if (!upiIntentUrl || !gpayIntentUrl || !qrCodeUrl) {
    return null;
  }

  return (
    <a
      href={gpayIntentUrl}
      className="group block rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,rgba(246,250,255,0.96),rgba(255,255,255,0.92))] p-5 shadow-bloom transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-34px_rgba(15,23,42,0.32)]"
      aria-label="Open Google Pay"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-sky-700/72">Scan or Tap</p>
          <h3 className="mt-2 font-display text-3xl text-slate-900">
            {paymentDetails.accountHolderName}
          </h3>
        </div>
        <span className="rounded-full bg-sky-600 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white transition group-hover:bg-sky-700">
          GPay
        </span>
      </div>

      <div className="mt-5 rounded-[1.8rem] bg-white p-4 shadow-glass">
        <img
          src={qrCodeUrl}
          alt="Google Pay QR code"
          loading="lazy"
          decoding="async"
          className="mx-auto aspect-square w-full max-w-[19rem] rounded-[1.3rem] object-contain"
        />
        <p className="mt-4 text-center text-sm font-semibold text-slate-800">
          {paymentDetails.upiId}
        </p>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-slate-700/82">
        Tap the QR to open Google Pay
      </p>
    </a>
  );
}

function PaymentDetailsCard({ method, amount, selectedPlan }) {
  const [copiedLabel, setCopiedLabel] = useState('');
  const bank = paymentDetails.bankTransfer || {};
  const isUpi = method === 'UPI Transfer';
  const isBank = method === 'Bank Transfer';
  const isWhatsapp = method === 'WhatsApp Confirmation';
  const displayAmount = formatAmount(amount);
  const upiIntentUrl = buildUpiIntent({
    upiId: paymentDetails.upiId,
    name: paymentDetails.accountHolderName || bank.accountName,
    amount,
    note: selectedPlan,
  });

  const hasUpiInfo = Boolean(paymentDetails.upiId || paymentDetails.googlePayNumber);
  const hasBankInfo = Boolean(bank.accountName || bank.bankName || bank.accountNumber || bank.ifsc);
  const hasWhatsappInfo = Boolean(paymentDetails.googlePayNumber);

  if ((isUpi && !hasUpiInfo) || (isBank && !hasBankInfo) || (isWhatsapp && !hasWhatsappInfo)) {
    return null;
  }

  async function handleCopy(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(''), 1800);
    } catch (error) {
      setCopiedLabel('');
    }
  }

  return (
    <div className="space-y-4 rounded-[1.9rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,247,250,0.72))] p-5 shadow-bloom">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-600/72">Payment Details</p>
          <h3 className="mt-2 font-display text-3xl text-rose-950">
            {isUpi ? 'UPI / Google Pay' : isBank ? 'Bank Transfer' : 'WhatsApp Confirmation'}
          </h3>
        </div>
        {displayAmount ? (
          <div className="rounded-[1.3rem] bg-rose-950 px-4 py-3 text-white shadow-glass">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/70">Amount</p>
            <p className="mt-1 text-2xl font-bold">{displayAmount}</p>
          </div>
        ) : null}
      </div>

      {copiedLabel ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {copiedLabel} copied
        </div>
      ) : null}

      {isUpi ? (
        <>
          <div className="rounded-[1.7rem] border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(240,253,247,0.96),rgba(255,255,255,0.95))] p-5 shadow-glass">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-emerald-700/72">Pay To</p>
                <h4 className="mt-2 font-display text-3xl text-emerald-950">
                  {paymentDetails.accountHolderName || bank.accountName}
                </h4>
                {selectedPlan ? <p className="mt-2 text-sm font-medium text-emerald-900/78">{selectedPlan}</p> : null}
              </div>
              {upiIntentUrl ? (
                <a
                  href={upiIntentUrl}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-emerald-700"
                >
                  Open UPI App
                </a>
              ) : null}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentInfoRow label="UPI ID" value={paymentDetails.upiId} onCopy={(value) => handleCopy(value, 'UPI ID')} />
            <PaymentInfoRow label="Google Pay" value={paymentDetails.googlePayNumber} onCopy={(value) => handleCopy(value, 'Google Pay number')} />
          </div>
        </>
      ) : null}

      {isBank ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <PaymentInfoRow label="Account Name" value={bank.accountName} onCopy={(value) => handleCopy(value, 'Account name')} />
          <PaymentInfoRow label="Bank" value={bank.bankName} onCopy={(value) => handleCopy(value, 'Bank name')} />
          <PaymentInfoRow label="Account Number" value={bank.accountNumber} onCopy={(value) => handleCopy(value, 'Account number')} />
          <PaymentInfoRow label="IFSC" value={bank.ifsc} onCopy={(value) => handleCopy(value, 'IFSC')} />
          <PaymentInfoRow label="Mobile Number" value={formatPhoneDisplay(paymentDetails.googlePayNumber)} onCopy={(value) => handleCopy(value, 'Mobile number')} />
        </div>
      ) : null}

      {isWhatsapp ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <PaymentInfoRow label="WhatsApp / GPay" value={paymentDetails.googlePayNumber} onCopy={(value) => handleCopy(value, 'WhatsApp / GPay number')} />
          <a
            href={buildWhatsappUrl(`Hi, I need payment help for ${selectedPlan || 'my service'}.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-amber-600"
          >
            Open WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}

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
      message: requiresPayment ? 'Submitting...' : 'Sending...',
      whatsappUrl,
    });

    try {
      if (requiresPayment) {
        const paymentResult = await submitPaymentRequest(payload, token);

        if (!paymentResult) {
          throw new Error(
            'Could not submit your payment request.',
          );
        }

        setStatus({
          type: 'success',
          message: 'Submitted for review.',
          whatsappUrl,
        });
      } else {
        const response = await submitContactMessage(payload, token);
        setStatus({
          type: response?.stored ? 'success' : 'error',
          message: response?.stored ? 'Message sent.' : response?.storageStatus || 'Could not send your message.',
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
            title={requiresPayment ? 'Payment' : 'Contact'}
            description={requiresPayment ? 'Share your payment reference for review.' : 'Send a quick message here.'}
          />
        </GlassPanel>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <GlassPanel className="rounded-[2.5rem] p-8 shadow-bloom">
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-5xl text-rose-950">
                {requiresPayment ? 'Payment Summary' : brandDetails.promise}
              </h2>
              <p className="mt-4 text-base leading-8 text-rose-900/82">
                {requiresPayment
                  ? 'Choose the method, pay, and submit the reference.'
                  : 'Your saved account details are ready.'}
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
                  <span className="font-semibold">Selected Service:</span> {form.selectedPlan}
                </p>
              ) : null}
              {form.planPrice ? (
                <p>
                  <span className="font-semibold">Price:</span> {form.planPrice}
                </p>
              ) : null}
            </div>

            {requiresPayment ? (
              <>
                <div className="rounded-[1.75rem] bg-white/60 px-5 py-5 text-sm leading-7 text-rose-900/82 shadow-glass">
                  Submit the method and reference. Admin will review it.
                </div>
                <PaymentQrCard amount={form.amount} selectedPlan={form.selectedPlan} />
              </>
            ) : null}

            <Link to="/pricing" className="btn-secondary inline-flex">
              Back to Pricing
            </Link>
          </div>
        </GlassPanel>

        <GlassPanel className="rounded-[2.5rem] p-8 shadow-bloom">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="whatsapp" className="mb-2 block text-sm font-semibold text-rose-900">
                WhatsApp
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
                Service
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
                  <label className="mb-2 block text-sm font-semibold text-rose-900">
                    Method
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {paymentMethodOptions.map((option) => (
                      <PaymentMethodButton
                        key={option.value}
                        option={option}
                        active={form.paymentMethod === option.value}
                        onSelect={(value) => setForm((current) => ({ ...current, paymentMethod: value }))}
                      />
                    ))}
                  </div>
                </div>
                <PaymentDetailsCard
                  method={form.paymentMethod}
                  amount={form.amount}
                  selectedPlan={form.selectedPlan}
                />
                <div>
                  <label htmlFor="transactionReference" className="mb-2 block text-sm font-semibold text-rose-900">
                    UTR / Reference
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
                {requiresPayment ? 'Note (Optional)' : 'Message'}
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required={!requiresPayment}
                placeholder={requiresPayment ? 'Add a short note if needed.' : 'Write your message here.'}
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
                  ? 'Submit'
                  : 'Send'}
            </button>
            {status.type !== 'idle' && status.type !== 'submitting' ? (
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
