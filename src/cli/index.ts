#!/usr/bin/env node

/**
 * wiremd CLI Tool
 * Generate wireframes from markdown files
 *
 * Copyright (c) 2025 wiremd
 * Licensed under MIT License
 * https://github.com/akonan/wiremd/blob/main/LICENSE
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { pathToFileURL } from 'url';
import { parse } from '../parser/index.js';
import { renderToHTML, renderToJSON, renderToPDFFile, renderToImageFile, renderToSVGFile, type ImageFormat } from '../renderer/index.js';
import { startServer, notifyReload, notifyError } from './server.js';
import chokidar from 'chokidar';
import chalk from 'chalk';

export interface CLIOptions {
  input: string;
  output?: string;
  format?: 'html' | 'json' | 'pdf' | 'png' | 'svg' | 'jpeg' | 'webp';
  style?: 'sketch' | 'clean' | 'wireframe' | 'none' | 'tailwind' | 'material' | 'brutal';
  watch?: boolean;
  serve?: number;
  pretty?: boolean;
  watchPattern?: string;
  ignorePattern?: string;
  // PDF specific options
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid';
  landscape?: boolean;
  // Image specific options
  width?: number;
  height?: number;
  scale?: number; // Device scale factor for images (2x, 3x)
}

export function showHelp(): void {
  console.log(`
┌─────────────────────────────────────────────────────────────────┐
│  wiremd - Text-first UI design tool                            │
│  Generate wireframes from Markdown syntax                       │
└─────────────────────────────────────────────────────────────────┘

USAGE:
  wiremd <input.md> [options]

OPTIONS:
  -o, --output <file>        Output file path (default: <input>.<ext>)
  -f, --format <format>      Output format: html, json, pdf, png, svg, jpeg, webp (default: html)
  -s, --style <style>        Visual style: sketch, clean, wireframe, none, tailwind, material, brutal (default: sketch)
  -w, --watch                Watch for changes and regenerate
  --serve <port>             Start dev server with live-reload (default: 3000)
  --watch-pattern <pattern>  Glob pattern for files to watch (e.g., "**/*.md")
  --ignore <pattern>         Glob pattern for files to ignore (e.g., "**/node_modules/**")
  -p, --pretty               Pretty print output (default: true)

  PDF OPTIONS:
  --page-size <size>         PDF page size: A4, A3, Letter, Legal, Tabloid (default: A4)
  --landscape                Use landscape orientation for PDF

  IMAGE OPTIONS:
  --width <pixels>           Width for image export (default: 1200)
  --height <pixels>          Height for image export (default: 800)
  --scale <factor>           Device scale factor for high-DPI (e.g., 2 for 2x) (default: 1)

  -h, --help                 Show this help message
  -v, --version              Show version number

EXAMPLES:
  # Generate HTML with default Balsamiq-style
  wiremd wireframe.md

  # Output to specific file
  wiremd wireframe.md -o output.html

  # Use alternative style
  wiremd wireframe.md --style clean

  # Watch mode with live-reload
  wiremd wireframe.md --watch --serve 3000

  # Watch multiple files with pattern
  wiremd wireframe.md --watch --watch-pattern "src/**/*.md"

  # Generate JSON output
  wiremd wireframe.md --format json

  # Export to PDF
  wiremd wireframe.md --format pdf -o wireframe.pdf --page-size A4

  # Export to PNG with high resolution
  wiremd wireframe.md --format png --width 1920 --height 1080 --scale 2

  # Export to SVG
  wiremd wireframe.md --format svg -o wireframe.svg

STYLES:
  sketch     - Balsamiq-inspired hand-drawn look (default)
  clean      - Modern minimal design
  wireframe  - Traditional grayscale with hatching
  none       - Unstyled semantic HTML
  tailwind   - Modern utility-first design with purple accents
  material   - Google Material Design with elevation system
  brutal     - Neo-brutalism with bold colors and thick borders

