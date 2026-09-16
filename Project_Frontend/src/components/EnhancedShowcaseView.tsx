import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  Database,
  Globe,
  Zap,
  CheckCircle2,
  Terminal,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Split,
  Workflow,
  BarChart3,
  Search,
  School,
  Video,
} from 'lucide-react';
import { MermaidRenderer } from './MermaidRenderer';
import { MathBlock } from './MathBlock';
import { CodeBlock } from './CodeBlock';
import { FacultyGuidance } from './FacultyGuidance';
import { FormattedText } from './FormattedText';

interface EnhancedShowcaseViewProps {
  onSwitchToReadme: () => void;
}

export const EnhancedShowcaseView: React.FC<EnhancedShowcaseViewProps> = ({ onSwitchToReadme }) => {
  const [pipelineTab, setPipelineTab] = useState<'part1' | 'part2' | 'comparison'>('comparison');
  const [selectedLangTier, setSelectedLangTier] = useState<'all' | 'high' | 'low'>('all');

  const highResourceLangs = [
    { name: 'Assamese', code: 'asm', script: 'Bengali-Assamese' },
    { name: 'Bengali', code: 'ben', script: 'Bengali' },
    { name: 'Gujarati', code: 'guj', script: 'Gujarati' },
    { name: 'Hindi', code: 'hin', script: 'Devanagari' },
    { name: 'Kannada', code: 'kan', script: 'Kannada' },
    { name: 'Malayalam', code: 'mal', script: 'Malayalam' },
    { name: 'Marathi', code: 'mar', script: 'Devanagari' },
    { name: 'Nepali', code: 'nep', script: 'Devanagari' },
    { name: 'Odia', code: 'ori', script: 'Odia' },
    { name: 'Punjabi', code: 'pan', script: 'Gurmukhi' },
    { name: 'Tamil', code: 'tam', script: 'Tamil' },
    { name: 'Telugu', code: 'tel', script: 'Telugu' },
    { name: 'Urdu', code: 'urd', script: 'Perso-Arabic' },
    { name: 'English', code: 'eng', script: 'Latin' },
  ];

  const lowResourceLangs = [
    { name: 'Bodo', code: 'brx', script: 'Devanagari', gain: '+109.9%' },
    { name: 'Dogri', code: 'doi', script: 'Devanagari', gain: '+101.1%' },
    { name: 'Kashmiri', code: 'kas', script: 'Perso-Arabic / Deva', gain: '+117.6%' },
    { name: 'Konkani', code: 'kok', script: 'Devanagari', gain: '+89.2%' },
    { name: 'Maithili', code: 'mai', script: 'Devanagari', gain: '+85.7%' },
    { name: 'Manipuri', code: 'mni', script: 'Meitei Mayek / Bengali', gain: 'Standard' },
    { name: 'Sanskrit', code: 'san', script: 'Devanagari', gain: 'Classical' },
    { name: 'Santali', code: 'sat', script: 'Ol Chiki', gain: '+131.6%' },
    { name: 'Sindhi', code: 'snd', script: 'Perso-Arabic / Deva', gain: 'Standard' },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-900/10 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-12 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm text-xs font-semibold">
            <School size={15} />
            <span>IIT Guwahati Academic NLP Platform</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-amber-600 dark:text-amber-400">Department of EEE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
            Bharat<span className="text-indigo-600 dark:text-indigo-400">Saar</span>
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-slate-700 dark:text-slate-200 font-display">
            Multilingual Text Summarization Platform Across 22 Indic Languages & English
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            BharatSaar is an advanced, AI-driven SaaS platform designed to extract, analyze, and intelligently summarize news articles across <strong>22 Indic languages</strong> and English. By leveraging a localized, state-of-the-art AI pipeline, BharatSaar seamlessly handles complex long-context news articles from URLs. It breaks them down semantically, extracts critical named entities and topics, and generates highly accurate abstractive summaries—all while preserving the rich native context of low-resource regional languages.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                22+1
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Languages Supported
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                5.2 GB
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Peak VRAM (Isolated)
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                +110%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Low-Resource Quality Gain
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                ~33s
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                End-to-End Latency
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#architecture"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition active:scale-95 flex items-center gap-2"
            >
              <Workflow size={16} />
              Explore System Architecture
            </a>
            <button
              onClick={onSwitchToReadme}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-sm transition active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <BookOpen size={16} />
              View Complete README (100% Raw)
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACADEMIC GUIDANCE & FACULTY ADVISOR */}
      <FacultyGuidance />

      {/* 3. KEY FEATURES & WHAT IT DOES */}
      <section id="features" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Key Features & Capabilities
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Core innovations addressing information overload in regional Indian languages
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Instant URL Extraction',
              desc: 'Simply paste a link to any news article. Aggressively bypasses ads, popups, and paywall obfuscation to cleanly extract the core markdown text using Crawl4AI and Trafilatura.',
              icon: Globe,
              tag: 'Crawl4AI + Trafilatura',
            },
            {
              title: 'Intelligent Language Detection',
              desc: 'Employs FastText and IndicLID to automatically detect over 22 distinct regional Indian languages (including Bodo, Dogri, Kashmiri, Konkani, etc.) with near-perfect accuracy.',
              icon: Search,
              tag: 'IndicLID + FastText',
            },
            {
              title: 'The "English Pivot" Architecture',
              desc: 'To overcome poor LLM performance on low-resource languages, low-resource texts are pivoted into English via Sarvam Translation, processed with 100% downstream accuracy, and back-translated natively.',
              icon: Split,
              tag: 'Sarvam 4-Bit NF4',
            },
            {
              title: 'Deep Semantic Intelligence',
              desc: 'Powered by KeyBERT and IndicBERT, the platform autonomously extracts top-5 salient keyword topics, narrative themes via BERTopic, and deduplicates news events with BGE-Reranker-v2-m3.',
              icon: Cpu,
              tag: 'IndicBERT + KeyBERT',
            },
            {
              title: 'Long-Context RAG Summarization',
              desc: 'Uses SaT (Semantic-aware Text Chunking) and BGE-M3 to generate 1024-d dense embeddings in ChromaDB, allowing Qwen 4B to access precise context and generate hallucination-free summaries.',
              icon: Database,
              tag: 'SaT + BGE-M3 + Qwen3-4B',
            },
            {
              title: 'Dynamic Multilingual UI',
              desc: 'Built with React and Tailwind CSS v4, the frontend automatically adapts its UI labels, reading direction, and typography based on the native language of the processed document.',
              icon: Sparkles,
              tag: 'React + Tailwind CSS v4',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* What It Does Step-by-Step */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span>🎯 What It Does in Practice</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            BharatSaar solves the critical problem of information overload in regional Indian languages:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg mb-1 font-mono">01</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Paste Any News URL</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Automatically bypasses paywalls, ads, and cookie banners to isolate pure article text.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg mb-1 font-mono">02</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Read in Native Language</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Whether in Dogri, Kashmiri, Bodo, or Santali, returns a summary in that authentic language.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg mb-1 font-mono">03</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Instant Structured Context</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bulleted "Key Takeaways", detailed abstractive summary, keywords, and named entities.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg mb-1 font-mono">04</div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Massive Time Savings</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                A 3,000-word article is condensed into a 300-word summary without losing critical semantic meaning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. PROJECT PRESENTATION */}
      <section id="project-presentation" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <Video size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Project Presentation
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Official video demonstrations and system architecture walkthroughs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video 1 */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col">
            <div className="aspect-video w-full bg-slate-950">
              <iframe
                src="https://www.youtube.com/embed/wqKhxgo57Ic"
                title="BharatSaar Full Project Demonstration & Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                  Project Presentation Demo 1
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                  Full Project Demonstration & Overview
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  End-to-end walkthrough showing real-time URL ingestion, multi-tier document parsing, Indic language detection, and RAG abstractive summarization.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href="https://youtu.be/wqKhxgo57Ic?si=sdK4Q1DcZ3QtAic0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} />
                  <span>https://youtu.be/wqKhxgo57Ic</span>
                </a>
              </div>
            </div>
          </div>

          {/* Video 2 */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col">
            <div className="aspect-video w-full bg-slate-950">
              <iframe
                src="https://www.youtube.com/embed/0pyGsjMlHQE"
                title="BharatSaar System Architecture & Technical Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  Technical Walkthrough Demo 2
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                  System Architecture & Technical Deep Dive
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Detailed architectural explanation of the VRAM-isolated GPU sandbox, Sarvam 4-bit English Pivot pipeline, and ChromaDB vector retrieval.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href="https://youtu.be/0pyGsjMlHQE?si=ozLdr8IT0u_k2qSA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 transition"
                >
                  <ExternalLink size={13} />
                  <span>https://youtu.be/0pyGsjMlHQE</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SYSTEM ARCHITECTURE & TOPOLOGY */}
      <section id="system-architecture" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Architecture & Memory Topology
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              High-throughput asynchronous microservices orchestrating heavy transformer models on consumer GPUs
            </p>
          </div>
        </div>

        {/* 1. Multi-Tier Component Diagram */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Multi-Tier Component & Hardware Topology</span>
          </h3>
          <MermaidRenderer
            chart={`graph TB
    subgraph ClientTier ["1. Presentation Layer (React 19 + Vite)"]
        UI["Modern Responsive UI<br/>(Tailwind CSS v4 + Framer Motion)"]
        StateEngine["Zustand State Store & Exponential Polling Engine"]
        UI <--> StateEngine
    end

    subgraph GatewayTier ["2. API & Routing Layer (FastAPI :8000)"]
        APIGateway["FastAPI HTTP Server (Uvicorn ASGI)"]
        IngestRouter["/api/ingest (Document / URL Ingestion)"]
        JobsRouter["/api/jobs/{id} (Real-time Status Polling)"]
        DocsRouter["/api/documents/{id} (Intelligence Fetch)"]
        APIGateway --> IngestRouter
        APIGateway --> JobsRouter
        APIGateway --> DocsRouter
    end

    subgraph StorageTier ["3. Persistence & Messaging Layer"]
        MongoDB[("MongoDB Store<br/>- Job Lifecycle State<br/>- Clean Text & Meta<br/>- Final Multilingual Payloads")]
        TaskBroker[("Celery Task Broker & SQLite Backend<br/>- Asynchronous Queue<br/>- Retry Logic & DLQ")]
        ChromaDB[("ChromaDB Local Vector DB<br/>- 1024-d Dense Vectors<br/>- Document-Scoped HNSW Index")]
    end

    subgraph WorkerTier ["4. Celery Distributed Worker Pool"]
        WorkerManager["Celery Pipeline Worker Daemon"]
        StageChain["Sequential 8-Stage Execution Chain"]
        WorkerManager --> StageChain
    end

    subgraph VRAMSandbox ["5. VRAM-Isolated GPU Sandbox (Zero Memory Leak)"]
        SubprocessQwen17["Isolated Subprocess<br/>Qwen3-1.7B (Text Refinement)"]
        SubprocessQwen4["Isolated Subprocess<br/>Qwen3-4B (RAG Summarizer)"]
        SubprocessSarvam["Dynamic 4-Bit NF4 Engine<br/>Sarvam-Translate (Pivot / Back-Trans)"]
        FileIPC[("Atomic JSON File IPC Buffer")]
    end

    UI -->|"HTTP POST /api/ingest"| IngestRouter
    StateEngine -->|"HTTP GET /api/jobs/{id}"| JobsRouter
    IngestRouter -->|"1. Persist PENDING Job"| MongoDB
    IngestRouter -->|"2. Enqueue Job Task"| TaskBroker
    TaskBroker -->|"3. Dequeue Pipeline Job"| WorkerManager
    
    StageChain -->|"Stage 1-3: Parse & Normalize"| MongoDB
    StageChain -.->|"Stage 3b: Pivot Translate"| SubprocessSarvam
    StageChain -.->|"Stage 4: Spawn Refinement Subprocess"| SubprocessQwen17
    SubprocessQwen17 <-->|"IPC JSON"| FileIPC
    StageChain -->|"Stage 5: SaT + BGE-M3 Dense Vectors"| ChromaDB
    StageChain -->|"Stage 6: IndicBERT KeyBERT + Reranker"| StageChain
    StageChain -.->|"Stage 7: Fetch Context (Top 12)"| ChromaDB
    StageChain -.->|"Stage 7: Spawn Summarizer Subprocess"| SubprocessQwen4
    SubprocessQwen4 <-->|"IPC JSON"| FileIPC
    StageChain -.->|"Stage 7c: Back-Translate Native"| SubprocessSarvam
    StageChain -->|"Stage 8: Write COMPLETED Payload"| MongoDB
    
    DocsRouter -->|"Retrieve Final Intelligence"| MongoDB
    DocsRouter -->|"Deliver JSON Payload"| UI`}
            title="Multi-Tier Component & Hardware Topology"
          />
        </div>

        {/* 2. VRAM Subprocess Sandbox Sequence Diagram */}
        <div className="space-y-4 mt-8">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span>2. VRAM Subprocess Sandbox & Memory Isolation Architecture</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            To eliminate PyTorch CUDA memory fragmentation and prevent Out-Of-Memory (OOM) crashes on consumer GPUs (6 GB / 8 GB VRAM), BharatSaar uses an isolated subprocess lifecycle where memory is reclaimed immediately by the OS:
          </p>
          <MermaidRenderer
            chart={`sequenceDiagram
    autonumber
    participant Worker as Celery Main Worker (CPU)
    participant FS as File System (Temp IPC)
    participant Sub as Isolated Python Subprocess (GPU)
    participant VRAM as CUDA VRAM Pool

    Note over Worker,VRAM: Stage 7 Summarization Triggered
    Worker->>FS: Write prompt & context to temp input.json
    Worker->>Sub: Spawn subprocess: python run_qwen_isolated.py input.json output.json
    
    activate Sub
    Sub->>VRAM: Initialize pristine CUDA context (~400 MB)
    Sub->>VRAM: Load Qwen3-4B weights in 4-bit NF4 quantization (~2.8 GB)
    Note over Sub,VRAM: Total VRAM allocated: ~3.2 GB - 5.2 GB Peak
    Sub->>Sub: Execute forward pass & autoregressive generation
    Sub->>FS: Write headline, summary & key takeaways to output.json
    Sub-->>Worker: Subprocess exits with returncode 0
    deactivate Sub

    Note over Sub,VRAM: OS destroys subprocess address space
    VRAM-->>VRAM: Operating System immediately reclaims all CUDA VRAM (0 MB allocated)
    Worker->>FS: Read generated output.json
    Worker->>FS: Securely unlink temporary IPC JSON files
    Worker->>Worker: Run gc.collect() & torch.cuda.empty_cache()
    Note over Worker,VRAM: GPU VRAM returns to absolute baseline (0% leak)`}
            title="VRAM Subprocess Sandbox Lifecycle (Zero Memory Leak)"
          />
        </div>

        {/* 3. End-to-End Pipeline Execution Topology */}
        <div className="space-y-4 mt-8">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span>3. End-to-End Pipeline Execution Topology</span>
          </h3>
          <MermaidRenderer
            chart={`flowchart TD
    Start([User Submits Article URL]) --> Ingest[FastAPI Ingest Router]
    Ingest --> DBInit[(MongoDB: Status = PENDING)]
    Ingest --> QueueTask[(Celery Queue: Task Dispatch)]
    
    subgraph PipelineExecution ["Celery Asynchronous Pipeline Execution"]
        QueueTask --> S1["Stage 1 & 2: Parsing & Web Extraction<br/>(Crawl4AI Playwright + Trafilatura DOM Heuristics)"]
        S1 --> S3["Stage 3: Language Detection & Unicode Normalization<br/>(FastText IndicLID + IndicNLP)"]
        
        S3 --> PivotCheck{"Is Language Low-Resource?<br/>(Bodo, Dogri, Kashmiri, Santali, etc.)"}
        
        PivotCheck -->|"YES: needs_english_pivot = True"| S3b["Stage 3b: English Pivot Translation<br/>(Sarvam-Translate 4-Bit NF4)"]
        PivotCheck -->|"NO: High-Resource (Hindi, Tamil, etc.)"| S4["Stage 4: Transliteration & Refinement<br/>(IndicXlit + Isolated Qwen3-1.7B)"]
        
        S3b -->|"Spoof Language Meta = 'en'"| S4
        
        S4 --> S5["Stage 5: Semantic Chunking & Vectorization<br/>(SaT-3L-SM + LlamaIndex + BGE-M3)"]
        S5 --> ChromaStore[("Store Dense & Sparse Vectors<br/>in ChromaDB")]
        
        S5 --> S6["Stage 6: Semantic Intelligence Extraction<br/>(KeyBERT Keywords + BERTopic + BGE-Reranker)"]
        
        S6 --> S7["Stage 7: Long-Context RAG Retrieval<br/>(BGE-M3 Query vs ChromaDB Top-12 Chunks)"]
        ChromaStore -.-> S7
        
        S7 --> S7LLM["Stage 7b: Isolated LLM Summarization<br/>(Qwen3-4B Parameter Model)"]
        
        S7LLM --> BackTransCheck{"Was Document Pivoted?<br/>(needs_english_pivot == True)"}
        
        BackTransCheck -->|"YES"| S7Back["Stage 7c: Native Back-Translation<br/>(English Summary -> Original Native Script via Sarvam)"]
        BackTransCheck -->|"NO"| S8["Stage 8: Finalization & Document Commit"]
        
        S7Back --> S8
    end
    
    S8 --> DBComplete[(MongoDB: Status = COMPLETED<br/>Native Headline, Summary, Bullets, Keywords)]
    DBComplete --> PollingUI[React Frontend Dynamic Update]
    PollingUI --> End([User Reads Native Article Summary])`}
            title="End-to-End Pipeline Execution Topology"
          />
        </div>
      </section>

      {/* 5. COMPLETE TECHNOLOGY STACK & MODEL MAPPING */}
      <section id="technology-stack" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Complete Technology Stack & Models
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Exact logical pipeline tasks mapped to foundation models and open-source libraries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { stage: 'Web Extraction', model: 'Crawl4AI + Trafilatura', desc: 'Headless Playwright Chromium + News DOM heuristic filters', link: 'https://github.com/unclecode/crawl4AI' },
            { stage: 'Language Detection', model: 'IndicLID + FastText', desc: 'FTN neural hierarchical softmax classifier across 22 Indic scripts', link: 'https://github.com/AI4Bharat/IndicLID' },
            { stage: 'Unicode Normalization', model: 'Indic NLP Library', desc: 'NFC canonical decomposition, Virama and Matra reordering', link: 'https://github.com/anoopkunchukuttan/indic_nlp_library' },
            { stage: 'Sentence Segmentation', model: 'SaT-3L-SM (Segment any Text)', desc: '3-layer neural token classification boundary model', link: 'https://huggingface.co/segment-any-text/sat-3l-sm' },
            { stage: 'Roman ↔ Native Xlit', model: 'IndicXlit', desc: 'Character sequence-to-sequence beam search for loanwords and acronyms', link: 'https://github.com/AI4Bharat/IndicXlit' },
            { stage: 'Text Refinement & Grammar', model: 'Qwen3-1.7B', desc: 'Zero-shot isolated autoregressive text smoothing and typo repair', link: 'https://huggingface.co/Qwen/Qwen3-1.7B' },
            { stage: 'Multilingual Vectors', model: 'BGE-M3 (BAAI)', desc: '1024-d dense embeddings and lexical sparse token weighting', link: 'https://huggingface.co/BAAI/bge-m3' },
            { stage: 'Vector Database', model: 'ChromaDB Local Engine', desc: 'Multi-tenant scoped HNSW vector index with metadata filters', link: 'https://www.trychroma.com' },
            { stage: 'Keyword Extraction', model: 'IndicBERT-v3-270M + KeyBERT', desc: 'Candidate n-gram embeddings with Maximal Marginal Relevance (MMR)', link: 'https://huggingface.co/ai4bharat/IndicBERT-v3-270M' },
            { stage: 'Event Deduplication', model: 'BGE-Reranker-v2-m3', desc: 'Cross-encoder joint attention logit scoring with threshold s > 1.0', link: 'https://huggingface.co/BAAI/bge-reranker-v2-m3' },
            { stage: 'RAG Summarizer', model: 'Qwen3-4B (4-bit NF4)', desc: 'Long-context abstractive headline, detailed summary, and bullet generator', link: 'https://huggingface.co/Qwen/Qwen3-4B' },
            { stage: 'Multilingual Translation', model: 'Sarvam-Translate (4-bit NF4)', desc: 'Dynamic pivot and back-translation engine for low-resource scripts', link: 'https://huggingface.co/sarvamai/sarvam-translate' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-semibold">
                  {item.stage}
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-base mt-1">
                  {item.model}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  Model Card <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS: DUAL-FORK PIPELINE & COMPARISON */}
      <section id="how-it-works" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Split size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How It Works: The Dual-Fork Processing Pipeline
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Direct Native execution for high-resource languages vs. English Pivot Architecture for low-resource languages
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 max-w-lg">
          <button
            onClick={() => setPipelineTab('comparison')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              pipelineTab === 'comparison'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚖️ Architectural Comparison
          </button>
          <button
            onClick={() => setPipelineTab('part1')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              pipelineTab === 'part1'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🟢 Part 1: High-Resource
          </button>
          <button
            onClick={() => setPipelineTab('part2')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              pipelineTab === 'part2'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🟠 Part 2: Low-Resource
          </button>
        </div>

        {/* Tab 1: Architectural Comparison Table */}
        {pipelineTab === 'comparison' && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4">Feature / Metric</th>
                      <th className="p-4 text-emerald-700 dark:text-emerald-300">
                        🟢 Part 1: Normal-Resource Pipeline
                      </th>
                      <th className="p-4 text-amber-700 dark:text-amber-300">
                        🟠 Part 2: Low-Resource Pipeline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {[
                      {
                        metric: 'Target Languages',
                        part1: 'Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, Nepali, English',
                        part2: 'Bodo, Dogri, Kashmiri, Konkani, Maithili, Manipuri, Sanskrit, Santali, Sindhi',
                      },
                      { metric: 'Pivot Required?', part1: '❌ No (Direct Native Execution)', part2: '✅ Yes (English Pivot Architecture)' },
                      { metric: 'Stage 3b Translation', part1: '⏭️ Skipped (Pass-through)', part2: '🔄 Native → English (Sarvam 4-bit NF4)' },
                      { metric: 'Refinement Stage', part1: 'Native Script via IndicXlit + Qwen3-1.7B', part2: 'English Prose via Qwen3-1.7B' },
                      { metric: 'Semantic Chunking', part1: 'SaT Native Script + BGE-M3', part2: 'SaT English + BGE-M3' },
                      { metric: 'Vector Space', part1: 'Multilingual Indic Hypersphere', part2: 'English Semantic Hypersphere' },
                      { metric: 'RAG Summarization', part1: 'Qwen3-4B Direct Native Output', part2: 'Qwen3-4B Pristine English Output' },
                      { metric: 'Stage 7b Back-Translation', part1: '⏭️ Skipped', part2: '🔄 English → Native Script (Sarvam)' },
                      { metric: 'End-to-End Latency', part1: '~24.4 seconds (3,000 words)', part2: '~33.0 seconds (3,000 words)' },
                      { metric: 'ROUGE-L Score', part1: '78.4% - 84.1%', part2: '68.1% - 76.5% (+110% vs native direct)' },
                      { metric: 'Memory Peak', part1: '5.2 GB (Qwen3-4B Subprocess)', part2: '5.2 GB (Qwen3-4B Subprocess)' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {row.metric}
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">
                          {row.part1}
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                          {row.part2}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Part 1 Details */}
        {pipelineTab === 'part1' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm leading-relaxed">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-base mb-2">
                🟢 Direct Native Execution for High-Resource Languages
              </h4>
              <p className="text-emerald-800 dark:text-emerald-300 mb-2">
                <strong>Target Languages:</strong> Assamese, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Nepali, Odia, Punjabi, Tamil, Telugu, Urdu, and English.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Because these languages have rich representation in modern open foundation models (BGE-M3, IndicBERT-v3, Qwen3-4B), they are processed natively from this point forward with <strong>zero translation loss</strong>.
              </p>
            </div>

            <MermaidRenderer
              chart={`flowchart TD
    S3_Out(["Language Verified: High-Resource (e.g., Hindi, Tamil, Bengali)"]) --> S4["Stage 4: Transliteration & Native Refinement<br/>(IndicXlit + Isolated Qwen3-1.7B)"]
    S4 --> S5["Stage 5: Native Semantic Chunking & Vectorization<br/>(SaT-3L-SM + LlamaIndex + BGE-M3 + ChromaDB)"]
    S5 --> S6["Stage 6: Native Intelligence & Event Deduplication<br/>(IndicBERT + KeyBERT + BGE-Reranker)"]
    S6 --> S7["Stage 7: Long-Context RAG & Direct Native Summarization<br/>(ChromaDB Retrieval + Isolated Qwen3-4B)"]
    S7 --> S8["Stage 8: Finalization & Reactive UI Localization<br/>(MongoDB Commit + React Polling Engine)"]
    S8 --> Result([Final Native Headline, Summary, Bullets & Keywords])`}
              title="Part 1: High-Resource Direct Native Pipeline"
            />
          </div>
        )}

        {/* Tab 3: Part 2 Details */}
        {pipelineTab === 'part2' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm leading-relaxed">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-base mb-2">
                🟠 The English Pivot Architecture for Low-Resource Languages
              </h4>
              <p className="text-amber-800 dark:text-amber-300 mb-2">
                <strong>Target Languages:</strong> Bodo, Dogri, Kashmiri, Konkani, Maithili, Manipuri, Sanskrit, Santali, and Sindhi.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Low-resource scripts suffer catastrophic token fragmentation (6–12 subword tokens per word), exploding context windows and introducing attention noise. BharatSaar solves this by translating into English via Sarvam Translation, executing downstream vector search and LLM summarization with 100% accuracy, and then back-translating natively into the authentic script.
              </p>
            </div>

            <MermaidRenderer
              chart={`flowchart TD
    S3_Out(["Language Verified: Low-Resource (e.g., Bodo, Dogri, Santali)"]) --> S3b["Stage 3b: Pivot Translation to English<br/>(Sarvam 4-Bit NF4)<br/>Spoofs language_meta = 'en'"]
    
    subgraph TheEnglishPivot ["The English Pivot Processing Layer"]
        S3b --> S4["Stage 4: English Text Refinement<br/>(Isolated Qwen3-1.7B)"]
        S4 --> S5["Stage 5: High-Precision English Semantic Chunking<br/>(SaT + BGE-M3 + ChromaDB)"]
        S5 --> S6["Stage 6: English Intelligence & Deduplication<br/>(KeyBERT + BGE-Reranker)"]
        S6 --> S7a["Stage 7a: Long-Context RAG & English Summarization<br/>(ChromaDB + Qwen3-4B)"]
    end
    
    subgraph NativeRestoration ["Native Restoration Layer"]
        S7a --> S7b["Stage 7b: Native Back-Translation Engine<br/>(Sarvam: English -> Native Script)"]
        S7b --> S8["Stage 8: Native Commit & Reactive UI Push<br/>(MongoDB Native Store + Localized UI)"]
    end
    
    S8 --> Result([Final Native Output in Bodo, Santali, Kashmiri, etc.])`}
              title="Part 2: Low-Resource English Pivot Architecture Flow"
            />

            <MermaidRenderer
              chart={`sequenceDiagram
    autonumber
    participant S3 as Stage 3 (IndicLID)
    participant S3b as Stage 3b (Sarvam Pivot)
    participant S5_6 as Stage 5 & 6 (BGE-M3 & KeyBERT)
    participant S7 as Stage 7 (Qwen3-4B & Sarvam)
    participant DB as MongoDB

    Note over S3,DB: Low-Resource Language Detected (e.g., Bodo 'brx')
    S3->>S3: Detects 'brx' via IndicLID/FastText
    S3->>S3: Sets needs_english_pivot = True
    S3->>S3: Securely caches original_language_code = 'brx'
    S3->>S3b: Hands off Bodo Raw Text
    
    Note over S3b: 1. Pivot Translation to English
    S3b->>S3b: Splits into 500-char safe chunks
    S3b->>S3b: Translates Bodo Text -> English via Sarvam (4-bit NF4)
    S3b->>S3b: Overwrites raw_text with English translation
    S3b->>S3b: Spoofs pipeline language_meta = 'en'
    S3b->>S3b: Flushes Sarvam from GPU (torch.cuda.empty_cache())
    
    S3b->>S5_6: Passes English Cleaned Text
    Note over S5_6: 2. Full Intelligence Operates with 100% Accuracy
    S5_6->>S5_6: SaT segments English sentences cleanly
    S5_6->>S5_6: BGE-M3 embeds vectors in ChromaDB
    S5_6->>S5_6: KeyBERT extracts salient English keywords
    
    S5_6->>S7: Passes English Context & Keywords
    Note over S7: 3. Summarization & Native Back-Translation
    S7->>S7: Qwen3-4B generates English Summary & Bullets
    S7->>S7: Loads Sarvam on GPU (4-bit NF4)
    S7->>S7: Back-translates Headline, Summary, Bullets, Keywords -> Bodo
    S7->>S7: Flushes Sarvam from GPU memory
    
    Note over S7,DB: 4. Native Persistence
    S7->>DB: Saves Bodo Native Payload
    S7->>DB: Restores language = 'brx'
    DB-->>S7: Document committed with 100% native fidelity`}
              title="The English Pivot Sequence Lifecycle"
            />
          </div>
        )}
      </section>

      {/* 7. PIPELINE DECISION LOGIC & ALGORITHMIC FLOWCHARTS */}
      <section id="algorithmic-flowcharts" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Workflow size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pipeline Decision Logic & Algorithmic Flowcharts
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Deep algorithmic decision trees governing web extraction, language state machines, semantic chunking, and deduplication
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Flowchart 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              1. Cascade Web Extraction & Anti-Bot Fallback Logic
            </h3>
            <MermaidRenderer
              chart={`flowchart TD
    URL([Input Article URL]) --> S1["Strategy 1: Headless Crawl4AI<br/>(Playwright Chromium / JS Hydration)"]
    S1 --> S1b["Strategy 1b: Trafilatura DOM Extraction<br/>(News Article Heuristic Filter)"]
    S1b --> Check1{"Is text valid?<br/>(len >= 250 chars)"}
    Check1 -->|"YES"| CleanOutput["Sanitize Markdown & Regex Normalization"]
    
    Check1 -->|"NO: Paywall / Anti-Bot / Sparse DOM"| S2["Strategy 2: Crawl4AI Raw Markdown<br/>(Aggressive Regex Cleaner)"]
    S2 --> Check2{"Is text valid?<br/>(len >= 250 chars)"}
    Check2 -->|"YES"| CleanOutput
    
    Check2 -->|"NO: Empty Markdown"| S3["Strategy 3: Direct HTTP Request<br/>(Browser User-Agent Spoofing)"]
    S3 --> S3Trafilatura["Feed Raw Response to Trafilatura"]
    S3Trafilatura --> Check3{"Is text valid?<br/>(len >= 250 chars)"}
    Check3 -->|"YES"| CleanOutput
    
    Check3 -->|"NO: Cloudflare / Blocked"| S4["Strategy 4: Semantic BeautifulSoup DOM<br/>(Filter article, main, p tags)"]
    S4 --> FinalValidate{"Final Length Check"}
    FinalValidate -->|"Pass"| CleanOutput
    FinalValidate -->|"Fail"| ErrorFallback["Throw ExtractionException & Alert Celery DLQ"]
    CleanOutput --> RawTextPayload([Validated raw_text Payload])`}
              title="Cascade Web Extraction Fallback Decision Logic"
            />
          </div>

          {/* Flowchart 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              2. Dynamic Language Classification & English Pivot State Machine
            </h3>
            <MermaidRenderer
              chart={`flowchart TD
    RawText([Raw Cleaned Text]) --> Slice["Extract First 2,000 Characters"]
    Slice --> IndicLID["Run FastText IndicLID Classifier"]
    IndicLID --> ConfCheck{"Confidence Score >= 0.70?"}
    
    ConfCheck -->|"YES"| LangCode["Extract ISO Code & Script<br/>(e.g., brx_Deva, sat_Olck, hin_Deva)"]
    ConfCheck -->|"NO"| FallbackLang["Fallback to langdetect Library"]
    FallbackLang --> LangCode
    
    LangCode --> UnicodeNorm["Apply IndicNLP Unicode Script Normalization"]
    UnicodeNorm --> CheckLowResource{"Is Language in<br/>LOW_RESOURCE_LANGUAGES?<br/>[brx, doi, kas, kok, mai, mni, san, sat, snd]"}
    
    CheckLowResource -->|"NO: High-Resource<br/>(hin, ben, tam, tel, etc.)"| NativeDirect["Set needs_english_pivot = False<br/>Preserve native language tag"]
    NativeDirect --> NativePipeline([Continue Direct Native Pipeline])
    
    CheckLowResource -->|"YES: Low-Resource"| SetPivotFlag["Set needs_english_pivot = True<br/>Store original_language_code"]
    SetPivotFlag --> Chunk500["Split Raw Text into 500-Character Chunks"]
    Chunk500 --> LoadSarvam["Load sarvam-translate (4-Bit NF4)"]
    LoadSarvam --> TransIter["Iteratively Translate Chunks to English"]
    TransIter --> StitchEnglish["Concatenate Translated English Chunks"]
    StitchEnglish --> SpoofMeta["Overwrite raw_text with English<br/>Spoof language_meta = 'en'"]
    SpoofMeta --> FlushSarvam["Unload Sarvam & Run torch.cuda.empty_cache()"]
    FlushSarvam --> EnglishPipeline([Route through English Pipeline])`}
              title="Dynamic Language Classification & Pivot State Machine"
            />
          </div>

          {/* Flowchart 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              3. SaT + LlamaIndex Semantic Chunking Breakpoint Logic
            </h3>
            <MermaidRenderer
              chart={`flowchart TD
    RefinedText([Refined Article Text]) --> SaTSplit["SaT-3L-SM Neural Model<br/>(Token-Level Boundary Probability)"]
    SaTSplit --> Sentences["Array of Distinct Sentences: [s_1, s_2, ..., s_M]"]
    Sentences --> EmbedSentences["Local BGE-M3 Dense Embedding<br/>Compute v_i = Model(s_i) in R^1024"]
    
    EmbedSentences --> CalcCosine["Compute Adjacent Cosine Similarity:<br/>Sim(s_i, s_{i+1}) = (v_i · v_{i+1}) / (||v_i|| * ||v_{i+1}||)"]
    CalcCosine --> CalcDistance["Compute Semantic Distance Metric:<br/>Δ_i = 1 - Sim(s_i, s_{i+1})"]
    
    CalcDistance --> Threshold["Calculate Dynamic 95th Percentile Threshold:<br/>τ_95 = Percentile(Δ, 95)"]
    
    Threshold --> IterSentences{"For Each Sentence Boundary i:"}
    IterSentences --> BreakCheck{"Δ_i >= τ_95 ?"}
    
    BreakCheck -->|"YES (Top 5% Semantic Drop)"| NewChunk["Create New Chunk Breakpoint<br/>Split at boundary i"]
    BreakCheck -->|"NO (Thematic Continuity)"| MergeChunk["Append sentence s_{i+1} to Current Chunk"]
    
    NewChunk --> FinalChunks["Final Structured Semantic Chunks"]
    MergeChunk --> FinalChunks
    FinalChunks --> VectorStore["Generate Dense & Sparse BGE-M3 Embeddings<br/>Commit to ChromaDB with (user_id, doc_id)"]`}
              title="SaT Semantic Chunking & Adaptive Threshold Logic"
            />
          </div>

          {/* Flowchart 4 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              4. Intelligence Extraction & Cross-Encoder Deduplication Logic
            </h3>
            <MermaidRenderer
              chart={`flowchart TD
    TextInput([Refined Text: First 1500 Characters]) --> ForkParallel["Dispatch GPU Analysis"]
    
    ForkParallel --> KeyBERTModel["1. KeyBERT + IndicBERT-v3<br/>Candidate N-Gram Extraction (1, 2)<br/>Cosine Ranking vs Document Embedding"]
    ForkParallel --> BERTopicModel["2. BERTopic Model<br/>Sentence Embedding & HDBSCAN/c-TF-IDF Topic Modeling"]
    
    BERTopicModel --> CandidateEvents["Extract Salient Events & Topic Clusters"]
    CandidateEvents --> DeduplicationLoop{"Deduplicate Events via BGE-Reranker-v2-m3"}
    
    DeduplicationLoop --> Pairwise["Construct Input Pairs: [Event_i, Event_j]"]
    Pairwise --> CrossEncoder["Cross-Encoder Forward Pass:<br/>Logit Score s(A, B)"]
    CrossEncoder --> ScoreCheck{"Score s(A, B) > 1.0?"}
    
    ScoreCheck -->|"YES"| DropDup["Mark Event_j as Semantic Duplicate (Drop)"]
    ScoreCheck -->|"NO"| KeepUnique["Retain Unique Event"]
    
    DropDup --> MergeBack["Aggregate Unique Events & Topics"]
    KeepUnique --> MergeBack
    
    KeyBERTModel --> Top5Keywords["Select Top 5 Salient Keywords<br/>(Maximal Marginal Relevance)"]
    
    MergeBack --> FinalIntelligence[("Final Intelligence Object<br/>- topics: List[str]<br/>- keywords: List[str]")]
    Top5Keywords --> FinalIntelligence`}
              title="Cross-Encoder Event Deduplication Logic"
            />
          </div>

          {/* Flowchart 5 */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              5. Long-Context RAG Retrieval & Synthesis Logic
            </h3>
            <MermaidRenderer
              chart={`flowchart TD
    Keywords([Top 5 Salient Keywords]) --> QueryBuilder["Construct Composite Query:<br/>Q = ' '.join(keywords[:5])"]
    QueryBuilder --> BGEM3Query["Encode Query via BGE-M3<br/>q_dense = Encode(Q) in R^1024"]
    
    BGEM3Query --> ChromaQuery["ChromaDB Vector Search<br/>Filter: user_id == uid and doc_id == did<br/>Limit: 12 Nearest Chunks"]
    
    ChromaQuery --> ChunksReturned{"Chunks Found?"}
    
    ChunksReturned -->|"YES"| DeduplicateChunks["Deduplicate Chunks by Exact String Hash"]
    DeduplicateChunks --> StitchContext["Stitch Context String with newline<br/>Truncate to 12,000 characters maximum"]
    
    ChunksReturned -->|"NO: Fallback"| RawFallback["Slice raw_text[:12000] directly"]
    
    StitchContext --> SynthesizedPayload[Synthesized Context Payload]
    RawFallback --> SynthesizedPayload
    
    SynthesizedPayload --> IsolatedQwen["Launch Isolated Subprocess: run_qwen_isolated.py<br/>Model: Qwen3-4B (4-bit NF4 Quantization)<br/>System Prompt: Strict Abstractive Extraction"]
    
    IsolatedQwen --> GeneratedPayload[("Generated Output Payload<br/>- headline: str<br/>- detailed_summary: str<br/>- bullet_summary: str<br/>- keywords: str")]`}
              title="Long-Context RAG Retrieval & Causal Synthesis Logic"
            />
          </div>
        </div>
      </section>

      {/* 8. MATHEMATICAL FOUNDATIONS & ALGORITHMIC EQUATIONS (ALL 23 FORMULAS) */}
      <section id="mathematical-foundations" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <span className="font-serif font-black text-xl">∑</span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mathematical Foundations & Algorithmic Equations
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Formal mathematical optimization criteria, probability formulations, and vector space algebra across all 8 pipeline stages
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Stage 1 & 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Stage 1 & 2 • Web Extraction & DOM Filtering
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                A. Text-to-HTML Density Ratio Heuristic (Trafilatura Pruning)
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"For any DOM tree node $n$, let $\\text{Text}(n)$ denote visible text characters and $\\text{HTML}(n)$ denote raw markup length:"} /></p>
            <MathBlock math="\rho(n) = \frac{\text{len}(\text{Text}(n))}{\text{len}(\text{HTML}(n))} \in [0, 1]" />
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"The anchor text link density $\\delta(n)$ penalizes navigation carousels and affiliate banners:"} /></p>
            <MathBlock math="\delta(n) = \frac{\text{len}(\text{AnchorText}(n))}{\text{len}(\text{Text}(n))} \in [0, 1]" />
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"The comprehensive node retention scoring function $\\psi(n)$ is formulated as:"} /></p>
            <MathBlock math="\psi(n) = \rho(n) \cdot \left(1 - \delta(n)\right)^\alpha \cdot \log\left(\text{len}(\text{Text}(n)) + 1\right), \quad \alpha = 2.0" />
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"A subtree $n$ is pruned if $\\psi(n) &lt; \\theta_{\\text{DOM}}$ or link density exceeds 50%:"} /></p>
            <MathBlock math="\text{Prune}(n) = \begin{cases} \text{True} & \text{if } \psi(n) < \theta_{\text{DOM}} \;\lor\; \delta(n) > 0.50 \\ \text{False} & \text{otherwise} \end{cases}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Cascade extraction fallback decision rule:
            </p>
            <MathBlock math="T^* = S_k(\text{URL}) \quad \text{where } k = \min \left\{ i \in \{1, 2, 3, 4\} \;\middle|\; \text{len}\left(S_i(\text{URL})\right) \ge 250 \right\}" />
          </div>

          {/* Stage 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Stage 3 • Linguistics & Dynamic Routing
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                B. FastText / IndicLID Hierarchical Softmax & Decision Rule
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"Hashed subword $n$-gram representations $\\mathbf{x} \\in \\mathbb{R}^d$:"} /></p>
            <MathBlock math="\mathbf{x} = \frac{1}{|N_x|} \sum_{g \in N_x} \mathbf{v}_g" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The hierarchical softmax probability over the binary decision path:
            </p>
            <MathBlock math="P(l \mid x) = \prod_{j=1}^{d(l)} \sigma\left( \text{sgn}\left(\text{child}(n_j) == \text{left}\right) \cdot \mathbf{w}_j^T \mathbf{x} \right)" />
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"Indic Unicode Canonical Decomposition ($\\mathcal{D}$), Composition ($\\mathcal{C}$), and Matra reordering ($\\mathcal{M}$):"} /></p>
            <MathBlock math="T_{\text{norm}} = \mathcal{M}\left( \mathcal{C}\left( \mathcal{D}(T) \right) \right)" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Post-identification dynamic routing decision rule:
            </p>
            <MathBlock math="\mathbb{I}_{\text{pivot}} = \begin{cases} 1 & \text{if } l^* \in \mathcal{L}_{\text{low}} \quad (\text{Direct to Part 2: English Pivot Pipeline}) \\ 0 & \text{if } l^* \in \mathcal{L}_{\text{normal}} \quad (\text{Direct to Part 1: Direct Native Pipeline}) \end{cases}" />
          </div>

          {/* Stage 3b & 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Stage 3b & 4 • Pivot Translation & LLM Refinement
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                C. Cross-Attention Factorization & 4-Bit NormalFloat Quantization
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Autoregressive translation conditional probability:
            </p>
            <MathBlock math="P(\mathbf{E} \mid \mathbf{S}) = \prod_{t=1}^N P_\theta(e_t \mid e_{< t}, \mathbf{S}) = \prod_{t=1}^N \text{softmax}\left( \mathbf{W}_v \mathbf{h}_t^{\text{dec}} \right)_{e_t}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Multi-head cross-attention mechanism:
            </p>
            <MathBlock math="\text{CrossAttention}(Q^{\text{dec}}, K^{\text{enc}}, V^{\text{enc}}) = \text{softmax}\left(\frac{Q^{\text{dec}} (K^{\text{enc}})^T}{\sqrt{d_k}}\right) V^{\text{enc}}" />
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"Optimal 4-bit NormalFloat (NF4) quantization distribution $q_i$:"} /></p>
            <MathBlock math="q_i = \frac{1}{2} \left( Q_X\left(\frac{2i - 1}{32}\right) + Q_X\left(\frac{2i + 1}{32}\right) \right)" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Weight quantization index and dequantization reconstruction:
            </p>
            <MathBlock math="c_w = \arg\min_{k \in \{1,\dots,16\}} \left| \frac{w}{\gamma} - q_k \right|, \quad \hat{w} = \gamma \cdot q_{c_w}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Bounded partition segment constraint:
            </p>
            <MathBlock math="\mathcal{P}(T) = \{C_1, C_2, \dots, C_K\} \quad \text{subject to } \text{len}(C_k) \le 500, \quad \text{boundary}(C_k) \in \{\text{'}\backslash\text{n'}, \text{'.' }, \text{'।'}\}" />
          </div>

          {/* Stage 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Stage 5 • Semantic Chunking & Multilingual Embeddings
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                D. Neural Boundary Probability & Adaptive 95th Percentile Breakpoints
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Token boundary classification parameterized by SaT sigmoid head:
            </p>
            <MathBlock math="P(y_i = 1 \mid \mathbf{X}) = \sigma(\mathbf{w}_s^T \mathbf{h}_i + b_s) = \frac{1}{1 + \exp\left(-(\mathbf{w}_s^T \mathbf{h}_i + b_s)\right)}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Adjacent sentence cosine similarity via BGE-M3 1024-d representations:
            </p>
            <MathBlock math="\text{Sim}(s_i, s_{i+1}) = \cos(\mathbf{v}_i, \mathbf{v}_{i+1}) = \frac{\mathbf{v}_i \cdot \mathbf{v}_{i+1}}{\|\mathbf{v}_i\|_2 \|\mathbf{v}_{i+1}\|_2} = \sum_{k=1}^{1024} v_{i,k} \cdot v_{i+1,k}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Dynamic 95th percentile breakpoint decision rule:
            </p>
            <MathBlock math="\Delta_i = 1 - \text{Sim}(s_i, s_{i+1}), \quad \tau_{95} = \text{Percentile}_{95}(\mathbf{\Delta})" />
            <MathBlock math="\mathbb{I}_{\text{split}}(i) = \begin{cases} 1 & \text{if } \Delta_i \ge \tau_{95} \\ 0 & \text{if } \Delta_i < \tau_{95} \end{cases}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              BGE-M3 unit hypersphere projection and lexical sparse token weighting:
            </p>
            <MathBlock math="\mathbf{e}_{\text{dense}} = \frac{\frac{1}{L} \sum_{i=1}^L \mathbf{h}_i}{\left\| \frac{1}{L} \sum_{i=1}^L \mathbf{h}_i \right\|_2} \in \mathbb{R}^{1024}, \quad w_t = \log\left(1 + \text{ReLU}\left(\mathbf{W}_{\text{sparse}} \mathbf{h}_t + b_{\text{sparse}}\right)\right)" />
          </div>

          {/* Stage 6 & 7 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Stage 6 & 7 • Intelligence, RAG Retrieval & Causal Summarization
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                E. Maximal Marginal Relevance, Cross-Encoder & Causal Likelihood
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              KeyBERT Maximal Marginal Relevance (MMR) greedy keyword selection:
            </p>
            <MathBlock math="c^* = \arg\max_{c_i \in C \setminus S} \left[ \lambda \cos(\mathbf{e}_{c_i}, \mathbf{e}_D) - (1 - \lambda) \max_{c_j \in S} \cos(\mathbf{e}_{c_i}, \mathbf{e}_{c_j}) \right], \quad \lambda = 0.65" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              BERTopic class-based TF-IDF (c-TF-IDF):
            </p>
            <MathBlock math="W_{t, c} = \text{tf}_{t, c} \cdot \log\left( 1 + \frac{A}{f_t} \right)" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              BGE-Reranker-v2-m3 cross-encoder event duplicate classification:
            </p>
            <MathBlock math="\text{IsDuplicate}(E_A, E_B) = \begin{cases} \text{True} & \text{if } s(E_A, E_B) > 1.0 \\ \text{False} & \text{if } s(E_A, E_B) \le 1.0 \end{cases}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Multi-tenant scoped ArgTop-K optimization in ChromaDB:
            </p>
            <MathBlock math="\mathcal{K}^* = \arg\max^{(12)}_{j \in \{1, \dots, N\} \atop \text{user\_id}(j) = u \;\land\; \text{doc\_id}(j) = d} \left( 1.0 - \mathcal{D}_{\text{HNSW}}(\mathbf{q}, \mathbf{k}_j) \right)" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Qwen3-4B Causal Language Modeling loss and nucleus sampling:
            </p>
            <MathBlock math="\mathcal{L}_{\text{CLM}}(\theta) = -\sum_{t=1}^T \log P_\theta(y_t \mid y_{< t}, \mathbf{X}_{\text{context}})" />
            <MathBlock math="P(y_t = w) = \begin{cases} \frac{\exp(z_w / T)}{\sum_{w' \in \mathcal{V}^{(p)}} \exp(z_{w'} / T)} & \text{if } w \in \mathcal{V}^{(p)} \\ 0 & \text{otherwise} \end{cases}, \quad p=0.90, T=0.01" />
          </div>

          {/* Stage 8 & Benchmarks */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Stage 8 • Finalization & NLP Benchmark Formulations
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                F. Evaluation Metrics: ROUGE-N, ROUGE-L, BLEU, and BERTScore
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300"><FormattedText text={"ROUGE-N overlapping $n$-grams:"} /></p>
            <MathBlock math="\text{ROUGE-}N = \frac{\sum_{S \in \{\text{Reference}\}} \sum_{n\text{-gram} \in S} \text{Count}_{\text{match}}(n\text{-gram})}{\sum_{S \in \{\text{Reference}\}} \sum_{n\text{-gram} \in S} \text{Count}(n\text{-gram})}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              ROUGE-L Longest Common Subsequence score:
            </p>
            <MathBlock math="R_{\text{LCS}} = \frac{\text{LCS}(\text{Ref}, \text{Cand})}{m}, \quad P_{\text{LCS}} = \frac{\text{LCS}(\text{Ref}, \text{Cand})}{n}, \quad \text{ROUGE-L} = \frac{(1 + \beta^2) R_{\text{LCS}} P_{\text{LCS}}}{R_{\text{LCS}} + \beta^2 P_{\text{LCS}}}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              BLEU score with brevity penalty (BP):
            </p>
            <MathBlock math="\text{BLEU} = \text{BP} \cdot \exp\left(\sum_{n=1}^4 \frac{1}{4} \log p_n\right), \quad \text{BP} = \begin{cases} 1 & \text{if } c > r \\ \exp\left(1 - \frac{r}{c}\right) & \text{if } c \le r \end{cases}" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Contextual BERTScore semantic preservation:
            </p>
            <MathBlock math="R_{\text{BERT}} = \frac{1}{|x|} \sum_{x_i \in x} \max_{y_j \in \hat{x}} \mathbf{e}_{x_i}^T \mathbf{e}_{y_j}, \quad F_{\text{BERT}} = 2 \cdot \frac{P_{\text{BERT}} \cdot R_{\text{BERT}}}{P_{\text{BERT}} + R_{\text{BERT}}}" />
          </div>
        </div>
      </section>

      {/* 9. PERFORMANCE ANALYTICS, EMPIRICAL GRAPHS & BENCHMARKS */}
      <section id="performance-analytics" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Performance Analytics & Empirical Benchmarks
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Hardware memory utilization timeline, stage latency Gantt, and ROUGE-L comparative accuracy
            </p>
          </div>
        </div>

        {/* 1. VRAM Memory Footprint Timeline */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            1. VRAM Memory Footprint Timeline: Monolithic vs Subprocess Isolation
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A monolithic architecture (holding all models simultaneously in PyTorch CUDA memory) exceeds 16 GB and triggers a fatal CUDA OOM crash. BharatSaar's isolated subprocess architecture enforces strict model teardown, keeping peak VRAM firmly at <strong>5.2 GB</strong>:
          </p>
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre className="leading-relaxed">
{`VRAM (GB)
16.0 ┼ - - - - - - - - - - - - - - - - - - - - - - - - - - - - [CRITICAL OOM LIMIT: 16 GB]
14.0 ┼                                              ╭────────── Monolithic Stack (15.8 GB OOM Crash 💥)
12.0 ┼                                       ╭──────╯
10.0 ┼                               ╭───────╯
 8.0 ┼                       ╭───────╯
 6.0 ┼                      ╭╯               ╭─╮ Qwen3-4B Peak (5.2 GB)
 4.0 ┼     ╭─╮ Sarvam (3.4G)│   ╭─╮ Qwen1.7B │ │
 2.0 ┼ ───╭╯ ╰───╮          │ ──╯ ╰──╮       │ │   ╭─╮ Sarvam Back-Trans (3.4 GB)
 0.4 ┼ ───┴──────┴──────────┴────────┴───────┴─┴───┴─┴─────────────────── BharatSaar Subprocess Pipeline
     ┼──────────────────────────────────────────────────────────────────
       Stage 1-2   Stage 3b    Stage 4   Stage 5-6   Stage 7    Stage 8
        (Parse)    (Pivot)    (Refine)   (Embed)     (RAG/LLM)  (Commit)`}
            </pre>
          </div>
        </div>

        {/* 2. Pipeline Stage Latency Gantt */}
        <div className="space-y-4 mt-8">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            2. Pipeline Stage Latency Breakdown & Execution Gantt
          </h3>
          <MermaidRenderer
            chart={`gantt
    title BharatSaar Pipeline Execution Latency (Standard 3,000-Word News Article)
    dateFormat X
    axisFormat %s s
    section Extraction
    Stage 1 & 2 (Crawl4AI + Trafilatura)   :active, s1, 0, 2
    section Linguistics
    Stage 3 (FastText IndicLID + IndicNLP) :s2, after s1, 1
    Stage 3b (Sarvam Pivot Translation)    :crit, s3, after s2, 5
    section Refinement
    Stage 4 (IndicXlit + Qwen3-1.7B)       :s4, after s3, 4
    section Vector Space
    Stage 5 (SaT + BGE-M3 Chunking)        :s5, after s4, 3
    section Intelligence
    Stage 6 (KeyBERT + BERTopic + Reranker):s6, after s5, 3
    section Generation
    Stage 7 (ChromaDB Retrieval + Qwen 4B) :crit, s7, after s6, 12
    Stage 7c (Sarvam Back-Translation)     :crit, s8, after s7, 4
    section Persistence
    Stage 8 (MongoDB Commit + UI Broadcast):s9, after s8, 1`}
            title="BharatSaar Pipeline Execution Latency Gantt Chart"
          />

          {/* Latency Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Stage #</th>
                    <th className="p-3.5">Stage Name</th>
                    <th className="p-3.5">Primary Model / Library</th>
                    <th className="p-3.5">Device Target</th>
                    <th className="p-3.5">Mean Latency</th>
                    <th className="p-3.5">Peak VRAM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                  {[
                    { num: 'Stage 1 & 2', name: 'Web Scraping & DOM Parsing', model: 'Crawl4AI + Trafilatura', target: 'CPU (Playwright)', time: '2.2s', vram: '0.1 GB' },
                    { num: 'Stage 3', name: 'Language ID & Normalization', model: 'FastText IndicLID + IndicNLP', target: 'CPU', time: '0.3s', vram: '0.2 GB' },
                    { num: 'Stage 3b', name: 'English Pivot Translation', model: 'Sarvam-Translate (4-bit NF4)', target: 'GPU (Subprocess)', time: '4.8s', vram: '3.4 GB' },
                    { num: 'Stage 4', name: 'Transliteration & Text Refinement', model: 'IndicXlit + Qwen3-1.7B', target: 'GPU (Subprocess)', time: '3.5s', vram: '2.6 GB' },
                    { num: 'Stage 5', name: 'Semantic Chunking & Embeddings', model: 'SaT-3L-SM + BGE-M3', target: 'GPU (CUDA)', time: '3.1s', vram: '1.8 GB' },
                    { num: 'Stage 6', name: 'Intelligence & Deduplication', model: 'KeyBERT + IndicBERT + Reranker', target: 'GPU (CUDA)', time: '2.4s', vram: '1.9 GB' },
                    { num: 'Stage 7', name: 'Vector Retrieval & Summarization', model: 'ChromaDB + Qwen3-4B', target: 'GPU (Subprocess)', time: '12.5s', vram: '5.2 GB' },
                    { num: 'Stage 7c', name: 'Native Back-Translation', model: 'Sarvam-Translate (4-bit NF4)', target: 'GPU (Subprocess)', time: '3.8s', vram: '3.4 GB' },
                    { num: 'Stage 8', name: 'Database Commit & UI Broadcast', model: 'MongoDB Async Motor Driver', target: 'CPU / Network', time: '0.2s', vram: '0.0 GB' },
                    { num: 'Total', name: 'End-to-End Execution Pipeline', model: 'BharatSaar Autonomous Chain', target: 'Hybrid', time: '~33.0s', vram: '5.2 GB Peak' },
                  ].map((row, i) => (
                    <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${row.num === 'Total' ? 'font-bold bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400">{row.num}</td>
                      <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">{row.name}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">{row.model}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{row.target}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">{row.time}</td>
                      <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">{row.vram}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Low-Resource Indic Summarization Accuracy Comparison */}
        <div className="space-y-4 mt-8">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            3. Low-Resource Indic Summarization Accuracy: Direct Native vs English Pivot
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Dramatically improved summary quality achieved by BharatSaar's English Pivot Architecture over direct native generation on low-resource Indic languages:
          </p>
          <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre className="leading-relaxed">
{`ROUGE-L Score (%)
80 ┼                                              ████
70 ┼                                  ████        ████
60 ┼                      ████        ████        ████
50 ┼          ████        ████        ████  ░░░░  ████
40 ┼    ░░░░  ████  ░░░░  ████  ░░░░  ████  ░░░░  ████
30 ┼    ░░░░  ████  ░░░░  ████  ░░░░  ████  ░░░░  ████
20 ┼    ░░░░  ████  ░░░░  ████  ░░░░  ████  ░░░░  ████
 0 ┼────░░░░──████──░░░░──████──░░░░──████──░░░░──████──
         Bodo (brx)   Dogri (doi)  Kashmiri(kas) Santali(sat)
        
        ░░░░ Direct Native Pipeline (Qwen Native Indic)
        ████ BharatSaar English Pivot Architecture (Sarvam + Qwen + BGE-M3)`}
            </pre>
          </div>

          {/* Benchmark Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3.5">Language Code</th>
                    <th className="p-3.5">Language Name</th>
                    <th className="p-3.5">Direct Native ROUGE-L</th>
                    <th className="p-3.5 text-emerald-600 dark:text-emerald-400">English Pivot ROUGE-L</th>
                    <th className="p-3.5">Direct BERTScore</th>
                    <th className="p-3.5 text-emerald-600 dark:text-emerald-400">English Pivot BERTScore</th>
                    <th className="p-3.5 text-indigo-600 dark:text-indigo-400">Relative Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                  {[
                    { code: 'brx', name: 'Bodo', directRouge: '34.2%', pivotRouge: '71.8%', directBert: '0.582', pivotBert: '0.874', delta: '+109.9% 🚀' },
                    { code: 'doi', name: 'Dogri', directRouge: '36.5%', pivotRouge: '73.4%', directBert: '0.601', pivotBert: '0.886', delta: '+101.1% 🚀' },
                    { code: 'kas', name: 'Kashmiri', directRouge: '31.8%', pivotRouge: '69.2%', directBert: '0.548', pivotBert: '0.862', delta: '+117.6% 🚀' },
                    { code: 'sat', name: 'Santali', directRouge: '29.4%', pivotRouge: '68.1%', directBert: '0.521', pivotBert: '0.851', delta: '+131.6% 🚀' },
                    { code: 'mai', name: 'Maithili', directRouge: '41.2%', pivotRouge: '76.5%', directBert: '0.643', pivotBert: '0.899', delta: '+85.7% 🚀' },
                    { code: 'kok', name: 'Konkani', directRouge: '39.7%', pivotRouge: '75.1%', directBert: '0.628', pivotBert: '0.891', delta: '+89.2% 🚀' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{row.code}</td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                      <td className="p-3.5 text-slate-500 font-mono">{row.directRouge}</td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold">{row.pivotRouge}</td>
                      <td className="p-3.5 text-slate-500 font-mono">{row.directBert}</td>
                      <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold">{row.pivotBert}</td>
                      <td className="p-3.5 text-indigo-600 dark:text-indigo-400 font-mono font-bold">{row.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4 & 5. Chunk Threshold & RAG Retrieval Density Curves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Threshold Curve */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              4. Semantic Chunk Threshold Sensitivity Curve (P95 Setting)
            </h4>
            <div className="p-3 rounded-xl bg-[#0d1117] font-mono text-[11px] text-slate-200 overflow-x-auto">
              <pre>
{`Score / Chunks
1.0 ┼───────────────╭───────────────────────── Boundary Precision
    │              ╭╯
0.8 ┼             ╭╯       [OPTIMAL OPERATING POINT: P95]
    │            ╭╯         ├─ Dynamic Threshold τ = 95th Percentile
0.6 ┼           ╭╯          ├─ Mean Chunk Length: ~420 tokens
    │          ╭╯           └─ Zero Sentence Truncation
0.4 ┼─────────╭─╯
    │ ╲      ╭╯
0.2 ┼  ╲────╭╯──────────────────────────────── Fragmented Noise Ratio
0.0 ┼───╲───╯─────────────────────────────────
       P50       P70       P85       P95       P99`}
              </pre>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              BharatSaar uses the adaptive 95th percentile ($\tau_{95}$) threshold: contiguous sentences remain clustered, and splits occur solely at genuine topical shifts.
            </p>
          </div>

          {/* Retrieval Density Curve */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              5. RAG Retrieval Density vs Hallucination Rate (K = 12)
            </h4>
            <div className="p-3 rounded-xl bg-[#0d1117] font-mono text-[11px] text-slate-200 overflow-x-auto">
              <pre>
{`Percentage (%)
100 ┼ ╲                                              ╭───── Context Completeness
 80 ┼  ╲ Hallucination Rate                         ╭╯
 60 ┼   ╲                                          ╭╯
 40 ┼    ╲                                   ╭─────╯
 20 ┼     ╲                              ╭───╯
  5 ┼──────╲────────────────────────────╭╯───────────── [OPTIMAL SWEET SPOT: K = 12]
    ┼───────┴────────┴────────┴─────────┴─────────┴───
           K=2      K=4      K=8       K=12      K=20`}
              </pre>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              At $K = 12$, context completeness reaches 96.4% while factual hallucination drops to an empirical minimum of 2.1%, fitting cleanly within prompt budgets.
            </p>
          </div>
        </div>
      </section>

      {/* 10. GETTING STARTED & SETUP INSTRUCTIONS */}
      <section id="getting-started" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Terminal size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Getting Started & Installation
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Complete environment configuration, dependency setup, and concurrent service startup
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Prerequisites */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Prerequisites</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                • <strong>Node.js</strong>: v18 or higher
              </li>
              <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                • <strong>Python</strong>: 3.10 or higher
              </li>
              <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                • <strong>MongoDB</strong>: Instance running on localhost:27017 or Atlas
              </li>
              <li className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                • <strong>CUDA GPU</strong>: Highly recommended for local Qwen 4B & BGE-M3
              </li>
            </ul>
          </div>

          {/* Step 1: Clone */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              1. Clone the Repository
            </h4>
            <CodeBlock
              code={`git clone <repository_url>\ncd "Multilingual Text Summarizer"`}
              language="bash"
              title="Clone"
            />
          </div>

          {/* Step 2: Backend */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              2. Backend Setup
            </h4>
            <CodeBlock
              code={`cd backend\npython -m venv .venv\nsource .venv/Scripts/activate  # On Windows\npip install -r requirements.txt`}
              language="bash"
              title="Backend Environment Setup"
            />
          </div>

          {/* Step 3: Environment Variables */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              3. Environment Variables (backend/.env)
            </h4>
            <CodeBlock
              code={`MONGO_URI="mongodb://localhost:27017"\nMONGO_DB_NAME="docintel"\nSARVAM_API_KEY="your_sarvam_key_here"`}
              language="env"
              title="backend/.env Configuration"
            />
          </div>

          {/* Step 4: Frontend */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              4. Frontend Setup
            </h4>
            <CodeBlock
              code={`cd ../frontend\nnpm install`}
              language="bash"
              title="Frontend Dependencies"
            />
          </div>

          {/* Step 5: Start Platform */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              5. Start the Platform
            </h4>
            <CodeBlock
              code={`npm run dev`}
              language="bash"
              title="Concurrent Multi-Service Start"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              This launches the Vite Frontend on <code className="text-indigo-600 dark:text-indigo-400">http://localhost:5173</code>, FastAPI Backend on <code className="text-indigo-600 dark:text-indigo-400">http://localhost:8000</code>, and the Celery Worker Pool monitoring task queues simultaneously.
            </p>
          </div>
        </div>
      </section>

      {/* 11. SUPPORTED LANGUAGES DIRECTORY */}
      <section id="supported-languages" className="scroll-mt-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supported Indic Languages Directory
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Native extraction, detection, and summarization across all 22 Scheduled Indian Languages and English
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedLangTier('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedLangTier === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All 23 Languages
          </button>
          <button
            onClick={() => setSelectedLangTier('high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedLangTier === 'high'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            🟢 High / Normal Resource (14)
          </button>
          <button
            onClick={() => setSelectedLangTier('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedLangTier === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            🟠 Low Resource (9)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {(selectedLangTier === 'all' || selectedLangTier === 'high') &&
            highResourceLangs.map((lang) => (
              <div
                key={lang.code}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {lang.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Direct Native Processing" />
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {lang.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang.script}
                </div>
              </div>
            ))}

          {(selectedLangTier === 'all' || selectedLangTier === 'low') &&
            lowResourceLangs.map((lang) => (
              <div
                key={lang.code}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {lang.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" title="English Pivot Architecture" />
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {lang.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang.script}
                </div>
                <div className="mt-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Gain: {lang.gain}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 12. SWITCH TO RAW README CALLOUT */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
          Looking for the Exact 1,238-Line Markdown Document?
        </h3>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Every piece of information from README.md is fully available in both views. Switch to the Complete README reader for line-by-line sequential rendering.
        </p>
        <button
          onClick={onSwitchToReadme}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition shadow-md"
        >
          <BookOpen size={16} />
          <span>Switch to Complete README View</span>
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};
