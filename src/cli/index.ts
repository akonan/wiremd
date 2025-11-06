#!/usr/bin/env node

/**
 * wiremd CLI Tool
 * Generate wireframes from markdown files
 */

import { readFileSync, writeFileSync, existsSync, watchFile } from 'fs';
import { resolve } from 'path';
import { parse } from '../parser/index.js';
import { renderToHTML, renderToJSON } from '../renderer/index.js';
import { startServer, notifyReload } from './server.js';

interface CLIOptions {
  input: string;
  output?: string;
  format?: 'html' | 'json';
  style?: 'sketch' | 'clean' | 'wireframe' | 'none';
  watch?: boolean;
  serve?: number;
  pretty?: boolean;
}

function showHelp(): void {
  console.log(`
┌─────────────────────────────────────────────────────────────────┐
│  wiremd - Text-first UI design tool                            │
│  Generate wireframes from Markdown syntax                       │
└─────────────────────────────────────────────────────────────────┘

USAGE:
  mdmock <input.md> [options]

OPTIONS:
  -o, --output <file>      Output file path (default: <input>.html)
  -f, --format <format>    Output format: html, json (default: html)
  -s, --style <style>      Visual style: sketch, clean, wireframe, none (default: sketch)
  -w, --watch              Watch for changes and regenerate
  --serve <port>           Start dev server with live-reload (default: 3000)
  -p, --pretty             Pretty print output (default: true)
  -h, --help               Show this help message
  -v, --version            Show version number

EXAMPLES:
  # Generate HTML with default Balsamiq-style
  mdmock wireframe.md

  # Output to specific file
  mdmock wireframe.md -o output.html

  # Use alternative style
  mdmock wireframe.md --style clean

  # Watch mode with live-reload
  mdmock wireframe.md --watch --serve 3000

  # Generate JSON output
  mdmock wireframe.md --format json

STYLES:
  sketch     - Balsamiq-inspired hand-drawn look (default)
  clean      - Modern minimal design
  wireframe  - Traditional grayscale with hatching
  none       - Unstyled semantic HTML

For more information: https://github.com/akonan/wiremd
`);
}

function showVersion(): void {
  // Read version from package.json
  try {
    const pkgPath = resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    console.log(`wiremd v${pkg.version}`);
  } catch {
    console.log('wiremd v0.1.0');
  }
}

function parseArgs(args: string[]): CLIOptions | null {
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
      case '--format':
        const format = args[++i];
        if (format !== 'html' && format !== 'json') {
          console.error(`Error: Invalid format "${format}". Must be html or json.`);
          process.exit(1);
        }
        options.format = format;
        break;

      case '-s':
      case '--style':
        const style = args[++i];
        if (!['sketch', 'clean', 'wireframe', 'none'].includes(style)) {
          console.error(`Error: Invalid style "${style}". Must be sketch, clean, wireframe, or none.`);
          process.exit(1);
        }
        options.style = style as any;
        break;

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

      case '-p':
      case '--pretty':
        options.pretty = true;
        break;

      default:
        if (arg.startsWith('-')) {
          console.error(`Error: Unknown option "${arg}"`);
          console.error('Run "mdmock --help" for usage information.');
          process.exit(1);
        }
        if (!options.input) {
          options.input = arg;
        }
    }
  }

  if (!options.input) {
    console.error('Error: No input file specified');
    console.error('Run "mdmock --help" for usage information.');
    process.exit(1);
  }

  return options;
}

function generateOutput(options: CLIOptions): string {
  const { input, format, style, pretty } = options;

  // Check if input file exists
  if (!existsSync(input)) {
    console.error(`Error: File not found: ${input}`);
    process.exit(1);
  }

  // Read input file
  const markdown = readFileSync(input, 'utf-8');

  // Parse to AST
  const ast = parse(markdown);

  // Render to output format
  if (format === 'json') {
    return renderToJSON(ast, { pretty });
  } else {
    return renderToHTML(ast, { style, pretty, inlineStyles: true });
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const options = parseArgs(args);
  if (!options) {
    process.exit(0);
  }

  // Determine output path
  if (!options.output) {
    const ext = options.format === 'json' ? '.json' : '.html';
    options.output = options.input.replace(/\.md$/, ext);
  }

  // Watch mode
  if (options.watch || options.serve) {
    console.log(`👀 Watching: ${options.input}`);

    // Initial generation
    let output = generateOutput(options);
    writeFileSync(options.output, output, 'utf-8');
    console.log(`✅ Generated: ${options.output}`);
    console.log(`🎨 Style: ${options.style}`);
    console.log(`📦 Format: ${options.format}`);
    console.log('');

    // Start dev server if requested
    if (options.serve) {
      const port = options.serve;
      startServer({ port, outputPath: options.output });
      console.log('');
    }

    // Watch for file changes
    let debounceTimer: NodeJS.Timeout | null = null;

    watchFile(options.input, { interval: 500 }, () => {
      // Debounce file changes (editors can trigger multiple events)
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        console.log('📝 File changed, regenerating...');

        try {
          output = generateOutput(options);
          writeFileSync(options.output!, output, 'utf-8');
          console.log(`✅ Regenerated: ${options.output} (${new Date().toLocaleTimeString()})`);

          // Notify live-reload clients
          if (options.serve) {
            notifyReload();
          }
        } catch (error: any) {
          console.error(`❌ Error: ${error.message}`);
        }
      }, 100);
    });

    // Keep process running
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping watch mode...');
      process.exit(0);
    });

    return;
  }

  // One-time generation
  console.log(`📄 Parsing: ${options.input}`);
  const output = generateOutput(options);

  // Write output
  writeFileSync(options.output, output, 'utf-8');
  console.log(`✅ Generated: ${options.output}`);
  console.log(`🎨 Style: ${options.style}`);
  console.log(`📦 Format: ${options.format}`);
}

main();
