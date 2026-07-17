import React, { useState, useEffect } from 'react';
import { work } from '../data';
import { useTheme } from '../ThemeContext';

export default function WorkPage({ onBackClick, onRequestCaseBookClick }) {
  const { active } = useTheme();
  const gold = active.gold;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="subpage-container relative overflow-hidden pt-24 pb-32">
      {/* Background Cinematic Glows */}
      <div className="glow-blob glow-blob--1" />
      <div className="glow-blob glow-blob--2" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        {/* Back button */}
        <button
          onClick={onBackClick}
          className={`mb-8 inline-flex items-center gap-2 text-xs font-mono text-gold-2 uppercase tracking-widest hover:text-gold transition-all duration-700 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          data-cursor="link"
        >
          ← Back to Home
        </button>

        {/* Widescreen Hero Header */}
        <header
          className={`cinematic-header p-8 md:p-12 rounded-3xl mb-16 relative overflow-hidden transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-98'
          }`}
        >
          <div className="laser-line" />
          <div className="max-w-4xl relative z-10">
            <div className="eyebrow mb-4">Case Studies</div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
              Numbers that <span className="italic gold-grad">moved</span> boardrooms.
            </h1>
            <p className="text-ink/80 text-lg md:text-xl leading-relaxed max-w-3xl">
              We design and execute result-oriented digital marketing strategies that scale businesses, drive conversions, and validate market leadership.
            </p>
          </div>
        </header>

        {/* Work Grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {work.map((w, i) => (
            <article
              key={w.t}
              className="glow-card rounded-3xl overflow-hidden border border-line flex flex-col justify-between"
              style={{ transitionDelay: `${i * 100}ms` }}
              data-cursor="link"
            >
              <div>
                <div className="case-cover aspect-[16/10] relative overflow-hidden reveal-mask">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`work-g${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={gold} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={gold} stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    {Array.from({ length: 6 }).map((_, k) => (
                      <circle
                        key={k}
                        cx={80 + k * 90}
                        cy={190 + Math.sin(k + i) * 60}
                        r={6 + k * 1.5}
                        fill={`url(#work-g${i})`}
                        opacity={0.6 + k * 0.07}
                      />
                    ))}
                    <path
                      d={`M30 ${260 - i * 20} C 150 ${120 - i * 10}, 300 ${320 - i * 10}, 580 ${140 + i * 10}`}
                      stroke={`url(#work-g${i})`}
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d={`M30 ${300 - i * 10} C 200 ${200 - i * 10}, 360 ${260 - i * 10}, 580 ${200 + i * 10}`}
                      stroke={gold}
                      strokeWidth="0.8"
                      strokeOpacity="0.45"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute top-4 left-4 chip rounded-full px-3 py-1 text-[11px] font-mono">
                    {w.tag}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-display text-3xl mb-3 text-gold-2">{w.t}</h3>
                  <p className="text-mute text-sm leading-relaxed">{w.d}</p>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-px bg-[var(--line)] ring-gold rounded-lg overflow-hidden mt-2">
                  {w.m.map(([val, label]) => (
                    <div key={label} className="bg-ink/90 p-4 text-center">
                      <div className="font-display text-2xl text-gold">{val}</div>
                      <div className="text-mute text-[10px] uppercase tracking-widest mt-1 font-mono">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Request Case Book CTA */}
        <section
          className={`mt-20 glow-card p-8 md:p-12 rounded-3xl border border-line text-center transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '350ms' }}
        >
          <h2 className="font-display text-3xl md:text-5xl mb-6 text-gold-2">
            Looking for More Outcomes?
          </h2>
          <p className="text-mute max-w-2xl mx-auto text-base leading-relaxed mb-8">
            We operate under strict NDA with several of our fortune-100 clients. Contact us to request our offline catalog of enterprise case books.
          </p>
          <button
            onClick={() => onRequestCaseBookClick('contact')}
            className="btn-gold px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            data-cursor="link"
          >
            Request Full Case Book
          </button>
        </section>
      </div>
    </div>
  );
}
