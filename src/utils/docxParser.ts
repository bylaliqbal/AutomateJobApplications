import mammoth from 'mammoth';

/**
 * Converts Mammoth HTML into structured plain text, preserving bullet points (•),
 * table column segregation, and section headers cleanly.
 */
function convertHtmlToStructuredText(html: string): string {
  if (!html || typeof document === 'undefined') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Helper to extract text from an element node
  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // Check for tables - process column by column if it's a multi-column layout table
    if (tagName === 'table') {
      const rows = Array.from(el.querySelectorAll('tr'));
      if (rows.length === 0) return '';

      // Check max number of cells in any row
      const maxCols = Math.max(...rows.map(r => r.querySelectorAll('td, th').length));

      if (maxCols > 1) {
        // Multi-column table: extract by logical columns so sidebar and main content aren't interleaved
        const colTexts: string[] = [];
        for (let colIdx = 0; colIdx < maxCols; colIdx++) {
          const colChunks: string[] = [];
          for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td, th'));
            if (cells[colIdx]) {
              const cellText = processNode(cells[colIdx]).trim();
              if (cellText) colChunks.push(cellText);
            }
          }
          if (colChunks.length > 0) {
            colTexts.push(colChunks.join('\n\n'));
          }
        }
        return '\n\n' + colTexts.join('\n\n') + '\n\n';
      }
    }

    // Process list items with explicit bullet prefix
    if (tagName === 'li') {
      const inner = Array.from(el.childNodes).map(processNode).join('').trim();
      return `\n• ${inner}`;
    }

    // Process lists
    if (tagName === 'ul' || tagName === 'ol') {
      const listContent = Array.from(el.childNodes).map(processNode).join('');
      return `\n${listContent}\n`;
    }

    // Process headings
    if (/^h[1-6]$/.test(tagName)) {
      const headingText = Array.from(el.childNodes).map(processNode).join('').trim();
      return `\n\n${headingText}\n`;
    }

    // Process paragraphs
    if (tagName === 'p') {
      const pText = Array.from(el.childNodes).map(processNode).join('').trim();
      return pText ? `\n${pText}\n` : '\n';
    }

    // Process line breaks
    if (tagName === 'br') {
      return '\n';
    }

    // Default container: recursively process children
    return Array.from(el.childNodes).map(processNode).join('');
  }

  const structured = processNode(doc.body);
  // Normalize whitespace and multiple blank lines
  return structured
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parses an ArrayBuffer of a DOCX / Word file into plain text and structured HTML/Markdown.
 */
export async function parseWordDocument(arrayBuffer: ArrayBuffer): Promise<{
  text: string;
  html?: string;
  messages?: string[];
}> {
  try {
    const textResult = await mammoth.extractRawText({ arrayBuffer });
    const rawText = textResult.value || '';
    
    // Also convert to clean HTML to render formatted Word document preview
    let html = '';
    try {
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      html = htmlResult.value || '';
    } catch {
      html = '';
    }

    // Convert HTML to high-fidelity structured text that preserves bullet points and table segregation
    let text = rawText;
    if (html && typeof document !== 'undefined') {
      try {
        const structuredFromHtml = convertHtmlToStructuredText(html);
        if (structuredFromHtml && structuredFromHtml.length > rawText.length * 0.7) {
          text = structuredFromHtml;
        }
      } catch (err) {
        console.warn('Failed to convert HTML to structured text, using rawText:', err);
      }
    }

    const messages = textResult.messages?.map(m => m.message) || [];
    return { text, html, messages };
  } catch (err: any) {
    console.error('Error parsing DOCX with mammoth:', err);
    throw new Error(err?.message || 'Failed to read Word document (.docx)');
  }
}


