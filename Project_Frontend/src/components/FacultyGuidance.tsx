import { GraduationCap, Award, Users, School, Phone, Mail } from 'lucide-react';

export const FacultyGuidance: React.FC = () => {
  return (
    <section id="faculty-guidance" className="my-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-[#FBF0EB] dark:bg-[#2A1E1A] text-[#C85A32] dark:text-[#E76F51] border border-[#F2DDD3] dark:border-[#422923]">
          <GraduationCap size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1C1917] dark:text-[#F3F4F6] tracking-tight">
            Academic Guidance & Project Mentorship
          </h2>
          <p className="text-sm text-[#78716C] dark:text-[#A8A29E] font-medium">
            Conducted under the research direction of Indian Institute of Technology Guwahati
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Advisor - Takes 2 columns for appropriate academic prominence */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#17191E] border border-[#EAE4DC] dark:border-[#25282F] shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          {/* Subtle warm glow watermark */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-[#F0EBE3] dark:border-[#25282F] pb-4">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full bg-[#C85A32] dark:bg-[#E76F51] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Award size={14} />
                Faculty Advisor
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#C85A32] dark:text-[#E76F51] font-semibold">
              <School size={15} />
              <span>IIT Guwahati</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={`${import.meta.env.BASE_URL}prithwijit_guha.jpg`}
                alt="Dr. Prithwijit Guha"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#EAE4DC] dark:border-[#25282F] shadow-md ring-4 ring-[#FAF8F5] dark:ring-[#1E2128] shrink-0"
              />
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1C1917] dark:text-[#F3F4F6] tracking-tight">
                  Dr. Prithwijit Guha
                </h3>
                <p className="text-base sm:text-lg font-semibold text-[#C85A32] dark:text-[#E76F51] mt-1">
                  Associate Professor
                </p>
                <p className="text-sm font-medium text-black dark:text-stone-300 mt-0.5">
                  Department of Electronics and Electrical Engineering
                </p>
                <p className="text-sm font-bold text-black dark:text-stone-200 tracking-wide mt-0.5">
                  Indian Institute of Technology Guwahati (IIT Guwahati)
                </p>

                {/* Contact Information */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-xs text-black dark:text-[#A8A29E]">
                  <a
                    href="tel:+913612583452"
                    className="inline-flex items-center gap-1.5 hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors font-medium"
                    title="Call Office"
                  >
                    <Phone size={13} className="text-[#C85A32] dark:text-[#E76F51]" />
                    <span>+91-361-258-3452 (Office)</span>
                  </a>
                  <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
                  <a
                    href="mailto:pguha@iitg.ac.in"
                    className="inline-flex items-center gap-1.5 hover:text-[#C85A32] dark:hover:text-[#E76F51] transition-colors font-mono"
                    title="Send Email"
                  >
                    <Mail size={13} className="text-[#C85A32] dark:text-[#E76F51]" />
                    <span>pguha@iitg.ac.in</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-lg bg-white dark:bg-[#1E2128] text-black dark:text-stone-200 border border-[#EAE4DC] dark:border-[#2A2E37]">
                Computer Vision & NLP
              </span>
              <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-lg bg-white dark:bg-[#1E2128] text-black dark:text-stone-200 border border-[#EAE4DC] dark:border-[#2A2E37]">
                Machine Learning & Robotics
              </span>
              <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-lg bg-white dark:bg-[#1E2128] text-black dark:text-stone-200 border border-[#EAE4DC] dark:border-[#2A2E37]">
                Statistical Signal Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Project Mentors - 1 Column */}
        <div className="rounded-3xl bg-white dark:bg-[#17191E] border border-[#EAE4DC] dark:border-[#25282F] shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-[#F0EBE3] dark:border-[#25282F] pb-3">
              <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1E2128] text-black dark:text-stone-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-[#EAE4DC] dark:border-[#2A2E37]">
                <Users size={14} className="text-[#C85A32] dark:text-[#E76F51]" />
                Project Mentors
              </span>
              <span className="text-xs text-black dark:text-[#A8A29E] font-mono">Industry & Research</span>
            </div>

            <div className="space-y-4">
              {/* Mentor 1: Amaan Irfan (2nd Picture) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1F26] border border-[#EAE4DC] dark:border-[#2A2E37] flex items-center gap-3.5 shadow-xs">
                <img
                  src={`${import.meta.env.BASE_URL}amaan_irfan.jpg`}
                  alt="Amaan Irfan"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EAE4DC] dark:border-[#25282F] shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-black dark:text-[#F3F4F6] text-sm sm:text-base truncate">
                      Amaan Irfan
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FBF0EB] dark:bg-[#2A1E1A] text-[#C85A32] dark:text-[#E76F51] shrink-0 border border-[#F2DDD3] dark:border-[#422923]">
                      Mentor
                    </span>
                  </div>
                  <p className="text-xs text-black dark:text-stone-300 mt-0.5 font-medium">
                    NLP Pipeline Optimization & Verification
                  </p>
                </div>
              </div>

              {/* Mentor 2: Ashwin Jacob Gigo (3rd Picture) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1C1F26] border border-[#EAE4DC] dark:border-[#2A2E37] flex items-center gap-3.5 shadow-xs">
                <img
                  src={`${import.meta.env.BASE_URL}ashwin_jacob_gigo.jpg`}
                  alt="Ashwin Jacob Gigo"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EAE4DC] dark:border-[#25282F] shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-black dark:text-[#F3F4F6] text-sm sm:text-base truncate">
                      Ashwin Jacob Gigo
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FBF0EB] dark:bg-[#2A1E1A] text-[#C85A32] dark:text-[#E76F51] shrink-0 border border-[#F2DDD3] dark:border-[#422923]">
                      Mentor
                    </span>
                  </div>
                  <p className="text-xs text-black dark:text-stone-300 mt-0.5 font-medium">
                    Architecture Review & System Engineering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
