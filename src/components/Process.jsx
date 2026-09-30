import React from 'react';
import { processSteps } from '../data';

export default function Process() {
  return (
    <section
      id="process"
      data-section="process"
      data-scene="process"
      data-edge-chip="02 · THE METHOD"
      className="relative border-t border-line"
    >
      <div id="process-pin" className="relative h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden pt-12 lg:pt-0">
          <div className="absolute inset-0 grid-overlay opacity-30 process-grid"></div>

          {/* Giant background numeral that morphs with phase */}
          <div id="process-numeral" className="process-numeral">
            01
          </div>

          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-12 items-center z-10">
            <div className="order-2 lg:order-1 w-full max-w-xl mx-auto lg:max-w-none">
              <div className="eyebrow mb-2 sm:mb-4 text-xs sm:text-sm">02 — The Networq Global Method</div>
              <div id="process-stage" className="relative h-[270px] sm:h-[310px] md:h-[350px] lg:h-[400px]">
                {processSteps.map((p, i) => (
                  <div
                     key={p.n}
                    className={`proc-step card p-4 sm:p-6 md:p-8 rounded-2xl flex flex-col justify-between ${i === 0 ? 'active' : ''}`}
                    data-step={i}
                  >
                    <div>
                      <div className="flex items-baseline gap-3 sm:gap-4 mb-1.5 sm:mb-3">
                        <span className="step-num text-3xl sm:text-5xl lg:text-6xl font-display leading-none">{p.n}</span>
                        <span className="font-mono text-[11px] sm:text-xs text-mute">{p.time}</span>
                      </div>
                      <h3 className="font-display text-xl sm:text-3xl lg:text-5xl mb-1.5 sm:mb-4 font-semibold text-white">{p.t}</h3>
                      <p className="text-mute max-w-lg text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">{p.d}</p>
                    </div>
                    <div className="mt-3 sm:mt-6 lg:mt-8 flex flex-wrap gap-1.5 sm:gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="chip rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 sm:mt-6 lg:mt-8 flex items-center gap-3">
                <div id="process-dots" className="flex gap-2">
                  {processSteps.map((_, i) => (
                    <div
                      key={i}
                      className={i === 0 ? 'on' : ''}
                      data-dot={i}
                    ></div>
                  ))}
                </div>
                <span id="process-label" className="font-mono text-[10px] sm:text-xs text-mute uppercase tracking-widest">
                  {processSteps[0].t.toUpperCase()}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="mt-2.5 sm:mt-6 w-36 sm:w-48 h-px bg-[var(--line)] overflow-hidden">
                <div
                  id="process-progress"
                  className="h-full bg-[var(--gold-2)] origin-left scale-x-0"
                  style={{ transformOrigin: 'left' }}
                ></div>
              </div>
            </div>

            <div className="order-1 lg:order-2 h-[20vh] sm:h-[28vh] lg:h-[80vh] relative flex items-center justify-center">
              <div id="process-anchor" className="absolute inset-0"></div>
            </div>
          </div>

          {/* Vertical text scrolling on left edge */}
          {/* <div className="deco-vert-text" style={{ top: '18%', left: '18px' }} data-parallax="0.3">
            THE NETWORQ GLOBAL METHOD · DISCOVER · STRATEGIZE · ACTIVATE · COMPOUND
          </div> */}
        </div>
      </div>
    </section>
  );
}
