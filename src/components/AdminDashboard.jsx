import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function AdminDashboard({ user, onLogoutSuccess, onBackClick }) {
  const { active } = useTheme();
  const logoSrc = active.id === 'reversed-ocean-blue' ? '/logo-full.svg' : '/logo-full-inverted.svg';

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'jobs', 'services', 'blogs'
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  
  // Job states
  const [jobPage, setJobPage] = useState(0);
  const [jobTotalPages, setJobTotalPages] = useState(0);
  const [jobSearch, setJobSearch] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    jobName: '',
    jobId: '',
    jobDescription: '',
    expiryDate: ''
  });

  // Service states
  const [servicePage, setServicePage] = useState(0);
  const [serviceTotalPages, setServiceTotalPages] = useState(0);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    active: true,
    displayOrder: 0
  });
  const [serviceImages, setServiceImages] = useState([]);

  // Blog / Field Notes states
  const [blogPage, setBlogPage] = useState(0);
  const [blogTotalPages, setBlogTotalPages] = useState(0);
  const [blogSearch, setBlogSearch] = useState('');
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    author: '',
    tag: 'Playbook',
    readTime: '5 min read',
    shortDescription: '',
    content: '',
    active: true,
    displayOrder: 0
  });
  const [blogCoverImage, setBlogCoverImage] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchJobs();
    fetchServices();
    fetchBlogs();
  }, [jobPage, servicePage, blogPage]);

  // --- API CALLS FOR JOBS ---
  const fetchJobs = async () => {
    try {
      let url = `${API_BASE_URL}/api/jobs?page=${jobPage}&size=10&sort=createdDate,desc`;
      if (jobSearch.trim()) {
        url = `${API_BASE_URL}/api/jobs/search?jobName=${encodeURIComponent(jobSearch)}&page=${jobPage}&size=10`;
      }
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.content || []);
        setJobTotalPages(data.totalPages || 0);
      }
    } catch (err) {
      showToast('Error connecting to backend', 'error');
    }
  };

  const handleJobSearchSubmit = (e) => {
    e.preventDefault();
    setJobPage(0);
    fetchJobs();
  };

  const handleCreateOrUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingJob;
      const url = `${API_BASE_URL}/api/jobs`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const payload = {
        ...jobFormData,
        id: isEdit ? editingJob.id : undefined,
        jobId: isEdit ? editingJob.id : jobFormData.jobId,
        createdDate: isEdit ? editingJob.createdDate : new Date().toISOString()
      };

      if (payload.expiryDate) {
        payload.expiryDate = new Date(payload.expiryDate).toISOString();
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (res.ok) {
        showToast(isEdit ? 'Position updated successfully!' : 'Position published successfully!');
        setShowJobForm(false);
        setEditingJob(null);
        setJobFormData({ jobName: '', jobId: '', jobDescription: '', expiryDate: '' });
        fetchJobs();
      } else {
        const errText = await res.text();
        showToast(`Failed: ${errText}`, 'error');
      }
    } catch (err) {
      showToast('Error saving job', 'error');
    }
  };

  const handleDeleteJobs = async (idsToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${idsToDelete.length} position(s)?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idsToDelete),
        credentials: 'include'
      });
      if (res.ok) {
        showToast('Position(s) deleted successfully');
        setSelectedJobIds([]);
        fetchJobs();
      } else {
        showToast('Failed to delete positions', 'error');
      }
    } catch (err) {
      showToast('Error deleting positions', 'error');
    }
  };

  const startEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      jobName: job.jobName,
      jobId: job.jobId,
      jobDescription: job.jobDescription,
      expiryDate: job.expiryDate ? new Date(job.expiryDate).toISOString().substring(0, 16) : ''
    });
    setShowJobForm(true);
  };

  const handleSelectJob = (id) => {
    setSelectedJobIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // --- API CALLS FOR SERVICES ---
  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/services?page=${servicePage}&size=10&sort=displayOrder,asc`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data.content || []);
        setServiceTotalPages(data.totalPages || 0);
      }
    } catch (err) {
      showToast('Error connecting to services API', 'error');
    }
  };

  const handleCreateOrUpdateService = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingService;
      const url = isEdit 
        ? `${API_BASE_URL}/api/services/${editingService.id}`
        : `${API_BASE_URL}/api/services`;
      
      const formData = new FormData();
      formData.append('title', serviceFormData.title);
      formData.append('shortDescription', serviceFormData.shortDescription);
      formData.append('longDescription', serviceFormData.longDescription);
      formData.append('active', serviceFormData.active);
      formData.append('displayOrder', serviceFormData.displayOrder);
      
      if (serviceImages.length > 0) {
        for (let i = 0; i < serviceImages.length; i++) {
          formData.append('images', serviceImages[i]);
        }
      } else if (!isEdit) {
        showToast('At least one image is required for new services', 'error');
        return;
      }

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include'
      });

      if (res.ok) {
        showToast(isEdit ? 'Capability updated successfully!' : 'Capability created successfully!');
        setShowServiceForm(false);
        setEditingService(null);
        setServiceFormData({ title: '', shortDescription: '', longDescription: '', active: true, displayOrder: 0 });
        setServiceImages([]);
        fetchServices();
      } else {
        const errText = await res.text();
        showToast(`Failed: ${errText}`, 'error');
      }
    } catch (err) {
      showToast('Error saving service', 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this capability?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        showToast('Capability deleted successfully');
        fetchServices();
      } else {
        showToast('Failed to delete service', 'error');
      }
    } catch (err) {
      showToast('Error deleting service', 'error');
    }
  };

  const startEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      shortDescription: service.shortDescription,
      longDescription: service.longDescription,
      active: service.active,
      displayOrder: service.displayOrder
    });
    setServiceImages([]);
    setShowServiceForm(true);
  };

  // --- API CALLS FOR BLOGS / FIELD NOTES ---
  const [blogNextCursor, setBlogNextCursor] = useState(null);
  const [blogHasMore, setBlogHasMore] = useState(false);

  const fetchBlogs = async () => {
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/blogs/active?limit=50`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/blogs/inactive?limit=50`, { credentials: 'include' })
      ]);

      let activeItems = [];
      let inactiveItems = [];

      if (activeRes.ok) {
        const activeData = await activeRes.json();
        activeItems = activeData.blogs || activeData.content || (Array.isArray(activeData) ? activeData : []);
      }
      if (inactiveRes.ok) {
        const inactiveData = await inactiveRes.json();
        inactiveItems = inactiveData.blogs || inactiveData.content || (Array.isArray(inactiveData) ? inactiveData : []);
      }

      // Merge and sort by createdAt descending
      let combinedItems = [...activeItems, ...inactiveItems].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });

      // Filter client-side if a search query is present
      if (blogSearch.trim()) {
        const query = blogSearch.toLowerCase().trim();
        combinedItems = combinedItems.filter(blog => 
          (blog.title && blog.title.toLowerCase().includes(query)) ||
          (blog.description && blog.description.toLowerCase().includes(query))
        );
      }

      setBlogs(combinedItems);
      setBlogHasMore(false);
      setBlogNextCursor(null);
      setBlogTotalPages(1);
    } catch (err) {
      showToast('Error connecting to blogs API', 'error');
    }
  };

  const handleBlogSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleCreateOrUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingBlog;
      const url = isEdit
        ? `${API_BASE_URL}/api/blogs/${editingBlog.id}`
        : `${API_BASE_URL}/api/blogs`;

      if (!isEdit && !blogCoverImage) {
        showToast('Blog image is required for new articles', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('title', blogFormData.title);
      formData.append('description', blogFormData.description);
      formData.append('active', blogFormData.active);

      if (blogCoverImage) {
        formData.append('image', blogCoverImage);
      }

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        body: formData,
        credentials: 'include'
      });

      if (res.ok) {
        showToast(isEdit ? 'Blog updated successfully!' : 'Blog created successfully!');
        setShowBlogForm(false);
        setEditingBlog(null);
        setBlogFormData({
          title: '',
          description: '',
          active: true
        });
        setBlogCoverImage(null);
        fetchBlogs();
      } else {
        const errText = await res.text();
        showToast(`Failed: ${errText}`, 'error');
      }
    } catch (err) {
      showToast('Error saving article', 'error');
    }
  };



  const startEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogFormData({
      title: blog.title || '',
      description: blog.description || '',
      active: blog.active !== false
    });
    setBlogCoverImage(null);
    setShowBlogForm(true);
  };

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        onLogoutSuccess();
      } else {
        showToast('Logout failed on server', 'error');
      }
    } catch (err) {
      showToast('Error logging out', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070707] text-white">
      
      {/* Scope premium admin theme fonts & primary colors locally */}
      <style>{`
        .admin-sidebar,
        .admin-main,
        .admin-modal {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        /* Scale up text size across the dashboard */
        .text-xs {
          font-size: 0.875rem !important; /* 14px instead of 12px */
        }
        .text-[10px] {
          font-size: 0.75rem !important; /* 12px instead of 10px */
        }
        .text-[9px] {
          font-size: 0.75rem !important; /* 12px instead of 9px */
        }
        .text-2xl {
          font-size: 1.875rem !important; /* 30px instead of 24px */
        }
        .text-3xl {
          font-size: 2.25rem !important; /* 36px instead of 30px */
        }
        .btn-primary-gold {
          background-color: var(--gold) !important;
          color: var(--bg) !important;
          border-color: var(--gold) !important;
          transition: all 0.3s ease;
        }
        .btn-primary-gold:hover {
          background-color: var(--gold-2) !important;
          border-color: var(--gold-2) !important;
          color: var(--bg) !important;
        }
        /* Override hardcoded dark elements with system palette variables */
        .flex.min-h-screen.bg-\[\#070707\] {
          background-color: var(--bg) !important;
        }
        .admin-main {
          background-color: var(--bg) !important;
        }
        .bg-\[\#0c0c0c\] {
          background-color: var(--bg-2) !important;
        }
        .bg-\[\#0d0d0d\] {
          background-color: var(--card-bg) !important;
        }
        .bg-neutral-950 {
          background-color: var(--bg) !important;
        }
        .bg-neutral-900\/40, .bg-neutral-900\/30 {
          background-color: var(--bg-2) !important;
          opacity: 0.85;
        }
        .border-neutral-900 {
          border-color: var(--line) !important;
        }
        .border-neutral-800, .border-neutral-800\/40 {
          border-color: var(--line) !important;
        }
        .text-neutral-500 {
          color: var(--mute) !important;
        }
        .text-neutral-400 {
          color: var(--mute) !important;
          opacity: 0.85;
        }
        .text-neutral-300 {
          color: var(--ink) !important;
        }
        .text-neutral-200 {
          color: var(--ink) !important;
        }
        .text-white {
          color: var(--ink) !important;
        }
        .divide-neutral-900\/50 > :not([hidden]) ~ :not([hidden]) {
          border-color: var(--line) !important;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl border text-xs font-semibold shadow-2xl transition-all duration-300 transform translate-y-0 ${
          toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-400' : 'bg-green-950/90 border-green-500/30 text-green-400'
        }`}>
          {toast.message}
        </div>
      )}

      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-64 border-r border-neutral-900 bg-[#0c0c0c] flex flex-col justify-between shrink-0 admin-sidebar">
        
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-center">
            <img src={logoSrc} alt="Networq Global" className="h-7 w-auto object-contain" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all text-left ${
                activeTab === 'overview' ? 'bg-neutral-900 text-gold border-l-2 border-gold' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'
              }`}
            >
              <span>◈</span> Overview
            </button>
            
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all text-left ${
                activeTab === 'jobs' ? 'bg-neutral-900 text-gold border-l-2 border-gold' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'
              }`}
            >
              <span>💼</span> Jobs Manager
            </button>
            
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all text-left ${
                activeTab === 'services' ? 'bg-neutral-900 text-gold border-l-2 border-gold' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'
              }`}
            >
              <span>⚙️</span> Capabilities Portfolio
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all text-left ${
                activeTab === 'blogs' ? 'bg-neutral-900 text-gold border-l-2 border-gold' : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-white'
              }`}
            >
              <span>📰</span> Field Notes & Blogs
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Profile and Exit */}
        <div className="p-4 border-t border-neutral-900">
          
          {/* User Badge */}
          <div className="flex items-center gap-3 p-3 bg-neutral-900/40 rounded-xl border border-neutral-800/40 mb-4">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full border border-neutral-700 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center font-mono text-[10px] text-gold bg-neutral-900">U</div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-neutral-200 truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-neutral-500 truncate">{user?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBackClick}
              className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              Exit
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider bg-red-950/30 border border-red-500/20 text-red-400 hover:bg-red-900/40 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

      </aside>

      {/* MAIN WORKSPACE PANEL */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-[#070707] p-8 md:p-12 admin-main">

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">System Overview</h1>
              <p className="text-xs text-neutral-400 mt-1">Management summary and system diagnostics logs.</p>
            </div>

            {/* Diagnostics Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl border border-neutral-900 bg-[#0d0d0d] flex flex-col justify-between">
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Active Career Postings</span>
                <span className="text-3xl font-light text-gold mt-4">{jobs.length}</span>
                <span className="text-[10px] text-neutral-400 mt-2">Available for application</span>
              </div>
              
              <div className="p-6 rounded-2xl border border-neutral-900 bg-[#0d0d0d] flex flex-col justify-between">
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Offered Capabilities</span>
                <span className="text-3xl font-light text-gold mt-4">{services.length}</span>
                <span className="text-[10px] text-neutral-400 mt-2">Active service packages</span>
              </div>

              <div className="p-6 rounded-2xl border border-neutral-900 bg-[#0d0d0d] flex flex-col justify-between">
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Dispatches & Articles</span>
                <span className="text-3xl font-light text-gold mt-4">{blogs.length}</span>
                <span className="text-[10px] text-neutral-400 mt-2">Published field notes</span>
              </div>

              <div className="p-6 rounded-2xl border border-neutral-900 bg-[#0d0d0d] flex flex-col justify-between">
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Link Health</span>
                <div className="flex items-center gap-2 mt-4 text-emerald-400 font-semibold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </div>
                <span className="text-[10px] text-neutral-400 mt-2">Server API connection ok</span>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="p-8 rounded-2xl border border-neutral-900 bg-[#0d0d0d] flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-base font-semibold text-white">Need to publish new field notes or capabilities?</h3>
                <p className="text-xs text-neutral-400 mt-1">Directly create insights dispatches, register services, or list careers.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setJobFormData({ jobName: '', jobId: '', jobDescription: '', expiryDate: '' });
                    setShowJobForm(true);
                  }}
                  className="px-5 py-2.5 rounded-full border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  + Add Position
                </button>
                <button
                  onClick={() => {
                    setEditingService(null);
                    setServiceFormData({ title: '', shortDescription: '', longDescription: '', active: true, displayOrder: 0 });
                    setServiceImages([]);
                    setShowServiceForm(true);
                  }}
                  className="px-5 py-2.5 rounded-full border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  + Add Service
                </button>
                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setBlogFormData({
                      title: '',
                      author: user?.name || 'Networq Global Editorial',
                      tag: 'Playbook',
                      readTime: '5 min read',
                      shortDescription: '',
                      content: '',
                      active: true,
                      displayOrder: 0
                    });
                    setBlogCoverImage(null);
                    setShowBlogForm(true);
                  }}
                  className="px-5 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  + Add Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== JOBS DIRECTORY TAB ==================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Jobs Directory</h1>
                <p className="text-xs text-neutral-400 mt-1">Manage public positions and requirements.</p>
              </div>
              <button
                onClick={() => {
                  setEditingJob(null);
                  setJobFormData({ jobName: '', jobId: '', jobDescription: '', expiryDate: '' });
                  setShowJobForm(true);
                }}
                className="px-5 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                + New Position
              </button>
            </div>

            {/* Filter and Bulk Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0d0d0d] p-4 rounded-xl border border-neutral-900">
              <form onSubmit={handleJobSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Filter by title..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-gold"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                />
                <button type="submit" className="px-4 py-2 rounded-lg border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer">
                  Filter
                </button>
              </form>

              {selectedJobIds.length > 0 && (
                <button
                  onClick={() => handleDeleteJobs(selectedJobIds)}
                  className="px-4 py-2 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-950/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Delete Selected ({selectedJobIds.length})
                </button>
              )}
            </div>

            {/* Positions Table */}
            <div className="border border-neutral-900 bg-[#0d0d0d] rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse text-xs md:text-sm font-mono">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-900/30 text-[10px] text-neutral-500 uppercase tracking-widest">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={jobs.length > 0 && selectedJobIds.length === jobs.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedJobIds(jobs.map(j => j.id));
                          else setSelectedJobIds([]);
                        }}
                      />
                    </th>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Position Title</th>
                    <th className="p-4 hidden md:table-cell">Created</th>
                    <th className="p-4 hidden md:table-cell">Expiry</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/50 text-neutral-300">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-neutral-500 text-xs italic">
                        No positions found.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-neutral-950/40 transition-colors">
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedJobIds.includes(job.id)}
                            onChange={() => handleSelectJob(job.id)}
                          />
                        </td>
                        <td className="p-4 text-gold-2 font-semibold">{job.jobId}</td>
                        <td className="p-4 text-white font-sans">{job.jobName}</td>
                        <td className="p-4 text-neutral-500 hidden md:table-cell">
                          {new Date(job.createdDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-neutral-500 hidden md:table-cell">
                          {new Date(job.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => startEditJob(job)}
                            className="px-2.5 py-1 rounded border border-neutral-800 text-[10px] text-gold hover:border-gold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJobs([job.id])}
                            className="px-2.5 py-1 rounded border border-red-500/20 text-[10px] text-red-400 hover:border-red-500 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {jobTotalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button
                  disabled={jobPage === 0}
                  onClick={() => setJobPage(p => p - 1)}
                  className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="px-4 py-2 text-xs font-mono text-neutral-500">
                  Page {jobPage + 1} of {jobTotalPages}
                </span>
                <button
                  disabled={jobPage >= jobTotalPages - 1}
                  onClick={() => setJobPage(p => p + 1)}
                  className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}

          </div>
        )}

        {/* ==================== SERVICES TAB ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Capabilities Portfolio</h1>
                <p className="text-xs text-neutral-400 mt-1">Manage dynamic digital capabilities and images.</p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceFormData({ title: '', shortDescription: '', longDescription: '', active: true, displayOrder: 0 });
                  setServiceImages([]);
                  setShowServiceForm(true);
                }}
                className="px-5 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                + New Service
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.length === 0 ? (
                <div className="col-span-full border border-neutral-900 bg-[#0d0d0d] p-12 text-center text-neutral-500 text-xs italic rounded-2xl">
                  No services available.
                </div>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="border border-neutral-900 bg-[#0d0d0d] p-6 rounded-2xl flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-900">
                        <span className="font-mono text-xs text-gold">Display Order: {service.displayOrder}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider ${
                          service.active 
                            ? 'bg-green-950/20 border-green-500/30 text-green-400' 
                            : 'bg-yellow-950/20 border-yellow-500/30 text-yellow-400'
                        }`}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                      <p className="text-neutral-400 text-xs leading-relaxed mb-4">{service.shortDescription}</p>

                      {/* Image Thumbnails */}
                      {service.images && service.images.length > 0 && (
                        <div className="flex gap-2 mb-4 overflow-x-auto py-1">
                          {service.images.map((img) => (
                            <img
                              key={img.id}
                              src={img.imageUrl}
                              alt="Thumbnail"
                              className="h-12 w-auto rounded border border-neutral-800 object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-neutral-900 flex justify-end gap-2 text-xs font-mono">
                      <button
                        onClick={() => startEditService(service)}
                        className="px-4 py-1.5 rounded border border-neutral-800 text-[10px] text-gold hover:border-gold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="px-4 py-1.5 rounded border border-red-500/20 text-[10px] text-red-400 hover:border-red-500 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {serviceTotalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button
                  disabled={servicePage === 0}
                  onClick={() => setServicePage(p => p - 1)}
                  className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="px-4 py-2 text-xs font-mono text-neutral-500">
                  Page {servicePage + 1} of {serviceTotalPages}
                </span>
                <button
                  disabled={servicePage >= serviceTotalPages - 1}
                  onClick={() => setServicePage(p => p + 1)}
                  className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}

          </div>
        )}

        {/* ==================== BLOGS / FIELD NOTES TAB ==================== */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Field Notes & Intelligence</h1>
                <p className="text-xs text-neutral-400 mt-1">Publish and curate articles, research notes, and market signals.</p>
              </div>

              <button
                onClick={() => {
                  setEditingBlog(null);
                  setBlogFormData({
                    title: '',
                    author: user?.name || 'Networq Global Editorial',
                    tag: 'Playbook',
                    readTime: '5 min read',
                    shortDescription: '',
                    content: '',
                    active: true,
                    displayOrder: 0
                  });
                  setBlogCoverImage(null);
                  setShowBlogForm(true);
                }}
                className="px-6 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                + New Article
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl border border-neutral-900 bg-[#0d0d0d]">
              <form onSubmit={handleBlogSearchSubmit} className="flex gap-2 w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search articles by title..."
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold"
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                />
                <button type="submit" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-semibold hover:border-gold transition-colors">
                  Search
                </button>
              </form>
              <div className="text-[11px] font-mono text-neutral-500">
                Total Records: <span className="text-gold">{blogs.length}</span>
              </div>
            </div>

            {/* Blogs Table / Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.length === 0 ? (
                <div className="col-span-full p-12 text-center border border-dashed border-neutral-900 rounded-2xl bg-[#0d0d0d]">
                  <span className="text-2xl block mb-2">📰</span>
                  <p className="text-xs text-neutral-400">No article dispatches found in the database.</p>
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setBlogFormData({
                        title: '',
                        author: user?.name || 'Networq Global Editorial',
                        tag: 'Playbook',
                        readTime: '5 min read',
                        shortDescription: '',
                        content: '',
                        active: true,
                        displayOrder: 0
                      });
                      setBlogCoverImage(null);
                      setShowBlogForm(true);
                    }}
                    className="mt-4 px-5 py-2 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    + Publish First Article
                  </button>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div key={blog.id} className="p-6 rounded-2xl border border-neutral-900 bg-[#0d0d0d] flex flex-col justify-between hover:border-neutral-800 transition-colors">
                    <div>
                      {/* Thumbnail or Badge */}
                      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 bg-neutral-950 border border-neutral-900 relative">
                        {blog.coverImage || (blog.images && blog.images[0]?.imageUrl) ? (
                          <img
                            src={blog.coverImage || blog.images[0].imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700 text-xs font-mono">
                            No Cover Image
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/70 border border-neutral-700 text-gold">
                          {blog.tag || blog.category || 'Note'}
                        </span>
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                          blog.active !== false ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-900/90 text-neutral-500 border border-neutral-800'
                        }`}>
                          {blog.active !== false ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mb-1">
                        <span>{blog.author || 'Networq Global Editorial'}</span>
                      </div>

                      <h3 className="text-base font-semibold text-white mb-2 leading-snug line-clamp-2">
                        {blog.title || blog.t}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
                        {blog.shortDescription || blog.description || blog.d || blog.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-500">
                        {blog.createdDate ? new Date(blog.createdDate).toLocaleDateString() : 'Recent'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditBlog(blog)}
                          className="px-3 py-1.5 rounded border border-neutral-800 text-[10px] text-gold hover:border-gold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {blogTotalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button
                  disabled={blogPage === 0}
                  onClick={() => setBlogPage(p => p - 1)}
                  className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="px-4 py-2 text-xs font-mono text-neutral-500">
                  Page {blogPage + 1} of {blogTotalPages}
                </span>
                <button
                  disabled={blogPage >= blogTotalPages - 1}
                  onClick={() => setBlogPage(p => p + 1)}
                  className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-mono disabled:opacity-30 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==================== FORM OVERLAY MODALS ==================== */}

      {/* 1. Job Creation / Edit Modal */}
      {showJobForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 admin-modal">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="text-lg font-semibold text-white mb-6">
              {editingJob ? 'Edit Position' : 'Create New Position'}
            </h3>
            
            <form onSubmit={handleCreateOrUpdateJob} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Position Title</span>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                    placeholder="Lead Creative Designer"
                    value={jobFormData.jobName}
                    onChange={(e) => setJobFormData({ ...jobFormData, jobName: e.target.value })}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">
                    Job Reference Code {editingJob && '(Read Only)'}
                  </span>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="CREATIVE-202"
                    value={jobFormData.jobId}
                    onChange={(e) => setJobFormData({ ...jobFormData, jobId: e.target.value })}
                    required
                    disabled={!!editingJob}
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-2">Expiry Date & Time</span>
                  <input
                    type="datetime-local"
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                    value={jobFormData.expiryDate}
                    onChange={(e) => setJobFormData({ ...jobFormData, expiryDate: e.target.value })}
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Description & Requirements</span>
                <textarea
                  rows="6"
                  className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                  placeholder="Role specifications and responsibilities..."
                  value={jobFormData.jobDescription}
                  onChange={(e) => setJobFormData({ ...jobFormData, jobDescription: e.target.value })}
                  required
                ></textarea>
              </label>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => { setShowJobForm(false); setEditingJob(null); }}
                  className="px-5 py-2.5 rounded-full border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {editingJob ? 'Update Position' : 'Publish Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Service Creation / Edit Modal */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 admin-modal">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-8 shadow-2xl relative">
            <h3 className="text-lg font-semibold text-white mb-6">
              {editingService ? 'Edit Capability' : 'Create New Capability'}
            </h3>
            
            <form onSubmit={handleCreateOrUpdateService} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="block md:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Service Title</span>
                  <input
                    type="text"
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                    placeholder="Performance Marketing"
                    value={serviceFormData.title}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-2">Display Order</span>
                  <input
                    type="number"
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                    value={serviceFormData.displayOrder}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, displayOrder: parseInt(e.target.value) || 0 })}
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Short Summary</span>
                <input
                  type="text"
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                  placeholder="Data-driven campaigns maximizing ROI."
                  value={serviceFormData.shortDescription}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, shortDescription: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Detailed Portfolio Content</span>
                <textarea
                  rows="5"
                  className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                  placeholder="Detailed explanation outlining methodologies and capabilities..."
                  value={serviceFormData.longDescription}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, longDescription: e.target.value })}
                  required
                ></textarea>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceFormData.active}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, active: e.target.checked })}
                    className="rounded border-neutral-800 bg-neutral-950 text-gold w-4 h-4 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-xs text-neutral-300 font-medium">Active (visible on website)</span>
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">Attach Portfolio Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="file:mr-4 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-gold/15 file:text-gold file:cursor-pointer hover:file:bg-gold/25 text-xs text-neutral-500"
                    onChange={(e) => setServiceImages(e.target.files)}
                  />
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => { setShowServiceForm(false); setEditingService(null); }}
                  className="px-5 py-2.5 rounded-full border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Blog Creation / Edit Modal */}
      {showBlogForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 admin-modal overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-900">
              <h3 className="text-lg font-semibold text-white">
                {editingBlog ? 'Edit Field Note / Article Dispatch' : 'Publish New Article Dispatch'}
              </h3>
              <button
                onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}
                className="text-neutral-500 hover:text-white text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdateBlog} className="space-y-6">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Blog Title</span>
                <input
                  type="text"
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-gold"
                  placeholder="e.g. What survives the AI search shift"
                  value={blogFormData.title}
                  onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Blog Description / Content</span>
                <textarea
                  rows="8"
                  className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs text-white focus:outline-none focus:border-gold font-sans leading-relaxed"
                  placeholder="Enter the full blog description or article content..."
                  value={blogFormData.description}
                  onChange={(e) => setBlogFormData({ ...blogFormData, description: e.target.value })}
                  required
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogFormData.active}
                    onChange={(e) => setBlogFormData({ ...blogFormData, active: e.target.checked })}
                    className="rounded border-neutral-800 bg-neutral-950 text-gold w-4 h-4 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-xs text-neutral-300 font-medium">Active (visible on website)</span>
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                    Blog Image {!editingBlog && <span className="text-red-400">*</span>}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="file:mr-4 file:py-1.5 file:px-3.5 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-gold/15 file:text-gold file:cursor-pointer hover:file:bg-gold/25 text-xs text-neutral-500"
                    onChange={(e) => setBlogCoverImage(e.target.files[0] || null)}
                    required={!editingBlog}
                  />
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}
                  className="px-5 py-2.5 rounded-full border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full btn-primary-gold text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
