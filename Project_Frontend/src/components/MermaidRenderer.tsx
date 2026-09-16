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
      fontSize: 13,
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 40,
        rankSpacing: 45,
        padding: 20,
      },
      sequence: {
        useMaxWidth: false,
        actorFontSize: 12,
        messageFontSize: 11,
        noteFontSize: 11,
        boxMargin: 10,
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
        fontSize: '13px',
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

        // Patch SVG: remove fixed width/height, let it scale via viewBox
        const patched = svg
          .replace(/width="[^"]*"/, 'width="100%"')
          .replace(/height="[^"]*"/, 'height="auto"')
          .replace(/style="[^"]*max-width[^"]*"/g, '');

        setSvgContent(patched);
      } catch (err) {
        console.error('Mermaid render error for chart:', title, err);
      }
    };

    renderDiagram();

    const observer = new MutationObserver(() => {
      renderDiagram();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [chart, title, id]);

  // Auto-fit zoom after SVG renders
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    // Small delay to let the DOM paint the SVG
    const timer = setTimeout(() => {
      autoFit();
    }, 120);
    return () => clearTimeout(timer);
  }, [svgContent]);

  const autoFit = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const paddingX = 48;
    const containerW = containerRef.current.clientWidth - paddingX;

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

    if (svgW > 0 && containerW > 0 && svgW > containerW) {
      const scale = containerW / svgW;
      setZoom(Math.max(0.3, Math.min(1.0, +scale.toFixed(2))));
    } else {
      setZoom(1);
    }
    void svgH; // suppress lint
  };

  const handleFit = () => {
    autoFit();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Compute rendered SVG natural height from viewBox so container grows to fit
  const getSvgNaturalHeight = (): number | undefined => {
    if (!containerRef.current) return undefined;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return undefined;
    const viewBox = svgEl.viewBox?.baseVal;
    if (viewBox && viewBox.height > 0 && viewBox.width > 0) {
      const containerW = containerRef.current.clientWidth - 48;
      const scale = zoom < 1 ? zoom : Math.min(1, containerW / viewBox.width);
      return viewBox.height * scale + 80;
    }
    return undefined;
  };

  const naturalH = getSvgNaturalHeight();
  const canvasMinH = Math.max(200, naturalH ?? 200);
  const canvasMaxH = Math.min(Math.max(canvasMinH, 500), 1600);

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
            onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.1).toFixed(2)))}
            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#25282F] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))}
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
            title="Fit diagram into card"
          >
            Fit
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

      {/* SVG Canvas — scrollable both axes, grows to fit natural height */}
      <div
        ref={containerRef}
        className="overflow-auto bg-[#FAF8F5]/50 dark:bg-[#17191E]"
        style={{ minHeight: `${canvasMinH}px`, maxHeight: `${canvasMaxH}px` }}
      >
        {svgContent ? (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
              display: 'inline-block',
              padding: '24px',
              minWidth: '100%',
            }}
            className="mermaid-wrapper"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400 dark:text-slate-500 animate-pulse font-mono">
            Rendering architecture diagram...
          </div>
        )}
      </div>
    </div>
  );
};
