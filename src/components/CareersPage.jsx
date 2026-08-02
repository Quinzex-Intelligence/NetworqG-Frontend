import React, { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';

export default function CareersPage({ onBackClick }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const sliderRef = useRef(null);

  const handleScrollUp = (e) => {
    e.stopPropagation();
    if (sliderRef.current) {
      sliderRef.current.scrollTop -= 130;
    }
  };

  const handleScrollDown = (e) => {
    e.stopPropagation();
    if (sliderRef.current) {
      sliderRef.current.scrollTop += 130;
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 400);
    fetchJobs();
    return () => clearTimeout(timer);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/jobs/public');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.content || []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must not exceed 5MB.');
        e.target.value = null;
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload your resume.');
      return;
    }
    setFormStatus('sending');
    setErrorMessage('');
    
    try {
      const submissionData = new FormData();
      submissionData.append('fullName', formData.fullName);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone);
      submissionData.append('resume', resumeFile);

      const res = await fetch(`http://localhost:8080/api/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        body: submissionData
      });

      if (res.ok) {
        setFormStatus('success');
        setFormData({ fullName: '', email: '', phone: '' });
        setResumeFile(null);
      } else {
        const errText = await res.text();
        setFormStatus('error');
        setErrorMessage(errText || 'Failed to submit application.');
      }
    } catch (err) {
      setFormStatus('error');
      setErrorMessage('Network error occurred. Please try again.');
    }
  };

  return (
    <div className="subpage-container relative overflow-hidden pt-24 pb-32">
      {/* Background Cinematic Glows */}
      <div className="glow-blob glow-blob--1" />
      <div className="glow-blob glow-blob--2" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Back button */}
        <button
          onClick={onBackClick}
          className={`mb-8 inline-flex items-center gap-2 text-xs font-mono text-gold-2 uppercase tracking-widest hover:text-gold transition-all duration-700 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          data-cursor="link"
        >
          ← Back to Home
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Info & Open Positions Column */}
          <div
            className={`lg:col-span-5 glow-card p-8 md:p-10 rounded-3xl border border-line transition-all duration-1000 ${
              animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="eyebrow mb-4">Careers at Networq</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6">
              Work With <span className="italic gold-grad">Us</span>
            </h1>
            <p className="text-ink/80 text-base leading-relaxed mb-6">
              Are you driven by creativity and fueled by the passion to excel in the fast-paced world of global marketing? Join us in shaping digital brands that lead.
            </p>
            
            <div className="hairline my-6" />

             <h3 className="font-display text-lg text-gold-2 mb-4">Open Positions</h3>
            {loading ? (
              <p className="text-mute text-xs font-mono">Loading active careers...</p>
            ) : jobs.length === 0 ? (
              <p className="text-mute text-xs italic">No positions are currently advertised. Check back later.</p>
            ) : (
              <div className="relative group/slider">
                {/* Custom styling to hide scrollbars */}
                <style>{`
                  .vertical-slider-container {
                    scrollbar-width: none;
                  }
                  .vertical-slider-container::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {/* Up navigation arrow (only visible if more than 3 jobs) */}
                {jobs.length > 3 && (
                  <button
                    onClick={handleScrollUp}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/90 border border-gold/30 hover:border-gold text-gold rounded-full p-1.5 z-20 cursor-pointer shadow-lg transition-all duration-300 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center"
                    title="Scroll Up"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                )}

                {/* Main scrollable list viewport */}
                <div
                  ref={sliderRef}
                  className="vertical-slider-container overflow-y-auto scroll-smooth space-y-3 max-h-[380px] py-1"
                  data-lenis-prevent
                >
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setFormStatus('idle'); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 font-mono flex flex-col justify-between ${
                        selectedJob?.id === job.id 
                          ? 'border-gold bg-gold/10 text-gold shadow-lg shadow-gold/5' 
                          : 'border-line hover:border-gold/50 text-mute hover:text-ink bg-bg/20'
                      }`}
                    >
                      <span className="text-[10px] text-mute uppercase tracking-wider">{job.jobId}</span>
                      <span className="text-sm font-sans font-medium text-ink mt-1.5">{job.jobName}</span>
                      <span className="text-[9px] text-mute mt-2">Expires: {new Date(job.expiryDate).toLocaleDateString()}</span>
                    </button>
                  ))}
                </div>

                {/* Down navigation arrow (only visible if more than 3 jobs) */}
                {jobs.length > 3 && (
                  <button
                    onClick={handleScrollDown}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/90 border border-gold/30 hover:border-gold text-gold rounded-full p-1.5 z-20 cursor-pointer shadow-lg transition-all duration-300 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center"
                    title="Scroll Down"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Application Form Column */}
          <div className="lg:col-span-7">
            {selectedJob ? (
              <form
                className={`glow-card rounded-3xl p-8 lg:p-10 border border-line transition-all duration-1000 ${
                  animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: '300ms' }}
                onSubmit={handleSubmit}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="font-mono text-[9px] text-gold uppercase tracking-widest bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                      Applying for: {selectedJob.jobId}
                    </span>
                    <h2 className="font-display text-3xl mt-2 text-gold-2">{selectedJob.jobName}</h2>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedJob(null)}
                    className="text-[10px] font-mono text-mute hover:text-gold uppercase tracking-wider border border-line px-2.5 py-1 rounded"
                  >
                    Close
                  </button>
                </div>

                {/* Job Description Box */}
                <div className="bg-bg/40 border border-line rounded-2xl p-5 mb-8 text-xs leading-relaxed text-mute max-h-48 overflow-y-auto">
                  <div className="font-bold text-ink mb-2">Role & Requirements:</div>
                  <div style={{ whiteSpace: 'pre-line' }}>{selectedJob.jobDescription}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <label className="block">
                    <span className="eyebrow text-[10px]">Full Name</span>
                    <input
                      type="text"
                      className="field text-sm"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ada Lovelace"
                      required
                      disabled={formStatus === 'sending'}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow text-[10px]">Email Address</span>
                    <input
                      type="email"
                      className="field text-sm"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@domain.com"
                      required
                      disabled={formStatus === 'sending'}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow text-[10px]">Phone Number</span>
                    <input
                      type="tel"
                      className="field text-sm"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 012-3456"
                      required
                      disabled={formStatus === 'sending'}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow text-[10px]">Upload Resume (PDF, DOC, DOCX up to 5MB)</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-mono file:bg-gold/15 file:text-gold file:cursor-pointer hover:file:bg-gold/25 text-xs text-mute mt-2.5"
                      onChange={handleFileChange}
                      required
                      disabled={formStatus === 'sending'}
                    />
                  </label>
                </div>

                {formStatus === 'error' && (
                  <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 font-mono text-xs">
                    {errorMessage}
                  </div>
                )}

                {formStatus === 'success' && (
                  <div className="mt-6 p-4 rounded-xl border border-green-500/20 bg-green-950/20 text-green-400 font-mono text-xs">
                    Application submitted successfully! Our team will contact you.
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-gold mt-8 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 w-full justify-center sm:w-auto"
                  disabled={formStatus === 'sending'}
                  data-cursor="link"
                >
                  {formStatus === 'idle' && 'Submit Application →'}
                  {formStatus === 'sending' && 'Submitting Application...'}
                  {formStatus === 'success' && 'Application Submitted ✓'}
                  {formStatus === 'error' && 'Retry Submission →'}
                </button>
              </form>
            ) : (
              <div
                className={`glow-card rounded-3xl p-10 border border-line flex flex-col items-center text-center justify-center min-h-[300px] transition-all duration-1000 ${
                  animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                <div className="text-gold text-3xl mb-4">◈</div>
                <h3 className="font-display text-xl text-gold-2 mb-2">Select a Position</h3>
                <p className="text-mute text-xs max-w-xs leading-relaxed">
                  Choose one of the open positions from the left directory to read details, review requirements, and submit your application.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
