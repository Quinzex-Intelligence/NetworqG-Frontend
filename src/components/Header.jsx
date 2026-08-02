import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

const SERVICE_NAV = [
  { id: 'brand-creative',        label: 'Brand & Creative',       icon: '✦', desc: 'Identity, logo & brand strategy' },
  { id: 'social-media',          label: 'Social Media Marketing', icon: '◈', desc: 'Content, management & ads' },
  { id: 'performance-marketing', label: 'Performance Marketing',  icon: '◎', desc: 'Google, Meta & LinkedIn ads' },
  { id: 'seo-services',          label: 'SEO Services',           icon: '◇', desc: 'Rank higher, grow organically' },
  { id: 'website-services',      label: 'Website Services',       icon: '▣', desc: 'Design, dev & optimization' },
  { id: 'content-marketing',     label: 'Content Marketing',      icon: '◉', desc: 'Blogs, copy & content strategy' },
  { id: 'video-multimedia',      label: 'Video & Multimedia',     icon: '▶', desc: 'Production, reels & motion' },
  { id: 'email-automation',      label: 'Email & Automation',     icon: '⊡', desc: 'Nurture flows & campaigns' },
  { id: 'business-growth',       label: 'Business Growth',        icon: '◬', desc: 'Strategy, funnels & consulting' },
  { id: 'local-business',        label: 'Local Business',         icon: '◯', desc: 'Google profile & local ads' },
  { id: 'emerging-services',     label: 'Emerging & AI',          icon: '⬡', desc: 'AI tools & automation' },
];

