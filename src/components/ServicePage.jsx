import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { serviceDetails } from '../serviceData';

function FloatingOrb({ color, size, x, y, delay }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={{
        width: size, height: size,
        left: x, top: y,
        background: color,
        opacity: 0.12,
        animationName: 'floatOrb',
        animationDuration: '8s',
        animationDelay: delay,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      }}
    />
  );
}

// ============================================================================
// 3D SPECULAR TILT CARD
// ============================================================================
function TiltCard({ children, className = '', style = {}, delay = 0 }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Mild tilt: range -6 to 6 deg
    const tiltX = (yc - y) / 14; 
    const tiltY = (x - xc) / 14;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // speculation glow spot
    const glow = card.querySelector('.laser-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(var(--accent-rgb), 0.16) 0%, transparent 65%)`;
      glow.style.opacity = 1;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    const glow = card.querySelector('.laser-glow');
    if (glow) {
      glow.style.opacity = 0;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out border border-[var(--line)] bg-[var(--bg-2)]/90 backdrop-blur-md rounded-2xl ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
    >
      {/* Specular lighting effect overlay */}
      <div className="laser-glow absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-10" />
      <div className="relative z-20 h-full w-full" style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </div>
  );
}

// ============================================================================
// 1. BRAND & CREATIVE MOCKUP
// ============================================================================
function BrandCreativeMockup() {
  const [fontStyle, setFontStyle] = useState('serif');
  const [sketchMode, setSketchMode] = useState(false);

  return (
    <TiltCard className="w-full max-w-md p-6">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--gold)]/5 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Identity Sandbox</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setSketchMode(!sketchMode)}
            className="px-2.5 py-1 rounded text-[10px] font-mono border border-[var(--line)] hover:border-[var(--gold)] transition-colors"
            style={{ color: sketchMode ? 'var(--gold)' : 'var(--mute)' }}
          >
            {sketchMode ? 'Vector' : 'Sketch'}
          </button>
        </div>
      </div>

      {/* Logo Display */}
      <div className="h-32 rounded-xl border border-[var(--line)] flex items-center justify-center relative overflow-hidden bg-[var(--bg)]/50 mb-6">
        <div className={`transition-all duration-500 flex flex-col items-center ${sketchMode ? 'opacity-30 filter grayscale contrast-150' : 'opacity-100'}`}>
          <div className="text-4xl mb-2 font-display text-[var(--gold)]">
            {sketchMode ? '🜚' : '✦'}
          </div>
          <span className={`font-mono text-sm tracking-[0.3em] uppercase ${fontStyle === 'serif' ? 'font-serif' : 'font-sans'}`}>
            NETWORQ
          </span>
        </div>
        {sketchMode && (
          <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none" />
        )}
      </div>

      {/* Typography Toggles */}
      <div className="mb-4">
        <label className="font-mono text-[10px] text-[var(--mute)] uppercase block mb-2">Typography Pair</label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setFontStyle('serif')}
            className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
              fontStyle === 'serif' ? 'border-[var(--gold)] bg-[var(--bg-2)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--mute)] bg-[var(--bg-2)]/40'
            }`}
          >
            <span className="block font-serif text-[13px] font-bold">Elegant Serif</span>
            <span className="block text-[9px] font-mono mt-0.5">Brand & Strategy</span>
          </button>
          <button 
            onClick={() => setFontStyle('sans')}
            className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
              fontStyle === 'sans' ? 'border-[var(--gold)] bg-[var(--bg-2)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--mute)] bg-[var(--bg-2)]/40'
            }`}
          >
            <span className="block font-sans text-[13px] font-bold">Minimal Sans</span>
            <span className="block text-[9px] font-mono mt-0.5">Emerging & AI</span>
          </button>
        </div>
      </div>

      {/* Color swatches */}
      <div>
        <label className="font-mono text-[10px] text-[var(--mute)] uppercase block mb-2">Primary Swatches</label>
        <div className="flex gap-2">
          {['#0D0D0D', '#1A1A1A', '#D4AF37', '#F0C040'].map((color, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className="h-8 rounded-lg border border-[var(--line)] mb-1" style={{ background: color }} />
              <span className="font-mono text-[8px] text-[var(--mute)]">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 2. SOCIAL MEDIA MOCKUP
// ============================================================================
function SocialMediaMockup() {
  const [activeTab, setActiveTab] = useState('feed');
  const [likes, setLikes] = useState(240);

  useEffect(() => {
    const interval = setInterval(() => {
      setLikes(prev => prev + (Math.random() > 0.5 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TiltCard className="w-full max-w-[320px] p-4">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[var(--line)] rounded-full z-20" />
      
      {/* Navigation tabs inside mockup */}
      <div className="flex justify-between items-center mt-4 mb-4 border-b border-[var(--line)] pb-2 text-[10px] font-mono text-[var(--mute)]">
        <button onClick={() => setActiveTab('feed')} style={{ color: activeTab === 'feed' ? 'var(--gold)' : 'var(--mute)' }}>Feed</button>
        <button onClick={() => setActiveTab('reels')} style={{ color: activeTab === 'reels' ? 'var(--gold)' : 'var(--mute)' }}>Reels</button>
        <button onClick={() => setActiveTab('stats')} style={{ color: activeTab === 'stats' ? 'var(--gold)' : 'var(--mute)' }}>Analytics</button>
      </div>

      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--line)] overflow-hidden bg-[var(--bg)]">
            <div className="p-2.5 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[10px]">✦</div>
              <span className="font-mono text-[9px] font-bold">networq.global</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg)] flex items-center justify-center relative">
              <span className="text-4xl text-[var(--gold)] opacity-40">◈</span>
              <div className="absolute bottom-2 left-2 bg-[var(--bg-2)]/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono border border-[var(--line)] text-[var(--gold)]">
                Instagram Ads
              </div>
            </div>
            <div className="p-3">
              <div className="flex gap-3 mb-2 text-sm text-[var(--gold)]">
                <span>♥ {likes}</span>
                <span>💬 48</span>
                <span>✈ 14</span>
              </div>
              <p className="text-[10px] text-[var(--mute)] leading-relaxed">
                <strong>networq.global</strong> Stop hoping. Start scaling. Discover our creative social formulas today.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="h-64 rounded-xl border border-[var(--line)] bg-[var(--bg)] relative overflow-hidden flex flex-col justify-end p-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-[var(--gold)] animate-pulse">▶</span>
          </div>
          <div className="relative z-20 text-[10px] text-[var(--ink)] space-y-1">
            <span className="font-bold">@networq.global</span>
            <p className="text-[var(--mute)]">Formula to double retention in 3 seconds...</p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-[var(--gold)]">
              <span>🎚 Original Audio</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-3 font-mono text-[10px]">
          <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
            <div className="text-[var(--mute)]">Reach Growth</div>
            <div className="text-xl font-bold text-[var(--gold)] mt-1">+1,240.8%</div>
            <div className="text-[8px] text-[var(--mute)] mt-1">vs previous month</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
            <div className="text-[var(--mute)]">Avg. Engagement</div>
            <div className="text-xl font-bold text-[var(--gold)] mt-1">8.42%</div>
            <div className="text-[8px] text-[var(--mute)] mt-1">Industry avg: 1.8%</div>
          </div>
        </div>
      )}
    </TiltCard>
  );
}

// ============================================================================
// 3. PERFORMANCE MARKETING MOCKUP
// ============================================================================
function PerformanceMockup() {
  const [spend, setSpend] = useState(5000);

  const estLeads = Math.round(spend / 42);
  const estSales = (estLeads * 0.12 * 850).toLocaleString();

  return (
    <TiltCard className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">ROI Campaign Estimator</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Live Data</span>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-[var(--mute)]">Monthly Ad Spend</span>
            <span className="text-[var(--gold)] font-bold">${spend.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="50000" 
            step="1000"
            value={spend} 
            onChange={(e) => setSpend(Number(e.target.value))}
            className="w-full accent-[var(--gold)] bg-[var(--bg)] h-1 rounded-lg cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50">
            <span className="font-mono text-[9px] text-[var(--mute)] uppercase block mb-1">Conversion Leads</span>
            <span className="text-2xl font-display text-[var(--gold)]">{estLeads}</span>
            <span className="block text-[8px] text-[var(--mute)] font-mono mt-1">Est. $42 Cost Per Lead</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50">
            <span className="font-mono text-[9px] text-[var(--mute)] uppercase block mb-1">Est. Revenue</span>
            <span className="text-2xl font-display text-[var(--gold)]">${estSales}</span>
            <span className="block text-[8px] text-[var(--mute)] font-mono mt-1">Based on 12% Sales Close</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-[var(--gold)]/5 border border-[var(--gold)]/20 text-center">
          <span className="font-mono text-[10px] text-[var(--gold)] block">ROAS Return Multiplier</span>
          <span className="text-xl font-bold block mt-0.5">5.4x Average Return</span>
        </div>
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 4. SEO SERVICES MOCKUP
// ============================================================================
function SeoMockup() {
  const [crawlScore, setCrawlScore] = useState(85);

  useEffect(() => {
    const timer = setTimeout(() => setCrawlScore(99), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TiltCard className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Opportunity Audit</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Optimization Console</span>
      </div>

      <div className="space-y-4">
        {/* Speed tracker */}
        <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold block mb-0.5">Google Pagespeed Score</span>
            <span className="text-[10px] text-[var(--mute)] font-mono">Mobile Core Web Vitals</span>
          </div>
          <div className="text-3xl font-display text-[var(--gold)] transition-all duration-1000">{crawlScore}%</div>
        </div>

        {/* Keyword list */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-[var(--mute)] uppercase block mb-1">Target Keyword Ranks</label>
          {[
            { keyword: 'high intent leads', start: '12', current: '2', status: '▲ 10' },
            { keyword: 'business growth consultation', start: '38', current: '4', status: '▲ 34' },
            { keyword: 'digital marketing partner NY', start: '14', current: '1', status: '▲ 13' },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg)]/30 flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--ink)]">{item.keyword}</span>
              <div className="flex items-center gap-4">
                <span className="text-[var(--mute)]">#{item.start}</span>
                <span className="text-[var(--gold)] font-bold">#{item.current}</span>
                <span className="text-[var(--gold)] text-[9px] bg-[var(--gold)]/10 px-1.5 py-0.5 rounded">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 5. WEBSITE SERVICES MOCKUP
// ============================================================================
function WebsiteMockup() {
  const [viewMode, setViewMode] = useState('preview');

  return (
    <TiltCard className="w-full max-w-md p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Viewport Sandbox</span>
        <div className="flex gap-2">
          {['preview', 'wireframe', 'code'].map((tab) => (
            <button
              key={tab}
              onClick={() => setViewMode(tab)}
              className="px-2 py-0.5 rounded text-[9px] font-mono border border-[var(--line)] capitalize hover:border-[var(--gold)] transition-colors"
              style={{ color: viewMode === tab ? 'var(--gold)' : 'var(--mute)' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-44 rounded-lg border border-[var(--line)] bg-[var(--bg)]/50 relative overflow-hidden flex items-center justify-center p-4">
        {viewMode === 'preview' && (
          <div className="w-full max-w-[240px] p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)] shadow-xl relative overflow-hidden text-center">
            <div className="absolute top-0 inset-x-0 h-1 bg-[var(--gold)]" />
            <span className="text-xl font-display text-[var(--gold)] block mb-1">✦</span>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Midnight Growth</h4>
            <p className="text-[9px] text-[var(--mute)] leading-relaxed">
              Accelerate your pipeline with custom, ultra-fast interfaces.
            </p>
          </div>
        )}

        {viewMode === 'wireframe' && (
          <div className="w-full max-w-[240px] p-4 rounded-xl border border-dashed border-[var(--gold)] bg-transparent text-center relative">
            <span className="text-[8px] font-mono text-[var(--gold)] absolute top-2 right-2">Box</span>
            <div className="w-6 h-6 rounded-full border border-dashed border-[var(--gold)] mx-auto mb-2 flex items-center justify-center text-[8px] text-[var(--gold)]">Icon</div>
            <div className="h-2 w-20 bg-[var(--gold)]/20 mx-auto mb-2" />
            <div className="h-6 w-full bg-[var(--gold)]/10 mx-auto" />
          </div>
        )}

        {viewMode === 'code' && (
          <pre className="font-mono text-[8px] text-[var(--gold)] text-left w-full h-full overflow-y-auto p-2 leading-relaxed bg-[var(--bg)] rounded border border-[var(--line)]">
{`const Landing = () => {
  return (
    <Section className="glow-grid">
      <Title glyph="✦">Midnight Gold</Title>
      <PerformanceTracker speed="99%" />
    </Section>
  );
}`}
          </pre>
        )}
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 6. CONTENT MARKETING MOCKUP
// ============================================================================
function ContentMarketingMockup() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    { title: 'Research & Search Intent', desc: 'Identify high-demand queries and customer paint points.' },
    { title: 'Outline & Angle', desc: 'Formulate a distinct angle to stand out from competitors.' },
    { title: 'Copy & Optimization', desc: 'Draft persuasive copies optimized for readers and rank algorithms.' },
    { title: 'Distribution Pipeline', desc: 'Shatter content across newsletters, social links, and hubs.' }
  ];

  return (
    <TiltCard className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Editorial Pipeline</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Milestone Track</span>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                isActive ? 'border-[var(--gold)] bg-[var(--bg-2)]' : 'border-[var(--line)] hover:border-[var(--gold)]/40 bg-[var(--bg-2)]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border transition-colors ${
                  isActive ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--bg)]' : 'border-[var(--line)] text-[var(--mute)]'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <h4 className={`text-xs font-bold transition-colors ${isActive ? 'text-[var(--gold)]' : 'text-[var(--ink)]'}`}>
                    {stage.title}
                  </h4>
                  {isActive && (
                    <p className="text-[10px] text-[var(--mute)] mt-1.5 leading-relaxed">
                      {stage.desc}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 7. VIDEO & MULTIMEDIA MOCKUP
// ============================================================================
function VideoMockup() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(40);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 2));
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <TiltCard className="w-full max-w-md p-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Cinematic Editor</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Timeline Preview</span>
      </div>

      {/* Screen viewport */}
      <div className="h-36 rounded-lg border border-[var(--line)] bg-[var(--bg)] relative overflow-hidden flex items-center justify-center mb-4">
        <span className="text-4xl text-[var(--gold)] opacity-50 font-display">▶</span>
        <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[var(--mute)] bg-[var(--bg-2)]/80 px-2 py-0.5 rounded border border-[var(--line)]">
          00:14:{Math.round(progress * 0.24).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="space-y-3 font-mono text-[9px]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 py-1 rounded bg-[var(--gold)] text-[var(--bg)] font-bold uppercase tracking-wider text-center"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="flex-1 bg-[var(--bg)] h-1 rounded relative">
            <div className="absolute top-0 bottom-0 left-0 bg-[var(--gold)] rounded" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Tracks */}
        <div className="space-y-1.5 pt-2 border-t border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--mute)] w-10">Video Track</span>
            <div className="flex-1 h-3 bg-[var(--gold)]/10 rounded border border-dashed border-[var(--gold)]/30 relative">
              <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-[var(--gold)]/20 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--mute)] w-10">Audio Wave</span>
            <div className="flex-1 h-3 bg-[var(--bg)] rounded relative overflow-hidden flex items-center">
              <div className="w-full flex justify-between px-1 gap-[1px]">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-[var(--gold)]/50 rounded-sm"
                    style={{ height: `${Math.max(2, Math.abs(Math.sin(i * 0.5) * 10))}px` }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 8. EMAIL & AUTOMATION MOCKUP
// ============================================================================
function EmailAutomationMockup() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Trigger Event', val: 'Sign Up / Purchase' },
    { label: 'Wait Condition', val: 'Wait 18 Hours' },
    { label: 'Dynamic Branch', val: 'Has Purchased?' },
    { label: 'Action Result', val: 'Trigger Upsell Flow' }
  ];

  return (
    <TiltCard className="w-full max-w-md p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Flowchart Builder</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Automation Sequence</span>
      </div>

      <div className="flex flex-col items-center gap-2 relative">
        {steps.map((s, idx) => (
          <React.Fragment key={idx}>
            <button
              onClick={() => setActiveStep(idx)}
              className={`w-full max-w-[240px] p-3 rounded-xl border text-center transition-all ${
                activeStep === idx ? 'border-[var(--gold)] bg-[var(--bg-2)]' : 'border-[var(--line)] bg-[var(--bg-2)]/55 hover:border-[var(--gold)]/40'
              }`}
            >
              <span className="block font-mono text-[8px] text-[var(--mute)] uppercase tracking-wider mb-1">{s.label}</span>
              <span className={`block text-xs font-bold ${activeStep === idx ? 'text-[var(--gold)]' : 'text-[var(--ink)]'}`}>{s.val}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className="h-6 w-px bg-[var(--gold)]/30 border-dashed border-l relative">
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[var(--gold)] text-[8px]">▼</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 9. BUSINESS GROWTH MOCKUP
// ============================================================================
function BusinessGrowthMockup() {
  const [funnelMode, setFunnelMode] = useState('leak');

  return (
    <TiltCard className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Funnel Milestone Optimization</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Consulting Simulator</span>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFunnelMode('leak')}
          className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            funnelMode === 'leak' ? 'border-[var(--gold)] bg-[var(--bg-2)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--mute)] bg-[var(--bg-2)]/40'
          }`}
        >
          Before (Conversions Leak)
        </button>
        <button
          onClick={() => setFunnelMode('optimized')}
          className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            funnelMode === 'optimized' ? 'border-[var(--gold)] bg-[var(--bg-2)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--mute)] bg-[var(--bg-2)]/40'
          }`}
        >
          After Networq
        </button>
      </div>

      <div className="space-y-4">
        {[
          { stage: 'Traffic Attraction', leak: '10,000 Visitors', opt: '15,000 High-Intent' },
          { stage: 'MQL Qualification', leak: '200 Lead Contacts', opt: '900 Hot SQL Leads' },
          { stage: 'Sales Conversion', leak: '4 Clients (0.04%)', opt: '45 Clients (3.0%)' },
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg)]/40 relative">
            <span className="font-mono text-[9px] text-[var(--mute)] uppercase block mb-1">{item.stage}</span>
            <div className="flex justify-between items-center">
              <span className={`text-xs ${funnelMode === 'leak' ? 'text-[var(--mute)] line-through' : 'text-[var(--gold)] font-bold'}`}>
                {funnelMode === 'leak' ? item.leak : item.opt}
              </span>
              <span className="text-[9px] font-mono text-[var(--mute)]">Stage {idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 10. LOCAL BUSINESS MOCKUP
// ============================================================================
function LocalBusinessMockup() {
  const [activePin, setActivePin] = useState('nyc');

  const pins = {
    nyc: { title: 'Networq NY HQ', reach: '48.2k Monthly Citations', rate: '4.9 ★★★★★' },
    ldn: { title: 'London Regional Hub', reach: '24.1k Monthly Citations', rate: '4.8 ★★★★★' },
    sgp: { title: 'Singapore Central', reach: '18.9k Monthly Citations', rate: '5.0 ★★★★★' }
  };

  return (
    <TiltCard className="w-full max-w-md p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">Citations Map Optimizer</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Local SEO Map</span>
      </div>

      {/* Abstract Map Grid */}
      <div className="h-32 rounded-lg border border-[var(--line)] bg-[var(--bg)] relative overflow-hidden mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-lines opacity-10 pointer-events-none" />
        
        {/* Map Pins */}
        <button 
          onClick={() => setActivePin('nyc')}
          className="absolute top-8 left-16 flex flex-col items-center group shadow-lg"
        >
          <span className={`text-xl transition-transform ${activePin === 'nyc' ? 'scale-125 text-[var(--gold)]' : 'text-[var(--mute)]'}`}>📍</span>
          <span className="text-[8px] font-mono mt-0.5 bg-[var(--bg-2)] px-1 rounded border border-[var(--line)]">NY</span>
        </button>

        <button 
          onClick={() => setActivePin('ldn')}
          className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center group shadow-lg"
        >
          <span className={`text-xl transition-transform ${activePin === 'ldn' ? 'scale-125 text-[var(--gold)]' : 'text-[var(--mute)]'}`}>📍</span>
          <span className="text-[8px] font-mono mt-0.5 bg-[var(--bg-2)] px-1 rounded border border-[var(--line)]">LDN</span>
        </button>

        <button 
          onClick={() => setActivePin('sgp')}
          className="absolute bottom-6 right-16 flex flex-col items-center group shadow-lg"
        >
          <span className={`text-xl transition-transform ${activePin === 'sgp' ? 'scale-125 text-[var(--gold)]' : 'text-[var(--mute)]'}`}>📍</span>
          <span className="text-[8px] font-mono mt-0.5 bg-[var(--bg-2)] px-1 rounded border border-[var(--line)]">SGP</span>
        </button>
      </div>

      <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg)]/50">
        <span className="font-mono text-[9px] text-[var(--gold)] uppercase tracking-wider block mb-1">GMB Profile: {pins[activePin].title}</span>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-[var(--ink)] font-bold">{pins[activePin].reach}</span>
          <span className="text-xs text-[var(--gold)] font-bold">{pins[activePin].rate}</span>
        </div>
      </div>
    </TiltCard>
  );
}

// ============================================================================
// 11. EMERGING & AI SERVICES MOCKUP
// ============================================================================
function EmergingServicesMockup() {
  const [logs, setLogs] = useState([
    'Initializing AI Heuristics Engine...',
    'Analyzing search context benchmarks...',
  ]);
  const [activePrompt, setActivePrompt] = useState('');

  const handlePrompt = (type) => {
    setActivePrompt(type);
    let newLogs = [...logs];
    if (type === 'strategy') {
      newLogs.push('Prompt: [Draft Campaign Strategy]');
      newLogs.push('AI Output: Generated 14-page tailored distribution checklist in 1.4s.');
    } else {
      newLogs.push('Prompt: [Check Competitor Map]');
      newLogs.push('AI Output: Identified 3 gaps in local citation directories.');
    }
    setLogs(newLogs);
  };

  return (
    <TiltCard className="w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--line)]">
        <span className="font-mono text-[10px] text-[var(--mute)] uppercase tracking-wider">AI Copilot Terminal</span>
        <span className="text-[10px] font-mono text-[var(--gold)] uppercase">Neural Sandbox</span>
      </div>

      {/* Terminal View */}
      <div className="h-36 rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3 overflow-y-auto mb-4 font-mono text-[9px] text-[var(--gold)] leading-relaxed space-y-1.5">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>

      {/* Interactive Prompts */}
      <div className="space-y-2">
        <label className="font-mono text-[10px] text-[var(--mute)] uppercase block mb-1">Execute Prompt Sequences</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePrompt('strategy')}
            className={`p-2.5 rounded-lg border text-[10px] font-mono text-center transition-all ${
              activePrompt === 'strategy' ? 'border-[var(--gold)] bg-[var(--bg-2)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--mute)] hover:border-[var(--gold)]/40 bg-[var(--bg-2)]/40'
            }`}
          >
            Draft Campaign Strategy
          </button>
          <button
            onClick={() => handlePrompt('competitors')}
            className={`p-2.5 rounded-lg border text-[10px] font-mono text-center transition-all ${
              activePrompt === 'competitors' ? 'border-[var(--gold)] bg-[var(--bg-2)] text-[var(--gold)]' : 'border-[var(--line)] text-[var(--mute)] hover:border-[var(--gold)]/40 bg-[var(--bg-2)]/40'
            }`}
          >
            Check Competitor Map
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

// ============================================================================
// MAIN SERVICE PAGE COMPONENT
// ============================================================================
export default function ServicePage({ serviceId, onBackClick, onContactClick, onServiceClick }) {
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [hoveredOffer, setHoveredOffer] = useState(null);
  const data = serviceDetails[serviceId];
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setAnimate(false);
    setOpenFaqIdx(null);
    const timer = setTimeout(() => setAnimate(true), 400);

    // Stagger fade up entries on mount
    if (containerRef.current) {
      const el = containerRef.current;
      gsap.fromTo(el.querySelectorAll('.gsap-fade-up'),
        { opacity: 0, y: 32 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.95, 
          ease: 'power3.out', 
          stagger: 0.08,
          delay: 0.35
        }
      );
    }

    return () => clearTimeout(timer);
  }, [serviceId]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gold-2">
        Service not found.
      </div>
    );
  }

  const toggleFaq = (idx) => setOpenFaqIdx(openFaqIdx === idx ? null : idx);

  // Per-service decorative icon glyph mapping
  const GLYPHS = {
    'brand-creative': '✦',
    'social-media': '◈',
    'performance-marketing': '◎',
    'seo-services': '◇',
    'website-services': '▣',
    'content-marketing': '◉',
    'video-multimedia': '▶',
    'email-automation': '⊡',
    'business-growth': '◬',
    'local-business': '◯',
    'emerging-services': '⬡',
  };
  const glyph = GLYPHS[serviceId] || '✦';

  return (
    <div ref={containerRef} className="subpage-container relative overflow-hidden pt-24 pb-32">
      {/* Floating ambient orbs using midnight gold variables */}
      <FloatingOrb color="var(--gold)" size="600px" x="-200px" y="-100px" delay="0s" />
      <FloatingOrb color="var(--gold-2)" size="400px" x="60%" y="200px" delay="3s" />
      <FloatingOrb color="var(--gold)" size="300px" x="10%" y="70%" delay="5s" />

      {/* Hero Section */}
      <div className="relative mb-24">
        {/* Cinematic hero panel */}
        <div
          className={`relative overflow-hidden transition-all duration-1000 ${
            animate ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(var(--accent-rgb),0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(var(--accent-rgb),0.08) 0%, transparent 50%)' }}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 md:py-32 relative z-10">
            {/* Back + breadcrumb */}
            <div className="flex items-center gap-4 mb-12 gsap-fade-up">
              <button
                onClick={onBackClick}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:scale-105 transition-all duration-300 px-4 py-2 rounded-full border"
                style={{ color: 'var(--gold)', borderColor: 'rgba(var(--accent-rgb), 0.25)' }}
                data-cursor="link"
              >
                ← Home
              </button>
              <span className="text-[var(--mute)] text-xs font-mono">/</span>
              <button
                onClick={() => onServiceClick?.('services')}
                className="text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
                style={{ color: 'var(--gold)' }}
                data-cursor="link"
              >
                Services
              </button>
              <span className="text-[var(--mute)] text-xs font-mono">/</span>
              <span className="text-[var(--mute)] text-xs font-mono uppercase tracking-widest truncate">{data.t}</span>
            </div>

            {/* Main hero text */}
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                {/* Service label */}
                <div className="inline-flex items-center gap-3 mb-8 gsap-fade-up">
                  <span className="text-3xl animate-pulse" style={{ color: 'var(--gold)' }}>{glyph}</span>
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border"
                    style={{ color: 'var(--gold)', borderColor: 'rgba(var(--accent-rgb), 0.2)', background: 'rgba(var(--accent-rgb), 0.06)' }}
                  >
                    {data.t}
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-5xl sm:text-7xl lg:text-[86px] leading-[0.88] tracking-tight mb-8 gsap-fade-up">
                  {data.sub.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 || i === arr.length - 2 ? (
                        <span className="italic font-serif" style={{ color: 'var(--gold)' }}>{word}</span>
                      ) : (
                        word
                      )}
                      {i < arr.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </h1>

                {/* Description */}
                <p className="text-[var(--mute)] text-lg md:text-xl leading-relaxed max-w-2xl mb-10 gsap-fade-up">
                  {data.desc}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 gsap-fade-up">
                  <button
                    onClick={onContactClick}
                    className="px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    style={{ background: 'var(--gold)', color: '#0a0a0a' }}
                    data-cursor="link"
                  >
                    Get Started →
                  </button>
                  <button
                    onClick={onContactClick}
                    className="px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2 border transition-all duration-300 hover:scale-105"
                    style={{ color: 'var(--gold)', borderColor: 'rgba(var(--accent-rgb), 0.25)' }}
                    data-cursor="link"
                  >
                    Talk to Us
                  </button>
                </div>
              </div>

              {/* Hero Visual — Dynamic, bespoke interactive component per service page */}
              <div className="lg:col-span-5 flex items-center justify-center gsap-fade-up">
                {serviceId === 'brand-creative' && <BrandCreativeMockup />}
                {serviceId === 'social-media' && <SocialMediaMockup />}
                {serviceId === 'performance-marketing' && <PerformanceMockup />}
                {serviceId === 'seo-services' && <SeoMockup />}
                {serviceId === 'website-services' && <WebsiteMockup />}
                {serviceId === 'content-marketing' && <ContentMarketingMockup />}
                {serviceId === 'video-multimedia' && <VideoMockup />}
                {serviceId === 'email-automation' && <EmailAutomationMockup />}
                {serviceId === 'business-growth' && <BusinessGrowthMockup />}
                {serviceId === 'local-business' && <LocalBusinessMockup />}
                {serviceId === 'emerging-services' && <EmergingServicesMockup />}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">

        {/* ─── Why It Matters ─────────────────────────────────────────── */}
        <section className="mb-24 gsap-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px" style={{ background: 'var(--gold)' }} />
            <h2 className="font-display text-2xl md:text-4xl text-[var(--gold)]">
              Why It Matters
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.importance.map((point, idx) => (
              <TiltCard key={idx} className="p-6">
                {/* Number */}
                <div
                  className="font-mono text-5xl font-bold mb-4 opacity-10 absolute right-4 top-2 select-none"
                  style={{ color: 'var(--gold)' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                {/* Accent bar */}
                <div className="w-6 h-0.5 mb-4 rounded-full" style={{ background: 'var(--gold)' }} />
                <p className="text-[var(--mute)] text-sm leading-relaxed relative z-10">{point}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ─── Web Dev Process (website-services only) ───────────────── */}
        {data.process && (
          <section className="mb-24 gsap-fade-up">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px" style={{ background: 'var(--gold)' }} />
              <h2 className="font-display text-2xl md:text-4xl text-[var(--gold)]">
                Our Development Process
              </h2>
            </div>
            <div className="relative">
              {/* Connecting line */}
              <div
                className="absolute top-8 left-8 right-8 h-px hidden lg:block"
                style={{ background: 'linear-gradient(90deg, rgba(var(--accent-rgb), 0.25), rgba(var(--accent-rgb), 0.25))' }}
              />
              <div className="grid md:grid-cols-5 gap-6 relative z-10">
                {data.process.map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-mono font-bold mx-auto mb-4 border-2"
                      style={{
                        borderColor: 'var(--gold)',
                        color: 'var(--gold)',
                        background: 'rgba(var(--accent-rgb), 0.07)',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-display text-base text-[var(--ink)] mb-2">{step.t}</h3>
                    <p className="text-[var(--mute)] text-xs leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── What We Offer ──────────────────────────────────────────── */}
        <section className="mb-24 gsap-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px" style={{ background: 'var(--gold)' }} />
            <h2 className="font-display text-2xl md:text-4xl text-[var(--gold)]">
              What We Offer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.offers.map((offer, idx) => (
              <TiltCard
                key={idx}
                className="p-6 cursor-default"
                onMouseEnter={() => setHoveredOffer(idx)}
                onMouseLeave={() => setHoveredOffer(null)}
                data-cursor="link"
              >
                {/* Index */}
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 block transition-colors duration-300"
                  style={{ color: hoveredOffer === idx ? 'var(--gold)' : 'var(--mute)' }}
                >
                  {String(idx + 1).padStart(2, '0')} · SERVICE
                </span>

                {/* Icon glyph */}
                <div className="text-2xl mb-4 transition-transform duration-300 group-hover:scale-125" style={{ color: 'var(--gold)' }}>
                  {glyph}
                </div>

                <h3 className="font-display text-xl mb-3 text-[var(--ink)] leading-tight">{offer.t}</h3>
                <p className="text-[var(--mute)] text-sm leading-relaxed">{offer.d}</p>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 inset-x-0 h-0.5 transition-all duration-300 scale-x-0 group-hover:scale-x-100"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
                />
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ─── SEO Plans (seo-services only) ─────────────────────────── */}
        {data.plans && (
          <section className="mb-24 gsap-fade-up">
            <div className="flex items-center gap-4 mb-10">
              <span className="w-8 h-px" style={{ background: 'var(--gold)' }} />
              <h2 className="font-display text-2xl md:text-4xl text-[var(--gold)]">
                Networq's SEO Plans
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {data.plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl border p-8 relative transition-all duration-300 hover:-translate-y-2 ${
                    idx === 1 ? 'scale-[1.03]' : ''
                  }`}
                  style={{
                    borderColor: idx === 1 ? 'var(--gold)' : 'rgba(var(--accent-rgb), 0.16)',
                    background: idx === 1
                      ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.07) 0%, var(--bg-2) 100%)'
                      : 'var(--bg-2)',
                    boxShadow: idx === 1 ? '0 0 40px rgba(var(--accent-rgb), 0.1)' : 'none',
                  }}
                >
                  {idx === 1 && (
                    <span
                      className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold"
                      style={{ background: 'var(--gold)', color: '#0a0a0a' }}
                    >
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-2xl mb-6 text-[var(--ink)]">{plan.t}</h3>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-sm text-[var(--mute)]">
                        <span style={{ color: 'var(--gold)' }}>◆</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onContactClick}
                    className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105"
                    style={idx === 1
                      ? { background: 'var(--gold)', color: '#0a0a0a' }
                      : { border: '1px solid rgba(var(--accent-rgb), 0.25)', color: 'var(--gold)' }
                    }
                    data-cursor="link"
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
            {data.conclusion && (
              <p className="mt-8 text-[var(--mute)] text-sm leading-relaxed text-center max-w-3xl mx-auto">
                {data.conclusion}
              </p>
            )}
          </section>
        )}

        {/* ─── Why Choose Networq ────────────────────────────────────── */}
        {(data.whyChoose || data.whyChoosePoints) && (
          <section className="mb-24 gsap-fade-up">
            <div
              className="relative overflow-hidden rounded-3xl border p-10 md:p-14"
              style={{
                borderColor: 'rgba(var(--accent-rgb), 0.16)',
                background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.04) 0%, var(--bg-2) 60%, rgba(var(--accent-rgb), 0.02) 100%)',
              }}
            >
              {/* Decorative large glyph */}
              <div
                className="absolute right-8 top-8 text-[120px] leading-none select-none pointer-events-none opacity-5 font-display"
                style={{ color: 'var(--gold)' }}
              >
                {glyph}
              </div>

              {data.whyChoose && (
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="font-display text-3xl md:text-5xl mb-6 text-[var(--ink)]">
                    Why Choose <span className="italic font-serif text-[var(--gold)]">Networq?</span>
                  </h2>
                  <p className="text-[var(--mute)] text-lg leading-relaxed mb-8">{data.whyChoose}</p>
                  <button
                    onClick={onContactClick}
                    className="px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    style={{ background: 'var(--gold)', color: '#0a0a0a' }}
                    data-cursor="link"
                  >
                    Partner With Us →
                  </button>
                </div>
              )}

              {data.whyChoosePoints && (
                <div>
                  <h2 className="font-display text-3xl md:text-4xl mb-8 text-[var(--ink)]">
                    Why Choose <span className="italic font-serif text-[var(--gold)]">Networq?</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-10">
                    {data.whyChoosePoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="mt-1 shrink-0" style={{ color: 'var(--gold)' }}>◆</span>
                        <p className="text-[var(--mute)] text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={onContactClick}
                    className="px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    style={{ background: 'var(--gold)', color: '#0a0a0a' }}
                    data-cursor="link"
                  >
                    Let's Connect →
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── FAQ ───────────────────────────────────────────────────── */}
        <section className="mb-24 gsap-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px" style={{ background: 'var(--gold)' }} />
            <h2 className="font-display text-2xl md:text-4xl text-[var(--gold)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 max-w-4xl">
            {data.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border transition-all duration-300"
                  style={{
                    borderColor: isOpen ? 'rgba(var(--accent-rgb), 0.25)' : 'rgba(var(--accent-rgb), 0.1)',
                    background: isOpen ? 'rgba(26, 26, 26, 0.95)' : 'var(--bg-2)',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-6 transition-colors duration-200"
                    data-cursor="link"
                  >
                    <span className="font-display text-base md:text-lg text-[var(--ink)]">{faq.q}</span>
                    <span
                      className="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-mono text-lg transition-all duration-300"
                      style={{
                        borderColor: 'rgba(var(--accent-rgb), 0.25)',
                        color: 'var(--gold)',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        background: isOpen ? 'rgba(var(--accent-rgb), 0.08)' : 'transparent',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="transition-all duration-400 ease-in-out overflow-hidden"
                    style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="px-6 pb-6 text-[var(--mute)] text-sm leading-relaxed border-t" style={{ borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
                      <div className="pt-4">{faq.a}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Bottom CTA Banner ─────────────────────────────────────── */}
        <section className="gsap-fade-up">
          <div
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.1) 0%, rgba(var(--accent-rgb), 0.05) 50%, var(--bg-2) 100%)',
              border: '1px solid rgba(var(--accent-rgb), 0.12)',
            }}
          >
            {/* Background glyph */}
            <div
              className="absolute inset-0 flex items-center justify-center text-[300px] leading-none select-none pointer-events-none opacity-[0.03] font-display"
              style={{ color: 'var(--gold)' }}
            >
              {glyph}
            </div>
            <div className="relative z-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--gold)' }}>
                Ready to scale?
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-[var(--ink)] mb-6 max-w-2xl mx-auto leading-tight">
                Let's build something <span className="italic font-serif text-[var(--gold)]">remarkable</span> together.
              </h2>
              <p className="text-[var(--mute)] text-base mb-10 max-w-xl mx-auto">
                Talk to our team and discover what {data.t} can do for your business.
              </p>
              <button
                onClick={onContactClick}
                className="px-10 py-4 rounded-full text-base font-semibold inline-flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'var(--gold)',
                  color: '#0a0a0a',
                  boxShadow: '0 8px 32px rgba(var(--accent-rgb), 0.2)',
                }}
                data-cursor="link"
              >
                Connect Now <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
