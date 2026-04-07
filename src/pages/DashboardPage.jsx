import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { buildWhatsappUrl } from '../data/siteData';
import { fetchMyMembership, updateMyMembershipProgress } from '../lib/membershipApi';
import { fetchMyPaymentRequests } from '../lib/paymentApi';
import { getPlanVisual, getServiceTags } from '../lib/planVisuals';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_PROGRESS_TYPES = [
  {
    key: 'sessionCompleted',
    label: 'Sessions',
    targetKey: 'targetSessions',
    completedKey: 'completedSessions',
    activeClass: 'border-rose-500 bg-rose-500 text-white shadow-[0_20px_45px_-25px_rgba(244,63,94,0.75)]',
    idleClass: 'border-rose-200 bg-white/80 text-rose-700 hover:border-rose-300 hover:bg-rose-50',
    disabledClass: 'border-slate-200 bg-slate-100 text-slate-400',
    dotClass: 'bg-rose-500',
  },
  {
    key: 'consultationCompleted',
    label: 'Consultations',
    targetKey: 'targetConsultations',
    completedKey: 'completedConsultations',
    activeClass: 'border-amber-500 bg-amber-500 text-white shadow-[0_20px_45px_-25px_rgba(245,158,11,0.75)]',
    idleClass: 'border-amber-200 bg-white/80 text-amber-700 hover:border-amber-300 hover:bg-amber-50',
    disabledClass: 'border-slate-200 bg-slate-100 text-slate-400',
    dotClass: 'bg-amber-500',
  },
  {
    key: 'dietCheckInCompleted',
    label: 'Diet Check-ins',
    targetKey: 'targetDietCheckIns',
    completedKey: 'completedDietCheckIns',
    activeClass: 'border-emerald-500 bg-emerald-500 text-white shadow-[0_20px_45px_-25px_rgba(16,185,129,0.75)]',
    idleClass: 'border-emerald-200 bg-white/80 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50',
    disabledClass: 'border-slate-200 bg-slate-100 text-slate-400',
    dotClass: 'bg-emerald-500',
  },
  {
    key: 'meditationCompleted',
    label: 'Meditations',
    targetKey: 'targetMeditations',
    completedKey: 'completedMeditations',
    activeClass: 'border-sky-500 bg-sky-500 text-white shadow-[0_20px_45px_-25px_rgba(14,165,233,0.75)]',
    idleClass: 'border-sky-200 bg-white/80 text-sky-700 hover:border-sky-300 hover:bg-sky-50',
    disabledClass: 'border-slate-200 bg-slate-100 text-slate-400',
    dotClass: 'bg-sky-500',
  },
];

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.75rem] border border-white/55 bg-white/60 px-5 py-5 shadow-glass">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600/70">{label}</p>
      <p className="mt-3 text-3xl font-bold text-rose-950">{value}</p>
      {hint ? <p className="mt-2 text-sm leading-6 text-rose-900/74">{hint}</p> : null}
    </div>
  );
}

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

  if (normalized === 'EXPIRING_SOON') {
    return 'Expiring Soon';
  }

  return normalized.replace(/_/g, ' ');
}

function StatusBadge({ status }) {
  const normalized = normalizeStatusValue(status);
  const palette =
    normalized === 'ACTIVE'
      ? 'bg-emerald-100 text-emerald-700'
      : normalized === 'EXPIRING_SOON'
        ? 'bg-amber-100 text-amber-700'
        : normalized === 'PENDING_REVIEW'
          ? 'bg-sky-100 text-sky-700'
          : normalized === 'APPROVED'
            ? 'bg-emerald-100 text-emerald-700'
            : normalized === 'REJECTED'
              ? 'bg-rose-100 text-rose-700'
              : 'bg-rose-100 text-rose-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${palette}`}>
      {formatStatusLabel(normalized)}
    </span>
  );
}

