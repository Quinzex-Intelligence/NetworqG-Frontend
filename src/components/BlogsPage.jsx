import React, { useState, useEffect, useMemo } from 'react';
import { insights as staticInsights } from '../data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function BlogsPage({ onBackClick, onBlogClick, onContactClick }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 200);
    fetchBlogs();
    return () => clearTimeout(timer);
  }, []);

  const fetchBlogs = async () => {
    try {
      let res = await fetch(`${API_BASE_URL}/api/blogs/active?limit=50`);
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

          const normalized = items.map((b, idx) => ({
            id: b.id || `blog-${idx}`,
            title: b.title || b.t || 'Untitled Dispatch',
            tag: b.tag || b.category || 'Field Note',
            shortDescription: b.description ? (b.description.length > 160 ? b.description.slice(0, 160) + '...' : b.description) : (b.shortDescription || b.d || ''),
            content: b.description || b.content || b.longDescription || b.d || '',
            author: b.author || 'Networq Editorial',
            readTime: b.readTime || '5 min read',
            createdDate: b.createdAt || b.createdDate || null,
            coverImage: b.imageUrl || b.imageKey || b.coverImage || (b.images && b.images[0]?.imageUrl) || null,
            active: b.active !== false
          }));
          setBlogs(normalized);
          setLoading(false);
          return;
        }
      }
      throw new Error('No backend blogs found, falling back to static');
    } catch (err) {
      // Graceful fallback to static insights
      const fallbackItems = staticInsights.map((s, idx) => ({
        id: `static-${idx}`,
        title: s.t,
        tag: s.tag || 'Field Note',
        shortDescription: s.d,
        content: s.d,
        author: 'Networq Editorial',
        readTime: s.time || '5 min read',
        createdDate: new Date().toISOString(),
        coverImage: null,
        active: true
      }));
      setBlogs(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  // Derive all unique tags
  const allTags = useMemo(() => {
    const set = new Set(['All']);
    blogs.forEach((b) => {
      if (b.tag) set.add(b.tag);
    });
    return Array.from(set);
  }, [blogs]);

  // Filtered blogs based on search query & tag filter
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesTag = selectedTag === 'All' || b.tag.toLowerCase() === selectedTag.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [blogs, selectedTag, searchQuery]);

  return (
    <div className="subpage-container relative overflow-hidden pt-28 pb-32 min-h-screen">
      {/* Cinematic Ambient Glows */}
      <div className="glow-blob glow-blob--1 pointer-events-none" />
      <div className="glow-blob glow-blob--2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackClick}
            className={`inline-flex items-center gap-2 text-xs font-mono text-gold hover:text-white uppercase tracking-widest transition-all duration-700 cursor-pointer ${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            data-cursor="link"
          >
            ← Back to Field Notes
          </button>
          
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Dispatch' : 'Dispatches'} in Archive
          </div>
        </div>

        {/* Hero Header with Glassmorphism */}
        <header
          className={`cinematic-header bg-[#0b0e14]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-14 rounded-3xl mb-10 relative overflow-hidden shadow-2xl transition-all duration-1000 ${
            animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-98'
          }`}
        >
          <div className="laser-line" />
          <div className="absolute right-8 top-0 font-display text-[160px] leading-none text-white/[0.02] select-none pointer-events-none hidden lg:block">
            ARCHIVE
          </div>
          <div className="max-w-4xl relative z-10">
            <div className="eyebrow mb-4">03 — Complete Knowledge & Field Notes Archive</div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6 text-white">
              All signals from the <br className="hidden sm:inline" />
              <span className="italic gold-grad">global network</span>.
            </h1>
            <p className="text-neutral-300 text-base md:text-xl leading-relaxed max-w-2xl">
              Explore the complete directory of Networq Global dispatches on brand authority, high-performance marketing models, AI search architectures, and global market signals.
            </p>
          </div>
        </header>

        {/* Filter and Search Bar Container */}
        {allTags.length > 2 && (
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b0e14]/70 backdrop-blur-xl border border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-gold text-black font-semibold shadow-md'
                      : 'bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-gold/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive..."
                className="w-full px-4 py-2 rounded-full bg-black/40 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* All Blogs Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
            <div className="text-xs font-mono text-mute tracking-widest uppercase">Streaming Complete Archive...</div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="card bg-[#0b0e14]/80 backdrop-blur-xl p-12 rounded-3xl text-center border border-dashed border-line">
            <div className="text-4xl mb-4">◈</div>
            <h3 className="font-display text-2xl mb-2 text-white">No matching dispatches</h3>
            <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
              No field notes found matching your criteria. Try resetting your search filter.
            </p>
            <button
              onClick={() => { setSelectedTag('All'); setSearchQuery(''); }}
              className="btn-gold px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <article
                key={blog.id || idx}
                onClick={() => onBlogClick ? onBlogClick(blog.id) : null}
                className="card bg-[#0b0e14]/85 backdrop-blur-xl rounded-3xl overflow-hidden lift block cursor-pointer group border border-white/10 hover:border-gold/50 transition-all duration-400 flex flex-col justify-between shadow-xl"
                data-cursor="link"
              >
                <div>
                  {/* Cover image or stylish abstract placeholder */}
                  <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-b border-white/10">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between p-6 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_70%)]" />
                        <div className="flex items-center justify-between relative z-10">
                          <span className="chip rounded-full px-3 py-1 text-[11px] font-mono">
                            {blog.tag}
                          </span>
                        </div>
                        <div className="font-display text-2xl text-white/10 select-none pointer-events-none self-end">
                          #{String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>
                    )}

                    {blog.coverImage && (
                      <div className="absolute top-4 left-4 chip rounded-full px-3 py-1 text-[11px] font-mono backdrop-blur-md">
                        {blog.tag}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-7">
                    <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-neutral-400">
                      <span>{blog.author}</span>
                      {blog.createdDate && (
                        <>
                          <span>•</span>
                          <span>{new Date(blog.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-2xl mb-3 leading-snug text-white group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-neutral-300 text-sm line-clamp-3 leading-relaxed">
                      {blog.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-7 pb-6 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-gold group-hover:translate-x-1 transition-transform duration-300">
                  <span>Read Full Article</span>
                  <span>→</span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
