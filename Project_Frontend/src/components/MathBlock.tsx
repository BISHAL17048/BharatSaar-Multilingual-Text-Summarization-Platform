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
        className={`my-3 p-3 overflow-x-auto rounded-xl bg-white dark:bg-black border border-[#EAE4DC] dark:border-[#262626] text-black dark:text-white shadow-xs ${className}`}
        ref={containerRef as React.RefObject<HTMLDivElement>}
      />
    );
  }

  return (
    <span 
      className={`inline-block px-1 font-mono text-sm text-black dark:text-white ${className}`}
      ref={containerRef as React.RefObject<HTMLSpanElement>}
    />
  );
};
