import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const MAX_CHARS = 15000;

/** Reads a CV entirely in the browser. Nothing is uploaded here. */
export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buffer = await file.arrayBuffer();
  let text = '';

  if (name.endsWith('.pdf')) {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((it) => ('str' in it ? it.str : '')).join(' '));
    }
    text = pages.join('\n\n');
  } else if (name.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    text = result.value;
  } else if (name.endsWith('.doc')) {
    throw new Error('Old .doc files can’t be read in the browser. Save it as PDF or .docx and try again.');
  } else {
    throw new Error('Unsupported file type. Use PDF or .docx.');
  }

  text = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length < 100) {
    throw new Error('Couldn’t find much text in this file. If it’s a scanned image, export it as a text-based PDF.');
  }
  return text.slice(0, MAX_CHARS);
}
