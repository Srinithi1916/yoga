import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyNotifications, markAllNotificationsRead } from '../lib/notificationApi';

export default function NotificationBell() {
  const { token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadNotifications() {
      if (!isAuthenticated || !token) {
        setNotifications([]);
        return;
      }

      try {
        const unread = await fetchMyNotifications(token, true);
        if (!ignore) {
          setNotifications(unread || []);
        }
      } catch {
        if (!ignore) {
          setNotifications([]);
        }
      }
    }

    loadNotifications();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, token]);

  async function handleMarkAllRead() {
    if (!token || !notifications.length) {
      setIsOpen(false);
      return;
    }

    try {
      await markAllNotificationsRead(token);
      setNotifications([]);
      setIsOpen(false);
    } catch {
      // Keep the bell usable even if the API fails.
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/60 text-rose-900 shadow-glass transition hover:-translate-y-0.5 hover:bg-white/80"
        aria-label="Open notifications"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
          <path d="M12 4a4 4 0 0 0-4 4v1.2c0 .7-.2 1.4-.6 2L6 13.5c-.5.8.1 1.8 1 1.8h10c.9 0 1.5-1 1-1.8l-1.4-2.3c-.4-.6-.6-1.3-.6-2V8a4 4 0 0 0-4-4Z" />
          <path d="M10 18a2 2 0 0 0 4 0" />
        </svg>
        {notifications.length ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.68rem] font-bold text-white">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-[22rem] rounded-[1.75rem] border border-white/60 bg-white/90 p-4 shadow-[0_24px_70px_-30px_rgba(136,19,55,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700/75">Notifications</p>
            <button type="button" onClick={handleMarkAllRead} className="text-xs font-semibold text-rose-700 hover:text-rose-900">
              Mark all read
            </button>
          </div>

          {notifications.length ? (
            <div className="mt-4 space-y-3">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.actionUrl || '/dashboard'}
                  className="block rounded-2xl border border-rose-100 bg-rose-50/75 px-4 py-3 text-sm text-rose-900 transition hover:bg-rose-100/80"
                >
                  <p className="font-semibold">{notification.title}</p>
                  <p className="mt-1 text-xs leading-6 text-rose-900/75">{notification.message}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-rose-50/70 px-4 py-4 text-sm leading-7 text-rose-900/75">
              No unread notifications right now.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
