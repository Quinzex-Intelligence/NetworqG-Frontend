import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

export default function PalettePicker() {
  const { active, setActiveId, palettes } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  /* Close when clicking outside */
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

  return (
    <div className="palette-picker-wrap" style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="palette-trigger"
        aria-label="Change colour palette"
        aria-expanded={open}
        data-cursor="link"
      >
        <span className="palette-trigger-swatches">
          {active.preview.map((c, i) => (
            <span key={i} className="palette-trigger-swatch" style={{ background: c }} />
          ))}
        </span>
        <span className="palette-trigger-label">Theme</span>
        <svg
          className={`palette-trigger-chevron${open ? ' open' : ''}`}
          width="10" height="10" viewBox="0 0 10 10" fill="none"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      <div
        ref={panelRef}
        className={`palette-panel${open ? ' open' : ''}`}
        role="menu"
        aria-label="Colour palettes"
      >
        <div className="palette-panel-header">
          <span className="palette-panel-eyebrow">Colour Palettes</span>
        </div>
        <div className="palette-grid">
          {palettes.map((p) => {
            const isActive = p.id === active.id;
            return (
              <button
                key={p.id}
                role="menuitem"
                className={`palette-item${isActive ? ' active' : ''}`}
                onClick={() => { setActiveId(p.id); setOpen(false); }}
                data-cursor="link"
                title={p.name}
              >
                {/* dual swatch preview */}
                <span className="palette-item-swatches">
                  <span className="palette-swatch-bg"   style={{ background: p.bg }} />
                  <span className="palette-swatch-accent" style={{ background: p.gold }} />
                </span>
                <span className="palette-item-info">
                  <span className="palette-item-name">{p.name}</span>
                  <span className="palette-item-label">{p.label}</span>
                </span>
                {isActive && (
                  <span className="palette-item-check" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
