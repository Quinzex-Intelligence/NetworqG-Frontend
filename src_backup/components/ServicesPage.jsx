import React, { useState, useEffect } from 'react';
import { services as staticServices } from '../data';

export default function ServicesPage({ onBackClick, onServiceClick, onContactClick }) {
  const [animate, setAnimate] = useState(false);
  const [dynamicServices, setDynamicServices] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 600);
    fetchActiveServices();
    return () => clearTimeout(timer);
  }, []);

  const fetchActiveServices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/services/active`);
      if (res.ok) {
        const data = await res.json();
        setDynamicServices(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch active services:', err);
    }
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

  // Combine static and dynamic services
  const combinedServices = [
    ...staticServices.map(s => ({
      n: s.n,
      t: s.t,
      d: s.d,
      id: serviceIdMap[s.n],
      isStatic: true
    })),
    ...dynamicServices.map((s, index) => ({
      n: String(staticServices.length + 1 + index).padStart(2, '0'),
      t: s.title,
      d: s.shortDescription,
      id: s.id,
      isStatic: false
    }))
  ];

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
            <div className="eyebrow mb-4">Our Services</div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
              Capabilities built for <span className="italic gold-grad">reach</span> and impact.
            </h1>
            <p className="text-ink/80 text-lg md:text-xl leading-relaxed max-w-3xl">
              Blending advanced technology and never-ending creativity, we build digital solutions that make your brand stand out, grow, and lead in global markets.
            </p>
          </div>
        </header>

        {/* Services Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {combinedServices.map((s, i) => (
            <div
              key={s.n}
              className="glow-card p-6 lg:p-8 rounded-2xl border border-line flex flex-col justify-between cursor-pointer"
              style={{ transitionDelay: `${i * 40}ms` }}
              data-cursor="link"
              onClick={() => onServiceClick?.(s.id)}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-gold">{s.n}</span>
                </div>
                <h3 className="font-display text-xl lg:text-2xl mb-2 text-gold-2">{s.t}</h3>
                <p className="text-mute text-xs leading-relaxed">{s.d}</p>
              </div>
              <div>
                <div className="mt-6 hairline"></div>
                <div className="flex items-center mt-4 text-[10px] font-mono uppercase tracking-widest">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onContactClick?.('contact');
                    }}
                    className="text-gold-2 hover:text-gold transition-colors duration-300"
                  >
                    Engage →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
