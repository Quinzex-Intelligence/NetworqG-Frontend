import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Preloader from './components/Preloader';
import StageCanvas from './components/StageCanvas';
import Cursor from './components/Cursor';
import ScrollRail from './components/ScrollRail';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Work from './components/Work';
import About from './components/About';
import Insights from './components/Insights';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import ServicePage from './components/ServicePage';
import CareersPage from './components/CareersPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import WorkPage from './components/WorkPage';
import ServicesPage from './components/ServicesPage';
import BlogsPage from './components/BlogsPage';
import BlogDetailPage from './components/BlogDetailPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import AccessDeniedPage from './components/AccessDeniedPage';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(() => {
    const isLoggingIn = sessionStorage.getItem('logging_in') === 'true';
    const savedPage = sessionStorage.getItem('current_page');
    let showedToday = false;
    try {
      const lastShowedDate = localStorage.getItem('ng-last-preloader-date');
      const todayDate = new Date().toDateString();
      showedToday = lastShowedDate === todayDate;
    } catch (e) {}
    return isLoggingIn || savedPage === 'admin' || showedToday;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname || '';
    const search = window.location.search || '';
    if (path.includes('error') || path.includes('403') || search.includes('error') || search.includes('403') || search.includes('forbidden')) {
      return 'access-denied';
    }
    const saved = sessionStorage.getItem('current_page');
    if (saved === 'login') {
      sessionStorage.removeItem('current_page');
      return 'home';
    }
    return saved || 'home';
  });
  const [transitionState, setTransitionState] = useState('idle'); // idle, fading-out, fading-in
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const lenisRef = useRef(null);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        if (sessionStorage.getItem('logging_in') === 'true') {
          sessionStorage.removeItem('logging_in');
          setCurrentPage('admin');
          sessionStorage.setItem('current_page', 'admin');
          setPreloaderDone(true);
        }
      } else {
        if (sessionStorage.getItem('logging_in') === 'true') {
          sessionStorage.removeItem('logging_in');
          setPreloaderDone(true);
          const isForbidden = res.status === 403 || window.location.search.includes('error') || window.location.pathname.includes('error');
          setCurrentPage(isForbidden ? 'access-denied' : 'login');
          sessionStorage.removeItem('current_page');
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      if (sessionStorage.getItem('logging_in') === 'true') {
        sessionStorage.removeItem('logging_in');
        setPreloaderDone(true);
        const isForbidden = window.location.search.includes('error') || window.location.pathname.includes('error');
        setCurrentPage(isForbidden ? 'access-denied' : 'login');
        sessionStorage.removeItem('current_page');
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect handling
  useEffect(() => {
    if (!preloaderDone) return;
    if (currentPage === 'login' && isAuthenticated) {
      navigateToPage('admin');
    } else if (currentPage === 'admin' && !isAuthenticated && !authLoading) {
      navigateToPage('login');
    }
  }, [currentPage, isAuthenticated, authLoading, preloaderDone]);

  // Shared mutable ref for Three.js canvas targets — bypasses React render cycle on every scroll tick
  const stageRef = useRef({
    bShatter: 0, bOrbit: 0, bConstellation: 0, bField: 0, bVortex: 0, bWave: 0, bHelix: 0, bText: 0,
    globeX: 1.6, globeY: 0.3, globeScale: 1.0,
    globeOpacity: 1, arcsOpacity: 1, citiesOpacity: 1,
    morphOpacity: 0, morphIndex: 0,
    morphPosX: 0, morphPosY: 0, morphScale: 1
  });

  const scrollToSection = (id) => {
    const targetEl = document.getElementById(id);
    if (targetEl && lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, { duration: 1.1 });
    }
  };

  const handleNavScroll = (id) => {
    if (currentPage !== 'home') {
      navigateToPage({ type: 'home-scroll', sectionId: id });
    } else {
      scrollToSection(id);
    }
  };

  const navigateToPage = useCallback((pageName, isPopState = false) => {
    const targetStr = typeof pageName === 'string' ? pageName : (pageName?.type === 'home-scroll' ? 'home' : '');
    if (!targetStr || targetStr === currentPage || transitionState !== 'idle') return;
    
    if (!isPopState) {
      const urlHash = targetStr === 'home' ? window.location.pathname : `#${targetStr}`;
      window.history.pushState({ page: targetStr }, '', urlHash);
    }

    setTransitionState('fading-out');
    
    // Temporary speed up of WebGL particles (warp effect)
    gsap.to(stageRef.current, {
      warpSpeed: 1.0,
      duration: 0.25,
      ease: 'power2.inOut'
    });

    // Hold page transition and change state at midpoint
    setTimeout(() => {
      if (typeof pageName === 'string') {
        setCurrentPage(pageName);
        if (pageName === 'login') {
          sessionStorage.removeItem('current_page');
        } else {
          sessionStorage.setItem('current_page', pageName);
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (pageName && pageName.type === 'home-scroll') {
        setCurrentPage('home');
        sessionStorage.setItem('current_page', 'home');
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
          const targetEl = document.getElementById(pageName.sectionId);
          if (targetEl) {
            if (lenisRef.current) {
              lenisRef.current.scrollTo(targetEl, { duration: 0.9, immediate: false });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 120);
      }
      
      // Set fading-in: content is at scale(1.02) opacity 0, transition:none
      setTransitionState('fading-in');

      // Decelerate particles back to normal speed
      gsap.to(stageRef.current, {
        warpSpeed: 0,
        duration: 0.35,
        ease: 'power2.out'
      });

      // Wait two animation frames so the browser commits fading-in paint
      // before we add the CSS transition back for the smooth fade-in to idle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionState('idle');
        });
      });

    }, 250);
  }, [currentPage, transitionState]);

  // Sync React page navigation with browser back/forward history buttons
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '', window.location.pathname);
    }

    const handlePopState = (e) => {
      const targetPage = e.state?.page || 'home';
      navigateToPage(targetPage, true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateToPage]);

  // Called when the preloader animation finishes — safe to start all scroll/GSAP logic
  const handlePreloaderComplete = useCallback(() => {
    try {
      localStorage.setItem('ng-last-preloader-date', new Date().toDateString());
    } catch (e) {}
    setPreloaderDone(true);
  }, []);

  // ── Stamp js-ready IMMEDIATELY on first mount ─────────────────────────────
  // This puts all [data-anim] / [data-split] elements into their CSS-hidden
  // pre-animation state immediately, while the preloader overlay covers them.
  // When the preloader exits, they are already hidden — no flash.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('js-ready');
    return () => document.body.classList.remove('js-ready');
  }, []);

  useEffect(() => {
    if (!preloaderDone) return;
    // js-ready already set; ScrollTrigger already registered above

    if (currentPage !== 'home') {
      let targetStage = {
        bShatter: 0, bOrbit: 0, bConstellation: 0, bField: 0, bVortex: 0, bWave: 0, bHelix: 0, bText: 0,
        globeX: 0, globeY: -0.2, globeScale: 0.85,
        globeOpacity: 0.6, arcsOpacity: 0.4, citiesOpacity: 0.5,
        morphOpacity: 0
      };

      if (currentPage === 'careers') {
        targetStage.bHelix = 0.7;
      } else if (currentPage.startsWith('blog-')) {
        targetStage.bField = 0.3;
        targetStage.globeOpacity = 0.15;
        targetStage.arcsOpacity = 0.1;
        targetStage.citiesOpacity = 0.15;
      } else if (currentPage === 'blogs') {
        targetStage.bField = 0.7;
      } else if (currentPage === 'contact') {
        targetStage.bVortex = 0.7;
      } else if (currentPage === 'about') {
        targetStage.bConstellation = 0.7;
      } else if (currentPage === 'work') {
        targetStage.bField = 0.7;
      } else if (currentPage === 'services') {
        targetStage.bOrbit = 0.7;
      } else if (currentPage === 'login') {
        targetStage.bVortex = 0;
        targetStage.bConstellation = 0.3;
        targetStage.globeX = 0;
        targetStage.globeY = -0.2;
        targetStage.globeScale = 0.7;
        targetStage.globeOpacity = 0.15;
        targetStage.arcsOpacity = 0.1;
        targetStage.citiesOpacity = 0.1;
      } else if (currentPage === 'admin') {
        targetStage.bConstellation = 0.8;
        targetStage.globeX = 0;
        targetStage.globeY = -0.3;
        targetStage.globeScale = 0.6;
        targetStage.globeOpacity = 0.1;
      } else if (currentPage === 'service-brand-creative') {
        targetStage.bOrbit = 0.7;
      } else if (currentPage === 'service-social-media') {
        targetStage.bShatter = 0.7;
      } else if (currentPage === 'service-performance-marketing') {
        targetStage.bVortex = 0.7;
      } else if (currentPage === 'service-seo-services') {
        targetStage.bField = 0.7;
      } else if (currentPage === 'service-website-services') {
        targetStage.bWave = 0.7;
      } else if (currentPage === 'service-content-marketing') {
        targetStage.bConstellation = 0.7;
      } else if (currentPage === 'service-video-multimedia') {
        targetStage.bHelix = 0.7;
      } else if (currentPage === 'service-email-automation') {
        targetStage.bVortex = 0.7;
      } else if (currentPage === 'service-business-growth') {
        targetStage.bHelix = 0.7;
      } else if (currentPage === 'service-local-business') {
        targetStage.bOrbit = 0.7;
      } else if (currentPage === 'service-emerging-services') {
        targetStage.bField = 0.7;
      }

      Object.assign(stageRef.current, targetStage);

      const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.08
      });
      lenis.on('scroll', ScrollTrigger.update);
      lenisRef.current = lenis;

      const tickLenis = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickLenis);
      gsap.ticker.lagSmoothing(0);

      // ScrollTrigger to animate particles into the NETWORQ logo text on subpage footers
      ScrollTrigger.create({
        trigger: '#footer',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 0.5,
        fastScrollEnd: true,
        onUpdate: ({ progress: p }) => {
          const mainShape = currentPage === 'careers' ? 'bHelix'
                          : currentPage === 'contact' ? 'bVortex'
                          : currentPage === 'about' ? 'bConstellation'
                          : currentPage === 'work' ? 'bField'
                          : currentPage === 'services' ? 'bOrbit'
                          : currentPage === 'service-brand-creative' ? 'bOrbit'
                          : currentPage === 'service-social-media' ? 'bShatter'
                          : currentPage === 'service-performance-marketing' ? 'bVortex'
                          : currentPage === 'service-seo-services' ? 'bField'
                          : currentPage === 'service-website-services' ? 'bWave'
                          : currentPage === 'service-content-marketing' ? 'bConstellation'
                          : currentPage === 'service-video-multimedia' ? 'bHelix'
                          : currentPage === 'service-email-automation' ? 'bVortex'
                          : currentPage === 'service-business-growth' ? 'bHelix'
                          : currentPage === 'service-local-business' ? 'bOrbit'
                          : currentPage === 'service-emerging-services' ? 'bField'
                          : '';

          let updateObj = {
            bText: p,
            globeOpacity: 0.6 * (1 - p),
            citiesOpacity: 0.5 * (1 - p),
            arcsOpacity: 0.4 * (1 - p),
            globeScale: 0.85 + p * 0.15
          };
          if (mainShape) {
            updateObj[mainShape] = 0.7 * (1 - p);
          }
          Object.assign(stageRef.current, updateObj);
        }
      });

      return () => {
        lenis.destroy();
        gsap.ticker.remove(tickLenis);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    // ─── Lenis smooth scroll ────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08
    });
    lenis.on('scroll', ScrollTrigger.update);
    lenisRef.current = lenis;

    const tickLenis = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickLenis);
    gsap.ticker.lagSmoothing(0);

    // ─── Manual word-split for heading reveals ──────────────────────────────
    const splitEls = document.querySelectorAll('[data-split]');
    splitEls.forEach((el) => {
      const walk = (node) => {
        const out = [];
        node.childNodes.forEach((child) => {
          if (child.nodeType === 3) {
            child.textContent.split(/(\s+)/).forEach((w) => {
              if (/^\s+$/.test(w)) {
                out.push(document.createTextNode(w));
              } else if (w.length) {
                const wrap = document.createElement('span');
                wrap.className = 'word';
                const inner = document.createElement('span');
                inner.textContent = w;
                wrap.appendChild(inner);
                out.push(wrap);
              }
            });
          } else if (child.nodeType === 1) {
            const clone = child.cloneNode(false);
            walk(child).forEach((n) => clone.appendChild(n));
            out.push(clone);
          }
        });
        return out;
      };

      try {
        const nodes = walk(el);
        el.innerHTML = '';
        nodes.forEach((n) => el.appendChild(n));
      } catch (_) {
        el.classList.add('split-played');
        return;
      }

      const playEl = (target) => {
        target.querySelectorAll('.word > span').forEach((s, i) => {
          s.style.transitionDelay = i * 0.04 + 's';
        });
        target.classList.add('split-played');
      };

      // If already in view, reveal immediately
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setTimeout(() => playEl(el), 80);
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,                // ← fires once then self-kills
          onEnter: () => playEl(el)
        });
      }
    });

    // ─── Batch reveal: fade-up & stagger ────────────────────────────────────
    // ScrollTrigger.batch groups elements into a single IntersectionObserver
    // instead of one ST instance per element — much cheaper at scale.
    ScrollTrigger.batch('[data-anim="fade-up"]', {
      start: 'top 95%',
      once: true,
      onEnter: (batch) => batch.forEach((el) => el.classList.add('is-in'))
    });

    ScrollTrigger.batch('[data-stagger]', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        batch.forEach((grid) => {
          Array.from(grid.children).forEach((child, i) => {
            child.style.transitionDelay = i * 0.08 + 's';
          });
          grid.classList.add('is-in');
        });
      }
    });

    // ─── Parallax (cached BCR — no layout thrash per frame) ─────────────────
    // We cache each element's "base" offset once, then update only on scroll
    // via ScrollTrigger's onUpdate, not on every rAF tick.
    const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]')).map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax) || 0
    }));

    const applyParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(({ el, speed }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        const ty = ((r.top + r.height / 2) - vh / 2) * speed * -1;
        el.style.transform = `translate3d(0,${ty.toFixed(1)}px,0)`;
      });
    };

    // Run on scroll only — no per-frame ticker needed for parallax
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: applyParallax
    });
    applyParallax(); // initial position

    // ─── Drift-up scrub ─────────────────────────────────────────────────────
    document.querySelectorAll('.drift-up').forEach((el) => {
      gsap.fromTo(el, { y: 40 }, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          fastScrollEnd: true
        }
      });
    });

    // ─── Stat counters ───────────────────────────────────────────────────────
    document.querySelectorAll('.stat-num').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.textContent.replace(/[\d.]/g, '');
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = (target >= 100
                ? Math.round(obj.v).toLocaleString()
                : obj.v.toFixed(1)) + suffix;
            }
          });
        }
      });
    });

    // ─── 3D card tilt ───────────────────────────────────────────────────────
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach((card) => {
      let rect = null;
      const onEnter = () => { rect = card.getBoundingClientRect(); };
      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
        const inner = card.querySelector('.tilt-inner');
        if (inner) inner.style.transform = `translate3d(${x * 8}px,${y * 6}px,0)`;
      };
      const onLeave = () => {
        rect = null;
        card.style.transform = '';
        const inner = card.querySelector('.tilt-inner');
        if (inner) inner.style.transform = '';
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      card._clean = () => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      };
    });

    // ─── Responsive anchor helpers ───────────────────────────────────────────
    const getHeroAnchor = () => {
      const w = window.innerWidth;
      if (w < 640)  return { x: 0.85, y: 0.95, s: 0.82 };
      if (w < 1024) return { x: 1.25, y: -0.20, s: 0.88 };
      return              { x: 1.80, y: -0.20, s: 0.95 };
    };
    const getCornerAnchor = () => {
      const w = window.innerWidth;
      if (w < 640)  return { x: 0.0, y:  1.3, s: 0.40 };
      if (w < 1024) return { x: 1.6, y: -0.4, s: 0.50 };
      return              { x: 2.2, y: -0.5, s: 0.55 };
    };

    let HERO   = getHeroAnchor();
    let CORNER = getCornerAnchor();

    const set = (target) => Object.assign(stageRef.current, target);

    set({
      globeX: HERO.x, globeY: HERO.y, globeScale: HERO.s,
      globeOpacity: currentPage === 'home' ? 1 : 0,
      arcsOpacity: currentPage === 'home' ? 1 : 0,
      citiesOpacity: currentPage === 'home' ? 1 : 0,
      morphOpacity: 0,
      bShatter: 0, bOrbit: 0, bConstellation: 0, bField: 0, bVortex: 0, bWave: 0, bHelix: 0, bText: 0
    });

    if (currentPage === 'login') {
      set({
        globeX: 0, globeY: 0, globeScale: 0.85,
        globeOpacity: 0.35, arcsOpacity: 0.15, citiesOpacity: 0.15,
        bVortex: 0.85, bHelix: 0.2
      });
      return;
    }

    if (currentPage === 'admin') {
      set({
        globeX: 0, globeY: -0.3, globeScale: 0.6,
        globeOpacity: 0.1, arcsOpacity: 0, citiesOpacity: 0,
        bConstellation: 0.8
      });
      return;
    }

    if (currentPage !== 'home') return;

    // ─── Single resize handler ───────────────────────────────────────────────
    const onResize = () => {
      HERO   = getHeroAnchor();
      CORNER = getCornerAnchor();
      applyParallax();
      ScrollTrigger.refresh();
      set({
        globeX: HERO.x,
        globeY: HERO.y,
        globeScale: HERO.s
      });
    };
    window.addEventListener('resize', onResize);

    // ─── Stage canvas scroll choreography ───────────────────────────────────
    // All scrub triggers use fastScrollEnd: true so they settle immediately
    // when fast-scrolling, avoiding stale intermediate states.

    ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      fastScrollEnd: true,
      onUpdate: ({ progress: p }) => set({
        globeX: HERO.x - p * 0.4,
        globeY: HERO.y - p * 0.3,
        globeScale: HERO.s * (1 - p * 0.10),
        globeOpacity: 1,
        arcsOpacity: 1,
        citiesOpacity: 1,
        bOrbit: 0,
        bShatter: 0,
        bConstellation: 0,
        bField: 0,
        bVortex: 0,
        bWave: 0,
        bHelix: 0,
        bText: 0,
        morphOpacity: 0
      })
    });

    ScrollTrigger.create({
      trigger: '#services',
      start: 'top 85%',
      end: 'bottom top',
      scrub: 0.5,
      fastScrollEnd: true,
      onUpdate: ({ progress: p }) => {
        const o = Math.sin(Math.min(1, p * 1.6) * Math.PI * 0.7);
        set({
          bShatter: 0, bOrbit: o, bField: 0,
          globeOpacity: Math.max(0, 1 - o * 1.2),
          arcsOpacity: Math.max(0, 1 - o * 1.5),
          citiesOpacity: Math.max(0, 1 - o * 1.5),
          globeX: HERO.x * (1 - o),
          globeY: HERO.y * (1 - o),
          globeScale: HERO.s
        });
      }
    });

    // Process section — pinned morph scene
    const updateProcessAnchor = () => {
      const a = document.getElementById('process-anchor');
      if (!a) return;
      const rect = a.getBoundingClientRect();
      const w = window.innerWidth, h = window.innerHeight;
      const ndcX = ((rect.left + rect.width / 2) / w) * 2 - 1;
      const ndcY = -(((rect.top + rect.height / 2) / h) * 2 - 1);
      const halfH = Math.tan((38 * Math.PI / 180) / 2) * 7;
      const halfW = halfH * (w / h);
      set({
        morphPosX: ndcX * halfW * 0.7,
        morphPosY: ndcY * halfH * 0.7,
        morphScale: Math.min((rect.width / w) * 2.2, 1.2)
      });
    };

    const procNames = ['UNDERSTAND', 'RESEARCH', 'IDEATE', 'DESIGN', 'RESULTS'];
    ScrollTrigger.create({
      trigger: '#process-pin',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      fastScrollEnd: true,
      onUpdate: ({ progress: p }) => {
        const idx = Math.min(4, Math.floor(p * 5));
        set({
          bShatter: 0, bOrbit: 0, bField: 0, bConstellation: 0, bVortex: 0,
          globeOpacity: 0, arcsOpacity: 0, citiesOpacity: 0,
          morphOpacity: 1,
          morphIndex: Math.min(3, p * 3)
        });
        updateProcessAnchor();

        // Direct DOM updates — avoids React re-renders for rapid scrub values
        document.querySelectorAll('.proc-step').forEach((s, i) =>
          s.classList.toggle('active', i === idx)
        );
        document.querySelectorAll('#process-dots div').forEach((d, i) =>
          d.classList.toggle('on', i === idx)
        );
        const procLabel = document.getElementById('process-label');
        const phaseNum  = document.getElementById('phase-num');
        const progress  = document.getElementById('process-progress');
        const procNumeral = document.getElementById('process-numeral');
        if (procLabel) procLabel.textContent = procNames[idx];
        if (phaseNum)  phaseNum.textContent  = String(idx + 1).padStart(2, '0');
        if (procNumeral) procNumeral.textContent = String(idx + 1).padStart(2, '0');
        if (progress)  progress.style.transform = `scaleX(${p})`;
      }
    });

    if (document.getElementById('work')) {
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        fastScrollEnd: true,
        onUpdate: ({ progress: p }) => {
          const wVal = Math.sin(Math.min(1, p * 1.4) * Math.PI * 0.7);
          set({ bWave: wVal, bOrbit: 0, morphOpacity: Math.max(0, 1 - p * 2.5), globeOpacity: 0 });
        }
      });
    }

    if (document.getElementById('about')) {
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        fastScrollEnd: true,
        onUpdate: ({ progress: p }) => {
          const c = Math.sin(Math.min(1, p * 1.5) * Math.PI * 0.65);
          set({
            bWave: Math.max(0, 1 - p * 2), bConstellation: c,
            globeOpacity: c * 0.45,
            globeX: CORNER.x, globeY: CORNER.y, globeScale: CORNER.s,
            arcsOpacity: c * 0.5, citiesOpacity: c * 0.7
          });
        }
      });
    }

    ScrollTrigger.create({
      trigger: '#insights',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      fastScrollEnd: true,
      onUpdate: ({ progress: p }) => {
        const h = Math.sin(Math.min(1, p * 1.4) * Math.PI * 0.7);
        set({ bConstellation: Math.max(0, 1 - p * 2), bHelix: h, globeOpacity: 0 });
      }
    });

    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      fastScrollEnd: true,
      onUpdate: ({ progress: p }) => {
        if (stageRef.current.bText > 0.01) return;
        const v = Math.sin(Math.min(1, p * 1.4) * Math.PI * 0.7);
        set({ bHelix: Math.max(0, 1 - p * 1.6), bVortex: v, bText: 0 });
      }
    });

    ScrollTrigger.create({
      trigger: '#footer',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.5,
      fastScrollEnd: true,
      onUpdate: ({ progress: p }) => {
        set({
          // zero out all other shapes so only text forms
          bShatter: 0, bOrbit: 0, bConstellation: 0,
          bField: 0, bVortex: 0, bWave: 0, bHelix: 0,
          bText: p,
          globeOpacity: 0,
          citiesOpacity: 0,
          arcsOpacity: 0,
          morphOpacity: 0,
          globeScale: 1.0   // reset scale so text renders at full size
        });
      }
    });

    // ─── Scroll-rail section tracker ────────────────────────────────────────
    const sectionEls = Array.from(document.querySelectorAll('main > section[data-section]'));
    const edgeChip = document.getElementById('edge-chip');
    sectionEls.forEach((s, idx) => {
      ScrollTrigger.create({
        trigger: s,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: ({ isActive }) => {
          if (!isActive) return;
          setActiveIndex(idx);
          if (edgeChip) {
            const chipText = s.getAttribute('data-edge-chip') || '';
            if (chipText) {
              edgeChip.textContent = chipText;
              edgeChip.classList.add('show');
            } else {
              edgeChip.classList.remove('show');
            }
          }
        }
      });
    });

    // Refresh after first paint
    setTimeout(() => ScrollTrigger.refresh(), 250);

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickLenis);
      window.removeEventListener('resize', onResize);
      tiltCards.forEach((card) => card._clean?.());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [preloaderDone, currentPage]);

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <div className={`site-reveal${preloaderDone ? ' site-reveal--in' : ''}`}>
        <Cursor />
        <div id="edge-chip" className={`edge-chip${currentPage !== 'home' && currentPage !== 'login' && currentPage !== 'access-denied' ? ' show' : ''}`}>
          {currentPage === 'home'
            ? '00 · INDEX'
            : currentPage === 'careers'
            ? 'CAREERS'
            : currentPage === 'blogs' || currentPage.startsWith('blog-')
            ? 'FIELD NOTES'
            : currentPage === 'contact'
            ? 'CONTACT'
            : currentPage === 'about'
            ? 'ABOUT'
            : currentPage === 'work'
            ? 'WORK'
            : currentPage === 'services'
            ? 'SERVICES'
            : currentPage === 'login' || currentPage === 'access-denied'
            ? ''
            : currentPage === 'admin'
            ? 'ADMIN DIRECTORY'
            : 'SERVICES'}
        </div>
        <StageCanvas stageRef={stageRef} />
        {currentPage === 'home' && (
          <ScrollRail activeIndex={activeIndex} onDotClick={scrollToSection} />
        )}
        {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'access-denied' && (
          <Header
            onLinkClick={handleNavScroll}
            onPageChange={navigateToPage}
            currentPage={currentPage}
            isAuthenticated={isAuthenticated}
          />
        )}
        <div className={`transition-content tr-${transitionState}`}>
          <main id="main">
            {currentPage === 'home' ? (
              <>
                <Hero
                  onStartProjectClick={() => navigateToPage('contact')}
                  onSeeWorkClick={() => scrollToSection('services')}
                />
                <Services
                  onEngageClick={handleNavScroll}
                  onServiceClick={(serviceId) => navigateToPage(`service-${serviceId}`)}
                />
                <Process />
                {/* <Work onRequestCaseBookClick={scrollToSection} /> */}
                {/* <About /> */}
                <Insights
                  onExploreAllClick={navigateToPage}
                  onBlogClick={(b) => navigateToPage(b?.id ? `blog-${b.id}` : 'blogs')}
                />
                <FAQ />
                <Contact />
              </>
            ) : currentPage === 'careers' ? (
              <CareersPage onBackClick={() => navigateToPage('home')} />
            ) : currentPage === 'blogs' ? (
              <BlogsPage
                onBackClick={() => navigateToPage({ type: 'home-scroll', sectionId: 'insights' })}
                onBlogClick={(blogId) => navigateToPage(`blog-${blogId}`)}
                onContactClick={navigateToPage}
              />
            ) : currentPage.startsWith('blog-') ? (
              <BlogDetailPage
                blogId={currentPage.replace('blog-', '')}
                onBackClick={() => navigateToPage('blogs')}
                onContactClick={() => navigateToPage('contact')}
              />
            ) : currentPage === 'contact' ? (
              <ContactPage onBackClick={() => navigateToPage('home')} />
            ) : currentPage === 'about' ? (
              <AboutPage onBackClick={() => navigateToPage('home')} onContactClick={() => navigateToPage('contact')} />
            ) : currentPage === 'work' ? (
              /* Temporarily hidden — falls back to home */
              <AboutPage onBackClick={() => navigateToPage('home')} onContactClick={() => navigateToPage('contact')} />
            ) : currentPage === 'services' ? (
              <ServicesPage onBackClick={() => navigateToPage('home')} onServiceClick={(serviceId) => navigateToPage(`service-${serviceId}`)} onContactClick={navigateToPage} />
            ) : currentPage === 'login' ? (
              <LoginPage onBackClick={() => navigateToPage('home')} />
            ) : currentPage === 'access-denied' ? (
              <AccessDeniedPage
                onBackToHome={() => navigateToPage('home')}
                onRetryLogin={() => navigateToPage('login')}
              />
            ) : currentPage === 'admin' ? (
              <AdminDashboard
                user={user}
                onLogoutSuccess={() => { setUser(null); setIsAuthenticated(false); navigateToPage('home'); }}
                onBackClick={() => navigateToPage('home')}
              />
            ) : currentPage.startsWith('service-') ? (
              <ServicePage
                serviceId={currentPage.replace('service-', '')}
                onBackClick={() => navigateToPage('home')}
                onContactClick={() => navigateToPage('contact')}
                onServiceClick={(page) => navigateToPage(page)}
              />
            ) : null}
            {currentPage !== 'login' && currentPage !== 'admin' && currentPage !== 'access-denied' && (
              <Footer onLinkClick={handleNavScroll} onPageChange={navigateToPage} isSubpage={currentPage !== 'home'} isAuthenticated={isAuthenticated} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}
