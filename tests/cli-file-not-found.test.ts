/**
 * Test for file not found error handling
 * This test verifies that the CLI returns a non-zero exit code
 * when attempting to process a non-existent file
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('CLI File Not Found Error Handling', () => {
  it('should exit with non-zero exit code when input file does not exist', () => {
    let exitCode = 0;
    let stdout = '';
    let stderr = '';

    try {
      stdout = execSync('node dist/cli/index.js nonexistent.md -o output.html', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    } catch (error: any) {
      exitCode = error.status || 1;
      stdout = error.stdout?.toString() || '';
      stderr = error.stderr?.toString() || '';
    }

    // Should exit with non-zero exit code
    expect(exitCode).not.toBe(0);

    // Should show error message about file not found
    const output = stdout + stderr;
    expect(output).toMatch(/File not found|not found|does not exist|ENOENT/i);
  });

  it('should show error message when file does not exist', () => {
    expect(() => {
      execSync('node dist/cli/index.js definitely-does-not-exist-file.md -o output.html', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    }).toThrow();
  });

  it('should exit with code 1 specifically for file not found errors', () => {
    let exitCode = 0;

    try {
      execSync('node dist/cli/index.js missing-file.md', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    } catch (error: any) {
      exitCode = error.status;
    }

    expect(exitCode).toBe(1);
  });
});
