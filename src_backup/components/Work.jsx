import React from 'react';
import { work } from '../data';
import { useTheme } from '../ThemeContext';

export default function Work({ onRequestCaseBookClick }) {
  const { active } = useTheme();
  const gold = active.gold;
  const handleRequestClick = (e) => {
    e.preventDefault();
    onRequestCaseBookClick('contact');
  };

  return (
    <section
      id="work"
      data-section="work"
      data-scene="field"
      data-edge-chip="04 · SELECTED WORK"
      className="relative py-20 lg:py-24 border-t border-line overflow-hidden"
    >
      <div className="ribbon" style={{ top: '6%' }} data-parallax="-0.22">
        CASE · STUDIES · CASE · STUDIES · CASE · STUDIES · CASE · STUDIES
      </div>

      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="card p-6 md:p-8 rounded-2xl mb-12 flex items-end justify-between flex-wrap gap-6" data-anim="fade-up">
          <div>
            <div className="eyebrow mb-3" data-anim="fade-up">
              03 — Selected Work
            </div>
            <h2
              className="font-display text-4xl lg:text-6xl leading-[1] tracking-tight max-w-3xl"
              data-split=""
              data-parallax="-0.06"
            >
              Numbers that <span className="italic gold-grad">moved</span> boardrooms.
            </h2>
          </div>
          <a
            href="#contact"
            data-cursor="link"
            className="text-xs text-gold underline-gold pb-1 transition-all duration-300"
            onClick={handleRequestClick}
          >
            Request the full case book →
          </a>
        </div>
        
        <div id="work-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-stagger="up">
          {work.map((w, i) => (
            <article key={w.t} className="card rounded-2xl overflow-hidden lift tilt-card" data-cursor="link">
              <div className="tilt-inner">
                <div className="case-cover aspect-[16/10] relative overflow-hidden reveal-mask">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="none" data-parallax="0.2">
                    <defs>
                      <linearGradient id={`g${i}`} x1="0" y1="0" x2="1" y2="1">
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
                        fill={`url(#g${i})`}
                        opacity={0.6 + k * 0.07}
                      />
                    ))}
                    <path
                      d={`M30 ${260 - i * 20} C 150 ${120 - i * 10}, 300 ${320 - i * 10}, 580 ${140 + i * 10}`}
                      stroke={`url(#g${i})`}
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
                
                <div className="p-6">
                  <h3 className="font-display text-3xl mb-2">{w.t}</h3>
                  <p className="text-mute text-sm max-w-md">{w.d}</p>
                  
                  <div className="grid grid-cols-3 gap-px bg-[var(--line)] mt-6 ring-gold rounded-lg overflow-hidden">
                    {w.m.map(([val, label]) => (
                      <div key={label} className="bg-ink p-4 text-center">
                        <div className="font-display text-2xl text-gold-2">{val}</div>
                        <div className="text-mute text-[11px] uppercase tracking-widest mt-1 font-mono">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
