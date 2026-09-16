import React from 'react';
import { MarkdownBlock } from '../utils/readmeParser';
import { CodeBlock } from './CodeBlock';
import { MathBlock } from './MathBlock';
import { MermaidRenderer } from './MermaidRenderer';
import { FormattedText } from './FormattedText';
import { Info, AlertTriangle, CheckCircle, Flame, Link2 } from 'lucide-react';

interface MarkdownRendererProps {
  blocks: MarkdownBlock[];
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ blocks }) => {
  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            const HeadingTag = `h${Math.min(block.level, 6)}` as keyof JSX.IntrinsicElements;
            const sizeClasses =
              block.level === 1
                ? 'text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-10 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800'
                : block.level === 2
                ? 'text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-10 mb-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60'
                : block.level === 3
                ? 'text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 mb-3'
                : block.level === 4
                ? 'text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-2'
                : 'text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-2';

            return (
              <div key={idx} id={block.id} className="group scroll-mt-24">
                <HeadingTag className={`${sizeClasses} flex items-center gap-2.5`}>
                  <FormattedText text={block.text} />
                  <a
                    href={`#${block.id}`}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-opacity p-1"
                    title="Copy section link"
                  >
                    <Link2 size={18} />
                  </a>
                </HeadingTag>
              </div>
            );
          }

          case 'paragraph': {
            return (
              <p key={idx} className="text-[1.03rem] leading-relaxed text-slate-700 dark:text-slate-300">
                <FormattedText text={block.text} />
              </p>
            );
          }

          case 'code': {
            return <CodeBlock key={idx} code={block.code} language={block.language} title={block.title} />;
          }

          case 'mermaid': {
            return <MermaidRenderer key={idx} chart={block.chart} id={`block-${idx}`} title={block.title} />;
          }

          case 'math': {
            return <MathBlock key={idx} math={block.math} block={block.block} />;
          }

          case 'callout': {
            const isWarning = block.alertType === 'WARNING' || block.alertType === 'CAUTION';
            const isTip = block.alertType === 'TIP';
            const isImportant = block.alertType === 'IMPORTANT';

            const borderColors = isWarning
              ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200'
              : isTip
              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
              : isImportant
              ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200'
              : 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200';

            const IconComponent = isWarning ? AlertTriangle : isTip ? CheckCircle : isImportant ? Flame : Info;

            return (
              <div
                key={idx}
                className={`my-4 p-4 rounded-xl border-l-4 shadow-sm ${borderColors} transition-all`}
              >
                <div className="flex items-center space-x-2 font-semibold text-sm mb-1.5 uppercase tracking-wide">
                  <IconComponent size={18} />
                  <span>{block.title}</span>
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  <FormattedText text={block.content} />
                </div>
              </div>
            );
          }

          case 'table': {
            return (
              <div key={idx} className="my-6 overflow-hidden rounded-xl border border-[#EAE4DC] dark:border-[#25282F] shadow-sm bg-white dark:bg-[#17191E]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#FAF8F5] dark:bg-[#1E2128] text-slate-900 dark:text-slate-100 border-b border-[#EAE4DC] dark:border-[#25282F]">
                        {block.headers.map((header, hIdx) => (
                          <th key={hIdx} className="px-4 py-3 font-semibold tracking-wider text-xs uppercase">
                            <FormattedText text={header} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE4DC] dark:divide-[#25282F]">
                      {block.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-slate-50 dark:hover:bg-[#1F2229] transition-colors"
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300 text-sm">
                              <FormattedText text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          case 'list': {
            const ListTag = block.ordered ? 'ol' : 'ul';
            const listClasses = block.ordered
              ? 'list-decimal list-outside pl-6 space-y-2'
              : 'list-disc list-outside pl-6 space-y-2';

            return (
              <ListTag key={idx} className={`${listClasses} text-slate-700 dark:text-slate-300 my-3`}>
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed pl-1 text-[1rem]">
                    <FormattedText text={item} />
                  </li>
                ))}
              </ListTag>
            );
          }

          case 'hr': {
            return <hr key={idx} className="my-8 border-slate-200 dark:border-slate-800" />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
};
