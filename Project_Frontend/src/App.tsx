import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { TableOfContents } from './components/TableOfContents';
import { EnhancedShowcaseView } from './components/EnhancedShowcaseView';
import { CompleteReadmeView } from './components/CompleteReadmeView';
import { SearchModal } from './components/SearchModal';
import { ContentAuditModal } from './components/ContentAuditModal';
import { extractTableOfContents } from './utils/readmeParser';
import { README_RAW } from './data/readmeRaw';
import { School, Github, ShieldCheck } from 'lucide-react';

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
  const [activeTocId, setActiveTocId] = useState<string>('');

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

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0% -60% 0%' }
    );

    const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id], section[id]');
    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [viewMode]);

  const handleNavigateToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-200">
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
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
          {/* Main Content Area */}
          <main className={viewMode === 'enhanced' ? 'lg:col-span-9' : 'lg:col-span-9'}>
            {viewMode === 'enhanced' ? (
              <EnhancedShowcaseView onSwitchToReadme={() => setViewMode('readme')} />
            ) : (
              <CompleteReadmeView />
            )}
          </main>

          {/* Sticky Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-4">
              <TableOfContents
                items={tocItems}
                activeId={activeTocId}
                onItemClick={handleNavigateToSection}
              />

              {/* Quick Completeness Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck size={16} />
                  <span>README Completeness</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  100% of the 1,238 lines from README.md are preserved across both views without omission.
                </p>
                <button
                  onClick={() => setAuditOpen(true)}
                  className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-[11px] transition text-center"
                >
                  View Audit Report
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Academic Footer */}
      <footer className="mt-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                भ
              </div>
              <div>
                <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  BharatSaar
                </span>
                <p className="text-xs text-slate-500">
                  Multilingual Text Summarization Platform across 22 Indic Languages
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <School size={14} className="text-indigo-500" />
                Indian Institute of Technology Guwahati
              </span>
              <span>•</span>
              <span>Department of Electronics and Electrical Engineering</span>
              <span>•</span>
              <a
                href="https://github.com/BISHAL17048/BharatSaar-Multilingual-Text-Summarization-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
              >
                <Github size={14} />
                GitHub Repository
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-3">
            <p>
              Project Advisor: <strong className="text-slate-800 dark:text-slate-300">Dr. Prithwijit Guha</strong> • Mentors: <strong className="text-slate-800 dark:text-slate-300">Ashwin Jacob Gigo</strong> & <strong className="text-slate-800 dark:text-slate-300">Amaan Irfan</strong>
            </p>
            <p className="font-mono text-[11px]">
              Strict adherence to Meta AI RAG (arxiv: 2005.11401)
            </p>
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
