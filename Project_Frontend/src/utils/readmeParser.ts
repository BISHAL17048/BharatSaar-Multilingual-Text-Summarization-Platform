// Reusable Markdown and README AST Parser for BharatSaar Academic Portal

export interface TocItem {
  id: string;
  text: string;
  level: number;
  sectionNumber?: string;
}

export type MarkdownBlock =
  | { type: 'heading'; level: number; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string; title?: string }
  | { type: 'mermaid'; chart: string; title?: string }
  | { type: 'math'; math: string; block: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; alertType: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION'; title: string; content: string }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'hr' };

export interface ParsedSection {
  id: string;
  title: string;
  level: number;
  blocks: MarkdownBlock[];
  rawContent: string;
}

export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  matchType: 'heading' | 'text' | 'formula' | 'code' | 'table';
  relevance: number;
}

/**
 * Generate a URL-friendly slug from heading text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Parses full Markdown string into typed blocks
 */
export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal Rule
    if (/^(---|___|\*\*\*)\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading (# to ######)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = headingMatch[2].trim();
      blocks.push({
        type: 'heading',
        level,
        text: rawText,
        id: slugify(rawText),
      });
      i++;
      continue;
    }

    // Mermaid code block
    if (line.trim().startsWith('```mermaid')) {
      let chartLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        chartLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: 'mermaid',
        chart: chartLines.join('\n'),
      });
      continue;
    }

    // Math code block (```math ... ```)
    if (line.trim().startsWith('```math')) {
      let mathLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        mathLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({
        type: 'math',
        math: mathLines.join('\n').trim(),
        block: true,
      });
      continue;
    }

    // KaTeX display block ($$ ... $$)
    if (line.trim().startsWith('$$')) {
      let mathLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('$$')) {
        mathLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({
        type: 'math',
        math: mathLines.join('\n').trim(),
        block: true,
      });
      continue;
    }

    // Code Block (```lang ... ```)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'text';
      let codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({
        type: 'code',
        language: lang,
        code: codeLines.join('\n'),
      });
      continue;
    }

    // GitHub Alert / Callout (> [!NOTE] ...)
    if (line.trim().startsWith('> [!')) {
      const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      const alertType = (alertMatch ? alertMatch[1].toUpperCase() : 'NOTE') as any;
      let contentLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        contentLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'callout',
        alertType,
        title: alertType.charAt(0) + alertType.slice(1).toLowerCase(),
        content: contentLines.join('\n').trim(),
      });
      continue;
    }

    // Markdown Table (| Col 1 | Col 2 |)
    if (line.trim().startsWith('|') && line.includes('|', 1)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim());

        const headers = parseRow(tableLines[0]);
        // line 1 is separator |---|---|
        const rows = tableLines.slice(2).map(parseRow);

        blocks.push({
          type: 'table',
          headers,
          rows,
        });
        continue;
      }
    }

    // List item (- or * or 1. 2.)
    if (/^(\s*[-*+]|\s*\d+\.)\s+/.test(line)) {
      const items: string[] = [];
      const isOrdered = /^\s*\d+\.\s+/.test(line);

      while (i < lines.length && /^(\s*[-*+]|\s*\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*[-*+]|\s*\d+\.)\s+/, '').trim());
        i++;
      }

      blocks.push({
        type: 'list',
        items,
        ordered: isOrdered,
      });
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Regular paragraph
    let paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('$$') &&
      !lines[i].trim().startsWith('> [!') &&
      !lines[i].trim().startsWith('|') &&
      !/^(\s*[-*+]|\s*\d+\.)\s+/.test(lines[i]) &&
      !/^(---|___|\*\*\*)\s*$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    const fullPara = paraLines.join('\n').trim();
    if (fullPara) {
      blocks.push({
        type: 'paragraph',
        text: fullPara,
      });
    }
  }

  return blocks;
}

/**
 * Extracts hierarchical Table of Contents from Markdown
 */
export function extractTableOfContents(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  const counters: number[] = [0, 0, 0, 0, 0, 0];

  for (const line of lines) {
    const match = line.match(/^(#{1,5})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let text = match[2].trim();

      // Clean emojis or symbols for cleaner TOC labeling
      counters[level - 1]++;
      for (let j = level; j < counters.length; j++) {
        counters[j] = 0;
      }

      const id = slugify(text);
      const sectionNum = counters.slice(0, level).filter((c) => c > 0).join('.');

      items.push({
        id,
        text,
        level,
        sectionNumber: sectionNum,
      });
    }
  }

  return items;
}

/**
 * Split the markdown into major sections based on H2 (##)
 */
export function extractSections(markdown: string): ParsedSection[] {
  const lines = markdown.split('\n');
  const sections: ParsedSection[] = [];
  let currentTitle = 'Overview';
  let currentLevel = 1;
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(#{1,3})\s+(.+)$/);

    if (match && match[1].length <= 2) {
      if (currentLines.length > 0) {
        const rawContent = currentLines.join('\n');
        sections.push({
          id: slugify(currentTitle),
          title: currentTitle,
          level: currentLevel,
          blocks: parseMarkdownBlocks(rawContent),
          rawContent,
        });
      }
      currentTitle = match[2].trim();
      currentLevel = match[1].length;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    const rawContent = currentLines.join('\n');
    sections.push({
      id: slugify(currentTitle),
      title: currentTitle,
      level: currentLevel,
      blocks: parseMarkdownBlocks(rawContent),
      rawContent,
    });
  }

  return sections;
}

/**
 * Full-text search index across all markdown content
 */
export function searchReadme(markdown: string, query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const lowerQuery = query.toLowerCase().trim();
  const sections = extractSections(markdown);
  const results: SearchResult[] = [];

  for (const section of sections) {
    // Check section title
    if (section.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        snippet: `Section Title: ${section.title}`,
        matchType: 'heading',
        relevance: 100,
      });
    }

    // Check blocks
    for (const block of section.blocks) {
      if (block.type === 'paragraph' && block.text.toLowerCase().includes(lowerQuery)) {
        const idx = block.text.toLowerCase().indexOf(lowerQuery);
        const start = Math.max(0, idx - 40);
        const end = Math.min(block.text.length, idx + query.length + 60);
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          snippet: (start > 0 ? '...' : '') + block.text.slice(start, end) + (end < block.text.length ? '...' : ''),
          matchType: 'text',
          relevance: 70,
        });
      } else if (block.type === 'math' && block.math.toLowerCase().includes(lowerQuery)) {
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          snippet: `Formula: ${block.math.slice(0, 100)}`,
          matchType: 'formula',
          relevance: 80,
        });
      } else if (block.type === 'code' && block.code.toLowerCase().includes(lowerQuery)) {
        const line = block.code.split('\n').find((l) => l.toLowerCase().includes(lowerQuery)) || block.code.slice(0, 80);
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          snippet: `Code (${block.language}): ${line.trim()}`,
          matchType: 'code',
          relevance: 65,
        });
      } else if (block.type === 'table') {
        const matchedRow = block.rows.find((row) => row.some((cell) => cell.toLowerCase().includes(lowerQuery)));
        if (matchedRow) {
          results.push({
            sectionId: section.id,
            sectionTitle: section.title,
            snippet: `Table row: ${matchedRow.join(' | ').slice(0, 90)}`,
            matchType: 'table',
            relevance: 75,
          });
        }
      }
    }
  }

  // Sort by relevance & cap at 20
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
}
