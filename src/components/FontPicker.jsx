import React, { useState, useRef, useEffect } from 'react';

// ─── Font combination definitions ─────────────────────────────────────────────
export const FONT_COMBOS = [
  {
    id: 'combo-1',
    name: 'Premium Agency',
    display: 'Outfit',
    body: 'Plus Jakarta Sans',
    mono: 'JetBrains Mono',
    displayFont: "'Outfit', 'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    headingTracking: '-0.02em',
    tag: 'Modern · Clean',
  },
  {
    id: 'combo-2',
    name: 'Tech Forward',
    display: 'Space Grotesk',
    body: 'Inter',
    mono: 'JetBrains Mono',
    displayFont: "'Space Grotesk', 'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    headingTracking: '-0.025em',
    tag: 'Engineered · Sharp',
  },
  {
    id: 'combo-3',
    name: 'Bold Creative',
    display: 'Syne',
    body: 'DM Sans',
    mono: 'Fira Code',
    displayFont: "'Syne', 'DM Sans', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
    monoFont: "'Fira Code', monospace",
    headingTracking: '-0.01em',
    tag: 'Impact · Expressive',
  },
  {
    id: 'combo-4',
    name: 'Friendly Corporate',
    display: 'Manrope',
    body: 'Nunito Sans',
    mono: 'JetBrains Mono',
    displayFont: "'Manrope', 'Nunito Sans', sans-serif",
    bodyFont: "'Nunito Sans', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    headingTracking: '-0.015em',
    tag: 'Warm · Approachable',
  },
  {
    id: 'combo-5',
    name: 'Futuristic Brand',
    display: 'Exo 2',
    body: 'Source Sans 3',
    mono: 'JetBrains Mono',
    displayFont: "'Exo 2', 'Source Sans 3', sans-serif",
    bodyFont: "'Source Sans 3', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    headingTracking: '0em',
    tag: 'Future · Performance',
  },
];

const STORAGE_KEY = 'ng-active-font-combo';

// Apply a combo to the document root CSS variables
function applyCombo(combo) {
  const root = document.documentElement;
  root.style.setProperty('--main-font', combo.bodyFont);
  root.style.setProperty('--pragraph-font', combo.bodyFont);
  root.style.setProperty('--display-font', combo.displayFont);
  root.style.setProperty('--mono-font', combo.monoFont);

  // Remove existing override tag if present, then re-append so it always
  // sits LAST in <head> — after Tailwind's compiled stylesheet — guaranteeing
  // our !important declarations win the specificity + order cascade.
  const existing = document.getElementById('ng-font-override');
  if (existing) existing.remove();

  const tag = document.createElement('style');
  tag.id = 'ng-font-override';
  tag.textContent = `
    /* ── Networq Font Override ── applied last so !important wins ── */

    /* Tag-level overrides */
    h1, h2, h3, h4, h5, h6 {
      font-family: ${combo.displayFont} !important;
      letter-spacing: ${combo.headingTracking} !important;
    }
    html, body,
    p, a, span, div, button, input, textarea, select,
    li, td, th, label, blockquote, figcaption {
      font-family: ${combo.bodyFont} !important;
    }
    code, pre {
      font-family: ${combo.monoFont} !important;
    }

    /* Tailwind compiled font utility class overrides */
    .font-display {
      font-family: ${combo.displayFont} !important;
      letter-spacing: ${combo.headingTracking} !important;
    }
    .font-sans {
      font-family: ${combo.bodyFont} !important;
    }
    .font-mono {
      font-family: ${combo.monoFont} !important;
    }
  `;
  document.head.appendChild(tag);
}

export default function FontPicker() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'combo-1';
  });
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const activeCombo = FONT_COMBOS.find((c) => c.id === activeId) || FONT_COMBOS[0];

  // Apply on mount + whenever activeId changes
  useEffect(() => {
    applyCombo(activeCombo);
    localStorage.setItem(STORAGE_KEY, activeId);
  }, [activeId, activeCombo]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current  && !btnRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (id) => {
    setActiveId(id);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        aria-label="Change font combination"
        aria-expanded={open}
        data-cursor="link"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 10px',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: open ? 'var(--gold)' : 'rgba(212,175,55,0.25)',
          background: open ? 'rgba(212,175,55,0.08)' : 'transparent',
          color: open ? 'var(--gold)' : 'var(--ink)',
          fontSize: '12px',
          fontFamily: 'inherit',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Tiny Aa glyph */}
        <span style={{
          fontSize: '13px',
          fontFamily: activeCombo.displayFont,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--gold)',
        }}>
          Aa
        </span>
        <span style={{ fontSize: '11px', fontWeight: 500 }}>Font</span>
        <svg
          width="9" height="9" viewBox="0 0 10 10" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        ref={panelRef}
        role="menu"
        aria-label="Font combinations"
        style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '260px',
          background: 'var(--bg-2, #1A1A1A)',
          border: '1px solid rgba(212,175,55,0.18)',
          borderRadius: '14px',
          padding: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          zIndex: 9999,
        }}
      >
        {/* Panel header */}
        <div style={{
          padding: '6px 10px 8px',
          borderBottom: '1px solid rgba(212,175,55,0.12)',
          marginBottom: '6px',
        }}>
          <span style={{
            fontSize: '9px',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--mute, #888880)',
          }}>
            Typography
          </span>
        </div>

        {/* Combo list */}
        {FONT_COMBOS.map((combo) => {
          const isActive = combo.id === activeId;
          return (
            <button
              key={combo.id}
              role="menuitem"
              data-cursor="link"
              onClick={() => handleSelect(combo.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 10px',
                borderRadius: '9px',
                border: '1px solid',
                borderColor: isActive ? 'rgba(212,175,55,0.35)' : 'transparent',
                background: isActive ? 'rgba(212,175,55,0.07)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
                marginBottom: '2px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {/* Font preview glyph */}
              <span style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: combo.displayFont,
                fontWeight: 700,
                fontSize: '15px',
                color: isActive ? 'var(--gold)' : 'var(--ink)',
                flexShrink: 0,
                letterSpacing: combo.headingTracking,
              }}>
                Aa
              </span>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isActive ? 'var(--gold)' : 'var(--ink)',
                  fontFamily: combo.displayFont,
                  lineHeight: 1.3,
                  letterSpacing: combo.headingTracking,
                }}>
                  {combo.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--mute, #888880)',
                  marginTop: '1px',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.04em',
                }}>
                  {combo.display} · {combo.body}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: 'rgba(212,175,55,0.6)',
                  marginTop: '2px',
                  fontFamily: 'inherit',
                  letterSpacing: '0.06em',
                }}>
                  {combo.tag}
                </div>
              </div>

              {/* Active checkmark */}
              {isActive && (
                <span style={{ color: 'var(--gold)', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}

        {/* Footer note */}
        <div style={{
          padding: '8px 10px 4px',
          borderTop: '1px solid rgba(212,175,55,0.10)',
          marginTop: '4px',
          fontSize: '9px',
          color: 'var(--mute, #888880)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          Live preview · Pick one to finalize
        </div>
      </div>
    </div>
  );
}
