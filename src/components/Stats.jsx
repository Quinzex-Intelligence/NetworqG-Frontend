import React from 'react';

export default function Stats() {
  return (
    <section
      id="stats"
      data-section="stats"
      data-scene="shatter"
      data-edge-chip="01 · BY THE NUMBERS"
      className="relative py-20 lg:py-24 overflow-hidden"
    >
      {/* <div className="ribbon" style={{ top: '10%' }} data-parallax="-0.2">
        NETWORK · NETWORK · NETWORK · NETWORK · NETWORK · NETWORK · NETWORK
      </div> */}

      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative">
        <div className="mb-12 max-w-3xl drift-up card p-6 md:p-8 rounded-2xl" data-anim="fade-up">
          <div className="eyebrow mb-3">The signal, by the numbers</div>
          <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight" data-split="">
            The globe doesn't <span className="italic gold-grad">just spin</span>. <br className="hidden sm:inline" />
            It compounds.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)]" data-stagger="3d">
          <div className="bg-ink/70 p-6 lg:p-8 backdrop-blur">
            <div className="eyebrow mb-2">Revenue influenced</div>
            <div className="font-display text-4xl lg:text-6xl gold-grad stat-num" data-count="2.4">
              $0B
            </div>
            <p className="text-mute mt-2 text-xs">For 180+ partner brands since 2014.</p>
          </div>
          
          <div className="bg-ink/70 p-6 lg:p-8 backdrop-blur">
            <div className="eyebrow mb-2">Avg. ROAS delivered</div>
            <div className="font-display text-4xl lg:text-6xl gold-grad stat-num" data-count="6.8">
              0x
            </div>
            <p className="text-mute mt-2 text-xs">Across paid social, search and programmatic.</p>
          </div>
          
          <div className="bg-ink/70 p-6 lg:p-8 backdrop-blur">
            <div className="eyebrow mb-2">Markets activated</div>
            <div className="font-display text-4xl lg:text-6xl gold-grad stat-num" data-count="42">
              0
            </div>
            <p className="text-mute mt-2 text-xs">Across 14 working languages and 6 continents.</p>
          </div>
          
          <div className="bg-ink/70 p-6 lg:p-8 backdrop-blur">
            <div className="eyebrow mb-2">Campaigns shipped</div>
            <div className="font-display text-4xl lg:text-6xl gold-grad stat-num" data-count="1240">
              0+
            </div>
            <p className="text-mute mt-3 text-sm">From brand films to performance funnels.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
