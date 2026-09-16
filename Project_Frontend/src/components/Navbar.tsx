import React from 'react';
import {
  Sun,
  Moon,
  Github,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  viewMode?: 'enhanced' | 'readme';
  setViewMode?: (mode: 'enhanced' | 'readme') => void;
  openSearch?: () => void;
  openAudit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-[#FAF7F2]/90 dark:bg-[#111215]/90 border-b border-[#EAE4DC] dark:border-[#25282F] transition-colors duration-300 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-3 xl:gap-4">
        {/* Left Branding: BharatSaar Platform */}
        <div className="shrink-0 flex items-center space-x-3">
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[#EAE4DC] dark:border-[#25282F] p-0.5 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src={`${import.meta.env.BASE_URL}bharatsaar_emblem.png`}
                alt="BharatSaar Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-black text-xl sm:text-2xl text-[#1C1917] dark:text-[#F3F4F6] tracking-tight">
                  Bharat<span className="text-[#C85A32] dark:text-[#E76F51]">Saar</span>
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] hidden min-[1680px]:block font-medium">
                Multilingual Text Summarization Platform
              </p>
            </div>
          </a>
        </div>

        {/* Center / Desktop Navigation Links: All sections included, Mentors & Benchmarks excluded */}
        <nav className="hidden lg:flex items-center space-x-2.5 xl:space-x-3 2xl:space-x-3.5 text-[11px] xl:text-[11.5px] font-bold tracking-wide uppercase text-stone-600 dark:text-stone-300 overflow-x-auto no-scrollbar whitespace-nowrap py-1 scroll-smooth mx-1">
          <a href="#hero" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            About
          </a>
          <a href="#features" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Key Features
          </a>
          <a href="#project-presentation" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Presentation
          </a>
          <a href="#system-architecture" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Architecture
          </a>
          <a href="#technology-stack" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Tech Stack
          </a>
          <a href="#how-it-works" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            How It Works
          </a>
          <a href="#algorithmic-flowcharts" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Flowcharts
          </a>
          <a href="#core-pipeline-logic" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Logic
          </a>
          <a href="#mathematical-foundations" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Mathematical Foundations
          </a>
          <a href="#getting-started" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Setup
          </a>
          <a href="#supported-languages" className="hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors shrink-0">
            Languages
          </a>
        </nav>

        {/* Right Tools & Actions */}
        <div className="shrink-0 flex items-center space-x-2">

          {/* GitHub Link */}
          <a
            href="https://github.com/BISHAL17048/BharatSaar-Multilingual-Text-Summarization-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-[#EAE4DC] dark:border-[#25282F] bg-[#FFFFFF] dark:bg-[#17191E] text-stone-700 dark:text-stone-300 hover:text-[#C85A32] dark:hover:text-[#E76F51] transition shadow-sm"
            title="View Source on GitHub"
          >
            <Github size={17} />
          </a>

          {/* Dark / Light Toggle matching user reference screenshot */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-[#EAE4DC] dark:border-[#25282F] bg-[#FFFFFF] dark:bg-[#17191E] text-[#D97706] hover:border-[#D8D2C7] dark:hover:border-[#3D4250] transition shadow-sm"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun size={18} className="text-[#F59E0B] fill-[#F59E0B]/25 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={18} className="text-[#D97706] fill-[#D97706]/25 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
