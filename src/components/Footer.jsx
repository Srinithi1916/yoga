import { Link } from 'react-router-dom';
import { contactDetails, navigationLinks, socialLinks } from '../data/siteData';
import { BlossomSpray, LotusBloom } from './Decorations';
import { BrandMark } from './Illustrations';

export default function Footer() {
  return (
    <footer className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="glass-card relative overflow-hidden rounded-[2rem] px-6 py-8 shadow-bloom sm:px-8">
          <BlossomSpray className="absolute -left-2 bottom-0 h-28 w-28 opacity-80" tone="rose" />
          <BlossomSpray className="absolute right-0 top-2 h-28 w-28 opacity-75" tone="lavender" />
          <BlossomSpray className="absolute right-16 bottom-0 hidden h-24 w-24 opacity-80 md:block" tone="peach" />
          <LotusBloom className="absolute bottom-0 right-20 hidden h-20 w-32 opacity-60 md:block" />
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.9fr_1fr_auto] lg:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-rose-900">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-glass">
                  <BrandMark className="h-10 w-10" />
                </span>
                <div>
                  <p className="font-display text-[2.1rem] leading-none">Jeevanam 360</p>
                  <p className="text-sm font-semibold text-rose-900/70">{contactDetails.tagline}</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-7 text-rose-900/75">
                Personalized yoga, nutrition guidance, progress tracking, and supportive care for men and women building a better routine.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose-700/70">
                Quick Links
              </p>
              <div className="flex flex-wrap gap-2">
                {navigationLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="pill-chip">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm text-rose-900/80">
              <p>
                <span className="font-semibold">Email:</span> {contactDetails.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {contactDetails.phone}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.map((item) =>
                  item.external ? (
                    <a key={item.label} href={item.href} className="pill-chip" target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} to={item.href} className="pill-chip">
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/contact" className="btn-secondary whitespace-nowrap justify-center">
                Start Free Trial
              </Link>
              <a
                href={contactDetails.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary whitespace-nowrap justify-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
