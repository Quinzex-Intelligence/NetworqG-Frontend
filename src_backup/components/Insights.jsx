import React, { useState, useEffect } from 'react';
import { insights as fallbackInsights } from '../data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function Insights({ onExploreAllClick, onBlogClick }) {
  const [blogsList, setBlogsList] = useState([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      let res = await fetch(`${API_BASE_URL}/api/blogs/active?limit=20`);
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/blogs/public`);
      }
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/blogs`);
      }
      if (res.ok) {
        const data = await res.json();
        let items = data.blogs || data.content || (Array.isArray(data) ? data : []);
        if (items.length > 0) {
          // Sort by creation date descending (newest first)
          items.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });

          // Take top 3 recently added blogs
          const formatted = items.slice(0, 3).map((b, idx) => ({
            id: b.id || `blog-${idx}`,
            tag: b.tag || b.category || 'Field Note',
            t: b.title || 'Field Note',
            d: b.description ? (b.description.length > 140 ? b.description.slice(0, 140) + '...' : b.description) : (b.shortDescription || b.d || ''),
            time: b.readTime || '5 min read',
            coverImage: b.imageUrl || b.imageKey || b.coverImage || (b.images && b.images[0]?.imageUrl) || null
          }));
          setBlogsList(formatted);
          return;
        }
      }
      throw new Error('Fallback to default static insights');
    } catch (err) {
      setBlogsList(fallbackInsights.slice(0, 3));
    }
  };

  const displayItems = blogsList.length > 0 ? blogsList : fallbackInsights.slice(0, 3);

  const handleClick = (e, blog) => {
    e.preventDefault();
    if (onBlogClick) {
      onBlogClick(blog);
    } else if (onExploreAllClick) {
      onExploreAllClick('blogs');
    }
  };

  return (
    <section
      id="insights"
      data-section="insights"
      data-scene="field"
      data-edge-chip="03 · FIELD NOTES"
      className="relative py-20 lg:py-28 border-t border-line overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="card bg-[#0b0e14]/75 backdrop-blur-xl border border-line/80 p-6 md:p-10 rounded-3xl mb-12 flex items-end justify-between flex-wrap gap-6" data-anim="fade-up">
          <div>
            <div className="eyebrow mb-3" data-anim="fade-up">
              03 — Field Notes & Intelligence
            </div>
            <h2
              className="font-display text-4xl lg:text-6xl leading-[1] tracking-tight max-w-3xl"
              data-split=""
              data-parallax="-0.06"
            >
              Signals from the <span className="italic gold-grad">global network</span>.
            </h2>
          </div>

          <button
            onClick={() => onExploreAllClick?.('blogs')}
            className="btn-gold px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-gold/20"
            data-cursor="link"
          >
            <span>View All Field Notes</span>
            <span>→</span>
          </button>
        </div>

        {/* 3 Most Recently Added Blogs Grid */}
        <div id="insights-grid" className="flex flex-col md:grid md:grid-cols-3 gap-6" data-stagger="3d">
          {displayItems.map((p, idx) => (
            <a
              key={p.id || p.t || idx}
              href={`#blog-${p.id}`}
              onClick={(e) => handleClick(e, p)}
              data-cursor="link"
              className="card bg-[#0b0e14]/80 backdrop-blur-xl rounded-3xl overflow-hidden lift block tilt-card group border border-line hover:border-gold/50 transition-all duration-300 shadow-xl"
            >
              <div className="tilt-inner">
                <div className="insight-cover aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border-b border-line">
                  {p.coverImage && (
                    <img
                      src={p.coverImage}
                      alt={p.t}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4 chip rounded-full px-3 py-1 text-[11px] font-mono backdrop-blur-md">
                    {p.tag}
                  </div>
                </div>
                
                <div className="p-7">
                  <h3 className="font-display text-2xl mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-snug">
                    {p.t}
                  </h3>
                  <p className="text-mute text-sm line-clamp-3 leading-relaxed mb-4">{p.d}</p>
                  <div className="text-xs font-mono uppercase tracking-widest text-gold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Read Dispatch</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Direct Navigation */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onExploreAllClick?.('blogs')}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold hover:text-white transition-colors cursor-pointer"
          >
            <span>Explore All Dispatches ({displayItems.length > 0 ? 'Full Archive' : 'All Notes'})</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