For more information: https://github.com/akonan/wiremd
`);
}

export function showVersion(): void {
  // Read version from package.json
  try {
    // ESM-compatible way to get directory path
    const currentDir = import.meta.url ? dirname(new URL(import.meta.url).pathname) : __dirname;
    const pkgPath = resolve(currentDir, '../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    console.log(`wiremd v${pkg.version}`);
  } catch {
    console.log('wiremd v0.1.2');
  }
}

export function parseArgs(args: string[]): CLIOptions | null {
  const options: CLIOptions = {
    input: '',
    format: 'html',
    style: 'sketch',
    pretty: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-h':
      case '--help':
        showHelp();
        return null;

      case '-v':
      case '--version':
        showVersion();
        return null;

      case '-o':
      case '--output':
        options.output = args[++i];
        break;

      case '-f':
      case '--format': {
        const format = args[++i];
        const validFormats = ['html', 'json', 'pdf', 'png', 'svg', 'jpeg', 'webp'];
        if (!validFormats.includes(format)) {
          console.error(`Error: Invalid format "${format}". Must be one of: ${validFormats.join(', ')}.`);
          process.exit(1);
        }
        options.format = format as any;
        break;
      }

      case '-s':
      case '--style': {
        const style = args[++i];
        if (!['sketch', 'clean', 'wireframe', 'none', 'tailwind', 'material', 'brutal'].includes(style)) {
          console.error(`Error: Invalid style "${style}". Must be sketch, clean, wireframe, none, tailwind, material, or brutal.`);
          process.exit(1);
        }
        options.style = style as any;
        break;
      }

      case '-w':
      case '--watch':
        options.watch = true;
        break;

      case '--serve':
        options.serve = parseInt(args[++i], 10);
        if (isNaN(options.serve)) {
          console.error('Error: --serve requires a numeric port');
          process.exit(1);
        }
        break;

      case '--watch-pattern':
        options.watchPattern = args[++i];
        break;

      case '--ignore':
        options.ignorePattern = args[++i];
        break;

      case '-p':
      case '--pretty':
        options.pretty = true;
        break;

      case '--page-size': {
        const pageSize = args[++i];
        const validPageSizes = ['A4', 'A3', 'Letter', 'Legal', 'Tabloid'];
        if (!validPageSizes.includes(pageSize)) {
          console.error(`Error: Invalid page size "${pageSize}". Must be one of: ${validPageSizes.join(', ')}.`);
          process.exit(1);
        }
        options.pageSize = pageSize as any;
        break;
      }

      case '--landscape':
        options.landscape = true;
        break;

      case '--width': {
        const width = parseInt(args[++i], 10);
        if (isNaN(width) || width <= 0) {
          console.error('Error: --width must be a positive number');
          process.exit(1);
        }
        options.width = width;
        break;
      }

      case '--height': {
        const height = parseInt(args[++i], 10);
        if (isNaN(height) || height <= 0) {
          console.error('Error: --height must be a positive number');
          process.exit(1);
        }
        options.height = height;
        break;
      }

      case '--scale': {
        const scale = parseFloat(args[++i]);
        if (isNaN(scale) || scale <= 0) {
          console.error('Error: --scale must be a positive number');
          process.exit(1);
        }
        options.scale = scale;
        break;
      }

      default:
        if (arg.startsWith('-')) {
          console.error(`Error: Unknown option "${arg}"`);
          console.error('Run "wiremd --help" for usage information.');
          process.exit(1);
        }
        if (!options.input) {
          options.input = arg;
        }
    }
  }

  if (!options.input) {
    console.error('Error: No input file specified');
    console.error('Run "wiremd --help" for usage information.');
    process.exit(1);
  }

  return options;
}

/**
 * Logger with colored output
 */
const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  warning: (msg: string) => console.log(chalk.yellow('⚠'), msg),
  error: (msg: string) => console.log(chalk.red('✗'), msg),
  watching: (msg: string) => console.log(chalk.cyan('👀'), msg),
  changed: (msg: string) => console.log(chalk.magenta('📝'), msg),
  style: (msg: string) => console.log(chalk.gray('🎨'), msg),
  format: (msg: string) => console.log(chalk.gray('📦'), msg),
};

/**
 * Check if file is too large and might cause performance issues
 */
export function checkFileSize(filePath: string): void {
  try {
    const stats = statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 10) {
      logger.warning(`Large file detected (${fileSizeMB.toFixed(2)}MB). Processing may take longer.`);
    }
  } catch (error) {
    // Ignore stat errors
  }
}

export async function generateOutput(options: CLIOptions): Promise<string | Buffer | void> {
  const { input, format, style, pretty, output } = options;

  // Check if input file exists
  if (!existsSync(input)) {
    throw new Error(`File not found: ${input}`);
  }

  // Check file size for performance warning
  checkFileSize(input);

  // Read input file
  const markdown = readFileSync(input, 'utf-8');

  // Parse to AST
  const ast = parse(markdown);

  // Render to output format
  switch (format) {
    case 'json':
      return renderToJSON(ast, { pretty });

    case 'pdf':
      if (!output) {
        throw new Error('Output file path is required for PDF export');
      }
      await renderToPDFFile(ast, output, {
        style,
        pageSize: options.pageSize,
        landscape: options.landscape,
      });
      return; // PDF writes directly to file

    case 'png':
    case 'jpeg':
    case 'webp':
      if (!output) {
        throw new Error(`Output file path is required for ${format.toUpperCase()} export`);
      }
      await renderToImageFile(ast, output, format as ImageFormat, {
        style,
        width: options.width,
        height: options.height,
        deviceScaleFactor: options.scale,
      });
      return; // Image writes directly to file

    case 'svg':
      if (!output) {
        throw new Error('Output file path is required for SVG export');
      }
      await renderToSVGFile(ast, output, {
        style,
        width: options.width,
        height: options.height,
      });
      return; // SVG writes directly to file

    case 'html':
    default:
      return renderToHTML(ast, { style, pretty, inlineStyles: true });
  }
}

export async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: No input file specified');
    console.error('Run "wiremd --help" for usage information.\n');
    process.exit(1);
  }

  const options = parseArgs(args);
  if (!options) {
    process.exit(0);
  }

  // Determine output path based on format
  if (!options.output) {
    const formatExtensions: Record<string, string> = {
      'json': '.json',
      'html': '.html',
      'pdf': '.pdf',
      'png': '.png',
      'svg': '.svg',
      'jpeg': '.jpg',
      'webp': '.webp',
    };
    const ext = formatExtensions[options.format || 'html'] || '.html';
    options.output = options.input.replace(/\.md$/, ext);
  }

  // Watch mode
  if (options.watch || options.serve) {
    logger.watching(`Watching: ${chalk.bold(options.input)}`);

    // Initial generation
    try {
      const output = await generateOutput(options);
      if (output) {
        // For HTML and JSON, we need to write the output
        writeFileSync(options.output, output, 'utf-8');
      }
      // For PDF/image formats, generateOutput writes directly to file
      logger.success(`Generated: ${chalk.bold(options.output)}`);
      logger.style(`Style: ${chalk.bold(options.style)}`);
      logger.format(`Format: ${chalk.bold(options.format)}`);
      console.log('');
    } catch (error: any) {
      logger.error(`Initial generation failed: ${error.message}`);
      // Don't exit - continue watching for fixes
    }

    // Start dev server if requested
    if (options.serve) {
      const port = options.serve;
      startServer({ port, outputPath: options.output });
      console.log('');
    }

    // Determine what to watch
    const watchPaths: string[] = [];
    const ignorePatterns: string[] = [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
    ];

    // Add custom ignore patterns
    if (options.ignorePattern) {
      ignorePatterns.push(options.ignorePattern);
    }

    // Determine watch paths based on options
    if (options.watchPattern) {
      // Watch using custom pattern
      watchPaths.push(options.watchPattern);
      logger.info(`Watch pattern: ${chalk.bold(options.watchPattern)}`);
    } else {
      // Default: watch the input file and its directory for new .md files
      watchPaths.push(options.input);
      const inputDir = dirname(options.input);
      watchPaths.push(join(inputDir, '**/*.md'));
    }

    logger.info(`Ignoring: ${chalk.gray(ignorePatterns.join(', '))}`);
    console.log('');

    // Setup chokidar watcher with enhanced options
    const watcher = chokidar.watch(watchPaths, {
      ignored: ignorePatterns,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
      // Performance optimizations
      usePolling: false, // Use native fs.watch for better performance
      interval: 100,
      binaryInterval: 300,
    });

    // Track processing state to prevent concurrent regenerations
    let isProcessing = false;
    let pendingRegeneration = false;

    /**
     * Regenerate output with error recovery
     */
    const regenerate = async (filePath: string, event: string) => {
      // If already processing, mark for re-processing
      if (isProcessing) {
        pendingRegeneration = true;
        return;
      }

      isProcessing = true;
      pendingRegeneration = false;

      try {
        const relativePath = filePath.replace(process.cwd(), '.');
        logger.changed(`${chalk.bold(event)}: ${chalk.dim(relativePath)}`);

        // Check if file still exists (it might have been deleted)
        if (!existsSync(options.input)) {
          logger.warning('Input file deleted. Waiting for it to be restored...');
          isProcessing = false;
          return;
        }

        // Regenerate
        const output = await generateOutput(options);
        if (output) {
          // For HTML and JSON, we need to write the output
          writeFileSync(options.output!, output, 'utf-8');
        }
        // For PDF/image formats, generateOutput writes directly to file

        const timestamp = chalk.dim(new Date().toLocaleTimeString());
        logger.success(`Regenerated: ${chalk.bold(options.output!)} ${timestamp}`);

        // Notify live-reload clients
        if (options.serve) {
          notifyReload();
        }
      } catch (error: any) {
        logger.error(`${error.message}`);

        // Show stack trace for debugging if available
        if (error.stack) {
          console.log(chalk.dim(error.stack.split('\n').slice(1, 4).join('\n')));
        }

        // Notify error to live-reload clients
        if (options.serve) {
          notifyError(error.message);
        }

        // Don't crash - continue watching for fixes
        logger.info('Watching for changes to retry...');
      } finally {
        isProcessing = false;

        // If there was a pending regeneration request, process it now
        if (pendingRegeneration) {
          setTimeout(() => regenerate(filePath, event), 50);
        }
      }
    };

    // Watch for various file events
    watcher
      .on('change', (path) => regenerate(path, 'changed'))
      .on('add', (path) => {
        logger.info(`New file detected: ${chalk.dim(path.replace(process.cwd(), '.'))}`);
        regenerate(path, 'added');
      })
      .on('unlink', (path) => {
        const relativePath = path.replace(process.cwd(), '.');
        logger.warning(`File removed: ${chalk.dim(relativePath)}`);

        // If the main input file was deleted, notify but keep watching
        if (path === options.input) {
          logger.warning('Main input file deleted. Waiting for restoration...');
        }
      })
      .on('error', (error: any) => {
        logger.error(`Watcher error: ${error.message}`);
        // Don't crash - the watcher will try to recover
      })
      .on('ready', () => {
        logger.info(chalk.green('Watcher ready. Press Ctrl+C to stop.'));
      });

    // Graceful shutdown
    const shutdown = () => {
      console.log('');
      logger.info('Stopping watch mode...');
      watcher.close().then(() => {
        logger.success('Watch mode stopped.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    return;
  }

  // One-time generation
  logger.info(`Parsing: ${chalk.bold(options.input)}`);

  try {
    const output = await generateOutput(options);

    // Write output (for HTML and JSON)
    if (output) {
      writeFileSync(options.output, output, 'utf-8');
    }
    // For PDF/image formats, generateOutput writes directly to file
    logger.success(`Generated: ${chalk.bold(options.output)}`);
    logger.style(`Style: ${chalk.bold(options.style)}`);
    logger.format(`Format: ${chalk.bold(options.format)}`);
  } catch (error: any) {
    logger.error(`Generation failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Only run main() if this file is executed directly (not imported)
// Use pathToFileURL to handle Windows paths correctly
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  main();
}
