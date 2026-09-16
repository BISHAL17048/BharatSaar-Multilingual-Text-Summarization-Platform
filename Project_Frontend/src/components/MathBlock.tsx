import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathBlockProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ math, block = true, className = '' }) => {
  const containerRef = useRef<HTMLDivElement | HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.textContent = math;
      }
    }
  }, [math, block]);

  if (block) {
    return (
      <div 
        className={`my-3 p-3 overflow-x-auto rounded-lg bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 ${className}`}
        ref={containerRef as React.RefObject<HTMLDivElement>}
      />
    );
  }

  return (
    <span 
      className={`inline-block px-1 font-mono text-sm ${className}`}
      ref={containerRef as React.RefObject<HTMLSpanElement>}
    />
  );
};