function AdminToolCard({ title, description, to, actionLabel }) {
  return (
    <Link to={to} className="group rounded-[2.25rem] border border-white/55 bg-white/60 p-6 shadow-glass transition duration-300 hover:-translate-y-1 hover:bg-white/75">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-600/70">Admin tool</p>
      <h2 className="mt-3 font-display text-4xl text-rose-950">{title}</h2>
      <p className="mt-3 text-base leading-8 text-rose-900/78">{description}</p>
      <p className="mt-6 text-sm font-semibold text-rose-700 transition group-hover:text-rose-900">{actionLabel}</p>
    </Link>
  );
}

function SummaryFact({ label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/60 bg-white/70 px-4 py-4 shadow-glass">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600/70">{label}</p>
      <p className="mt-2 text-2xl font-bold text-rose-950">{value}</p>
    </div>
  );
}

function ProgressChoiceButton({ type, target, completed, selected, disabled, badgeLabel, onClick }) {
  const classes = disabled
    ? type.disabledClass
    : selected
      ? type.activeClass
      : type.idleClass;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.6rem] border px-4 py-4 text-left transition duration-300 ${classes} ${disabled ? 'cursor-not-allowed' : 'hover:-translate-y-1'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em]">{type.label}</p>
          <p className="mt-2 text-2xl font-bold">{target > 0 ? `${completed}/${target}` : 'Not in plan'}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] ${selected ? 'bg-white/20 text-white' : 'bg-black/5 text-current'}`}>
          {badgeLabel || (disabled ? 'Locked' : selected ? 'Selected' : 'Tap')}
        </span>
      </div>
    </button>
  );
}

function buildDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey || '').split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function formatDateLabel(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isSameDay(left, right) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function buildDailyEntryMap(entries = []) {
  return entries.reduce((accumulator, entry) => {
    accumulator[entry.entryDate] = entry;
    return accumulator;
  }, {});
}

function resolveDefaultSelectedDate(membership) {
  if (!membership?.startAt || !membership?.endAt) {
    return '';
  }

  const startKey = buildDateKey(new Date(membership.startAt));
  const endKey = buildDateKey(new Date(membership.endAt));
  const todayKey = buildDateKey(new Date());

  return todayKey >= startKey && todayKey <= endKey ? todayKey : '';
}

function isDateWithinMembership(dateKey, membership) {
  if (!dateKey || !membership?.startAt || !membership?.endAt) {
    return false;
  }

  const startKey = buildDateKey(new Date(membership.startAt));
  const endKey = buildDateKey(new Date(membership.endAt));
  return dateKey >= startKey && dateKey <= endKey;
}

function buildPlanCalendar(membership, selectedDate, dailyEntryMap) {
  if (!membership?.startAt || !membership?.endAt) {
    return { monthLabel: '', days: [] };
  }

  const today = new Date();
  const todayKey = buildDateKey(today);
  const startDate = parseDateKey(buildDateKey(new Date(membership.startAt)));
  const endDate = parseDateKey(buildDateKey(new Date(membership.endAt)));
  const defaultDateKey = resolveDefaultSelectedDate(membership) || buildDateKey(startDate);
  const focusDate = parseDateKey(selectedDate || defaultDateKey);
  const monthStart = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);
    const dateKey = buildDateKey(current);
    const entry = dailyEntryMap[dateKey];
    const activityTypes = DAY_PROGRESS_TYPES.filter((type) => entry?.[type.key]).map((type) => type.key);
    const isActive = current >= startDate && current <= endDate;
    const isToday = dateKey === todayKey;

    days.push({
      key: `${dateKey}-${index}`,
      dateKey,
      dayNumber: current.getDate(),
      inCurrentMonth: current.getMonth() === monthStart.getMonth(),
      isActive,
      isToday,
      isEditable: isActive && isToday,
      isStart: isSameDay(current, startDate),
      isEnd: isSameDay(current, endDate),
      isSelected: dateKey === selectedDate,
      activityTypes,
    });
  }

  return {
    monthLabel: focusDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
    days,
  };
}

function PlanCalendar({ membership, selectedDate, dailyEntryMap, onSelectDate }) {
  const calendar = useMemo(
    () => buildPlanCalendar(membership, selectedDate, dailyEntryMap),
    [membership, selectedDate, dailyEntryMap],
  );

  if (!membership) {
    return null;
  }

  return (
    <div className="rounded-[2rem] border border-white/55 bg-white/55 p-5 shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600/70">Monthly calendar</p>
          <h3 className="mt-2 font-display text-3xl text-rose-950">{calendar.monthLabel}</h3>
        </div>
        <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-rose-900/78 shadow-glass">
          {membership.daysRemaining} days left
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-1 py-2">{label}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {calendar.days.map((day) => {
          const cellClass = [
            'min-h-[5.25rem] rounded-2xl border px-2 py-2 text-left transition duration-300',
            day.inCurrentMonth ? 'text-rose-950' : 'text-rose-700/35',
            day.isEditable
              ? 'border-white/60 bg-rose-50/82 hover:-translate-y-1 hover:border-rose-200'
              : day.isActive
                ? 'cursor-not-allowed border-white/40 bg-white/45'
                : 'cursor-not-allowed border-white/30 bg-white/35',
            day.isToday ? 'ring-2 ring-emerald-300 ring-offset-2 ring-offset-transparent' : '',
            day.isSelected ? 'border-rose-400 bg-white shadow-[0_18px_40px_-28px_rgba(190,24,93,0.7)]' : '',
          ].join(' ');

          return (
            <button
              key={day.key}
              type="button"
              className={cellClass}
              disabled={!day.isEditable}
              onClick={() => day.isEditable && onSelectDate(day.dateKey)}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-semibold">{day.dayNumber}</span>
                {day.isToday ? <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-emerald-700">Today</span> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {day.activityTypes.map((activityKey) => {
                  const type = DAY_PROGRESS_TYPES.find((item) => item.key === activityKey);
                  return <span key={activityKey} className={`h-2.5 w-2.5 rounded-full ${type?.dotClass || 'bg-rose-300'}`} />;
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-rose-600/72">
                {day.isStart ? <span>Start</span> : null}
                {day.isEnd ? <span>End</span> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [membership, setMembership] = useState(null);
  const [payments, setPayments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [daySelection, setDaySelection] = useState({
    sessionCompleted: false,
    consultationCompleted: false,
    dietCheckInCompleted: false,
    meditationCompleted: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDay, setIsSavingDay] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const isAdmin = user?.role === 'ADMIN';

  async function loadDashboard() {
    setIsLoading(true);
    try {
      if (isAdmin) {
        setMembership(null);
        setPayments([]);
        return;
      }

      const [membershipData, paymentData] = await Promise.all([
        fetchMyMembership(token),
        fetchMyPaymentRequests(token),
      ]);

      setMembership(membershipData || null);
      setPayments(paymentData || []);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not load your dashboard.' });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [token, isAdmin]);

  const latestPayment = payments[0] || null;
  const hasActiveMembership = Boolean(membership && membership.status !== 'EXPIRED' && membership.status !== 'SUPERSEDED');
  const planVisual = getPlanVisual(membership?.planKey);
  const serviceTags = getServiceTags(membership?.features || []);
  const dailyEntryMap = useMemo(() => buildDailyEntryMap(membership?.dailyProgressEntries || []), [membership?.dailyProgressEntries]);
  const todayDateKey = useMemo(() => resolveDefaultSelectedDate(membership), [membership]);
  const currentDayEntry = selectedDate ? dailyEntryMap[selectedDate] : null;
  const whatsappHref = membership
    ? buildWhatsappUrl(`Hi, I need support for my ${membership.planTitle}. Please guide me.`)
    : buildWhatsappUrl('Hi, I want to know more about the plans at Jeevanam 360.');
  const summaryItems = membership
    ? [
      { label: 'Days Left', value: membership.daysRemaining },
      { label: 'Progress', value: `${membership.progressPercent}%` },
      { label: 'Sessions', value: `${membership.completedSessions}/${membership.targetSessions}` },
      {
        label: membership.targetDietCheckIns > 0 ? 'Diet' : membership.targetConsultations > 0 ? 'Consultations' : 'Meditations',
        value: membership.targetDietCheckIns > 0
          ? `${membership.completedDietCheckIns}/${membership.targetDietCheckIns}`
          : membership.targetConsultations > 0
            ? `${membership.completedConsultations}/${membership.targetConsultations}`
            : `${membership.completedMeditations}/${membership.targetMeditations}`,
      },
    ]
    : [];

  useEffect(() => {
    if (!hasActiveMembership) {
      setSelectedDate('');
      return;
    }

    setSelectedDate(todayDateKey);
  }, [hasActiveMembership, todayDateKey]);

  useEffect(() => {
    if (!selectedDate) {
      setDaySelection({
        sessionCompleted: false,
        consultationCompleted: false,
        dietCheckInCompleted: false,
        meditationCompleted: false,
      });
      return;
    }

    const entry = dailyEntryMap[selectedDate];
    setDaySelection({
      sessionCompleted: Boolean(entry?.sessionCompleted),
      consultationCompleted: Boolean(entry?.consultationCompleted),
      dietCheckInCompleted: Boolean(entry?.dietCheckInCompleted),
      meditationCompleted: Boolean(entry?.meditationCompleted),
    });
  }, [selectedDate, dailyEntryMap]);

  async function handleDayUpdate(event) {
    event.preventDefault();
    if (!selectedDate) {
      return;
    }

    setStatus({ type: 'idle', message: '' });
    setIsSavingDay(true);

    try {
      const updated = await updateMyMembershipProgress(
        {
          entryDate: selectedDate,
          sessionCompleted: daySelection.sessionCompleted,
          consultationCompleted: daySelection.consultationCompleted,
          dietCheckInCompleted: daySelection.dietCheckInCompleted,
          meditationCompleted: daySelection.meditationCompleted,
        },
        token,
      );
      setMembership(updated);
      setStatus({ type: 'success', message: `Updated ${formatDateLabel(selectedDate)}.` });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not update the selected date.' });
    } finally {
      setIsSavingDay(false);
    }
  }

  if (isAdmin) {
    return (
      <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
            <SectionHeading
              eyebrow="Admin"
              title={`Welcome back, ${user?.name || 'Admin'}`}
              description="Open the approval page or the book selection page from here."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <AdminToolCard
                title="Approval Page"
                description="Review payment requests, approve plans, and activate member dashboards."
                to="/admin/payments"
                actionLabel="Open approvals"
              />
              <AdminToolCard
                title="Book Selection Page"
                description="Review plan selections and booking requests submitted through the website."
                to="/admin/bookings"
                actionLabel="Open bookings"
              />
            </div>
          </GlassPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Dashboard"
            title={`Welcome back, ${user?.name || 'Member'}`}
            description="Track your plan and payment status in one clean space."
          />

          {hasActiveMembership ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-4">
              <MetricCard label="Plan" value={membership.planTitle} hint={membership.planPrice} />
              <MetricCard label="Status" value={formatStatusLabel(membership.status)} hint={`${membership.daysRemaining} days remaining`} />
              <MetricCard label="Progress" value={`${membership.progressPercent}%`} hint="Based on your saved dates" />
              <MetricCard label="Sessions" value={`${membership.completedSessions}/${membership.targetSessions}`} hint="Completed in calendar" />
            </div>
          ) : null}
        </GlassPanel>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {latestPayment ? (
          <GlassPanel className="rounded-[2rem] p-5 shadow-bloom">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600/70">Latest payment</p>
                <h2 className="mt-2 font-display text-3xl text-rose-950">{latestPayment.selectedPlan}</h2>
                <p className="mt-2 text-sm leading-7 text-rose-900/76">
                  {latestPayment.paymentMethod || 'Manual'}
                  {latestPayment.transactionReference ? ` | Ref: ${latestPayment.transactionReference}` : ''}
                </p>
                {latestPayment.adminNote ? <p className="mt-2 text-sm leading-7 text-rose-900/72">{latestPayment.adminNote}</p> : null}
              </div>
              <StatusBadge status={latestPayment.status} />
            </div>
          </GlassPanel>
        ) : null}

        {isLoading ? (
          <GlassPanel className="rounded-[2.25rem] p-6 shadow-bloom">
            <p className="text-base leading-8 text-rose-900/82">Loading your dashboard...</p>
          </GlassPanel>
        ) : hasActiveMembership ? (
          <div className="grid gap-5 lg:grid-cols-[0.96fr_1.04fr]">
            <GlassPanel className={`rounded-[2.25rem] border ${planVisual.borderClass} bg-gradient-to-br ${planVisual.surfaceClass} p-6 shadow-bloom`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${planVisual.badgeClass}`}>
                    {planVisual.typeLabel}
                  </span>
                  <h2 className="mt-4 font-display text-4xl text-rose-950">{membership.planTitle}</h2>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-rose-700/70">{membership.planPrice}</p>
                </div>
                <StatusBadge status={membership.status} />
              </div>

              <p className="mt-5 text-base leading-8 text-rose-900/80">{membership.planDescription}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <SummaryFact key={item.label} label={item.label} value={item.value} />
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600/70">Included services</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {serviceTags.map((tag) => (
                    <span key={tag.key} className={`rounded-full px-4 py-2 text-sm font-semibold ${tag.className}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary">
                  WhatsApp Support
                </a>
                <Link to="/pricing" className="btn-primary">
                  View Plans
                </Link>
              </div>
            </GlassPanel>

            <GlassPanel className="rounded-[2.25rem] p-6 shadow-bloom">
              <PlanCalendar
                membership={membership}
                selectedDate={selectedDate}
                dailyEntryMap={dailyEntryMap}
                onSelectDate={setSelectedDate}
              />

              <form className="mt-5 space-y-4" onSubmit={handleDayUpdate}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] border border-white/60 bg-white/65 px-4 py-4 shadow-glass">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600/70">Selected date</p>
                    <h3 className="mt-2 font-display text-3xl text-rose-950">{selectedDate ? formatDateLabel(selectedDate) : 'Today is not active yet'}</h3>
                  </div>
                  <p className="text-sm leading-7 text-rose-900/72">Only today's date can be updated. Completed types lock when the plan limit is reached.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {DAY_PROGRESS_TYPES.map((type) => {
                    const target = membership[type.targetKey] || 0;
                    const completed = membership[type.completedKey] || 0;
                    const selected = Boolean(daySelection[type.key]);
                    const savedForCurrentDay = Boolean(currentDayEntry?.[type.key]);
                    const completedOnOtherDays = Math.max(0, completed - (savedForCurrentDay ? 1 : 0));
                    const limitReached = target > 0 && !selected && completedOnOtherDays >= target;
                    const disabled = !selectedDate || selectedDate !== todayDateKey || target <= 0 || limitReached;
                    const badgeLabel = target <= 0 ? 'Locked' : limitReached ? 'Limit Reached' : selected ? 'Selected' : 'Tap';

                    return (
                      <ProgressChoiceButton
                        key={type.key}
                        type={type}
                        target={target}
                        completed={completed}
                        selected={selected}
                        disabled={disabled}
                        badgeLabel={badgeLabel}
                        onClick={() => {
                          if (disabled) {
                            return;
                          }

                          setDaySelection((current) => ({
                            ...current,
                            [type.key]: !current[type.key],
                          }));
                        }}
                      />
                    );
                  })}
                </div>

                <button type="submit" className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70" disabled={!selectedDate || selectedDate !== todayDateKey || isSavingDay}>
                  {isSavingDay ? 'Updating Today...' : 'Update Today'}
                </button>
              </form>
            </GlassPanel>
          </div>
        ) : (
          <GlassPanel className="rounded-[2.25rem] p-8 shadow-bloom">
            <h2 className="font-display text-5xl text-rose-950">No active plan yet</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-rose-900/82">
              Choose a plan, submit your payment, and the dashboard will open after approval.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-secondary">
                WhatsApp Communication
              </a>
              <Link to="/pricing" className="btn-primary">
                View Plans
              </Link>
            </div>
          </GlassPanel>
        )}

        {status.type !== 'idle' ? (
          <GlassPanel className="rounded-[2rem] px-5 py-4 shadow-bloom">
            <p className={status.type === 'error' ? 'text-rose-900' : 'text-emerald-900'}>{status.message}</p>
          </GlassPanel>
        ) : null}
      </div>
    </div>
  );
}

