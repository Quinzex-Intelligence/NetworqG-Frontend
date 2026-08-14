import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Cinematic preloader — brand reveal with GSAP.
 *
 * Sequence:
 *  0.0s – black screen, corner deco lines draw in
 *  0.6s – "NETWORQ" letters animate in one by one (clip-path wipe per char)
 *  1.6s – gold hairline sweeps beneath the word
 *  2.0s – tag-line fades up
 *  2.4s – progress bar fills 0→100 over 1.2s
 *  3.6s – brief hold, then full-page wipe exits upward
 *  4.2s – component unmounts, site revealed
 *
 * @param {function} onComplete – called after exit animation finishes
 */
export default function Preloader({ onComplete }) {
  const rootRef   = useRef(null);
  const lettersRef = useRef([]);
  const word2Ref  = useRef(null);
  const barRef    = useRef(null);
  const tagRef    = useRef(null);
  const progressRef = useRef(null);
  const numRef    = useRef(null);
  const tlRef     = useRef(null);

  useEffect(() => {
    // Prevent scroll during load
    document.documentElement.style.overflow = 'hidden';

    const root     = rootRef.current;
    const letters  = lettersRef.current.filter(Boolean);
    const word2    = word2Ref.current;
    const bar      = barRef.current;
    const tag      = tagRef.current;
    const progress = progressRef.current;
    const numEl    = numRef.current;

    // ── Synchronously set initial states before first paint tick ────────────
    gsap.set(letters, { clipPath: 'inset(0 100% 0 0)', y: 20, opacity: 0 });
    gsap.set(word2, { opacity: 0, y: 12 });
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(tag, { opacity: 0, y: 14 });
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(root.querySelectorAll('.pl-corner-line'), { scaleX: 0, scaleY: 0 });
    gsap.set(root.querySelector('.pl-scan'), { scaleY: 0, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        onComplete?.();
      }
    });
    tlRef.current = tl;

    // ── Corner deco lines ───────────────────────────────────────────────────
    tl.fromTo(
      root.querySelectorAll('.pl-corner-line'),
      { scaleX: 0, scaleY: 0 },
      { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
      0
    );

    // ── Center scan line sweeps top→bottom ─────────────────────────────────
    tl.fromTo(
      root.querySelector('.pl-scan'),
      { scaleY: 0, opacity: 1 },
      { scaleY: 1, duration: 0.5, ease: 'power3.inOut', transformOrigin: 'center top' },
      0
    ).to(
      root.querySelector('.pl-scan'),
      { opacity: 0, duration: 0.4, ease: 'power2.in' },
      0.5
    );

    // ── Letters clip-wipe in ────────────────────────────────────────────────
    tl.fromTo(
      letters,
      { clipPath: 'inset(0 100% 0 0)', y: 20, opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)',
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.055
      },
      0.35
    );

    // ── Underscore hairline draws in ────────────────────────────────────────
    tl.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power3.inOut', transformOrigin: 'left center' },
      0.95
    );

    // ── GLOBAL subtitle fades up after NETWORQ is done ──────────────────────
    tl.fromTo(
      word2,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
      1.1
    );

    // ── Tag line ────────────────────────────────────────────────────────────
    tl.fromTo(
      tag,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      1.3
    );

    // ── Progress bar + number counter ──────────────────────────────────────
    const countObj = { v: 0 };
    tl.fromTo(
      progress,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power1.inOut',
        transformOrigin: 'left center',
        onUpdate() {
          const pct = Math.round(countObj.v);
          if (numEl) numEl.textContent = String(pct).padStart(2, '0');
        }
      },
      1.55
    );
    tl.to(
      countObj,
      { v: 100, duration: 1.2, ease: 'power1.inOut', onUpdate() {
        if (numEl) numEl.textContent = String(Math.round(countObj.v)).padStart(2, '0');
      }},
      1.55
    );

    // ── Brief hold ─────────────────────────────────────────────────────────
    tl.to({}, { duration: 0.3 }, 2.85);

    // ── Horizontal reveal bars sweep out (venetian exit) ───────────────────
    const bands = root.querySelectorAll('.pl-band');
    tl.to(
      bands,
      {
        scaleY: 0,
        duration: 0.6,
        ease: 'power4.inOut',
        stagger: { each: 0.04, from: 'center' },
        transformOrigin: 'center bottom'
      },
      3.15
    );

    // ── Full curtain lifts ──────────────────────────────────────────────────
    tl.to(
      root,
      { yPercent: -100, duration: 0.65, ease: 'power4.inOut' },
      3.6
    );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, [onComplete]);

  // 7 horizontal bands for venetian-blind exit
  const BANDS = Array.from({ length: 7 });
  const WORD  = 'NETWORQ';
  const WORD2 = 'GLOBAL';

  return (
    <div ref={rootRef} className="pl-root" aria-hidden="true">
      {/* Venetian bands */}
      {BANDS.map((_, i) => (
        <div key={i} className="pl-band" style={{ top: `${(i / BANDS.length) * 100}%`, height: `${100 / BANDS.length}%` }} />
      ))}

      {/* Scan line */}
      <div className="pl-scan" />

      {/* Corner decorations */}
      {/* <div className="pl-corner pl-corner--tl">
        <div className="pl-corner-line pl-corner-line--h" />
        <div className="pl-corner-line pl-corner-line--v" />
      </div>
      <div className="pl-corner pl-corner--tr">
        <div className="pl-corner-line pl-corner-line--h" />
        <div className="pl-corner-line pl-corner-line--v" />
      </div>
      <div className="pl-corner pl-corner--bl">
        <div className="pl-corner-line pl-corner-line--h" />
        <div className="pl-corner-line pl-corner-line--v" />
      </div>
      <div className="pl-corner pl-corner--br">
        <div className="pl-corner-line pl-corner-line--h" />
        <div className="pl-corner-line pl-corner-line--v" />
      </div> */}

      {/* Centre stage */}
      <div className="pl-stage">


        {/* Brand word — NETWORQ */}
        <div className="pl-word" aria-label="NETWORQ GLOBAL">
          {WORD.split('').map((char, i) => (
            <span
              key={i}
              ref={el => { lettersRef.current[i] = el; }}
              className="pl-letter"
              style={{ '--i': i }}
            >
              {char}
            </span>
          ))}
        </div>
        {/* Sub-brand word — GLOBAL */}
        <div ref={word2Ref} className="pl-word pl-word-sub" aria-hidden="true" style={{ opacity: 0 }}>
          {WORD2.split('').map((char, i) => (
            <span
              key={i}
              className="pl-letter pl-letter-sub"
              style={{ '--i': i }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Gold hairline below word */}
        <div ref={barRef} className="pl-bar" />

        {/* Tag line */}
        <p ref={tagRef} className="pl-tag">
          Performance · Precision · Results
        </p>
      </div>

      {/* Progress (bottom) */}
      <div className="pl-progress-wrap">
        <div className="pl-progress-track">
          <div ref={progressRef} className="pl-progress-fill" />
        </div>
        <span ref={numRef} className="pl-num">00</span>
      </div>

      {/* Bottom left label */}
      {/* <div className="pl-label-bl">
        <span className="pl-label-mono">Loading Experience</span>
      </div> */}

      {/* Bottom right version */}
      {/* <div className="pl-label-br">
        <span className="pl-label-mono">v2025</span>
      </div> */}
    </div>
  );
}
