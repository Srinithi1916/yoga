import { useEffect, useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { fetchAdminPaymentRequests, updatePaymentRequestStatus } from '../lib/paymentApi';

const STATUS_OPTIONS = ['PENDING_REVIEW', 'APPROVED', 'REJECTED'];

function normalizeStatusValue(status) {
  const normalized = (status || '').trim().toUpperCase();
  if (normalized === 'PENDING') {
    return 'PENDING_REVIEW';
  }

  return normalized || status;
}

function formatStatusLabel(status) {
  const normalized = normalizeStatusValue(status);

  if (normalized === 'PENDING_REVIEW') {
    return 'Pending';
  }

  if (normalized === 'APPROVED') {
    return 'Approved';
  }

  if (normalized === 'REJECTED') {
    return 'Rejected';
  }

  return normalized.replace(/_/g, ' ');
}

function PaymentStatusChip({ status }) {
  const normalized = normalizeStatusValue(status);
  const palette =
    normalized === 'PENDING_REVIEW'
      ? 'bg-sky-100 text-sky-700'
      : normalized === 'APPROVED'
        ? 'bg-emerald-100 text-emerald-700'
        : normalized === 'REJECTED'
          ? 'bg-rose-100 text-rose-700'
          : 'bg-white/70 text-rose-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${palette}`}>
      {formatStatusLabel(normalized)}
    </span>
  );
}

function getSelectableStatuses(currentStatus) {
  const normalized = normalizeStatusValue(currentStatus);
  if (normalized === 'APPROVED') {
    return ['APPROVED'];
  }

  return STATUS_OPTIONS;
}

export default function AdminPaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [decisionNotes, setDecisionNotes] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [workingId, setWorkingId] = useState('');

  async function loadPayments() {
    try {
      const data = await fetchAdminPaymentRequests(token);
      const allPayments = data || [];
      setPayments(allPayments);
      setSelectedStatuses(
        Object.fromEntries(allPayments.map((payment) => [payment.id, normalizeStatusValue(payment.status)])),
      );
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not load payment requests.' });
    }
  }

  useEffect(() => {
    loadPayments();
  }, [token]);

  async function handleStatusUpdate(payment, nextStatus) {
    const previousStatus = selectedStatuses[payment.id] || normalizeStatusValue(payment.status);
    const note = (decisionNotes[payment.id] || '').trim();
    const normalizedNextStatus = normalizeStatusValue(nextStatus);

    setSelectedStatuses((current) => ({ ...current, [payment.id]: normalizedNextStatus }));
    setWorkingId(payment.id);
    setStatus({ type: 'idle', message: '' });

    try {
      await updatePaymentRequestStatus(
        payment.id,
        {
          status: normalizedNextStatus,
          note,
        },
        token,
      );
      setStatus({ type: 'success', message: `${payment.selectedPlan} updated to ${formatStatusLabel(normalizedNextStatus)}.` });
      await loadPayments();
    } catch (error) {
      setSelectedStatuses((current) => ({ ...current, [payment.id]: previousStatus }));
      setStatus({ type: 'error', message: error.message || 'Could not update the payment status.' });
    } finally {
      setWorkingId('');
    }
  }

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Admin"
            title="Payment Approval Panel"
            description="Change the dropdown beside each request. Membership approvals activate the user dashboard automatically."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-4">
        {payments.map((payment) => {
          const selectedStatus = selectedStatuses[payment.id] || normalizeStatusValue(payment.status);
          const statusOptions = getSelectableStatuses(payment.status);
          const isWorking = workingId === payment.id;

          return (
            <GlassPanel key={payment.id} className="rounded-[2.25rem] p-5 shadow-bloom">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <PaymentStatusChip status={payment.status} />
                    <h2 className="font-display text-3xl text-rose-950 sm:text-4xl">{payment.selectedPlan}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-rose-900/78">
                    {payment.name} | {payment.email} | {payment.whatsapp}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-rose-900/78">
                    Method: {payment.paymentMethod || 'Not provided'} | Ref: {payment.transactionReference || 'Not provided'}
                  </p>
                  {payment.note ? <p className="mt-2 text-sm leading-7 text-rose-900/78">{payment.note}</p> : null}
                </div>

                <div className="grid min-w-[220px] gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(event) => handleStatusUpdate(payment, event.target.value)}
                    disabled={isWorking || statusOptions.length === 1}
                    className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm font-semibold text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white"
                  >
                    {statusOptions.map((statusValue) => (
                      <option key={statusValue} value={statusValue}>
                        {formatStatusLabel(statusValue)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs font-medium text-rose-700/72">
                    {isWorking ? 'Saving status...' : 'Status changes save automatically.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                <label className="block text-sm font-semibold text-rose-900">
                  Admin note (optional)
                  <textarea
                    rows="2"
                    value={decisionNotes[payment.id] || ''}
                    onChange={(event) => setDecisionNotes((current) => ({ ...current, [payment.id]: event.target.value }))}
                    placeholder="Type the note before changing the status."
                    className="mt-2 w-full rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white/80"
                  />
                </label>

                {payment.reviewedBy ? (
                  <div className="rounded-2xl bg-white/60 px-4 py-3 text-sm leading-7 text-rose-900/78 shadow-glass">
                    <span className="font-semibold">Reviewed by:</span> {payment.reviewedBy}
                  </div>
                ) : null}
              </div>
            </GlassPanel>
          );
        })}

        {!payments.length ? (
          <GlassPanel className="rounded-[2rem] p-6 shadow-bloom">
            <p className="text-base leading-8 text-rose-900/78">No payment requests found.</p>
          </GlassPanel>
        ) : null}

        {status.type !== 'idle' ? (
          <GlassPanel className="rounded-[2rem] px-5 py-4 shadow-bloom">
            <p className={status.type === 'error' ? 'text-rose-900' : 'text-emerald-900'}>{status.message}</p>
          </GlassPanel>
        ) : null}
      </div>
    </div>
  );
}
