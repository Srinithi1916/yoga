import { useEffect, useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { fetchAdminContactMessages } from '../lib/adminContactApi';

function formatSourceLabel(source) {
  const normalized = (source || '').trim();
  if (!normalized) {
    return 'Website request';
  }

  return normalized.replace(/-/g, ' ');
}

function formatDate(value) {
  if (!value) {
    return 'Recently';
  }

  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminBookingsPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      try {
        const data = await fetchAdminContactMessages(token);
        if (!ignore) {
          setMessages(data || []);
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load booking requests.' });
        }
      }
    }

    loadMessages();
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
            title="Book Selection Page"
            description="Review plan selections and website booking requests in one place."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-4">
        {messages.map((message) => (
          <GlassPanel key={message.id} className="rounded-[2.25rem] p-5 shadow-bloom">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-rose-700">
                    {formatSourceLabel(message.source)}
                  </span>
                  <h2 className="font-display text-3xl text-rose-950 sm:text-4xl">
                    {message.selectedPlan || 'General enquiry'}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-rose-900/78">
                  {message.name} | {message.email} | {message.whatsapp}
                </p>
                {message.planPrice || message.amount ? (
                  <p className="mt-2 text-sm leading-7 text-rose-900/78">
                    {message.planPrice || ''}
                    {message.amount ? ` ${message.planPrice ? '| ' : ''}Rs. ${message.amount}` : ''}
                  </p>
                ) : null}
                {message.message ? <p className="mt-2 text-sm leading-7 text-rose-900/78">{message.message}</p> : null}
              </div>

              <div className="rounded-2xl bg-white/60 px-4 py-3 text-sm leading-7 text-rose-900/78 shadow-glass">
                {formatDate(message.createdAt)}
              </div>
            </div>
          </GlassPanel>
        ))}

        {!messages.length ? (
          <GlassPanel className="rounded-[2rem] p-6 shadow-bloom">
            <p className="text-base leading-8 text-rose-900/78">No booking requests found.</p>
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
