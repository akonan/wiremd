/**
 * CLI integration tests without spawning a shell.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { main } from '../src/cli/index.js';

describe('CLI', () => {
  const TEST_DIR = './test-temp-cli';
  const TEST_INPUT = join(TEST_DIR, 'input.md');
  const TEST_OUTPUT = join(TEST_DIR, 'output.html');
  const PLUGIN_FIXTURE = './tests/fixtures/test-cli-plugin.mjs';

  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
    writeFileSync(
      TEST_INPUT,
      '# Test Wireframe\n\n## Button\n[Click Me]\n',
      'utf-8',
    );
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('generates HTML through main()', async () => {
    const result = await runCli([TEST_INPUT, '-o', TEST_OUTPUT]);

    expect(result.exitCode).toBeNull();
    expect(existsSync(TEST_OUTPUT)).toBe(true);
    expect(readFileSync(TEST_OUTPUT, 'utf-8')).toContain('<html');
    expect(result.logs.join('\n')).toContain('Generated');
  });

  it('auto-generates the output path when --output is omitted', async () => {
    const autoOutput = TEST_INPUT.replace('.md', '.html');

    const result = await runCli([TEST_INPUT]);

    expect(result.exitCode).toBeNull();
    expect(existsSync(autoOutput)).toBe(true);
  });

  it('generates JSON output', async () => {
    const jsonOutput = join(TEST_DIR, 'output.json');

    const result = await runCli([TEST_INPUT, '-o', jsonOutput, '--format', 'json']);

    expect(result.exitCode).toBeNull();
    expect(() => JSON.parse(readFileSync(jsonOutput, 'utf-8'))).not.toThrow();
  });

  it('generates a Vue component', async () => {
    const vueOutput = join(TEST_DIR, 'ContactForm.vue');

    const result = await runCli([
      TEST_INPUT,
      '-o',
      vueOutput,
      '--format',
      'vue',
      '--renderer-option',
      'componentName=ContactForm',
    ]);

    expect(result.exitCode).toBeNull();
    const content = readFileSync(vueOutput, 'utf-8');
    expect(content).toContain('<template>');
    expect(content).toContain('<script setup');
  });

  it('generates Angular artifacts into an output directory', async () => {
    const outputDir = join(TEST_DIR, 'angular-output');

    const result = await runCli([
      TEST_INPUT,
      '--format',
      'angular',
      '--output-dir',
      outputDir,
      '--renderer-option',
      'componentName=CliAngularComponent',
    ]);

    expect(result.exitCode).toBeNull();
    expect(existsSync(join(outputDir, 'cli-angular-component.component.ts'))).toBe(true);
    expect(existsSync(join(outputDir, 'cli-angular-component.component.html'))).toBe(true);
    expect(existsSync(join(outputDir, 'cli-angular-component.component.css'))).toBe(true);
  });

  it('rejects --output for multi-file renderers', async () => {
    const result = await runCli([
      TEST_INPUT,
      '--format',
      'angular',
      '-o',
      join(TEST_DIR, 'bad.ts'),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.logs.join('\n') + result.errors.join('\n')).toContain('Use --output-dir');
  });

  it('lists registered renderers', async () => {
    const result = await runCli(['--list-renderers']);

    expect(result.exitCode).toBe(0);
    expect(result.logs.join('\n')).toContain('html');
    expect(result.logs.join('\n')).toContain('vue');
    expect(result.logs.join('\n')).toContain('angular');
  });

  it('loads an external plugin from a local module', async () => {
    const customOutput = join(TEST_DIR, 'custom.txt');

    const result = await runCli([
      TEST_INPUT,
      '--plugin',
      PLUGIN_FIXTURE,
      '--format',
      'fixture',
      '-o',
      customOutput,
    ]);

    expect(result.exitCode).toBeNull();
    expect(readFileSync(customOutput, 'utf-8')).toContain('fixture renderer output');
  });

  it('shows parsing, style and format in console output', async () => {
    const result = await runCli([TEST_INPUT, '-o', TEST_OUTPUT]);
    const output = result.logs.join('\n');

    expect(output).toContain('Parsing');
    expect(output).toContain('Generated');
    expect(output).toContain('Style');
    expect(output).toContain('Format');
  });
});

async function runCli(args: string[]) {
  const logs: string[] = [];
  const errors: string[] = [];
  const originalArgv = [...process.argv];
  const logSpy = vi.spyOn(console, 'log').mockImplementation((...values) => {
    logs.push(values.map(String).join(' '));
  });
  const errorSpy = vi.spyOn(console, 'error').mockImplementation((...values) => {
    errors.push(values.map(String).join(' '));
  });
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error(`__EXIT__${code ?? 0}`);
  }) as never);

  process.argv = ['node', 'dist/cli/index.js', ...args];

  try {
    await main();
    return { logs, errors, exitCode: null as number | null };
  } catch (error: any) {
    if (typeof error?.message === 'string' && error.message.startsWith('__EXIT__')) {
      return {
        logs,
        errors,
        exitCode: Number(error.message.replace('__EXIT__', '')),
      };
    }
    throw error;
  } finally {
    process.argv = originalArgv;
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  }
}
