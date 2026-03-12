#!/usr/bin/env node

/**
 * wiremd CLI Tool
 * Generate wireframes from markdown files
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, dirname, extname, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import chokidar from 'chokidar';
import chalk from 'chalk';
import { parse } from '../parser/index.js';
import {
  createPluginRegistry,
  type defaultPluginRegistry,
} from '../renderer/index.js';
import type { PluginRegistry, RenderArtifact, RenderOptions, WiremdPlugin } from '../types.js';
import { startServer, notifyError, notifyReload } from './server.js';

type StyleOption = 'sketch' | 'clean' | 'wireframe' | 'none' | 'tailwind' | 'material' | 'brutal';
type CLIRegistry = typeof defaultPluginRegistry;

export interface CLIOptions {
  input: string;
  output?: string;
  outputDir?: string;
  format?: string;
  style?: StyleOption;
  watch?: boolean;
  serve?: number;
  pretty?: boolean;
  watchPattern?: string;
  ignorePattern?: string;
  plugins?: string[];
  listRenderers?: boolean;
  rendererOptions?: Record<string, unknown>;
}

export function showHelp(): void {
  console.log(`
┌─────────────────────────────────────────────────────────────────┐
│  wiremd - Text-first UI design tool                            │
│  Generate wireframes from Markdown syntax                       │
└─────────────────────────────────────────────────────────────────┘

USAGE:
  wiremd <input.md> [options]
  wiremd --list-renderers [options]

OPTIONS:
  -o, --output <file>          Output file path for single-file renderers
  --output-dir <dir>           Output directory for multi-file renderers
  -f, --format <format>        Output format: html, json, react, tailwind, vue, svelte, angular
  -s, --style <style>          Visual style: sketch, clean, wireframe, none, tailwind, material, brutal
  --plugin <path|specifier>    Load an external renderer plugin (repeatable)
  --renderer-option <k=v>      Pass plugin-specific renderer options (repeatable)
  --list-renderers             List available renderers
  -w, --watch                  Watch for changes and regenerate
  --serve <port>               Start dev server with live-reload (HTML/Tailwind only)
  --watch-pattern <pattern>    Glob pattern for files to watch (e.g., "**/*.md")
  --ignore <pattern>           Glob pattern for files to ignore (e.g., "**/node_modules/**")
  -p, --pretty                 Pretty print output (default: true)
  -h, --help                   Show this help message
  -v, --version                Show version number

EXAMPLES:
  wiremd wireframe.md
  wiremd wireframe.md -o output.html
  wiremd wireframe.md --format vue --renderer-option componentName=ContactForm
  wiremd wireframe.md --format angular --output-dir ./generated
  wiremd wireframe.md --plugin ./my-plugin.mjs --format custom
  wiremd --list-renderers

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
  try {
    const currentDir = import.meta.url ? dirname(new URL(import.meta.url).pathname) : __dirname;
    const pkgPath = resolve(currentDir, '../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    console.log(`wiremd v${pkg.version}`);
  } catch {
    console.log('wiremd v0.1.5');
  }
}

export function parseArgs(args: string[]): CLIOptions | null {
  const options: CLIOptions = {
    input: '',
    format: 'html',
    style: 'sketch',
    pretty: true,
  };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    switch (arg) {
      case '-h':
      case '--help':
        showHelp();
        return null;

      case '-v':
      case '--version':
        showVersion();
        return null;

      case '--list-renderers':
        options.listRenderers = true;
        break;

      case '--plugin':
        options.plugins = options.plugins || [];
        options.plugins.push(args[++index]);
        break;

      case '--renderer-option': {
        const entry = args[++index];
        const [key, ...rest] = entry.split('=');
        if (!key || rest.length === 0) {
          console.error(`Error: Invalid renderer option "${entry}". Use key=value.`);
          process.exit(1);
        }
        options.rendererOptions = options.rendererOptions || {};
        options.rendererOptions[key] = parseRendererOptionValue(rest.join('='));
        break;
      }

      case '-o':
      case '--output':
        options.output = args[++index];
        break;

      case '--output-dir':
        options.outputDir = args[++index];
        break;

      case '-f':
      case '--format':
        options.format = args[++index];
        break;

      case '-s':
      case '--style': {
        const style = args[++index];
        if (!['sketch', 'clean', 'wireframe', 'none', 'tailwind', 'material', 'brutal'].includes(style)) {
          console.error(`Error: Invalid style "${style}". Must be sketch, clean, wireframe, none, tailwind, material, or brutal.`);
          process.exit(1);
        }
        options.style = style as StyleOption;
        break;
      }

      case '-w':
      case '--watch':
        options.watch = true;
        break;

      case '--serve':
        options.serve = parseInt(args[++index], 10);
        if (Number.isNaN(options.serve)) {
          console.error('Error: --serve requires a numeric port');
          process.exit(1);
        }
        break;

      case '--watch-pattern':
        options.watchPattern = args[++index];
        break;

      case '--ignore':
        options.ignorePattern = args[++index];
        break;

      case '-p':
      case '--pretty':
        options.pretty = true;
        break;

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

  if (!options.input && !options.listRenderers) {
    console.error('Error: No input file specified');
    console.error('Run "wiremd --help" for usage information.');
    process.exit(1);
  }

  return options;
}

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

export function checkFileSize(filePath: string): void {
  try {
    const stats = statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 10) {
      logger.warning(`Large file detected (${fileSizeMB.toFixed(2)}MB). Processing may take longer.`);
    }
  } catch {
    // Ignore stat errors
  }
}

