import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check } from 'lucide-react';

interface MermaidRendererProps {
  chart: string;
  id?: string;
  title?: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, id, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const uniqueId = useRef(`mermaid-${id || Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      themeVariables: {
        darkMode: isDark,
        background: isDark ? '#0f172a' : '#f8fafc',
        primaryColor: '#4f46e5',
        primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
        primaryBorderColor: isDark ? '#6366f1' : '#4338ca',
        lineColor: isDark ? '#94a3b8' : '#64748b',
        secondaryColor: '#0284c7',
        tertiaryColor: '#10b981',
      }
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(uniqueId.current, chart.trim());
        setSvgContent(svg);
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    };

    renderDiagram();

    // Listen for theme change observer
    const observer = new MutationObserver(() => {
      renderDiagram();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [chart]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
      {/* Title & Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>{title || 'Architecture & Execution Topology'}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
            title="Reset Zoom"
          >
            <RotateCcw size={14} />
          </button>
          <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-700 mx-1" />
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition font-mono text-[11px]"
            title="Copy Mermaid Source"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Mermaid'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className="p-6 overflow-x-auto flex justify-center items-center bg-slate-50/50 dark:bg-slate-900/50 min-h-[220px]"
      >
        {svgContent ? (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
            className="mermaid-wrapper w-full flex justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="text-xs text-slate-400 dark:text-slate-500 animate-pulse font-mono">
            Rendering high-fidelity architecture diagram...
          </div>
        )}
      </div>
    </div>
  );
};