export default function Header({ onPageChange, onLinkClick, currentPage, isAuthenticated }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { active } = useTheme();
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setServicesOpen(false);
    onPageChange('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (serviceId) => {
    setServicesOpen(false);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    onPageChange(`service-${serviceId}`);
  };

  const handleServicesMouseEnter = () => {
    clearTimeout(timerRef.current);
    setServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    timerRef.current = setTimeout(() => setServicesOpen(false), 150);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logoSrc = active.id === 'reversed-ocean-blue' ? '/logo-full.svg' : '/logo-full-inverted.svg';

  return (
    <>
      <header id="nav" className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center group" data-cursor="link" onClick={handleLogoClick}>
            <img src={logoSrc} alt="Networq Global Logo" className="h-8 md:h-9 w-auto" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-[14px] font-medium">
            {/* About */}
            <a
              href="#"
              data-cursor="link"
              className="nav-link px-3 py-2 rounded-lg hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); onLinkClick?.('about'); onPageChange('about'); }}
            >
              About
            </a>

            {/* Work */}
            <a
              href="#"
              data-cursor="link"
              className="nav-link px-3 py-2 rounded-lg hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); onPageChange('work'); }}
            >
              Work
            </a>

            {/* Services — mega dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                data-cursor="link"
                className={`nav-link px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors duration-300 ${servicesOpen ? 'text-gold' : ''}`}
                style={{ color: servicesOpen ? 'var(--gold)' : 'var(--ink)' }}
                onClick={() => setServicesOpen((v) => !v)}
              >
                Services
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M1.5 3.5L5 7L8.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Mega Dropdown Panel */}
              <div
                className={`services-mega-dropdown absolute top-full left-1/2 -translate-x-1/2 mt-3 transition-all duration-300 ${
                  servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                {/* Arrow tip */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
                  <div className="w-3 h-3 bg-[var(--bg-2)] border-l border-t border-[var(--line)] rotate-45 translate-y-1 mx-auto" />
                </div>

                <div className="services-mega-inner p-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between px-3 pb-3 mb-3 border-b border-[var(--line)]">
                    <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-widest">All Services</span>
                    <button
                      onClick={() => { setServicesOpen(false); onPageChange('services'); }}
                      className="font-mono text-[10px] text-[var(--gold)] hover:text-[var(--gold-2)] uppercase tracking-widest transition-colors"
                      data-cursor="link"
                    >
                      View All →
                    </button>
                  </div>

                  {/* Services grid */}
                  <div className="grid grid-cols-2 gap-1 w-[520px]">
                    {SERVICE_NAV.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => handleServiceClick(s.id)}
                        data-cursor="link"
                        className="service-nav-item group flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 hover:bg-[var(--gold)]/8 border border-transparent hover:border-[var(--line)]"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <span className="text-[var(--gold)] text-lg leading-none mt-0.5 transition-transform duration-200 group-hover:scale-125 shrink-0">
                          {s.icon}
                        </span>
                        <div>
                          <div className="text-[var(--ink)] text-[13px] font-medium leading-tight group-hover:text-[var(--gold)] transition-colors duration-200">
                            {s.label}
                          </div>
                          <div className="text-[var(--mute)] text-[11px] mt-0.5 leading-tight">
                            {s.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Bottom CTA strip */}
                  <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--mute)]">Not sure which service? We'll figure it out together.</span>
                    <button
                      onClick={() => { setServicesOpen(false); onPageChange('contact'); }}
                      className="btn-gold px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ml-4"
                      data-cursor="link"
                    >
                      Talk to Us
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Careers */}
            <a
              href="#"
              data-cursor="link"
              className="nav-link px-3 py-2 rounded-lg hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); onPageChange('careers'); }}
            >
              Careers
            </a>

            {/* Contact */}
            <a
              href="#"
              data-cursor="link"
              className="nav-link px-3 py-2 rounded-lg hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); onPageChange('contact'); }}
            >
              Contact
            </a>

            {/* Admin/Sign-in */}
            <a
              href="#"
              data-cursor="link"
              className="nav-link px-3 py-2 rounded-lg hover:text-gold transition-colors duration-300 font-mono text-[13px] uppercase tracking-wider"
              style={{ color: 'var(--gold-2)' }}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(isAuthenticated ? 'admin' : 'login');
              }}
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </a>
          </nav>

          {/* Right-side controls */}
          <div className="flex items-center gap-3">

            {/* Hamburger */}
            <button
              className={`burger-btn md:hidden lg:hidden ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
            >
              <div className="burger-inner">
                <span className="burger-line"></span>
                <span className="burger-line"></span>
                <span className="burger-line"></span>
              </div>
            </button>

            {/* CTA */}
            <a
              href="#"
              data-cursor="link"
              className="btn-gold px-4 py-2 rounded-full text-sm font-medium hidden sm:inline-flex items-center gap-2"
              style={{ background: 'var(--gold)', color: '#1a1407' }}
              onClick={(e) => { e.preventDefault(); onPageChange('contact'); }}
            >
              Start a project <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`mobile-menu-drawer md:hidden${mobileMenuOpen ? ' open' : ''}`} data-lenis-prevent>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-nav">
            {/* About */}
            <a
              href="#"
              className="mobile-menu-link hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onPageChange('about'); }}
            >
              About
            </a>

            {/* Work */}
            <a
              href="#"
              className="mobile-menu-link hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onPageChange('work'); }}
            >
              Work
            </a>

            {/* Services accordion */}
            <div>
              <button
                className="mobile-menu-link hover:text-gold transition-colors duration-300 w-full text-left flex items-center justify-between"
                style={{ color: 'var(--ink)' }}
                onClick={() => setMobileServicesOpen((v) => !v)}
              >
                <span>Services</span>
                <span className={`text-gold font-mono transition-transform duration-300 ${mobileServicesOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {mobileServicesOpen && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-[var(--gold)]/30 pl-4">
                  {SERVICE_NAV.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleServiceClick(s.id)}
                      className="block w-full text-left py-2 text-sm text-[var(--mute)] hover:text-[var(--gold)] transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="text-[var(--gold)] text-xs">{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Careers */}
            <a
              href="#"
              className="mobile-menu-link hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onPageChange('careers'); }}
            >
              Careers
            </a>

            {/* Contact */}
            <a
              href="#"
              className="mobile-menu-link hover:text-gold transition-colors duration-300"
              style={{ color: 'var(--ink)' }}
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onPageChange('contact'); }}
            >
              Contact
            </a>

            {/* Admin/Sign-in Mobile */}
            <a
              href="#"
              className="mobile-menu-link hover:text-gold transition-colors duration-300 font-mono text-[13px] uppercase tracking-wider"
              style={{ color: 'var(--gold-2)' }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onPageChange(isAuthenticated ? 'admin' : 'login');
              }}
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </a>


            {/* Mobile CTA */}
            <a
              href="#"
              className="btn-gold px-5 py-2 rounded-full text-xs tracking-wider uppercase font-semibold inline-flex items-center gap-2 mt-4 mobile-menu-link"
              style={{ background: 'var(--gold)', color: '#1a1407' }}
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onPageChange('contact'); }}
            >
              Start a project <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="mobile-menu-footer mt-8 pt-5 border-t border-line w-full max-w-[280px] text-center flex flex-col gap-2.5">
            <span className="text-[10px] font-mono text-mute uppercase tracking-widest">Connect With Us</span>
            <a href="mailto:hello@networq.global" className="text-xs text-ink/80 hover:text-gold transition-colors duration-200">hello@networq.global</a>
            <div className="flex justify-center gap-4 text-[11px] font-mono text-mute mt-0.5">
              <a href="#" className="hover:text-gold transition-colors duration-200">LN</a>
              <span className="opacity-20">/</span>
              <a href="#" className="hover:text-gold transition-colors duration-200">IG</a>
              <span className="opacity-20">/</span>
              <a href="#" className="hover:text-gold transition-colors duration-200">TW</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