export function generateArtifacts(
  options: CLIOptions,
  registry: PluginRegistry = createPluginRegistry(),
) {
  const { input, format, style, pretty, rendererOptions } = options;

  if (!existsSync(input)) {
    throw new Error(`File not found: ${input}`);
  }

  checkFileSize(input);
  const markdown = readFileSync(input, 'utf-8');
  const ast = parse(markdown);

  const renderOptions: RenderOptions = {
    format,
    style,
    pretty,
    rendererOptions,
  };

  return registry.renderArtifacts(ast, renderOptions);
}

export function generateOutput(
  options: CLIOptions,
  registry: PluginRegistry = createPluginRegistry(),
): string {
  const result = generateArtifacts(options, registry);

  if (result.artifacts.length !== 1) {
    throw new Error(`Renderer "${options.format || 'html'}" produces multiple artifacts. Use --output-dir.`);
  }

  return result.artifacts[0].content;
}

async function loadPlugins(pluginRefs: string[], registry: PluginRegistry): Promise<void> {
  for (const pluginRef of pluginRefs) {
    const moduleRef = isModulePath(pluginRef)
      ? pathToFileURL(resolve(process.cwd(), pluginRef)).href
      : pluginRef;
    const loadedModule = await import(moduleRef);
    const pluginCandidates = resolvePluginCandidates(loadedModule);

    if (pluginCandidates.length === 0) {
      throw new Error(`Module "${pluginRef}" does not export a plugin, plugin list, or default plugin.`);
    }

    pluginCandidates.forEach((plugin) => {
      registry.registerPlugin(plugin);
    });
  }
}

function resolvePluginCandidates(moduleValue: Record<string, unknown>): WiremdPlugin[] {
  const directCandidates = [moduleValue.default, moduleValue.plugin, moduleValue.plugins]
    .filter(Boolean);

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isWiremdPlugin);
    }
    if (isWiremdPlugin(candidate)) {
      return [candidate];
    }
  }

  return Object.values(moduleValue).filter(isWiremdPlugin);
}

function isWiremdPlugin(value: unknown): value is WiremdPlugin {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof (value as WiremdPlugin).name === 'string' && typeof (value as WiremdPlugin).version === 'string';
}

function isModulePath(value: string): boolean {
  return value.startsWith('.') || value.startsWith('/') || value.endsWith('.js') || value.endsWith('.mjs') || value.endsWith('.cjs');
}

function parseRendererOptionValue(value: string): unknown {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return value;
}

function ensureServeCompatible(options: CLIOptions): void {
  if (options.serve && options.format && !['html', 'tailwind'].includes(options.format)) {
    throw new Error('--serve currently supports only html and tailwind outputs.');
  }
}

function writeArtifactsToDisk(
  options: CLIOptions,
  artifacts: RenderArtifact[],
): { primaryPath: string; writtenPaths: string[] } {
  if (artifacts.length === 1) {
    const artifact = artifacts[0];
    let targetPath = options.output;

    if (!targetPath && options.outputDir) {
      mkdirSync(options.outputDir, { recursive: true });
      targetPath = join(options.outputDir, artifact.filename);
    }

    if (!targetPath) {
      const extension = extname(artifact.filename) || '.txt';
      targetPath = options.input.replace(/\.md$/, extension);
    }

    writeFileSync(targetPath, artifact.content, 'utf-8');
    return { primaryPath: targetPath, writtenPaths: [targetPath] };
  }

  if (options.output) {
    throw new Error('Multi-file renderers do not support --output. Use --output-dir instead.');
  }

  const targetDir = options.outputDir || defaultOutputDir(options.input, options.format || 'output');
  mkdirSync(targetDir, { recursive: true });

  const writtenPaths = artifacts.map((artifact) => {
    const artifactPath = join(targetDir, artifact.filename);
    writeFileSync(artifactPath, artifact.content, 'utf-8');
    return artifactPath;
  });

  return {
    primaryPath: writtenPaths[0],
    writtenPaths,
  };
}

function defaultOutputDir(inputPath: string, format: string): string {
  const extension = extname(inputPath);
  const base = basename(inputPath, extension);
  return join(dirname(inputPath), `${base}-${format}`);
}

function printRendererList(registry: CLIRegistry): void {
  const renderers = registry.listRenderers();
  if (renderers.length === 0) {
    console.log('No renderers registered.');
    return;
  }

  console.log('Available renderers:\n');
  renderers.forEach((renderer) => {
    const mode = renderer.outputType === 'multi' ? 'multi-file' : 'single-file';
    console.log(`- ${renderer.format} (${mode}) - ${renderer.pluginName}${renderer.description ? `: ${renderer.description}` : ''}`);
  });
}

