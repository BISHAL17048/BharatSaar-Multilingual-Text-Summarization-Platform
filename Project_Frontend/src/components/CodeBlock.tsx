import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'bash',
  title,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-[#EAE4DC] dark:border-[#262626] bg-black shadow-lg transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#262626] text-xs text-stone-400">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4A261]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#81B29A]/80 inline-block" />
          </div>
          {title && <span className="font-semibold text-stone-200 mr-2">{title}</span>}
          <span className="px-2 py-0.5 rounded-md bg-[#251A16] text-[#E76F51] border border-[#422923] font-mono uppercase text-[10px] font-bold">
            {language}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {collapsible && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded hover:bg-[#252830] text-stone-400 hover:text-stone-200 transition"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#252830] hover:bg-[#2E323D] text-stone-300 hover:text-white transition active:scale-95 text-xs font-mono"
            title="Copy snippet"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      {expanded && (
        <div className="p-4 sm:p-5 overflow-x-auto text-sm font-mono leading-relaxed text-stone-200 selection:bg-[#C85A32]/40">
          <pre className="flex">
            <div className="select-none text-stone-600 text-right pr-4 border-r border-[#25282F] mr-4 font-mono text-xs">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <code className="text-[#F3F4F6] flex-1 whitespace-pre">{code.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
