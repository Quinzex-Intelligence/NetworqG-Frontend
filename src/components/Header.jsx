import React, { useState } from 'react';
import PalettePicker from './PalettePicker';
import { useTheme } from '../ThemeContext';

// Header component – responsive navigation adhering to brand guidelines
export default function Header({ onPageChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { active } = useTheme();

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onPageChange('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'services', label: 'Services' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
  ];

  const logoSrc = active.id === 'reversed-ocean-blue' ? '/logo-full.svg' : '/logo-full-inverted.svg';

  return (
    <>
      <header id="nav" className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center group" data-cursor="link" onClick={handleLogoClick}>
            <img src={logoSrc} alt="Networq Global Logo" className="h-8 md:h-9 w-auto" />
          </a>

          {/* Desktop / Tablet navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] text-ink/80 font-medium">
            {navItems.map((item) => (
              <a
                key={item.id}
                href="#"
                data-cursor="link"
                className="hover:text-gold transition-colors duration-300 py-2"
                style={{ color: 'var(--ink)' }}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right-side controls */}
          <div className="flex items-center gap-3">
            {/* Palette Picker — desktop */}
            <div className="hidden md:flex">
              <PalettePicker />
            </div>

            {/* Hamburger button */}
            <button
              className={`burger-btn md:hidden lg:hidden ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              <div className="burger-inner">
                <span className="burger-line"></span>
                <span className="burger-line"></span>
                <span className="burger-line"></span>
              </div>
            </button>

            {/* CTA button */}
            <a
              href="#"
              data-cursor="link"
              className="btn-gold px-4 py-2 rounded-full text-sm font-medium hidden sm:inline-flex items-center gap-2"
              style={{ background: 'var(--gold)', color: '#1a1407' }}
              onClick={(e) => {
                e.preventDefault();
                onPageChange('contact');
              }}
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
            {navItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className="mobile-menu-link hover:text-gold transition-colors duration-300"
                style={{ color: 'var(--ink)' }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onPageChange(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
            {/* Mobile Palette Picker */}
            <div className="mt-2 flex justify-center">
              <PalettePicker />
            </div>
            {/* Mobile CTA */}
            <a
              href="#"
              className="btn-gold px-5 py-2 rounded-full text-xs tracking-wider uppercase font-semibold inline-flex items-center gap-2 mt-4 mobile-menu-link"
              style={{ background: 'var(--gold)', color: '#1a1407' }}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                onPageChange('contact');
              }}
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
