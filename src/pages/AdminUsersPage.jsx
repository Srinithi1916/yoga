import { useEffect, useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { fetchAdminUsers } from '../lib/adminUserApi';

function formatStatusLabel(status) {
  const normalized = (status || '').trim().toUpperCase();
  if (!normalized) {
    return 'No status';
  }
  if (normalized === 'PENDING_REVIEW') {
    return 'Pending';
  }
  if (normalized === 'EXPIRING_SOON') {
    return 'Expiring Soon';
  }
  return normalized.replace(/_/g, ' ');
}

function formatDate(value) {
  if (!value) {
    return 'Earlier';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatusChip({ label, tone = 'rose' }) {
  const palette = tone === 'emerald'
    ? 'bg-emerald-100 text-emerald-700'
    : tone === 'sky'
      ? 'bg-sky-100 text-sky-700'
      : 'bg-rose-100 text-rose-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${palette}`}>
      {label}
    </span>
  );
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const data = await fetchAdminUsers(token);
        if (!ignore) {
          setUsers(data || []);
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load users.' });
        }
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, [token]);

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Admin"
            title="Users"
            description="All registered users with current plan and latest payment status."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-4">
        {users.map((user) => (
          <GlassPanel key={user.id} className="rounded-[2.25rem] p-5 shadow-bloom">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-3xl text-rose-950 sm:text-4xl">{user.name}</h2>
                  <StatusChip label={user.role} tone={user.role === 'ADMIN' ? 'sky' : 'rose'} />
                  <StatusChip label={user.active ? 'Active' : 'Inactive'} tone={user.active ? 'emerald' : 'rose'} />
                </div>
                <p className="mt-3 text-sm leading-7 text-rose-900/78">
                  {user.email} | {user.phone || 'No phone'}
                </p>
                <p className="mt-2 text-sm leading-7 text-rose-900/78">
                  Joined: {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="grid min-w-[260px] gap-3">
                <div className="rounded-2xl bg-white/60 px-4 py-4 text-sm leading-7 text-rose-900/78 shadow-glass">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">Current Plan</p>
                  <p className="mt-2 font-semibold">{user.currentPlanTitle || 'No active plan'}</p>
                  {user.currentPlanStatus ? <p className="mt-1">{formatStatusLabel(user.currentPlanStatus)}</p> : null}
                </div>
                <div className="rounded-2xl bg-white/60 px-4 py-4 text-sm leading-7 text-rose-900/78 shadow-glass">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">Latest Payment</p>
                  <p className="mt-2 font-semibold">{user.latestPaymentPlan || 'No payment yet'}</p>
                  {user.latestPaymentPrice ? <p className="mt-1">{user.latestPaymentPrice}</p> : null}
                  {user.latestPaymentStatus ? <p className="mt-1">{formatStatusLabel(user.latestPaymentStatus)}</p> : null}
                </div>
              </div>
            </div>
          </GlassPanel>
        ))}

        {!users.length ? (
          <GlassPanel className="rounded-[2rem] p-6 shadow-bloom">
            <p className="text-base leading-8 text-rose-900/78">No users found.</p>
          </GlassPanel>
        ) : null}

        {status.type === 'error' ? (
          <GlassPanel className="rounded-[2rem] px-5 py-4 shadow-bloom">
            <p className="text-rose-900">{status.message}</p>
          </GlassPanel>
        ) : null}
      </div>
    </div>
  );
}
