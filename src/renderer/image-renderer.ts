/**
 * Image Renderer Module
 *
 * Exports wireframes to PNG/SVG image formats using Puppeteer.
 * Leverages the existing HTML renderer for consistent output.
 */

import type { DocumentNode, RenderOptions } from '../types.js';
import { renderNode } from './html-renderer.js';
import { getStyleCSS } from './styles.js';

export interface ImageRenderOptions extends Omit<RenderOptions, 'format'> {
  width?: number;
  height?: number;
  deviceScaleFactor?: number; // For high-DPI support (2x, 3x)
  fullPage?: boolean;
  omitBackground?: boolean;
  encoding?: 'base64' | 'binary';
  quality?: number; // For JPEG format (0-100)
}

export type ImageFormat = 'png' | 'jpeg' | 'webp';

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
 * Render wireframe to image (PNG/JPEG/WebP)
 */
export async function renderToImage(
  ast: DocumentNode,
  format: ImageFormat = 'png',
  options: ImageRenderOptions = {}
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
    body {
      background: ${options.omitBackground ? 'transparent' : 'white'};
      padding: 20px;
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

    // Set viewport if dimensions are specified
    if (options.width || options.height) {
      await page.setViewport({
        width: options.width || 1200,
        height: options.height || 800,
        deviceScaleFactor: options.deviceScaleFactor || 1,
      });
    }

    // Set content
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
    });

    // Generate screenshot
    const screenshotOptions: any = {
      type: format,
      fullPage: options.fullPage !== false, // Default to true
      omitBackground: options.omitBackground || false,
      encoding: options.encoding || 'binary',
    };

    // Add quality for JPEG
    if (format === 'jpeg' && options.quality !== undefined) {
      screenshotOptions.quality = options.quality;
    }

    const imageBuffer = await page.screenshot(screenshotOptions);
    return Buffer.from(imageBuffer as any);
  } finally {
    await browser.close();
  }
}

/**
 * Render wireframe to SVG
 * SVG export requires a different approach since Puppeteer doesn't directly support SVG screenshots.
 * We'll extract the SVG from the rendered HTML.
 */
export async function renderToSVG(
  ast: DocumentNode,
  options: Omit<ImageRenderOptions, 'quality' | 'encoding'> = {}
): Promise<string> {
  // For SVG, we'll need to render as HTML and then convert
  // This is a simplified version - a full implementation would
  // need to properly convert HTML/CSS to SVG

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

  // Create SVG wrapper
  const width = options.width || 1200;
  const height = options.height || 800;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
      ${childrenHTML}
    </div>
  </foreignObject>
</svg>`;

  return svg;
}

/**
 * Render wireframe to image and save to file
 */
export async function renderToImageFile(
  ast: DocumentNode,
  filepath: string,
  format: ImageFormat = 'png',
  options: ImageRenderOptions = {}
): Promise<void> {
  const imageBuffer = await renderToImage(ast, format, options);

  // Use dynamic import for fs to support both Node and browser environments
  const { writeFile } = await import('fs/promises');
  await writeFile(filepath, imageBuffer);
}

/**
 * Render wireframe to SVG and save to file
 */
export async function renderToSVGFile(
  ast: DocumentNode,
  filepath: string,
  options: Omit<ImageRenderOptions, 'quality' | 'encoding'> = {}
): Promise<void> {
  const svg = await renderToSVG(ast, options);

  // Use dynamic import for fs to support both Node and browser environments
  const { writeFile } = await import('fs/promises');
  await writeFile(filepath, svg, 'utf-8');
}