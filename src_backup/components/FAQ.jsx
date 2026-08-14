import React, { useState } from 'react';

const FAQS = [
  {
    q: "Why should I choose Networq?",
    a: "Our key motto is not only to build empowering digital solutions for all kinds of businesses, but also to ensure that your vision is kept alive throughout the process. Choose us to see your vision flourish the right way!"
  },
  {
    q: "Will there be fixed plans or will it change with brand/business?",
    a: "No business or brand will have the same plan of action. The entire process, from beginning to end, will be different and tailored to their specific requirements. We make sure to conduct thorough research for every business, regardless of its sector, to deliver the best possible results."
  },
  {
    q: "What will be my role in your process?",
    a: "Your role is to share your vision, goals, and requirements clearly with us. We handle the research, planning, and execution, while keeping you updated at key stages for feedback. It’s a collaborative process where you guide the direction and we bring it to life."
  },
  {
    q: "Will your team monitor the campaigns every day?",
    a: "Yes, we monitor campaigns daily to track performance and optimize every lead generated, helping us maintain consistency and continuously improve results while ensuring steady growth and strong brand value."
  },
  {
    q: "Is Networq open to work with any kind of brands/business?",
    a: "Yes, we are open to working with all business sectors globally."
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      data-section="faq"
      data-scene="field"
      data-edge-chip="FAQ's"
      className="relative py-20 lg:py-24 border-t border-line overflow-hidden"
    >
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <div className="card p-6 md:p-8 rounded-2xl mb-12 text-center flex flex-col items-center justify-center" data-anim="fade-up">
          {/* <div className="eyebrow mb-3">Questions & Answers</div> */}
          <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] tracking-tight">
            Frequently Asked <span className="italic gold-grad">Questions</span>
          </h2>
        </div>

        <div className="space-y-4" data-stagger="up">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="card rounded-xl overflow-hidden transition-all duration-300 border border-line"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 hover:bg-gold-2/5 transition-colors duration-300"
                >
                  <span className="font-display text-xl md:text-2xl text-gold-2">
                    {faq.q}
                  </span>
                  <span className={`text-gold transition-transform duration-300 font-mono ${isOpen ? 'rotate-45' : ''}`}>
                    ＋
                  </span>
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] opacity-100 border-t border-line/50' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 md:p-8 text-mute text-base leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
