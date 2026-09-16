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

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: 12,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 25,
        rankSpacing: 28,
        padding: 8,
      },
      sequence: {
        useMaxWidth: true,
        actorFontSize: 12,
        messageFontSize: 11,
        noteFontSize: 11,
        boxMargin: 8,
      },
      gantt: {
        useMaxWidth: true,
        fontSize: 12,
        sectionFontSize: 12,
        barHeight: 24,
        barGap: 6,
        topPadding: 45,
        leftPadding: 160,
        gridLineStartPadding: 35,
      },
      themeVariables: {
        darkMode: isDark,
        fontSize: '12px',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: isDark ? '#17191E' : '#f8fafc',
        primaryColor: isDark ? '#22252C' : '#FFFFFF',
        primaryTextColor: isDark ? '#F3F4F6' : '#1C1917',
        primaryBorderColor: isDark ? '#3D4250' : '#D8D2C7',
        lineColor: isDark ? '#E76F51' : '#C85A32',
        secondaryColor: isDark ? '#1A1D24' : '#F5EFEB',
        tertiaryColor: isDark ? '#14161B' : '#FAF8F5',
        mainBkg: isDark ? '#22252C' : '#FFFFFF',
        nodeBorder: isDark ? '#3D4250' : '#D8D2C7',
        clusterBkg: isDark ? '#1A1D24' : '#F5EFEB',
        clusterBorder: isDark ? '#2D313A' : '#EAE4DC',
        titleColor: isDark ? '#F3F4F6' : '#1C1917',
        edgeLabelBackground: isDark ? '#17191E' : '#FFFFFF',
      }
    });

    const renderDiagram = async () => {
      try {
        const renderId = (id ? `mermaid-${id}-` : 'mermaid-') + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
        const { svg } = await mermaid.render(renderId, chart.trim());
        setSvgContent(svg);
      } catch (err) {
        console.error('Mermaid render error for chart:', title, err);
      }
    };

    renderDiagram();

    // Listen for theme change observer
    const observer = new MutationObserver(() => {
      renderDiagram();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [chart, title, id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFit = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const paddingX = 40;
    const paddingY = 40;
    const containerW = containerRef.current.clientWidth - paddingX;
    const containerH = (containerRef.current.clientHeight || 450) - paddingY;

    let svgW = 0;
    let svgH = 0;

    const viewBox = svgEl.viewBox?.baseVal;
    if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
      svgW = viewBox.width;
      svgH = viewBox.height;
    } else {
      svgW = svgEl.scrollWidth || svgEl.clientWidth || 800;
      svgH = svgEl.scrollHeight || svgEl.clientHeight || 400;
    }

    if (svgW > 0 && containerW > 0) {
      const scaleX = containerW / svgW;
      const scaleY = containerH > 0 && svgH > 0 ? containerH / svgH : scaleX;
      const fitScale = Math.min(scaleX, scaleY);
      const targetZoom = Math.max(0.35, Math.min(1.4, +fitScale.toFixed(2)));
      setZoom((current) => (Math.abs(current - targetZoom) < 0.05 ? 1 : targetZoom));
    } else {
      setZoom((z) => (z === 1 ? 0.75 : 1));
    }
  };

  return (
    <div className="my-6 rounded-xl border border-[#EAE4DC] dark:border-[#25282F] bg-white dark:bg-[#17191E] shadow-sm overflow-hidden">
      {/* Title & Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF8F5] dark:bg-[#14161B] border-b border-[#EAE4DC] dark:border-[#25282F] text-xs text-stone-600 dark:text-stone-400">
        <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#C85A32] dark:bg-[#E76F51]" />
          <span>{title || 'Architecture & Execution Topology'}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.15).toFixed(2)))}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#25282F] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)))}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#25282F] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#25282F] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
            title="Reset to 100%"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleFit}
            className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-200/70 dark:bg-[#1E2128] border border-transparent dark:border-[#25282F] text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-[#2A2E37] transition"
            title="Fit diagram into card container"
          >
            {zoom !== 1 ? "100%" : "Fit"}
          </button>
          <div className="w-[1px] h-3.5 bg-stone-300 dark:bg-[#25282F] mx-1" />
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-stone-200/70 dark:bg-[#1E2128] border border-transparent dark:border-[#25282F] text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-[#2A2E37] transition font-mono text-[11px]"
            title="Copy Mermaid Source"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Mermaid'}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container with Responsive Natural Height & Clean Scroll */}
      <div 
        ref={containerRef}
        className="p-4 sm:p-6 overflow-auto flex justify-center items-center bg-[#FAF8F5]/50 dark:bg-[#17191E] min-h-[180px] max-h-[640px]"
      >
        {svgContent ? (
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'top center', 
              transition: 'transform 0.15s ease-out',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
            className="mermaid-wrapper flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="text-xs text-slate-400 dark:text-slate-500 animate-pulse font-mono self-center">
            Rendering high-fidelity architecture diagram...
          </div>
        )}
      </div>
    </div>
  );
};
