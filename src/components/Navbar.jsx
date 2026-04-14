import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navigationLinks } from '../data/siteData';
import { BrandLogo } from './BrandLogo';
import NotificationBell from './NotificationBell';

function navLinkClass(isActive) {
  return [
    'relative px-3 py-2 text-sm font-bold transition duration-300 md:text-[0.95rem]',
    isActive ? 'text-rose-800' : 'text-rose-900/80 hover:text-rose-900',
  ].join(' ');
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = useMemo(() => {
    if (user?.role === 'ADMIN') {
      return [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Approvals', href: '/admin/payments' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Tracking', href: '/admin/member-tracking' },
      ];
    }

    if (!isAuthenticated) {
      return navigationLinks;
    }

    const dashboardLink = { label: 'Dashboard', href: '/dashboard' };
    const [homeLink, ...restLinks] = navigationLinks;

    if (!homeLink) {
      return [dashboardLink];
    }

    return [homeLink, dashboardLink, ...restLinks];
  }, [isAuthenticated, user]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card rounded-[2rem] px-4 py-3 shadow-bloom md:rounded-full">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="min-w-0 text-rose-900">
              <BrandLogo className="min-w-0" markClassName="h-14 w-14 sm:h-16 sm:w-16" />
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((link) => (
                <NavLink key={link.href} to={link.href} className={({ isActive }) => navLinkClass(isActive)}>
                  {({ isActive }) => (
                    <span className="relative inline-block">
                      {link.label}
                      {isActive ? (
                        <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-rose-400" />
                      ) : null}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <div className="rounded-full border border-white/55 bg-white/60 px-4 py-2 text-sm font-semibold text-rose-900 shadow-glass">
                    {user?.name}
                  </div>
                  <button type="button" onClick={logout} className="btn-secondary">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth?mode=login" className="btn-secondary">
                    Log In
                  </Link>
                  <Link to="/auth?mode=signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/60 text-rose-900 shadow-glass md:hidden"
              onClick={() => setIsOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>

          {isOpen ? (
            <div className="mt-4 rounded-[2rem] border border-white/50 bg-white/50 p-4 backdrop-blur-lg md:hidden">
              <div className="flex flex-col gap-2">
                {navItems.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-sm font-semibold ${
                        isActive ? 'bg-white/75 text-rose-900' : 'text-rose-900/80'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {isAuthenticated ? (
                  <>
                    <div className="rounded-2xl bg-white/60 px-4 py-3 text-sm font-semibold text-rose-900 shadow-glass">
                      Signed in as {user?.name}
                    </div>
                    {user?.role === 'ADMIN' ? (
                      <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">Admin tools are available from Home, Dashboard, Approvals, Users, and Tracking. Bookings stay inside the admin dashboard.</p>
                    ) : null}
                    <button type="button" onClick={logout} className="btn-secondary mt-2 w-full justify-center">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth?mode=login" className="btn-secondary mt-2 w-full justify-center">
                      Log In
                    </Link>
                    <Link to="/auth?mode=signup" className="btn-primary w-full justify-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
