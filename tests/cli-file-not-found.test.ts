import { describe, expect, it, vi } from 'vitest';
import { main } from '../src/cli/index.js';

describe('CLI File Not Found Error Handling', () => {
  it('should exit with code 1 when the input file does not exist', async () => {
    const result = await runMissingFileCli(['nonexistent.md', '-o', 'output.html']);

    expect(result.exitCode).toBe(1);
    expect(result.output).toMatch(/File not found|not found|does not exist|ENOENT/i);
  });

  it('should surface an error for a definitely missing file', async () => {
    const result = await runMissingFileCli(['definitely-does-not-exist-file.md', '-o', 'output.html']);

    expect(result.exitCode).toBe(1);
  });

  it('should exit with code 1 specifically for file not found errors', async () => {
    const result = await runMissingFileCli(['missing-file.md']);

    expect(result.exitCode).toBe(1);
  });
});

async function runMissingFileCli(args: string[]) {
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
    return { exitCode: 0, output: logs.join('\n') + errors.join('\n') };
  } catch (error: any) {
    if (typeof error?.message === 'string' && error.message.startsWith('__EXIT__')) {
      return {
        exitCode: Number(error.message.replace('__EXIT__', '')),
        output: `${logs.join('\n')}\n${errors.join('\n')}`,
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
