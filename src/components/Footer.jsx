import React from 'react';
import { useTheme } from '../ThemeContext';

export default function Footer({ onLinkClick, onPageChange, isSubpage = false }) {
  const { active } = useTheme();

  const logoSrc = active.id === 'reversed-ocean-blue' ? '/logo-full.svg' : '/logo-full-inverted.svg';

  const handleNavClick = (e, id) => {
    e.preventDefault();
    onLinkClick?.(id);
  };

  return (
    <footer
      id="footer"
      className="relative border-t border-line"
      style={{
        /* Solid background so WebGL canvas doesn't bleed through on subpages */
        background: isSubpage ? 'var(--bg)' : 'transparent',
        /* On home page we add extra bottom padding for the canvas 3D effect */
        paddingBottom: isSubpage ? '3rem' : '18rem',
        paddingTop: '5rem',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Subtle top gold glow line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.4 }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="mb-5 flex items-center">
              <img src={logoSrc} alt="Networq Global Logo" className="h-9 w-auto" />
            </div>
            <p className="text-mute text-sm leading-relaxed max-w-xs">
              A full-spectrum digital marketing agency built to take your business to the next level — with brilliance, creativity, and purpose at every step.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-5 mt-6">
              {['LinkedIn', 'Instagram', 'Twitter'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-mute text-xs font-mono uppercase tracking-widest hover:text-gold transition-colors duration-300"
                >
                  {s.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {/* Studio */}
            <div>
              <div className="eyebrow mb-5">Studio</div>
              <ul className="space-y-3 text-mute">
                {[
                  { label: 'About', action: (e) => { e.preventDefault(); onPageChange?.('about'); } },
                  { label: 'Work',  action: (e) => { e.preventDefault(); onPageChange?.('work'); } },
                  { label: 'Careers', action: (e) => { e.preventDefault(); onPageChange?.('careers'); } },
                  { label: 'Contact', action: (e) => { e.preventDefault(); onPageChange?.('contact'); } },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href="#"
                      className="hover:text-gold transition-colors duration-300"
                      onClick={item.action}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <div className="eyebrow mb-5">Services</div>
              <ul className="space-y-3 text-mute">
                {[
                  { label: 'Brand & Creative', id: 'brand-creative' },
                  { label: 'Social Media',      id: 'social-media' },
                  { label: 'Performance Mktg',  id: 'performance-marketing' },
                  { label: 'SEO Services',      id: 'seo-services' },
                  { label: 'Website Services',  id: 'website-services' },
                  { label: 'Email & Automation',id: 'email-automation' },
                ].map((s) => (
                  <li key={s.id}>
                    <a
                      href="#"
                      className="hover:text-gold transition-colors duration-300"
                      onClick={(e) => { e.preventDefault(); onPageChange?.(`service-${s.id}`); }}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <div className="eyebrow mb-5">Connect</div>
              <ul className="space-y-3 text-mute">
                <li>
                  <a href="mailto:hello@networq.global" className="hover:text-gold transition-colors duration-300">
                    hello@networq.global
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">LinkedIn</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">Instagram</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">Newsletter</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="hairline mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-mute font-mono pb-2">
          <div>© {new Date().getFullYear()} Networq Global Ltd. · All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-gold transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">Terms of Service</a>
            <span
              className="hidden sm:inline"
              style={{ color: 'var(--gold)', opacity: 0.6 }}
            >
              ●
            </span>
            <span>Worldwide · Digital · First</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
