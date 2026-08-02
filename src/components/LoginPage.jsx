import React, { useEffect, useState } from 'react';

export default function LoginPage({ onBackClick }) {
  const [animate, setAnimate] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 50);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleGoogleLogin = () => {
    sessionStorage.setItem('logging_in', 'true');
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/login`;
  };

  return (
    <div className="login-page-wrapper min-h-screen relative overflow-hidden flex items-center justify-center pt-16 pb-20 bg-[#070707]">
      
      {/* Scope premium typography and gradients locally */}
      <style>{`
        .login-page-wrapper,
        .login-card,
        .login-title,
        .login-sub,
        .login-btn,
        .login-back-btn,
        .hud-label {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
        .login-page-wrapper {
          background-color: var(--bg) !important;
        }
        .login-card {
          background-color: var(--card-bg) !important;
          border-color: var(--line) !important;
        }
        .login-btn {
          background-color: var(--bg-2) !important;
          border-color: var(--line) !important;
          color: var(--gold-2) !important;
        }
        .login-btn:hover {
          background-color: var(--gold) !important;
          color: var(--bg) !important;
          border-color: var(--gold) !important;
        }
        .login-sub {
          color: var(--mute) !important;
          opacity: 0.85;
        }
        .login-back-btn {
          color: var(--mute) !important;
        }
        .gold-glow-spot {
          background: radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 60%);
        }
        .premium-border {
          position: relative;
        }
        .premium-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
        }
      `}</style>

      {/* Subtle radial ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] gold-glow-spot pointer-events-none blur-3xl z-0" />

      {/* Subtle vertical vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#070707_98%)] pointer-events-none z-0" />

      <div className="max-w-md w-full px-6 relative z-10">
        
        {/* Cinematic Premium Card */}
        <div
          className={`login-card rounded-2xl border border-neutral-900 bg-[#0d0d0d]/80 backdrop-blur-2xl p-10 md:p-12 shadow-2xl transition-all duration-1000 premium-border flex flex-col items-center text-center ${
            animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-97'
          }`}
          style={{
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.02)'
          }}
        >
          {/* Elegant Monogram Ring */}
          <div className="w-16 h-16 rounded-full border border-neutral-800 flex items-center justify-center mb-7 bg-neutral-900/30 relative">
            {/* Pulsing indicator ring */}
            <div className="absolute inset-0 rounded-full border border-gold/10 animate-ping opacity-60" />
            {/* Delicate gold dot inner */}
            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold text-xs font-light tracking-widest bg-black/40">
              NQ
            </div>
          </div>

          {/* Eyebrow Label */}
          <span className="hud-label text-[9px] text-gold uppercase tracking-[0.35em] block mb-3 font-semibold">
            SYSTEM GATEWAY
          </span>

          {/* Clean Sans-serif Header */}
          <h1 className="login-title text-3xl font-light tracking-tight text-white mb-3">
            Portal Access
          </h1>
          
          <p className="login-sub text-[13px] text-neutral-400 leading-relaxed mb-8 max-w-[280px]">
            Provide administrative credentials via Google to manage active positions, portfolios, and marketing directories.
          </p>

          {/* Premium Glassmorphic Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="login-btn w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl border border-neutral-800 bg-[#141414] hover:bg-[#1a1a1a] hover:border-gold/30 text-neutral-300 hover:text-white transition-all duration-300 text-xs font-semibold uppercase tracking-[0.15em] cursor-pointer shadow-lg"
          >
            {/* SVG Google Icon */}
            <svg
              className="w-4.5 h-4.5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Sign In with Google
          </button>

          {/* Minimal Cancel Button */}
          <button
            onClick={onBackClick}
            className="login-back-btn mt-6 text-neutral-500 hover:text-neutral-300 transition-colors duration-300 text-xs font-medium cursor-pointer"
          >
            Cancel and Return
          </button>

          {/* Subtle Status Bar */}
          <div className="w-full mt-8 pt-4 border-t border-neutral-900/60 flex items-center justify-between font-mono text-[9px] text-neutral-600 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse"></span>
              <span>SECURE_LINK</span>
            </div>
            <div>
              <span>{currentTime || 'SYNCING...'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
