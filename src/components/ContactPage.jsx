import React, { useState, useEffect } from 'react';

const CONTACT_SERVICES = [
  'Brand & Creative Services',
  'Social Media Marketing',
  'Performance Marketing',
  'SEO Services',
  'Website Services',
  'Content Marketing',
  'Video & Multimedia',
  'Email & Automation',
  'Business Growth Services',
  'Local Business Marketing',
  'Emerging Services'
];

const BUDGET_RANGES = [
  '< $5,000',
  '$5,000 – $20,000',
  '$20,000 – $50,000',
  '$50,000+'
];

const CONTACT_MODES = [
  'Call',
  'Email',
  'WhatsApp'
];

export default function ContactPage({ onBackClick }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedContactMode, setSelectedContactMode] = useState('');
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

  const handleServiceSelect = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(prev => prev.filter(s => s !== service));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
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
        company: '',
        message: ''
      });
      setSelectedServices([]);
      setSelectedBudget('');
      setSelectedContactMode('');
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
            <div className="eyebrow mb-4">Connect With Networq</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6">
              Contact <span className="italic gold-grad">Us</span>
            </h1>
            <p className="text-ink/80 text-base leading-relaxed mb-6">
              Want to talk to us or explore how we can help your business grow? Don’t wait, connect with our team now and let’s build something impactful together.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gold">◆</span>
                <span className="text-mute">Email: hello@networqglobal.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gold">◆</span>
                <span className="text-mute">HQ: NYC · Dubai · Singapore · London</span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <form
            className={`lg:col-span-7 glow-card rounded-3xl p-8 lg:p-10 border border-line transition-all duration-1000 ${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '300ms' }}
            onSubmit={handleSubmit}
          >
            <h2 className="font-display text-3xl mb-4 text-gold-2">Get in Touch</h2>
            <p className="text-mute text-sm mb-8">
              Share your details below and take the first step toward building your brand journey.
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
                <span className="eyebrow text-[10px]">Company Name (Optional)</span>
                <input
                  type="text"
                  className="field text-sm"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Brand or Organization"
                  disabled={formStatus === 'sending'}
                />
              </label>
            </div>

            {/* Services interested in checkboxes */}
            <div className="mt-8">
              <span className="eyebrow block mb-3 text-[10px]">Services You're Interested In</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {CONTACT_SERVICES.map((serv) => {
                  const isSelected = selectedServices.includes(serv);
                  return (
                    <button
                      key={serv}
                      type="button"
                      onClick={() => handleServiceSelect(serv)}
                      className={`chip rounded-full px-4 py-2 transition-all duration-300 font-medium ${
                        isSelected ? 'bg-gold/15 border-gold text-gold scale-[1.03]' : 'hover:border-gold/30'
                      }`}
                      disabled={formStatus === 'sending'}
                      data-cursor="link"
                    >
                      {serv}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range */}
            <div className="mt-6">
              <span className="eyebrow block mb-3 text-[10px]">Budget Range (Optional)</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {BUDGET_RANGES.map((budg) => {
                  const isSelected = selectedBudget === budg;
                  return (
                    <button
                      key={budg}
                      type="button"
                      onClick={() => setSelectedBudget(budg)}
                      className={`chip rounded-full px-4 py-2 transition-all duration-300 font-medium ${
                        isSelected ? 'bg-gold/15 border-gold text-gold scale-[1.03]' : 'hover:border-gold/30'
                      }`}
                      disabled={formStatus === 'sending'}
                      data-cursor="link"
                    >
                      {budg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Message */}
            <div className="mt-6">
              <label className="block">
                <span className="eyebrow text-[10px]">Short Message About You / Your Requirement</span>
                <textarea
                  rows="4"
                  className="field text-sm"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us a little about your project goals and deadlines..."
                  required
                  disabled={formStatus === 'sending'}
                ></textarea>
              </label>
            </div>

            {/* Preferred contact mode */}
            <div className="mt-6">
              <span className="eyebrow block mb-3 text-[10px]">Preferred Mode of Contact</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {CONTACT_MODES.map((mode) => {
                  const isSelected = selectedContactMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSelectedContactMode(mode)}
                      className={`chip rounded-full px-4 py-2 transition-all duration-300 font-medium ${
                        isSelected ? 'bg-gold/15 border-gold text-gold scale-[1.03]' : 'hover:border-gold/30'
                      }`}
                      disabled={formStatus === 'sending'}
                      data-cursor="link"
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn-gold mt-8 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 w-full justify-center sm:w-auto"
              disabled={formStatus === 'sending'}
              data-cursor="link"
            >
              {formStatus === 'idle' && (
                <>
                  Send Message <span aria-hidden="true">→</span>
                </>
              )}
              {formStatus === 'sending' && 'Sending...'}
              {formStatus === 'success' && 'Message Sent ✓'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
