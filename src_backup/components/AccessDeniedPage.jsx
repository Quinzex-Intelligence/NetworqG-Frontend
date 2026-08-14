import React, { useEffect, useState } from 'react';

export default function AccessDeniedPage({ onBackToHome, onRetryLogin }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    if (onRetryLogin) {
      onRetryLogin();
    } else {
      sessionStorage.setItem('logging_in', 'true');
      window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/login?prompt=select_account`;
    }
  };

  return (
    <div className="access-denied-scope min-h-screen w-full bg-[#084b6f] flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden select-none">
      
      {/* Scope modern sans-serif typography strictly to prevent font distortions */}
      <style>{`
        .access-denied-scope,
        .access-denied-scope * {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          letter-spacing: normal;
        }
      `}</style>

      {/* Decorative ambient background mesh & glowing gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#084b6f] via-[#063854] to-[#042437] pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffc750]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Main Glass Card (Identical layout to Login Card) ── */}
      <div className="w-full max-w-[420px] shrink-0 flex justify-center relative z-10">
        <div
          className={`w-full max-w-[390px] bg-[#0c1017]/95 rounded-[32px] overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.85)] text-white flex flex-col relative transition-all duration-500 hover:border-white/20 ${
            animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* ── Top Visual Header: Centered Networq Brand Badge with Red Warning Pill ── */}
          <div className="relative h-44 w-full bg-gradient-to-b from-[#1c1214] via-[#140e11] to-[#0c1017] flex items-center justify-center overflow-hidden border-b border-white/5">
            
            {/* Soft ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Central Floating Glass Brand Logo Badge */}
            <div className="relative z-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white p-3.5 shadow-[0_12px_35px_rgba(239,68,68,0.3)] border border-white/90 flex items-center justify-center relative">
                <img src="/logo-icon.svg" alt="Networq Global" className="w-full h-full object-contain" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-white/30">
                  403
                </span>
              </div>
            </div>
          </div>

          {/* ── Card Content Body ── */}
          <div className="pt-7 pb-9 px-7 flex flex-col items-center text-center">
            
            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5 leading-snug">
              Access Denied
            </h2>

            <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest mb-4">
              Authorized Personnel Only
            </p>

            <p className="text-xs text-neutral-300 font-normal leading-relaxed mb-7 max-w-[290px]">
              You have attempted to sign in with an unauthorized account. Access to the Admin Gateway is strictly restricted to authorized organization accounts.
            </p>

            {/* ── Action Buttons ── */}
            <div className="w-full space-y-3">
              <button
                onClick={handleRetry}
                className="w-full rounded-full py-3.5 px-6 font-semibold text-xs uppercase tracking-wider bg-white text-neutral-900 hover:bg-neutral-100 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer border border-white/80 shadow-xl"
              >
                {/* Standard Google SVG Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Try Again with Authorized Account</span>
              </button>

              <button
                onClick={onBackToHome}
                className="w-full rounded-full py-2.5 px-5 font-semibold text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Main Website
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
