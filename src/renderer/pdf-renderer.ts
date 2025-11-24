/**
 * PDF Renderer Module
 *
 * Exports wireframes to PDF format using Puppeteer.
 * Leverages the existing HTML renderer for consistent output.
 */

import type { DocumentNode, RenderOptions } from '../types.js';
import { renderNode } from './html-renderer.js';
import { getStyleCSS } from './styles.js';

export interface PDFRenderOptions extends Omit<RenderOptions, 'format'> {
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid' | { width: number; height: number };
  margin?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
  landscape?: boolean;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
  preferCSSPageSize?: boolean;
  scale?: number;
}

/**
 * Check if Puppeteer is available
 */
async function checkPuppeteerAvailable(): Promise<boolean> {
  try {
    await import('puppeteer');
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert page size to Puppeteer format
 */
function getPageFormat(pageSize: PDFRenderOptions['pageSize']) {
  if (typeof pageSize === 'string') {
    return pageSize;
  }
  return pageSize;
}

/**
 * Render wireframe to PDF
 */
export async function renderToPDF(
  ast: DocumentNode,
  options: PDFRenderOptions = {}
): Promise<Buffer> {
  // Check if Puppeteer is available
  const puppeteerAvailable = await checkPuppeteerAvailable();
  if (!puppeteerAvailable) {
    throw new Error(
      'Puppeteer is not installed. Please install it with: npm install puppeteer'
    );
  }

  // Dynamically import Puppeteer
  const puppeteer = await import('puppeteer');

  // Prepare render context
  const {
    style = 'sketch',
    classPrefix = 'wmd-',
  } = options;

  const context = {
    style,
    classPrefix,
    inlineStyles: true,
    pretty: false,
  };

  // Render all children
  const childrenHTML = ast.children.map((child) => renderNode(child, context)).join('\n');

  // Get styles
  const css = getStyleCSS(style, classPrefix);

  // Create a complete HTML document
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wireframe Export</title>
  <style>
    ${css}
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body class="${classPrefix}root ${classPrefix}${style}">
  ${childrenHTML}
</body>
</html>`;

  // Launch Puppeteer
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Set content
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: getPageFormat(options.pageSize) as any || 'A4',
      margin: options.margin || {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      landscape: options.landscape || false,
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate,
      footerTemplate: options.footerTemplate,
      printBackground: options.printBackground !== false, // Default to true
      preferCSSPageSize: options.preferCSSPageSize || false,
      scale: options.scale || 1,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/**
 * Render wireframe to PDF and save to file
 */
export async function renderToPDFFile(
  ast: DocumentNode,
  filepath: string,
  options: PDFRenderOptions = {}
): Promise<void> {
  const pdfBuffer = await renderToPDF(ast, options);

  // Use dynamic import for fs to support both Node and browser environments
  const { writeFile } = await import('fs/promises');
  await writeFile(filepath, pdfBuffer);
}