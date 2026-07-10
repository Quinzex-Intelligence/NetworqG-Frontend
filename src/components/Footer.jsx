import React from 'react';
import { useTheme } from '../ThemeContext';

export default function Footer({ onLinkClick, onPageChange }) {
  const { active } = useTheme();
  
  const handleNavClick = (e, id) => {
    e.preventDefault();
    onLinkClick(id);
  };

  const logoSrc = active.id === 'reversed-ocean-blue' ? '/logo-full.svg' : '/logo-full-inverted.svg';

  return (
    <footer id="footer" className="relative border-t border-line foot-grad pt-20 pb-72">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 pb-16">
          <div className="max-w-md">
            <div className="mb-5 flex items-center">
              <img src={logoSrc} alt="Networq Global Logo" className="h-8 w-auto" />
            </div>
            <p className="text-mute text-sm">
              A worldwide digital marketing agency, headquartered in New York with hubs in London, Dubai and Singapore.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-6 text-sm">
            <div>
              <div className="eyebrow mb-3">Studio</div>
              <ul className="space-y-2 text-ink/75">
                <li>
                  <a
                    href="#about"
                    className="hover:text-gold transition-colors duration-300"
                    onClick={(e) => handleNavClick(e, 'about')}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#work"
                    className="hover:text-gold transition-colors duration-300"
                    onClick={(e) => handleNavClick(e, 'work')}
                  >
                    Work
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gold transition-colors duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.('careers');
                    }}
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="eyebrow mb-3">Capabilities</div>
              <ul className="space-y-2 text-ink/75">
                <li>
                  <a
                    href="#services"
                    className="hover:text-gold transition-colors duration-300"
                    onClick={(e) => handleNavClick(e, 'services')}
                  >
                    Brand &amp; Strategy
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-gold transition-colors duration-300"
                    onClick={(e) => handleNavClick(e, 'services')}
                  >
                    Paid Media
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-gold transition-colors duration-300"
                    onClick={(e) => handleNavClick(e, 'services')}
                  >
                    Search &amp; SEO
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="eyebrow mb-3">Network</div>
              <ul className="space-y-2 text-ink/75">
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Dispatch (newsletter)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="hairline"></div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-mute font-mono">
          <div>© {new Date().getFullYear()} Networq Global Ltd. · All signals reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:text-gold transition-colors duration-300">
              Privacy
            </a>
            <a href="#" className="hover:text-gold transition-colors duration-300">
              Terms
            </a>
            <span className="text-gold">●</span>
            <span>NYC · LDN · DXB · SGP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
