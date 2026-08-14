import React, { useState, useEffect } from 'react';
import { insights as staticInsights } from '../data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function BlogDetailPage({ blogId, onBackClick, onContactClick }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 150);
    fetchBlogDetail();
    return () => clearTimeout(timer);
  }, [blogId]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      // 1. Fetch active blogs from backend API
      let res = await fetch(`${API_BASE_URL}/api/blogs/active?limit=50`);
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/blogs/public`);
      }
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/blogs`);
      }

      if (res.ok) {
        const data = await res.json();
        const items = data.blogs || data.content || (Array.isArray(data) ? data : []);
        if (items.length > 0) {
          // Find matching blog by ID or title
          const found = items.find(
            (b) => String(b.id) === String(blogId) || (b.title && b.title.toLowerCase() === decodeURIComponent(String(blogId)).toLowerCase())
          );
          if (found) {
            setBlog(normalizeBlog(found));
            setLoading(false);
            return;
          } else {
            // If the ID in URL was from an old/static session, load the latest real blog from backend
            setBlog(normalizeBlog(items[0]));
            setLoading(false);
            return;
          }
        }
      }

      // 2. Only fallback to static insights if backend returned 0 blogs
      const staticIdx = parseInt(String(blogId).replace('static-', ''), 10);
      const staticFound =
        (!isNaN(staticIdx) && staticInsights[staticIdx])
          ? staticInsights[staticIdx]
          : staticInsights.find((s) => s.t.toLowerCase() === decodeURIComponent(String(blogId)).toLowerCase()) || staticInsights[0];

      setBlog({
        id: blogId,
        title: staticFound.t,
        tag: staticFound.tag || 'Field Note',
        shortDescription: staticFound.d,
        content: staticFound.d,
        author: 'Networq Editorial',
        readTime: staticFound.time || '5 min read',
        createdDate: new Date().toISOString(),
        coverImage: null
      });
    } catch (err) {
      const fallback = staticInsights[0];
      setBlog({
        id: blogId,
        title: fallback.t,
        tag: fallback.tag || 'Field Note',
        shortDescription: fallback.d,
        content: fallback.d,
        author: 'Networq Editorial',
        readTime: fallback.time || '5 min read',
        createdDate: new Date().toISOString(),
        coverImage: null
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeBlog = (b) => ({
    id: b.id,
    title: b.title || b.t || 'Untitled Dispatch',
    tag: b.tag || b.category || 'Field Note',
    shortDescription: b.description || b.shortDescription || b.d || '',
    content: b.description || b.content || b.d || '',
    author: b.author || 'Networq Editorial',
    readTime: b.readTime || '5 min read',
    createdDate: b.createdAt || b.createdDate || null,
    coverImage: b.imageUrl || b.imageKey || b.coverImage || (b.images && b.images[0]?.imageUrl) || null
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="subpage-container min-h-screen flex items-center justify-center pt-32 pb-32">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-xs font-mono text-mute tracking-widest uppercase">Streaming Dispatch...</div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="subpage-container min-h-screen flex flex-col items-center justify-center pt-32 pb-32 px-6 text-center">
        <div className="bg-[#0b0e14]/90 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl max-w-lg shadow-2xl">
          <h2 className="font-display text-3xl mb-4 text-white">Dispatch Not Found</h2>
          <p className="text-neutral-400 text-sm mb-6">The requested article note could not be retrieved from the network.</p>
          <button
            onClick={onBackClick}
            className="btn-primary-gold px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            ← Return to Field Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subpage-container relative overflow-hidden pt-28 pb-32 min-h-screen">
      {/* Ambient background glows */}
      <div className="glow-blob glow-blob--1 pointer-events-none" />
      <div className="glow-blob glow-blob--2 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation bar / Breadcrumb */}
        <div
          className={`flex items-center justify-between mb-8 transition-all duration-700 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <button
            onClick={onBackClick}
            className="inline-flex items-center gap-2 text-xs font-mono text-gold hover:text-white transition-colors uppercase tracking-widest cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to All Field Notes</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{copied ? '✓ Link Copied' : '🔗 Share Dispatch'}</span>
          </button>
        </div>

        {/* ================= FROSTED GLASS CONTENT CONTAINER ================= */}
        <div
          className={`bg-[#090d14]/92 backdrop-blur-2xl border border-white/12 rounded-3xl p-6 sm:p-12 md:p-16 shadow-[0_25px_100px_rgba(0,0,0,0.95)] transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main Article Header */}
          <header className="mb-10">
            {/* Metadata pill strip */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono uppercase tracking-wider font-semibold">
                {blog.tag}
              </span>
              {blog.createdDate && (
                <span className="text-xs font-mono text-neutral-400">
                  {new Date(blog.createdDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              {blog.title}
            </h1>

            {/* Author info strip */}
            <div className="flex items-center gap-4 py-5 border-y border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#084b6f] to-gold/40 border border-white/20 flex items-center justify-center text-sm font-bold text-white font-mono shadow-md shrink-0">
                {(blog.author || 'N').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-base font-semibold text-white tracking-wide">
                  {blog.author || 'Networq Editorial'}
                </div>
                <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <span>Networq Global Intelligence</span>
                  <span>•</span>
                  <span>Strategy & Insights</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          {blog.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] max-h-[460px] bg-neutral-950 shadow-2xl mb-10 relative">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Full Real Article Body Content */}
          <article className="space-y-8 text-neutral-200 text-base sm:text-lg leading-[1.85] font-normal tracking-normal whitespace-pre-line">
            {blog.content}
          </article>

          {/* Bottom Conversion Box */}
          <div className="mt-14 pt-10 border-t border-white/10">
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#084b6f]/35 via-[#063854]/25 to-[#042437]/35 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold font-semibold block mb-1">
                  Enterprise Strategy & Execution
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                  Ready to engineer your brand reach?
                </h3>
                <p className="text-sm text-neutral-300 max-w-lg leading-relaxed">
                  Partner with Networq Global's senior operators to design and execute high-precision digital growth frameworks.
                </p>
              </div>

              <button
                onClick={() => onContactClick?.('contact')}
                className="btn-primary-gold px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer shadow-xl hover:shadow-gold/20 transition-all active:scale-95"
              >
                Start a Project →
              </button>
            </div>
          </div>

        </div>

        {/* Back to all dispatches footer link */}
        <div className="mt-12 text-center">
          <button
            onClick={onBackClick}
            className="text-xs font-mono text-neutral-400 hover:text-gold uppercase tracking-widest transition-colors cursor-pointer"
          >
            ← View All Field Notes
          </button>
        </div>

      </div>
    </div>
  );
}
