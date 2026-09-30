import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function Insights({ onExploreAllClick, onBlogClick }) {
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
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
      setBlogsList([]);
    } catch (err) {
      console.error('Error fetching insights from server:', err);
      setBlogsList([]);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="col-span-full py-16 text-center">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-mute font-mono text-xs uppercase tracking-widest">Streaming Dispatches...</p>
            </div>
          ) : blogsList.length > 0 ? (
            blogsList.map((p, idx) => (
              <a
                key={p.id || p.t || idx}
                href={`#blog-${p.id}`}
                onClick={(e) => handleClick(e, p)}
                data-cursor="link"
                className="card bg-[#0b0e14]/80 backdrop-blur-xl rounded-3xl overflow-hidden lift block tilt-card group border border-line hover:border-gold/50 transition-all duration-300 shadow-xl"
              >
                <div className="tilt-inner">
                  <div className="insight-cover aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-b border-line flex items-center justify-center">
                    {p.coverImage && (
                      <>
                        <img
                          src={p.coverImage}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-110 pointer-events-none"
                        />
                        <img
                          src={p.coverImage}
                          alt={p.t}
                          className="relative z-10 w-full h-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </>
                    )}
                    <div className="absolute top-4 left-4 z-20 chip rounded-full px-3 py-1 text-[11px] font-mono backdrop-blur-md">
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
            ))
          ) : (
            <div className="col-span-full py-14 text-center card bg-[#0b0e14]/60 backdrop-blur-xl border border-line/60 rounded-3xl p-8">
              <div className="text-3xl mb-3 text-gold/60">◈</div>
              <p className="text-white font-display text-xl mb-2">No dispatches published yet</p>
              <p className="text-mute font-mono text-xs uppercase tracking-wider">Signals and field notes will appear here once published.</p>
            </div>
          )}
        </div>

        {/* Bottom Direct Navigation */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onExploreAllClick?.('blogs')}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold hover:text-white transition-colors cursor-pointer"
          >
            <span>Explore All Dispatches {blogsList.length > 0 ? `(${blogsList.length})` : ''}</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