async function runGeneration(
  options: CLIOptions,
  registry: CLIRegistry,
): Promise<{ primaryPath: string; writtenPaths: string[]; format: string }> {
  const result = generateArtifacts(options, registry);
  const writeResult = writeArtifactsToDisk(options, result.artifacts);
  return {
    primaryPath: writeResult.primaryPath,
    writtenPaths: writeResult.writtenPaths,
    format: result.format,
  };
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

  const registry = createPluginRegistry();
  await loadPlugins(options.plugins || [], registry);

  if (options.listRenderers) {
    printRendererList(registry);
    process.exit(0);
  }

  ensureServeCompatible(options);

  if (options.watch || options.serve) {
    logger.watching(`Watching: ${chalk.bold(options.input)}`);

    let primaryOutputPath = '';

    try {
      const generated = await runGeneration(options, registry);
      primaryOutputPath = generated.primaryPath;
      logger.success(`Generated: ${chalk.bold(primaryOutputPath)}`);
      logger.style(`Style: ${chalk.bold(options.style)}`);
      logger.format(`Format: ${chalk.bold(generated.format)}`);
      console.log('');
    } catch (error: any) {
      logger.error(`Initial generation failed: ${error.message}`);
    }

    if (options.serve) {
      if (!primaryOutputPath.endsWith('.html')) {
        throw new Error('--serve requires an HTML output file.');
      }
      startServer({ port: options.serve, outputPath: primaryOutputPath });
      console.log('');
    }

    const watchPaths: string[] = [];
    const ignorePatterns: string[] = [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
    ];

    if (options.ignorePattern) {
      ignorePatterns.push(options.ignorePattern);
    }

    if (options.watchPattern) {
      watchPaths.push(options.watchPattern);
      logger.info(`Watch pattern: ${chalk.bold(options.watchPattern)}`);
    } else {
      watchPaths.push(options.input);
      watchPaths.push(join(dirname(options.input), '**/*.md'));
    }

    logger.info(`Ignoring: ${chalk.gray(ignorePatterns.join(', '))}`);
    console.log('');

    const watcher = chokidar.watch(watchPaths, {
      ignored: ignorePatterns,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
      usePolling: false,
      interval: 100,
      binaryInterval: 300,
    });

    let isProcessing = false;
    let pendingRegeneration = false;

    const regenerate = async (filePath: string, event: string) => {
      if (isProcessing) {
        pendingRegeneration = true;
        return;
      }

      isProcessing = true;
      pendingRegeneration = false;

      try {
        const relativePath = filePath.replace(process.cwd(), '.');
        logger.changed(`${chalk.bold(event)}: ${chalk.dim(relativePath)}`);

        if (!existsSync(options.input)) {
          logger.warning('Input file deleted. Waiting for it to be restored...');
          isProcessing = false;
          return;
        }

        const generated = await runGeneration(options, registry);
        primaryOutputPath = generated.primaryPath;
        const timestamp = chalk.dim(new Date().toLocaleTimeString());
        logger.success(`Regenerated: ${chalk.bold(primaryOutputPath)} ${timestamp}`);

        if (options.serve) {
          notifyReload();
        }
      } catch (error: any) {
        logger.error(`${error.message}`);

        if (error.stack) {
          console.log(chalk.dim(error.stack.split('\n').slice(1, 4).join('\n')));
        }

        if (options.serve) {
          notifyError(error.message);
        }

        logger.info('Watching for changes to retry...');
      } finally {
        isProcessing = false;
        if (pendingRegeneration) {
          setTimeout(() => {
            void regenerate(filePath, event);
          }, 50);
        }
      }
    };

    watcher
      .on('change', (path) => {
        void regenerate(path, 'changed');
      })
      .on('add', (path) => {
        logger.info(`New file detected: ${chalk.dim(path.replace(process.cwd(), '.'))}`);
        void regenerate(path, 'added');
      })
      .on('unlink', (path) => {
        const relativePath = path.replace(process.cwd(), '.');
        logger.warning(`File removed: ${chalk.dim(relativePath)}`);

        if (path === options.input) {
          logger.warning('Main input file deleted. Waiting for restoration...');
        }
      })
      .on('error', (error: unknown) => {
        logger.error(`Watcher error: ${error instanceof Error ? error.message : String(error)}`);
      })
      .on('ready', () => {
        logger.info(chalk.green('Watcher ready. Press Ctrl+C to stop.'));
      });

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

  logger.info(`Parsing: ${chalk.bold(options.input)}`);

  try {
    const generated = await runGeneration(options, registry);
    logger.success(`Generated: ${chalk.bold(generated.primaryPath)}`);
    logger.style(`Style: ${chalk.bold(options.style)}`);
    logger.format(`Format: ${chalk.bold(generated.format)}`);
  } catch (error: any) {
    logger.error(`Generation failed: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  void main();
}
