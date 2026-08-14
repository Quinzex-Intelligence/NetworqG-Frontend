import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { 
  EMAILJS_SERVICE_ID, 
  EMAILJS_TEMPLATE_ID, 
  EMAILJS_PUBLIC_KEY 
} from '../config';

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    requirement: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically reset success message and button back to normal after 5 seconds
  React.useEffect(() => {
    if (formStatus === 'success') {
      const timer = setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(prev => prev.filter(s => s !== service));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setErrorMessage('');

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email,
        phone: formData.phone,
        company: formData.company || 'Not specified',
        services: selectedServices.length > 0 ? selectedServices.join(', ') : 'Not specified',
        requirement: formData.requirement,
        message: formData.requirement,
        to_name: 'Networq Global Team'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setFormStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        requirement: ''
      });
      setSelectedServices([]);
    } catch (err) {
      setFormStatus('error');
      setErrorMessage(err?.text || 'Network error. Please try again.');
    }
  };

  return (
    <section
      id="contact"
      data-section="contact"
      data-scene="vortex"
      data-edge-chip="07 · START A PROJECT"
      className="relative py-20 lg:py-24 border-t border-line overflow-hidden"
    >
      <div className="absolute inset-0 grid-overlay opacity-30" data-parallax="0.1"></div>
      
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col lg:grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 drift-up card p-6 md:p-8 rounded-2xl border border-line">
          <div className="eyebrow mb-3" data-anim="fade-up">
            06 — Start a Project
          </div>
          <h2
            className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight"
            data-split=""
            data-parallax="-0.05"
          >
            Let's <span className="italic gold-grad">build</span> the next move.
          </h2>
          <p className="text-mute mt-4 max-w-md text-sm" data-anim="fade-up">
            Tell us a little about the brand and the ambition. A partner will reply within one business day, anywhere on the network.
          </p>
          <div className="mt-10 space-y-3 text-sm" data-stagger="up">
            <div className="flex items-start gap-3">
              <span className="text-gold mt-1">◆</span>
              <div>
                <div className="text-gold-2">
                  <a href="mailto:hello@networqglobal.com">hello@networqglobal.com</a>
                </div>
                <div className="text-mute">New business · all markets</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-gold mt-1">◆</span>
              <div>
                <div className="text-gold-2">+1 (212) 555 0144</div>
                <div className="text-mute">NYC HQ · Mon–Fri</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-gold mt-1">◆</span>
              <div>
                <div className="text-gold-2">42 markets · 14 languages</div>
                <div className="text-mute">We come to you.</div>
              </div>
            </div>
          </div>
        </div>
        
        <form
          className="lg:col-span-7 card rounded-2xl p-8 lg:p-10 tilt-card"
          data-anim="fade-up"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <label className="block">
              <span className="eyebrow">01 / Your name</span>
              <input
                className="field text-sm"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Alexander Vance"
                required
                disabled={formStatus === 'sending'}
              />
            </label>
            <label className="block">
              <span className="eyebrow">02 / Company (Optional)</span>
              <input
                className="field text-sm"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g. Apex Global Ventures"
                disabled={formStatus === 'sending'}
              />
            </label>
            <label className="block">
              <span className="eyebrow">03 / Work email</span>
              <input
                className="field text-sm"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="alex@enterprise.com"
                required
                disabled={formStatus === 'sending'}
              />
            </label>
            <label className="block">
              <span className="eyebrow">04 / Phone Number</span>
              <input
                className="field text-sm"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 019-2834"
                required
                disabled={formStatus === 'sending'}
              />
            </label>
          </div>
          
          {/* 05 / Multi-Select Services Dropdown */}
          <div className="mt-6 relative" ref={dropdownRef}>
            <span className="eyebrow block mb-2">05 / Services You're Interested In</span>
            <button
              type="button"
              onClick={() => setIsServicesOpen(prev => !prev)}
              className="w-full text-left field text-sm flex items-center justify-between cursor-pointer py-3.5 transition-all"
              style={{
                borderBottom: isServicesOpen ? '1px solid var(--gold)' : '1px solid var(--line)'
              }}
              data-cursor="link"
            >
              <span className="truncate pr-4">
                {selectedServices.length === 0 ? (
                  <span className="text-[var(--mute)] opacity-50">Select services (multiple allowed)...</span>
                ) : (
                  <span className="text-gold font-medium">
                    {selectedServices.length === 1 
                      ? selectedServices[0] 
                      : `${selectedServices[0]} (+${selectedServices.length - 1} more)`}
                  </span>
                )}
              </span>
              <span className={`text-gold text-xs transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu Container */}
            {isServicesOpen && (
              <div
                data-lenis-prevent
                className="absolute left-0 right-0 top-full mt-2 rounded-2xl p-4 z-50 border border-[rgba(var(--accent-rgb),0.25)] shadow-2xl backdrop-blur-2xl"
                style={{
                  background: 'rgba(18, 18, 18, 0.96)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)] text-xs">
                  <span className="font-mono text-[10px] text-[var(--gold)] uppercase tracking-wider">
                    {selectedServices.length} Selected
                  </span>
                  {selectedServices.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedServices([])}
                      className="text-[10px] font-mono text-[var(--mute)] hover:text-[var(--gold)] transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div 
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar"
                  style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
                >
                  {CONTACT_SERVICES.map((serv) => {
                    const isSelected = selectedServices.includes(serv);
                    return (
                      <button
                        key={serv}
                        type="button"
                        onClick={() => handleServiceToggle(serv)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[rgba(var(--accent-rgb),0.15)] text-[var(--gold)] font-semibold border border-[rgba(var(--accent-rgb),0.3)]'
                            : 'text-[var(--ink)]/80 hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--gold)] border border-transparent'
                        }`}
                        data-cursor="link"
                      >
                        <span>{serv}</span>
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border transition-all ${
                          isSelected 
                            ? 'border-[var(--gold)] bg-[var(--gold)] text-[#0d0d0d] font-bold' 
                            : 'border-[var(--line)]'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* 06 / Requirement Textarea */}
          <div className="mt-6">
            <span className="eyebrow block mb-2">06 / Your Requirement / Project Goals</span>
            <textarea
              rows="4"
              className="field text-sm"
              name="requirement"
              value={formData.requirement}
              onChange={handleInputChange}
              placeholder="Tell Networq Global about your brand scaling goals, digital transformation, or market launch..."
              required
              disabled={formStatus === 'sending'}
            ></textarea>
          </div>

          {/* Feedback message banners */}
          {formStatus === 'success' && (
            <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-sm flex items-center gap-3">
              <span className="text-lg">✓</span>
              <span>Thank you! Your message has been sent successfully. We'll be in touch with you shortly.</span>
            </div>
          )}

          {formStatus === 'error' && (
            <div className="mt-6 p-4 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-sm flex items-center gap-3">
              <span className="text-lg">⚠</span>
              <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
            </div>
          )}
          
          <button
            type="submit"
            className="btn-gold mt-8 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            data-cursor="link"
            disabled={formStatus === 'sending'}
          >
            {formStatus === 'idle' && (
              <>
                Send to Networq <span aria-hidden="true">→</span>
              </>
            )}
            {formStatus === 'sending' && 'Sending message...'}
            {formStatus === 'success' && 'Message Sent ✓'}
            {formStatus === 'error' && 'Retry Sending →'}
          </button>
        </form>
      </div>
    </section>
  );
}
