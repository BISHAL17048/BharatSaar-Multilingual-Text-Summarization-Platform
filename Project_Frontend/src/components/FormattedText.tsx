import React from 'react';
import { MathBlock } from './MathBlock';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Parses and renders inline markdown:
 * - Bold: **text**
 * - Italic: *text*
 * - Code: `code`
 * - Inline LaTeX: $math$ or $`math`$
 * - Links: [label](url)
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  // Regex to match inline patterns
  // 1: Inline Math with backtick: $`...`$
  // 2: Inline Math: $...$
  // 3: Inline Code: `...`
  // 4: Markdown Link: [label](url)
  // 5: Bold: **...**
  // 6: Italic: *...*
  const pattern = /(\$`[^`]+`\$|\$[^$\n]+\$|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Inline Math: $`math`$
        if (part.startsWith('$`') && part.endsWith('`$')) {
          const math = part.slice(2, -2).trim();
          return <MathBlock key={index} math={math} block={false} />;
        }

        // Inline Math: $math$
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2 && !part.includes(' ')) {
          const math = part.slice(1, -1).trim();
          return <MathBlock key={index} math={math} block={false} />;
        }

        // Inline Code: `code`
        if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
          const code = part.slice(1, -1);
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-200 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-mono text-[0.88em] font-medium border border-slate-300 dark:border-slate-700"
            >
              {code}
            </code>
          );
        }

        // Markdown Link: [label](url)
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline font-medium decoration-indigo-400/60 hover:decoration-indigo-600 transition"
            >
              {label}
            </a>
          );
        }

        // Bold: **text**
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const inner = part.slice(2, -2);
          return <strong key={index} className="font-bold text-slate-900 dark:text-white">{inner}</strong>;
        }

        // Italic: *text*
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          const inner = part.slice(1, -1);
          return <em key={index} className="italic text-slate-800 dark:text-slate-200">{inner}</em>;
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
