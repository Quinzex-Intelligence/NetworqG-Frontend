import React from 'react';

const SECTIONS = [
  { id: 'top', label: 'hero' },
  { id: 'services', label: 'services' },
  { id: 'process', label: 'process' },
  // { id: 'work', label: 'work' },
  // { id: 'about', label: 'about' },
  { id: 'insights', label: 'insights' },
  { id: 'contact', label: 'contact' },
];

export default function ScrollRail({ activeIndex, onDotClick }) {
  return (
    <div id="scroll-rail">
      <div id="scroll-rail-fill"></div>
      <ul id="scroll-dots">
        {SECTIONS.map((sec, idx) => (
          <li
            key={sec.id}
            data-i={idx}
            title={sec.label}
            className={activeIndex === idx ? 'active' : ''}
            onClick={() => onDotClick(sec.id)}
          ></li>
        ))}
      </ul>
    </div>
  );
}
export { SECTIONS };
