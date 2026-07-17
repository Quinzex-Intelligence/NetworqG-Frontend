import React from 'react';
import { team } from '../data';

export default function About() {
  return (
    <section
      id="about"
      data-section="about"
      data-scene="constellation"
      data-edge-chip="05 · THE STUDIO"
      className="relative py-20 lg:py-24 border-t border-line overflow-hidden"
    >
      {/* <div className="ribbon" style={{ top: '8%' }} data-parallax="0.18">
        STUDIO · STUDIO · STUDIO · STUDIO · STUDIO · STUDIO · STUDIO · STUDIO
      </div> */}

      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 drift-up card p-6 md:p-8 rounded-2xl border border-line">
            <div className="eyebrow mb-3" data-anim="fade-up">
              04 — The Studio
            </div>
            <h2
              className="font-display text-4xl lg:text-5xl leading-[1] tracking-tight"
              data-split=""
              data-parallax="-0.05"
            >
              Senior <span className="italic gold-grad">operators</span>, not account farms.
            </h2>
            <p className="text-mute mt-4 max-w-md text-sm" data-anim="fade-up">
              Founded in 2014, Networq Global is a 60-person studio of strategists, creatives, media buyers and engineers — distributed across four hub cities and on the ground in your market when it matters.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6" data-stagger="up">
              <div>
                <dt className="eyebrow mb-1">Headcount</dt>
                <dd className="font-display text-3xl text-gold-2">60</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Avg. tenure</dt>
                <dd className="font-display text-3xl text-gold-2">7 yrs</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Hub cities</dt>
                <dd className="font-display text-3xl text-gold-2">NYC · LDN · DXB · SGP</dd>
              </div>
              <div>
                <dt className="eyebrow mb-1">Languages</dt>
                <dd className="font-display text-3xl text-gold-2">14</dd>
              </div>
            </dl>
          </div>
          
          <div className="lg:col-span-7">
            <div id="team-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--line)]" data-stagger="scale">
              {team.map((p) => {
                const init = p.n.split(' ').map((x) => x[0]).join('');
                return (
                  <div key={p.n} className="bg-ink p-6 lift tilt-card" data-cursor="link">
                    <div className="tilt-inner">
                      <div
                        className="aspect-square w-full rounded-lg mb-4 relative overflow-hidden ring-gold"
                        style={{
                          background: `
                            radial-gradient(circle at 30% 30%, rgba(var(--accent-rgb),0.35), transparent 55%),
                            radial-gradient(circle at 70% 80%, rgba(var(--accent-rgb),0.45), transparent 55%),
                            linear-gradient(135deg, var(--bg-2), var(--bg-2))
                          `
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center font-display text-5xl gold-grad">
                          {init}
                        </div>
                        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-gold">
                          {p.loc}
                        </div>
                      </div>
                      <div className="font-display text-lg leading-tight">{p.n}</div>
                      <div className="text-mute text-xs mt-1">{p.r}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
