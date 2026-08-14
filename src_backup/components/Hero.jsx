import React from 'react';

export default function Hero({ onStartProjectClick, onSeeWorkClick }) {
  return (
    <section id="top" data-section="hero" data-scene="globe" className="relative min-h-[100svh] overflow-hidden flex flex-col">
      {/* Background Lighting & Grid Atmosphere */}
      <div className="hero-aurora"></div>
      <div className="hero-aurora-secondary"></div>
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" data-parallax="0.15"></div>
      <div className="absolute inset-0 hero-vignette pointer-events-none"></div>

      {/* Hero Content Wrapper - Spreads across full 100svh height */}
      <div className="relative w-full px-6 sm:px-10 lg:px-16 pt-24 lg:pt-28 pb-8 sm:pb-16 drift-up flex flex-col min-h-[100svh] justify-between z-10 flex-1">
        
        {/* Top Eyebrow Tag */}
        <div className="flex items-center gap-3 pt-2 sm:pt-4" data-anim="fade-up">
          <span className="gold-dot eyebrow text-[11px] sm:text-xs tracking-[0.22em] text-[var(--gold)] font-semibold leading-snug">
            BECAUSE EVERY CLICK <br />
            SHOULD LEAD SOMEWHERE
          </span>
        </div>

        {/* Middle Main Copy Section */}
        <div className="max-w-3xl relative z-10 mt-auto sm:my-auto pt-6 pb-2 sm:py-10">
          <h1
            className="font-display text-[34px] min-[390px]:text-[40px] sm:text-[62px] lg:text-[80px] leading-[1.08] sm:leading-[1.05] tracking-tight font-extrabold text-[var(--ink)] mb-4 sm:mb-8"
            data-split=""
            data-parallax="-0.08"
          >
            Crafting <br />
            <span className="gold-grad italic font-serif font-normal">outstanding</span> <br />
            digital solutions <br />
            <span className="gold-grad italic font-serif font-normal">across the globe!</span>
          </h1>

          <p 
            className="max-w-xl text-ink/80 text-sm sm:text-lg font-normal leading-relaxed"
            data-anim="fade-up"
            data-parallax="-0.04"
          >
            Networq is all about taking you to the next level in the market with brilliance and creativity.
          </p>
        </div>

        {/* Bottom CTA Action Buttons */}
        <div className="mt-4 sm:mt-auto pt-2 sm:pt-6" data-anim="fade-up">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 max-w-sm sm:max-w-none">
            <button
              onClick={onStartProjectClick}
              data-cursor="link"
              className="btn-gold px-8 py-4 rounded-full text-sm sm:text-base font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              Let's Get Started <span aria-hidden="true">→</span>
            </button>

            
          </div>
        </div>

      </div>
    </section>
  );
}
