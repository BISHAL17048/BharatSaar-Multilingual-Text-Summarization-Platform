import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Hash, Code, FunctionSquare, Table as TableIcon, FileText } from 'lucide-react';
import { searchReadme, SearchResult } from '../utils/readmeParser';
import { README_RAW } from '../data/readmeRaw';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (sectionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'formula' | 'code' | 'table' | 'text'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const allResults = searchReadme(README_RAW, query);
      if (filter === 'all') {
        setResults(allResults);
      } else {
        setResults(allResults.filter((r) => r.matchType === filter));
      }
    } else {
      setResults([]);
    }
  }, [query, filter]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all README content, algorithms, equations, code..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X size={18} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-xs border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
          <span className="text-slate-400 font-medium mr-1">Filter:</span>
          {(['all', 'formula', 'code', 'table', 'text'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'formula' ? 'Equations' : f === 'all' ? 'All Content' : f}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {query.trim().length < 2 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">
                Search Documentation & Algorithmic Index
              </p>
              <p className="text-xs text-slate-500">
                Type at least 2 characters to search across 1,238 lines of technical specifications, LaTeX math, and code.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <button
                  onClick={() => setQuery('BGE-M3')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500"
                >
                  BGE-M3
                </button>
                <button
                  onClick={() => setQuery('Sarvam')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500"
                >
                  Sarvam
                </button>
                <button
                  onClick={() => setQuery('ROUGE-L')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500"
                >
                  ROUGE-L
                </button>
                <button
                  onClick={() => setQuery('Subprocess')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500"
                >
                  Subprocess
                </button>
                <button
                  onClick={() => setQuery('Dr. Prithwijit Guha')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-500"
                >
                  Dr. Prithwijit Guha
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No results found for "<span className="text-slate-600 dark:text-slate-200 font-semibold">{query}</span>"
            </div>
          ) : (
            results.map((res, i) => {
              const Icon =
                res.matchType === 'formula'
                  ? FunctionSquare
                  : res.matchType === 'code'
                  ? Code
                  : res.matchType === 'table'
                  ? TableIcon
                  : res.matchType === 'heading'
                  ? Hash
                  : FileText;

              return (
                <div
                  key={i}
                  onClick={() => {
                    onSelectResult(res.sectionId);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Icon size={14} />
                      <span>{res.sectionTitle}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {res.matchType}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-mono line-clamp-2 pl-5">
                    {res.snippet}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between items-center font-mono">
          <span>{results.length} results indexed</span>
          <span>Click any item to navigate</span>
        </div>
      </div>
    </div>
  );
};
