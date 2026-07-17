import React, { useState, useEffect } from 'react';
import { tickerItems } from '../data';

export default function Hero({ onStartProjectClick, onSeeWorkClick }) {
  const [tickerList, setTickerList] = useState([
    tickerItems[2],
    tickerItems[1],
    tickerItems[0]
  ]);

  useEffect(() => {
    let tIndex = 3;
    const interval = setInterval(() => {
      setTickerList(prev => [
        tickerItems[tIndex % tickerItems.length],
        prev[0],
        prev[1]
      ]);
      tIndex++;
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" data-section="hero" data-scene="globe" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-50" data-parallax="0.15"></div>
      <div className="absolute inset-0 hero-vignette pointer-events-none"></div>


      {/* Decorative floating elements */}
      <div className="deco-line" style={{ top: '18%', left: '0', width: '18%' }} data-parallax="0.35"></div>
      <div className="deco-line" style={{ top: '38%', right: '0', width: '14%' }} data-parallax="0.5"></div>
      <div className="deco-dot" style={{ top: '22%', left: '48%' }} data-parallax="0.7"></div>
      <div className="deco-dot" style={{ top: '72%', left: '8%' }} data-parallax="0.45"></div>

      <div className="relative w-full px-6 lg:px-10 pt-20 lg:pt-24 pb-10 drift-up flex flex-col min-h-[100svh]">
        <div className="rounded-3xl p-0 md:p-2 max-w-3xl relative z-10 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6" data-anim="fade-up">
              <span className="gold-dot eyebrow">Because every click should lead somewhere</span>
            </div>
            <h1
              className="font-display text-[32px] sm:text-[54px] lg:text-[76px] leading-[1.05] tracking-tight"
              data-split=""
              data-parallax="-0.08"
            >
              Crafting <span className="gold-grad italic">outstanding</span><br />
              digital solutions for<br />
              your business, <span className="gold-grad italic">across the globe!</span>
            </h1>
            <p className="mt-6 max-w-xl text-ink/70 text-base" data-anim="fade-up" data-parallax="-0.04">
              Networq is all about taking you to the next level in the market with brilliance and creativity.
            </p>
          </div>
          <div className="mt-8 pb-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4" data-anim="fade-up">
            <button
              onClick={onStartProjectClick}
              data-cursor="link"
              className="btn-gold px-6 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              Let's Get Started <span aria-hidden="true">→</span>
            </button>
            <button
              onClick={onSeeWorkClick}
              data-cursor="link"
              className="btn-ghost px-6 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2"
            >
              See our work
            </button>
          </div>
        </div>

        {/* Live ticker */}
        <div className="absolute right-6 lg:right-10 bottom-12 hidden md:block" data-anim="fade-up" data-parallax="0.18">
          <div className="rounded-xl p-4 w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow">Live · Network</span>
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[var(--gold)] animate-ping opacity-70"></span>
                <span className="relative rounded-full w-2 h-2 bg-[var(--gold)]"></span>
              </span>
            </div>
            <div className="space-y-2 font-mono text-[12px] text-ink/80" id="live-ticker">
              {tickerList.map((item, idx) => (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: item }}
                  className="transition-opacity duration-500 ease-out"
                  style={{ opacity: 1 - idx * 0.25 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
