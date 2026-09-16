import React, { useState } from 'react';
import { TocItem } from '../utils/readmeParser';
import { Bookmark } from 'lucide-react';

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  onItemClick,
}) => {
  // Filter mainly level 2 and level 3 for cleaner sidebar reading, with expandable full view
  const [showSubsections, setShowSubsections] = useState(true);

  const displayedItems = showSubsections
    ? items.filter((item) => item.level <= 3)
    : items.filter((item) => item.level <= 2);

  return (
    <nav className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
          <Bookmark size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span>Table of Contents</span>
        </div>
        <button
          onClick={() => setShowSubsections(!showSubsections)}
          className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          title="Toggle subsections"
        >
          {showSubsections ? 'H2 Only' : 'Show All'}
        </button>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 text-xs">
        {displayedItems.map((item, idx) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={idx}
              href={`#${item.id}`}
              onClick={(e) => {
                if (onItemClick) {
                  e.preventDefault();
                  onItemClick(item.id);
                }
              }}
              className={`group flex items-start gap-2 py-1.5 px-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              } ${item.level === 3 ? 'pl-5 text-[11px]' : ''} ${item.level === 4 ? 'pl-8 text-[10px]' : ''}`}
            >
              {item.sectionNumber && (
                <span
                  className={`font-mono text-[10px] shrink-0 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {item.sectionNumber}
                </span>
              )}
              <span className="line-clamp-1 leading-snug">{item.text.replace(/^[#\s*🌟🎯🏗️🛠️⚙️🌐🟢🟠⚖️🧠📐📊🚀🌍]+/, '')}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
