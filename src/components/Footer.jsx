import { Link, useLocation } from 'react-router-dom';
import { contactDetails, navigationLinks } from '../data/siteData';
import { BlossomSpray, LotusBloom } from './Decorations';

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card relative overflow-hidden rounded-[2rem] px-6 py-7 shadow-bloom sm:px-8">
          <BlossomSpray className="absolute -left-2 bottom-0 h-28 w-28 opacity-75" tone="rose" />
          <BlossomSpray className="absolute right-0 top-2 h-28 w-28 opacity-70" tone="lavender" />
          <LotusBloom className="absolute bottom-0 right-16 hidden h-20 w-32 opacity-50 md:block" />

          {isHomePage ? (
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-rose-900/82">
                  <p>
                    <span className="font-semibold">Email:</span> {contactDetails.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {contactDetails.phone}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose-700/70">
                  Quick Links
                </p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {navigationLinks.map((link) => (
                    <Link key={link.href} to={link.href} className="pill-chip">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col gap-2 text-sm text-rose-900/82 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="font-semibold">Email:</span> {contactDetails.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {contactDetails.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}