import React, { createContext, useContext, useState, useEffect } from 'react';

export const palettes = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    label: 'Default',
    bg: '#04385F',
    bg2: '#054B6E',
    gold: '#FEC74E',
    gold2: '#FEC74E',
    goldDeep: '#FEC74E',
    ink: '#e9e6dc',
    mute: '#9FB5C4',
    line: 'rgba(254, 199, 78, 0.18)',
    // extras used in hardcoded styles
    cardBg: 'rgba(5, 75, 110, 0.65)',
    glassBg: 'rgba(5, 75, 110, 0.45)',
    navBg: 'rgba(5, 75, 110, 0.55)',
    drawerBg: '#054B6E',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(254,199,78,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(254,199,78,0.3), transparent 55%), linear-gradient(135deg,#054B6E,#054B6E)',
    preloaderBg: '#04385F',
    burgerBg: 'rgba(5, 75, 110, 0.8)',
    accentRgb: '254, 199, 78',
    bgRgb: '4, 56, 95',
    bg2Rgb: '5, 75, 110',
    preview: ['#04385F', '#FEC74E'],
    // Globe configuration: blended ocean theme (blues/whites)
    globeDots: [0.65, 0.85, 1.0],
    globeWire: '#0f5a94',
    globeHalo: '#1d76be',
    globeOutline: '#aae0ff',
    globeOutlineHalo: '#1d76be',
    globeCity: '#ffffff',
    globeArc: '#85d0ff',
    globeEarth: '#021e35',
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    label: 'Palette 2',
    bg: '#0D0D0D',
    bg2: '#1A1A1A',
    gold: '#D4AF37',
    gold2: '#F0C040',
    goldDeep: '#B8960C',
    ink: '#F5F0E8',
    mute: '#888880',
    line: 'rgba(212, 175, 55, 0.20)',
    cardBg: 'rgba(26, 26, 26, 0.75)',
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
  {
    id: 'emerald-night',
    name: 'Emerald Night',
    label: 'Palette 3',
    bg: '#071A12',
    bg2: '#0D2B1E',
    gold: '#2ECC71',
    gold2: '#3DDC84',
    goldDeep: '#27AE60',
    ink: '#E8F5EC',
    mute: '#6B9E7A',
    line: 'rgba(46, 204, 113, 0.18)',
    cardBg: 'rgba(13, 43, 30, 0.70)',
    glassBg: 'rgba(10, 35, 22, 0.50)',
    navBg: 'rgba(7, 26, 18, 0.70)',
    drawerBg: '#0D2B1E',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(46,204,113,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(46,204,113,0.3), transparent 55%), linear-gradient(135deg,#0D2B1E,#0D2B1E)',
    preloaderBg: '#071A12',
    burgerBg: 'rgba(13, 43, 30, 0.85)',
    accentRgb: '46, 204, 113',
    bgRgb: '7, 26, 18',
    bg2Rgb: '13, 43, 30',
    preview: ['#071A12', '#2ECC71'],
    // Globe configuration: emerald green
    globeDots: [0.3, 0.85, 0.5],
    globeWire: '#0a3d25',
    globeHalo: '#135232',
    globeOutline: '#3ddc84',
    globeOutlineHalo: '#227c4b',
    globeCity: '#3ddc84',
    globeArc: '#2ecc71',
    globeEarth: '#030c08',
  },
  {
    id: 'crimson-dusk',
    name: 'Crimson Dusk',
    label: 'Palette 4',
    bg: '#1A0508',
    bg2: '#2D0B10',
    gold: '#E84560',
    gold2: '#FF5C7A',
    goldDeep: '#C0334D',
    ink: '#F5E8EA',
    mute: '#9E6B73',
    line: 'rgba(232, 69, 96, 0.18)',
    cardBg: 'rgba(45, 11, 16, 0.70)',
    glassBg: 'rgba(35, 8, 12, 0.50)',
    navBg: 'rgba(26, 5, 8, 0.70)',
    drawerBg: '#2D0B10',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(232,69,96,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(232,69,96,0.3), transparent 55%), linear-gradient(135deg,#2D0B10,#2D0B10)',
    preloaderBg: '#1A0508',
    burgerBg: 'rgba(45, 11, 16, 0.85)',
    accentRgb: '232, 69, 96',
    bgRgb: '26, 5, 8',
    bg2Rgb: '45, 11, 16',
    preview: ['#1A0508', '#E84560'],
    // Globe configuration: crimson red
    globeDots: [0.95, 0.35, 0.45],
    globeWire: '#4d0f17',
    globeHalo: '#6b1d28',
    globeOutline: '#ff5c7a',
    globeOutlineHalo: '#9e2d3d',
    globeCity: '#ff5c7a',
    globeArc: '#e84560',
    globeEarth: '#0a0204',
  },
  {
    id: 'violet-haze',
    name: 'Violet Haze',
    label: 'Palette 5',
    bg: '#0E0618',
    bg2: '#180A2C',
    gold: '#A855F7',
    gold2: '#C084FC',
    goldDeep: '#7C3AED',
    ink: '#EDE8F5',
    mute: '#7B6A9E',
    line: 'rgba(168, 85, 247, 0.18)',
    cardBg: 'rgba(24, 10, 44, 0.70)',
    glassBg: 'rgba(18, 6, 32, 0.50)',
    navBg: 'rgba(14, 6, 24, 0.70)',
    drawerBg: '#180A2C',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(168,85,247,0.3), transparent 55%), linear-gradient(135deg,#180A2C,#180A2C)',
    preloaderBg: '#0E0618',
    burgerBg: 'rgba(24, 10, 44, 0.85)',
    accentRgb: '168, 85, 247',
    bgRgb: '14, 6, 24',
    bg2Rgb: '24, 10, 44',
    preview: ['#0E0618', '#A855F7'],
    // Globe configuration: violet purple
    globeDots: [0.72, 0.45, 0.98],
    globeWire: '#341154',
    globeHalo: '#4d237a',
    globeOutline: '#c084fc',
    globeOutlineHalo: '#7137b3',
    globeCity: '#c084fc',
    globeArc: '#a855f7',
    globeEarth: '#06020c',
  },
  {
    id: 'arctic-steel',
    name: 'Arctic Steel',
    label: 'Palette 6',
    bg: '#0A1628',
    bg2: '#112140',
    gold: '#38BDF8',
    gold2: '#7DD3FC',
    goldDeep: '#0EA5E9',
    ink: '#E8F4FF',
    mute: '#6B8FAE',
    line: 'rgba(56, 189, 248, 0.18)',
    cardBg: 'rgba(17, 33, 64, 0.70)',
    glassBg: 'rgba(12, 24, 48, 0.50)',
    navBg: 'rgba(10, 22, 40, 0.70)',
    drawerBg: '#112140',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at 20% 80%, rgba(56,189,248,0.3), transparent 55%), linear-gradient(135deg,#112140,#112140)',
    preloaderBg: '#0A1628',
    burgerBg: 'rgba(17, 33, 64, 0.85)',
    accentRgb: '56, 189, 248',
    bgRgb: '10, 22, 40',
    bg2Rgb: '17, 33, 64',
    preview: ['#0A1628', '#38BDF8'],
    // Globe configuration: arctic blue
    globeDots: [0.35, 0.78, 0.98],
    globeWire: '#102d4d',
    globeHalo: '#1b4875',
    globeOutline: '#7dd3fc',
    globeOutlineHalo: '#296a9e',
    globeCity: '#7dd3fc',
    globeArc: '#38bdf8',
    globeEarth: '#040a12',
  },
  {
    id: 'reversed-ocean-blue',
    name: 'Reversed Ocean Blue',
    label: 'Palette 7',
    bg: '#FFFFFF', // Pure white
    bg2: '#F4F6F9', // Very soft bluish-gray for sections/cards alternate (originally '#FFFFFF')
    gold: '#F59E0B', // Bright clean orange-gold (originally '#E2A100')
    gold2: '#D97706', // Slightly darker gold
    goldDeep: '#B45309',
    ink: '#0B2C4D', // Deep slate-navy text (originally '#04385F')
    mute: '#4A5568', // Slate gray for muted text (originally '#64748B')
    line: 'rgba(11, 44, 77, 0.08)', // Subtle slate navy borders (originally 'rgba(4, 56, 95, 0.12)')
    cardBg: '#FFFFFF', // Solid white cards over soft background (originally 'rgba(255, 255, 255, 0.85)')
    glassBg: 'rgba(244, 246, 249, 0.70)', // Light glassbg (originally 'rgba(255, 255, 255, 0.60)')
    navBg: 'rgba(255, 255, 255, 0.80)', // White transparent nav (originally 'rgba(255, 255, 255, 0.75)')
    drawerBg: '#FFFFFF',
    caseCoverGrad: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(245,158,11,0.15), transparent 55%), linear-gradient(135deg,#FFFFFF,#FFFFFF)',
    preloaderBg: '#FFFFFF',
    burgerBg: 'rgba(255, 255, 255, 0.85)',
    accentRgb: '245, 158, 11', // rgb of F59E0B (originally '226, 161, 0')
    bgRgb: '255, 255, 255',
    bg2Rgb: '244, 246, 249', // rgb of F4F6F9
    preview: ['#FFFFFF', '#0B2C4D'],
    // Globe configuration: vivid ocean blue on white — high contrast
    globeDots: [0.04, 0.28, 0.55],      // Strong ocean blue dots
    globeWire: '#6ba8cc',               // Visible mid-blue wireframe grid
    globeHalo: '#2563eb',               // Rich blue atmospheric glow
    globeOutline: '#083e66',            // Very dark navy continent outlines
    globeOutlineHalo: '#3b82f6',        // Electric blue outline bloom
    globeCity: '#d97706',               // Amber/gold cities
    globeArc: '#1d4ed8',                // Vivid blue arcs
    globeEarth: '#deedf7',              // Light ice-blue sphere (not white — gives depth)
  },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [activeId, setActiveId] = useState(() => {
    try { return localStorage.getItem('ng-palette') || 'ocean-blue'; } catch { return 'ocean-blue'; }
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
