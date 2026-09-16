import React from 'react';
import {
  Sun,
  Moon,
  Search,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Github,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  viewMode: 'enhanced' | 'readme';
  setViewMode: (mode: 'enhanced' | 'readme') => void;
  openSearch: () => void;
  openAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  viewMode,
  setViewMode,
  openSearch,
  openAudit,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Academic Sub-Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center tracking-wider uppercase font-mono border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Indian Institute of Technology Guwahati</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Department of Electronics & Electrical Engineering</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-amber-400 font-medium">B.Tech / M.Tech Research Platform</span>
          <span className="text-slate-500">v1.0.0</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <span className="font-display font-black text-xl">भ</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                Bharat<span className="text-indigo-600 dark:text-indigo-400">Saar</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                22 Indic AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Multilingual Text Summarization Platform
            </p>
          </div>
        </div>

        {/* Center View Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('enhanced')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'enhanced'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={14} className={viewMode === 'enhanced' ? 'text-indigo-500' : ''} />
            <span className="hidden sm:inline">Enhanced</span> Presentation
          </button>
          <button
            onClick={() => setViewMode('readme')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'readme'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} className={viewMode === 'readme' ? 'text-indigo-500' : ''} />
            <span className="hidden sm:inline">Complete</span> README.md
          </button>
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 text-xs transition group"
            title="Search Documentation (Ctrl+K or /)"
          >
            <Search size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="hidden md:inline">Search docs...</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Completeness Audit Badge/Button */}
          <button
            onClick={openAudit}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-medium transition"
            title="README Completeness Audit"
          >
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="hidden lg:inline">100% Audit</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/BISHAL17048/BharatSaar-Multilingual-Text-Summarization-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition"
            title="View Source on GitHub"
          >
            <Github size={17} />
          </a>
        </div>
      </div>
    </header>
  );
};
