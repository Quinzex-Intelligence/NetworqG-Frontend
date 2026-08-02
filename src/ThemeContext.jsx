import React, { createContext, useContext, useState, useEffect } from 'react';

export const palettes = [
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    label: 'Default',
    bg: '#0D0D0D',
    bg2: '#1A1A1A',
    gold: '#D4AF37',
    gold2: '#F0C040',
    goldDeep: '#B8960C',
    ink: '#F5F0E8',
    mute: '#F5F0E8',
    line: 'rgba(212, 175, 55, 0.20)',
    cardBg: 'rgba(15, 15, 15, 0.94)',
    glassBg: 'rgba(20, 20, 20, 0.55)',
    navBg: 'rgba(13, 13, 13, 0.75)',
    drawerBg: '#1A1A1A',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(212,175,55,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(212,175,55,0.3), transparent 55%), linear-gradient(135deg,#1A1A1A,#1A1A1A)',
    preloaderBg: '#0D0D0D',
    burgerBg: 'rgba(26, 26, 26, 0.85)',
    accentRgb: '212, 175, 55',
    bgRgb: '13, 13, 13',
    bg2Rgb: '26, 26, 26',
    preview: ['#0D0D0D', '#D4AF37'],
    // Globe configuration: gold & black
    globeDots: [0.96, 0.78, 0.32],
    globeWire: '#4a3e21',
    globeHalo: '#8a6d25',
    globeOutline: '#f5d580',
    globeOutlineHalo: '#a88530',
    globeCity: '#f5d77a',
    globeArc: '#d4a847',
    globeEarth: '#060606',
  },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [activeId, setActiveId] = useState(() => {
    try { return localStorage.getItem('ng-palette') || 'midnight-gold'; } catch { return 'midnight-gold'; }
  });

  const active = palettes.find((p) => p.id === activeId) || palettes[0];

  useEffect(() => {
    const p = active;
    const root = document.documentElement;
    root.style.setProperty('--bg',        p.bg);
    root.style.setProperty('--bg-2',      p.bg2);
    root.style.setProperty('--gold',      p.gold);
    root.style.setProperty('--gold-2',    p.gold2);
    root.style.setProperty('--gold-deep', p.goldDeep);
    root.style.setProperty('--ink',       p.ink);
    root.style.setProperty('--mute',      p.mute);
    root.style.setProperty('--line',      p.line);
    // rgba helpers
    root.style.setProperty('--accent-rgb', p.accentRgb);
    root.style.setProperty('--bg-rgb',     p.bgRgb);
    root.style.setProperty('--bg2-rgb',    p.bg2Rgb);
    // component-level
    root.style.setProperty('--card-bg',    p.cardBg);
    root.style.setProperty('--glass-bg',   p.glassBg);
    root.style.setProperty('--nav-bg',     p.navBg);
    root.style.setProperty('--drawer-bg',  p.drawerBg);

    document.body.style.background = p.bg;
    document.body.style.color = p.ink;

    try { localStorage.setItem('ng-palette', p.id); } catch {}
  }, [active]);

  return (
    <ThemeContext.Provider value={{ active, setActiveId, palettes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
