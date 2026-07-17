import React, { useState, useEffect } from 'react';

export default function CareersPage({ onBackClick }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    portfolio: '',
    coverLetter: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setAnimate(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate API request
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        portfolio: '',
        coverLetter: ''
      });
    }, 1200);
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
          {/* Info Column */}
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
              Are you driven by creativity and fueled by the passion to excel in the fast-paced world of global marketing? If you love building ideas that make an impact, you’ll fit right in with us.
            </p>
            <p className="text-mute text-sm leading-relaxed mb-6">
              Join our team and be part of shaping brands that stand out, grow, and lead. We offer competitive salaries, a flexible work environment, and the opportunity to work with premium international clients.
            </p>
          </div>

          {/* Form Column */}
          <form
            className={`lg:col-span-7 glow-card rounded-3xl p-8 lg:p-10 border border-line transition-all duration-1000 ${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '300ms' }}
            onSubmit={handleSubmit}
          >
            <h2 className="font-display text-3xl mb-4 text-gold-2">Apply Now</h2>
            <p className="text-mute text-sm mb-8">
              Share your details below and take the first step toward building your career with us.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <label className="block">
                <span className="eyebrow text-[10px]">Full Name</span>
                <input
                  type="text"
                  className="field text-sm"
                  name="name"
                  value={formData.name}
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
                <span className="eyebrow text-[10px]">Position Applying For</span>
                <input
                  type="text"
                  className="field text-sm"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Full Stack Engineer / Designer"
                  required
                  disabled={formStatus === 'sending'}
                />
              </label>
            </div>

            <div className="mt-6">
              <label className="block">
                <span className="eyebrow text-[10px]">Portfolio / LinkedIn Link (Optional)</span>
                <input
                  type="url"
                  className="field text-sm"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  disabled={formStatus === 'sending'}
                />
              </label>
            </div>

            <div className="mt-6">
              <label className="block">
                <span className="eyebrow text-[10px]">Why should we hire you?</span>
                <textarea
                  rows="4"
                  className="field text-sm"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Tell us about your passions, achievements, and what you will bring to Networq..."
                  required
                  disabled={formStatus === 'sending'}
                ></textarea>
              </label>
            </div>

            <button
              type="submit"
              className="btn-gold mt-8 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 w-full justify-center sm:w-auto"
              disabled={formStatus === 'sending'}
              data-cursor="link"
            >
              {formStatus === 'idle' && (
                <>
                  Submit Application <span aria-hidden="true">→</span>
                </>
              )}
              {formStatus === 'sending' && 'Submitting...'}
              {formStatus === 'success' && 'Application Submitted ✓'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
