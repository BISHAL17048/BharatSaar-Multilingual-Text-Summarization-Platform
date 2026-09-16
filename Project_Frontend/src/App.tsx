import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { EnhancedShowcaseView } from './components/EnhancedShowcaseView';
import { CompleteReadmeView } from './components/CompleteReadmeView';
import { SearchModal } from './components/SearchModal';
import { ContentAuditModal } from './components/ContentAuditModal';
import { extractTableOfContents } from './utils/readmeParser';
import { README_RAW } from './data/readmeRaw';

export const App: React.FC = () => {
  // Theme state with local storage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bharatsaar_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // View Mode: 'enhanced' presentation vs 'readme' line-by-line
  const [viewMode, setViewMode] = useState<'enhanced' | 'readme'>('enhanced');

  // Modal states
  const [searchOpen, setSearchOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  // Extract Table of Contents from README
  const tocItems = useMemo(() => {
    return extractTableOfContents(README_RAW);
  }, []);

  // Sync dark mode class with DOM & localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bharatsaar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bharatsaar_theme', 'light');
    }
  }, [darkMode]);

  // Global Keyboard Shortcuts (Ctrl+K or / to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#111215] text-[#1C1917] dark:text-[#F3F4F6] transition-colors duration-300 relative overflow-x-hidden selection:bg-[#C85A32] selection:text-white">
      {/* Ambient Atmospheric Radial Lighting (Matches User Reference Screenshots) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed -top-24 -right-24 w-[600px] h-[600px] bg-gradient-to-bl from-amber-300/25 via-orange-300/15 to-transparent dark:from-amber-600/15 dark:via-orange-700/8 dark:to-transparent rounded-full blur-3xl z-0" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed -bottom-32 -left-32 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-200/20 via-teal-100/15 to-transparent dark:from-emerald-700/8 dark:via-teal-800/5 dark:to-transparent rounded-full blur-3xl z-0" 
      />

      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openSearch={() => setSearchOpen(true)}
        openAudit={() => setAuditOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 relative z-10">
        <main className="w-full">
          {viewMode === 'enhanced' ? (
            <EnhancedShowcaseView onSwitchToReadme={() => setViewMode('readme')} />
          ) : (
            <CompleteReadmeView />
          )}
        </main>
      </div>

      {/* Editorial Academic Footer */}
      <footer className="mt-20 bg-white/70 dark:bg-[#15171C]/80 backdrop-blur-md border-t border-[#EAE4DC] dark:border-[#25282F] py-12 transition-colors relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-sans font-extrabold text-lg text-[#1C1917] dark:text-[#F3F4F6] tracking-tight">
                BharatSaar <span className="font-normal text-stone-400">⋅</span> <span className="text-sm font-semibold text-[#C85A32] dark:text-[#E76F51]">Multilingual Text Summarization Platform</span>
              </span>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] font-medium mt-0.5">
                Multilingual Text Summarization Platform Across 22 Indic Languages
              </p>
              <p className="text-xs text-stone-600 dark:text-white font-normal mt-2">
                © 2026 BharatSaar : Multilingual Text Summarization. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectResult={handleNavigateToSection}
      />

      <ContentAuditModal
        isOpen={auditOpen}
        onClose={() => setAuditOpen(false)}
        tocItems={tocItems}
      />
    </div>
  );
};

export default App;
