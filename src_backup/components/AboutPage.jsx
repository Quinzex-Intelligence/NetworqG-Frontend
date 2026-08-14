import React, { useState, useEffect } from 'react';

const whyPoints = [
  { n: "01", t: "Tailored to You", d: "No business or brand will have the same plan of action. Every strategy is built from scratch based on your sector, goals and vision." },
  { n: "02", t: "Research-Driven", d: "We begin every engagement with deep research — analysing your competition, your market, and the opportunities competitors miss." },
  { n: "03", t: "Vision-First", d: "Your vision stays alive throughout the process. We build alongside you, not just for you." },
  { n: "04", t: "Daily Monitoring", d: "We monitor campaigns every day, optimising every lead generated to maintain consistency and continuously improve results." },
  { n: "05", t: "Global Reach", d: "We are open to working with all business sectors globally — no market is too big or too niche." },
];

const stats = [
  { v: "11+", l: "Service Capabilities" },
  { v: "Global", l: "Market Reach" },
  { v: "5-Phase", l: "Proven Workflow" },
  { v: "360°", l: "Digital Coverage" },
];

export default function AboutPage({ onBackClick, onContactClick }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 400);
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

        {/* Cinematic Hero Header */}
        <header
          className={`cinematic-header p-8 md:p-14 rounded-3xl mb-16 relative overflow-hidden transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-98'
          }`}
        >
          <div className="laser-line" />
          {/* Decorative large numeral */}
          <div className="absolute right-8 top-0 font-display text-[180px] leading-none text-white/[0.03] select-none pointer-events-none hidden lg:block">
            NG
          </div>
          <div className="max-w-5xl relative z-10">
            <div className="eyebrow mb-4">Who We Are</div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              We help brands <br className="hidden sm:inline" />
              <span className="italic gold-grad">grow, lead</span> and <span className="italic gold-grad">matter.</span>
            </h1>
            <p className="text-ink/80 text-lg md:text-2xl leading-relaxed max-w-3xl">
              Networq Global is a full-spectrum digital marketing agency built to take your business to the next level — with brilliance, creativity, and purpose at every step.
            </p>
          </div>
        </header>

        {/* Mission Statement Strip */}
        <div
          className={`mb-16 glow-card p-8 md:p-10 rounded-3xl border border-line text-center transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <p className="font-display text-2xl md:text-4xl text-gold-2 leading-tight max-w-4xl mx-auto">
            "If it matters to your business, it matters to us."
          </p>
          <p className="text-mute text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Everything that has something to do with your business, brand or you, matters. Blending advanced technology and never-ending creativity, we aim to build all things that will make your brand the talk of the town — or the world.
          </p>
        </div>

        {/* Stats Row */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.l}
              className="glow-card p-6 rounded-2xl border border-line text-center"
              style={{ transitionDelay: `${200 + i * 60}ms` }}
            >
              <div className="font-display text-3xl md:text-5xl gold-grad mb-2">{s.v}</div>
              <div className="text-mute text-xs uppercase tracking-widest font-mono">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          {/* Left: Section header */}
          <div
            className={`lg:col-span-4 transition-all duration-1000 ${
              animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: '250ms' }}
          >
            <div className="eyebrow mb-4">Why Choose Us</div>
            <h2 className="font-display text-3xl md:text-5xl text-gold-2 leading-tight mb-6">
              The difference is in how we think.
            </h2>
            <p className="text-mute text-sm leading-relaxed">
              We don't just execute campaigns — we build empowering digital solutions that keep your vision alive from day one to delivery.
            </p>
            <button
              onClick={() => onContactClick?.('contact')}
              className="btn-gold mt-8 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
              data-cursor="link"
            >
              Let's Work Together →
            </button>
          </div>

          {/* Right: Why points */}
          <div
            className={`lg:col-span-8 space-y-4 transition-all duration-1000 ${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {whyPoints.map((p, i) => (
              <div
                key={p.n}
                className="glow-card p-6 rounded-2xl border border-line flex items-start gap-6"
                style={{ transitionDelay: `${300 + i * 60}ms` }}
              >
                <span className="font-mono text-xs text-gold shrink-0 pt-1">{p.n}</span>
                <div>
                  <div className="font-display text-lg text-gold-2 mb-1">{p.t}</div>
                  <p className="text-mute text-sm leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <section
          className={`glow-card p-8 md:p-12 rounded-3xl border border-line transition-all duration-1000 max-w-4xl mx-auto ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '450ms' }}
        >
          <div className="text-center mb-10">
            <div className="eyebrow mb-4 justify-center">FAQ</div>
            <h2 className="font-display text-3xl md:text-4xl text-gold-2 leading-tight">
              Common questions about Networq Global.
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "Why should I choose Networq Global?", a: "Our key motto is not only to build empowering digital solutions for all kinds of businesses, but also to ensure that your vision is kept alive throughout the process. Choose us to see your vision flourish the right way!" },
              { q: "Will there be fixed plans or will it change with brand/business?", a: "No business or brand will have the same plan of action. The entire process, from beginning to end, will be different and tailored to their specific requirements. We make sure to conduct thorough research for every business, regardless of its sector, to deliver the best possible results." },
              { q: "What will be my role in your process?", a: "Your role is to share your vision, goals, and requirements clearly with us. We handle the research, planning, and execution, while keeping you updated at key stages for feedback. It's a collaborative process where you guide the direction and we bring it to life." },
              { q: "Will your team monitor the campaigns every day?", a: "Yes, we monitor campaigns daily to track performance and optimize every lead generated, helping us maintain consistency and continuously improve results while ensuring steady growth and strong brand value." },
              { q: "Is Networq Global open to work with any kind of brands/business?", a: "Yes, we are open to working with all business sectors globally." },
            ].map((faq, i) => (
              <details key={i} className="group border-b border-line/30 pb-4 last:border-0">
                <summary className="flex justify-between items-center cursor-pointer list-none font-display text-base md:text-lg text-gold-2 py-2 gap-4" data-cursor="link">
                  <span>{faq.q}</span>
                  <span className="text-gold transition-transform duration-300 group-open:rotate-45 shrink-0">+</span>
                </summary>
                <p className="text-mute text-sm leading-relaxed mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
