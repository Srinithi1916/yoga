import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigationLinks } from '../data/siteData';
import { BrandMark } from './Illustrations';

function navLinkClass(isActive) {
  return [
    'relative px-3 py-2 text-sm font-bold transition duration-300 md:text-[0.95rem]',
    isActive ? 'text-rose-800' : 'text-rose-900/80 hover:text-rose-900',
  ].join(' ');
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card rounded-full px-4 py-3 shadow-bloom">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 text-rose-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-glass">
                <BrandMark className="h-10 w-10" />
              </span>
              <div>
                <p className="font-display text-[2rem] font-semibold leading-none tracking-wide">
                  Jeevanam 360
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-rose-700/70">
                  Yoga . Diet . Care
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-3 md:flex">
              {navigationLinks.map((link) => (
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

            <div className="flex items-center gap-3">
              <Link to="/contact" className="btn-primary hidden sm:inline-flex">
                Start Free Trial
              </Link>
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
          </div>

          {isOpen ? (
            <div className="mt-4 rounded-[2rem] border border-white/50 bg-white/50 p-4 backdrop-blur-lg md:hidden">
              <div className="flex flex-col gap-2">
                {navigationLinks.map((link) => (
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
                <Link to="/contact" className="btn-primary mt-2 w-full">
                  Start Free Trial
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}