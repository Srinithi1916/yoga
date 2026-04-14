import { useEffect, useMemo, useState } from 'react';
import GlassPanel from '../components/GlassPanel';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminMembershipDetail,
  fetchAdminMemberships,
  updateAdminMembershipProgress,
} from '../lib/adminMembershipApi';

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

  const todayKey = buildDateKey(new Date());
  const startKey = buildDateKey(new Date(membership.startAt));
  const endKey = buildDateKey(new Date(membership.endAt));

  if (todayKey >= startKey && todayKey <= endKey) {
    return todayKey;
  }

  return startKey;
}

function formatStatusLabel(status) {
  const normalized = (status || '').trim().toUpperCase();
  if (!normalized) {
    return 'Unknown';
  }
  if (normalized === 'EXPIRING_SOON') {
    return 'Expiring Soon';
  }
  return normalized.replace(/_/g, ' ');
}

function StatusChip({ status }) {
  const normalized = (status || '').trim().toUpperCase();
  const palette = normalized === 'ACTIVE'
    ? 'bg-emerald-100 text-emerald-700'
    : normalized === 'EXPIRING_SOON'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${palette}`}>
      {formatStatusLabel(status)}
    </span>
  );
}

function MembershipPickerCard({ membership, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-[1.8rem] border p-4 text-left transition duration-300 ${selected ? 'border-rose-300 bg-rose-50 shadow-glass' : 'border-white/55 bg-white/68 hover:border-rose-200 hover:bg-white/82'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-3xl text-rose-950">{membership.userName}</h3>
          <p className="mt-1 text-sm font-medium text-rose-900/74">{membership.userEmail}</p>
        </div>
        <StatusChip status={membership.status} />
      </div>
      <p className="mt-3 text-sm font-semibold text-rose-900">{membership.planTitle}</p>
      <p className="mt-1 text-sm text-rose-900/72">{membership.planPrice}</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-rose-600/72">
        {membership.daysRemaining} days left • {membership.progressPercent}% progress
      </p>
    </button>
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
          {badgeLabel}
        </span>
      </div>
    </button>
  );
}

function buildPlanCalendar(membership, selectedDate, dailyEntryMap) {
  if (!membership?.startAt || !membership?.endAt) {
    return { monthLabel: '', days: [] };
  }

  const startDate = parseDateKey(buildDateKey(new Date(membership.startAt)));
  const endDate = parseDateKey(buildDateKey(new Date(membership.endAt)));
  const defaultDateKey = resolveDefaultSelectedDate(membership);
  const focusDate = parseDateKey(selectedDate || defaultDateKey);
  const monthStart = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const todayKey = buildDateKey(new Date());

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);
    const dateKey = buildDateKey(current);
    const entry = dailyEntryMap[dateKey];
    const activityTypes = DAY_PROGRESS_TYPES.filter((type) => entry?.[type.key]).map((type) => type.key);
    const isActive = current >= startDate && current <= endDate;

    days.push({
      key: `${dateKey}-${index}`,
      dateKey,
      dayNumber: current.getDate(),
      inCurrentMonth: current.getMonth() === monthStart.getMonth(),
      isActive,
      isToday: dateKey === todayKey,
      isSelected: dateKey === selectedDate,
      isStart: isSameDay(current, startDate),
      isEnd: isSameDay(current, endDate),
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
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600/70">Member calendar</p>
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
            day.isActive
              ? 'border-white/60 bg-rose-50/82 hover:-translate-y-1 hover:border-rose-200'
              : 'cursor-not-allowed border-white/30 bg-white/35',
            day.isToday ? 'ring-2 ring-emerald-300 ring-offset-2 ring-offset-transparent' : '',
            day.isSelected ? 'border-rose-400 bg-white shadow-[0_18px_40px_-28px_rgba(190,24,93,0.7)]' : '',
          ].join(' ');

          return (
            <button
              key={day.key}
              type="button"
              className={cellClass}
              disabled={!day.isActive}
              onClick={() => day.isActive && onSelectDate(day.dateKey)}
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

export default function AdminMemberTrackingPage() {
  const { token } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [membershipDetail, setMembershipDetail] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [daySelection, setDaySelection] = useState({
    sessionCompleted: false,
    consultationCompleted: false,
    dietCheckInCompleted: false,
    meditationCompleted: false,
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMemberships() {
      try {
        const data = await fetchAdminMemberships(token);
        if (!ignore) {
          const list = data || [];
          setMemberships(list);
          setSelectedMembershipId((current) => current || list[0]?.id || '');
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load member tracking.' });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMemberships();
    return () => {
      ignore = true;
    };
  }, [token]);

  useEffect(() => {
    let ignore = false;

    async function loadDetail() {
      if (!selectedMembershipId) {
        setMembershipDetail(null);
        return;
      }

      try {
        const detail = await fetchAdminMembershipDetail(selectedMembershipId, token);
        if (!ignore) {
          setMembershipDetail(detail);
          setSelectedDate(resolveDefaultSelectedDate(detail));
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load the membership detail.' });
        }
      }
    }

    loadDetail();
    return () => {
      ignore = true;
    };
  }, [selectedMembershipId, token]);

  const dailyEntryMap = useMemo(
    () => buildDailyEntryMap(membershipDetail?.dailyProgressEntries || []),
    [membershipDetail?.dailyProgressEntries],
  );
  const currentDayEntry = selectedDate ? dailyEntryMap[selectedDate] : null;

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

    setDaySelection({
      sessionCompleted: Boolean(currentDayEntry?.sessionCompleted),
      consultationCompleted: Boolean(currentDayEntry?.consultationCompleted),
      dietCheckInCompleted: Boolean(currentDayEntry?.dietCheckInCompleted),
      meditationCompleted: Boolean(currentDayEntry?.meditationCompleted),
    });
  }, [selectedDate, currentDayEntry]);

  async function handleUpdate(event) {
    event.preventDefault();
    if (!membershipDetail || !selectedDate) {
      return;
    }

    setIsSaving(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const updated = await updateAdminMembershipProgress(
        membershipDetail.id,
        {
          entryDate: selectedDate,
          sessionCompleted: daySelection.sessionCompleted,
          consultationCompleted: daySelection.consultationCompleted,
          dietCheckInCompleted: daySelection.dietCheckInCompleted,
          meditationCompleted: daySelection.meditationCompleted,
        },
        token,
      );

      setMembershipDetail(updated);
      setMemberships((current) => current.map((membership) => (
        membership.id === updated.id
          ? {
              ...membership,
              status: updated.status,
              daysRemaining: updated.daysRemaining,
              progressPercent: updated.progressPercent,
              updatedAt: updated.updatedAt,
            }
          : membership
      )));
      setStatus({ type: 'success', message: `${updated.userName} updated for ${formatDateLabel(selectedDate)}.` });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not update member progress.' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <GlassPanel className="rounded-[2.75rem] px-6 py-10 shadow-bloom sm:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Admin"
            title="Member Tracking"
            description="Pick a member, choose any plan date, and update the shared progress tracker."
          />
        </GlassPanel>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <GlassPanel className="rounded-[2.25rem] p-5 shadow-bloom">
          <h2 className="font-display text-4xl text-rose-950">Active Members</h2>
          <div className="mt-5 space-y-3">
            {memberships.map((membership) => (
              <MembershipPickerCard
                key={membership.id}
                membership={membership}
                selected={membership.id === selectedMembershipId}
                onSelect={() => setSelectedMembershipId(membership.id)}
              />
            ))}

            {!memberships.length && !isLoading ? (
              <div className="rounded-2xl bg-white/60 px-4 py-4 text-sm leading-7 text-rose-900/78 shadow-glass">
                No active memberships found.
              </div>
            ) : null}
          </div>
        </GlassPanel>

        <GlassPanel className="rounded-[2.25rem] p-6 shadow-bloom">
          {membershipDetail ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-4xl text-rose-950">{membershipDetail.userName}</h2>
                  <p className="mt-2 text-sm leading-7 text-rose-900/78">{membershipDetail.userEmail}</p>
                  <p className="mt-2 text-sm font-semibold text-rose-900">{membershipDetail.planTitle}</p>
                  <p className="mt-1 text-sm text-rose-900/72">{membershipDetail.planPrice}</p>
                </div>
                <StatusChip status={membershipDetail.status} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-white/60 px-4 py-4 shadow-glass">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">Days Left</p>
                  <p className="mt-2 text-2xl font-bold text-rose-950">{membershipDetail.daysRemaining}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/60 px-4 py-4 shadow-glass">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">Progress</p>
                  <p className="mt-2 text-2xl font-bold text-rose-950">{membershipDetail.progressPercent}%</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/60 px-4 py-4 shadow-glass">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600/70">Selected Date</p>
                  <p className="mt-2 text-2xl font-bold text-rose-950">{selectedDate ? formatDateLabel(selectedDate) : 'Choose a date'}</p>
                </div>
              </div>

              <div className="mt-6">
                <PlanCalendar
                  membership={membershipDetail}
                  selectedDate={selectedDate}
                  dailyEntryMap={dailyEntryMap}
                  onSelectDate={setSelectedDate}
                />
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleUpdate}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DAY_PROGRESS_TYPES.map((type) => {
                    const target = membershipDetail[type.targetKey] || 0;
                    const completed = membershipDetail[type.completedKey] || 0;
                    const selected = Boolean(daySelection[type.key]);
                    const savedForCurrentDay = Boolean(currentDayEntry?.[type.key]);
                    const completedOnOtherDays = Math.max(0, completed - (savedForCurrentDay ? 1 : 0));
                    const limitReached = target > 0 && !selected && completedOnOtherDays >= target;
                    const disabled = !selectedDate || target <= 0 || limitReached;
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

                <button
                  type="submit"
                  disabled={!selectedDate || isSaving}
                  className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? 'Updating...' : 'Update Member Progress'}
                </button>
              </form>
            </>
          ) : (
            <div className="rounded-2xl bg-white/60 px-4 py-4 text-sm leading-7 text-rose-900/78 shadow-glass">
              {isLoading ? 'Loading members...' : 'Select a member to manage the plan tracker.'}
            </div>
          )}
        </GlassPanel>
      </div>

      {status.type !== 'idle' ? (
        <div className="mx-auto max-w-7xl">
          <GlassPanel className="rounded-[2rem] px-5 py-4 shadow-bloom">
            <p className={status.type === 'error' ? 'text-rose-900' : 'text-emerald-900'}>{status.message}</p>
          </GlassPanel>
        </div>
      ) : null}
    </div>
  );
}
