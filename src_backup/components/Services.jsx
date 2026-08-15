import React from 'react';
import { services } from '../data';

export default function Services({ onEngageClick, onServiceClick }) {
  const handleEngage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEngageClick('contact');
  };

  const serviceIdMap = {
    "01": "brand-creative",
    "02": "social-media",
    "03": "performance-marketing",
    "04": "seo-services",
    "05": "website-services",
    "06": "content-marketing",
    "07": "video-multimedia",
    "08": "email-automation",
    "09": "business-growth",
    "10": "local-business",
    "11": "emerging-services"
  };

  return (
    <section
      id="services"
      data-section="services"
      data-scene="orbit"
      data-edge-chip="01 · OUR SERVICES"
      className="relative py-20 lg:py-24 border-t border-line overflow-hidden"
    >
      {/* <div className="ribbon" style={{ top: '8%' }} data-parallax="0.25">
        SERVICES · SERVICES · SERVICES · SERVICES · SERVICES · SERVICES · SERVICES
      </div> */}

      <div className="deco-dot" style={{ top: '14%', right: '8%' }} data-parallax="0.5"></div>
      <div className="deco-line" style={{ top: '50%', left: '0', width: '14%' }} data-parallax="0.4"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="card p-6 md:p-8 rounded-2xl mb-10 flex items-end justify-between flex-wrap gap-6" data-anim="fade-up">
          <div className="max-w-3xl">
            <div className="eyebrow mb-3" data-anim="fade-up">
              If it matters to your business, it matters to us.
            </div>
            <h2
              className="font-display text-4xl lg:text-6xl leading-[1] tracking-tight"
              data-split=""
              data-parallax="-0.06"
            >
              Everything that has something to do with your business, brand or you, <span className="italic gold-grad">matters</span>.
            </h2>
          </div>
          <p className="text-mute max-w-md text-sm lg:mb-2" data-anim="fade-up">
            Blending advanced technology and never-ending creativity, we aim to build all things that will make your brand, the talk of the town (or the world!)
          </p>
        </div>
        <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[4px]" data-stagger="3d">
          {services.map((s) => (
            <div
              key={s.n}
              className="bg-ink p-6 lg:p-8 svc-tile cursor-pointer border border-[#D4AF37] hover:border-[#F0C040] group relative"
              data-cursor="link"
              onClick={() => onServiceClick?.(serviceIdMap[s.n])}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-gold transition-colors duration-300 group-hover:text-white font-semibold">{s.n}</span>
              </div>
              <h3 className="font-display text-xl lg:text-2xl mb-2 text-white transition-colors duration-300 group-hover:text-gold">{s.t}</h3>
              <p className="text-mute text-xs transition-colors duration-300 group-hover:text-neutral-300 leading-relaxed">{s.d}</p>
              <div className="mt-6 hairline"></div>
              <div className="flex items-center mt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[10px] text-gold-2 font-mono uppercase tracking-widest hover:text-gold transition-all duration-300 group-hover:translate-x-1"
                  onClick={handleEngage}
                >
                  Engage <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
