import { GraduationCap, Award, Users, School, Compass } from 'lucide-react';

export const FacultyGuidance: React.FC = () => {
  return (
    <section id="faculty-guidance" className="my-14 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <GraduationCap size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Guidance & Project Mentorship
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Conducted under the research direction of Indian Institute of Technology Guwahati
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Advisor - Takes 2 columns for appropriate academic prominence */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white via-indigo-50/30 to-indigo-100/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/30 border-2 border-indigo-300/80 dark:border-indigo-700/60 shadow-lg p-6 sm:p-8 relative overflow-hidden transition-all hover:shadow-xl">
          {/* Subtle watermark badge */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-indigo-200/60 dark:border-indigo-800/60 pb-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Award size={14} />
                Faculty Advisor
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
                Principal Investigator
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
              <School size={15} />
              <span>IIT Guwahati</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Dr. Prithwijit Guha
              </h3>
              <p className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                Associate Professor
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                Department of Electronics and Electrical Engineering
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-200 tracking-wide mt-0.5">
                Indian Institute of Technology Guwahati (IIT Guwahati)
              </p>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              Project direction, architectural review, and academic validation for low-resource Indic natural language processing, transformer VRAM isolation models, and multi-tier semantic summarization pipelines.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                Computer Vision & NLP
              </span>
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                Machine Learning & Robotics
              </span>
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                Statistical Signal Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Project Mentors - 1 Column */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-indigo-500" />
                Project Mentors
              </span>
              <span className="text-xs text-slate-500 font-mono">Industry & Research</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Technical guidance across distributed asynchronous pipelines, translation pivot engineering, and model deployment:
            </p>

            <div className="space-y-4">
              {/* Mentor 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Ashwin Jacob Gigo
                  </h4>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Mentor
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Architecture Review & System Engineering
                </p>
              </div>

              {/* Mentor 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Amaan Irfan
                  </h4>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Mentor
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  NLP Pipeline Optimization & Verification
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <Compass size={13} className="text-indigo-500" />
              BharatSaar R&D
            </span>
            <span>Academic Year 2024-2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};
