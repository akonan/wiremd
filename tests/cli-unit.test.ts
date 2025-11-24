/**
 * Unit tests for CLI functions
 * These tests directly import and test CLI functions for better code coverage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFileSync, unlinkSync, existsSync, mkdirSync, rmSync } from 'fs';
import {
  parseArgs,
  showHelp,
  showVersion,
  checkFileSize,
  generateOutput,
  type CLIOptions,
} from '../src/cli/index.js';

describe('CLI Unit Tests', () => {
  describe('parseArgs', () => {
    it('should parse input file', () => {
      const result = parseArgs(['test.md']);
      expect(result).toEqual({
        input: 'test.md',
        format: 'html',
        style: 'sketch',
        pretty: true,
      });
    });

    it('should parse output option (short form)', () => {
      const result = parseArgs(['test.md', '-o', 'output.html']);
      expect(result?.output).toBe('output.html');
    });

    it('should parse output option (long form)', () => {
      const result = parseArgs(['test.md', '--output', 'output.html']);
      expect(result?.output).toBe('output.html');
    });

    it('should parse format option (short form)', () => {
      const result = parseArgs(['test.md', '-f', 'json']);
      expect(result?.format).toBe('json');
    });

    it('should parse format option (long form)', () => {
      const result = parseArgs(['test.md', '--format', 'json']);
      expect(result?.format).toBe('json');
    });

    it('should parse style option (short form)', () => {
      const result = parseArgs(['test.md', '-s', 'clean']);
      expect(result?.style).toBe('clean');
    });

    it('should parse style option (long form)', () => {
      const result = parseArgs(['test.md', '--style', 'wireframe']);
      expect(result?.style).toBe('wireframe');
    });

    it('should parse watch option (short form)', () => {
      const result = parseArgs(['test.md', '-w']);
      expect(result?.watch).toBe(true);
    });

    it('should parse watch option (long form)', () => {
      const result = parseArgs(['test.md', '--watch']);
      expect(result?.watch).toBe(true);
    });

    it('should parse serve option', () => {
      const result = parseArgs(['test.md', '--serve', '3000']);
      expect(result?.serve).toBe(3000);
    });

    it('should parse watch-pattern option', () => {
      const result = parseArgs(['test.md', '--watch-pattern', '**/*.md']);
      expect(result?.watchPattern).toBe('**/*.md');
    });

    it('should parse ignore option', () => {
      const result = parseArgs(['test.md', '--ignore', '**/node_modules/**']);
      expect(result?.ignorePattern).toBe('**/node_modules/**');
    });

    it('should parse pretty option (short form)', () => {
      const result = parseArgs(['test.md', '-p']);
      expect(result?.pretty).toBe(true);
    });

    it('should parse pretty option (long form)', () => {
      const result = parseArgs(['test.md', '--pretty']);
      expect(result?.pretty).toBe(true);
    });

    it('should parse multiple options together', () => {
      const result = parseArgs([
        'test.md',
        '-o',
        'output.html',
        '-f',
        'html',
        '-s',
        'clean',
        '-w',
      ]);
      expect(result).toEqual({
        input: 'test.md',
        output: 'output.html',
        format: 'html',
        style: 'clean',
        watch: true,
        pretty: true,
      });
    });

    it('should accept all valid styles', () => {
      const styles = ['sketch', 'clean', 'wireframe', 'none', 'tailwind', 'material', 'brutal'];

      for (const style of styles) {
        const result = parseArgs(['test.md', '--style', style]);
        expect(result?.style).toBe(style);
      }
    });

    describe('Error handling', () => {
      // Mock console.error and process.exit
      let consoleErrorSpy: any;
      let processExitSpy: any;

      beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: any) => {
          throw new Error(`process.exit(${code})`);
        });
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
      });

      it('should error on invalid format', () => {
        expect(() => parseArgs(['test.md', '--format', 'xml'])).toThrow('process.exit(1)');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid format "xml"')
        );
      });

      it('should error on invalid style', () => {
        expect(() => parseArgs(['test.md', '--style', 'invalid'])).toThrow('process.exit(1)');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Invalid style "invalid"')
        );
      });

      it('should error on invalid serve port', () => {
        expect(() => parseArgs(['test.md', '--serve', 'abc'])).toThrow('process.exit(1)');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('--serve requires a numeric port')
        );
      });

      it('should error on unknown option', () => {
        expect(() => parseArgs(['test.md', '--unknown'])).toThrow('process.exit(1)');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Unknown option "--unknown"')
        );
      });

      it('should error when no input file specified', () => {
        expect(() => parseArgs(['-o', 'output.html'])).toThrow('process.exit(1)');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('No input file specified')
        );
      });
    });

    describe('Help and version', () => {
      let consoleLogSpy: any;

      beforeEach(() => {
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      });

      afterEach(() => {
        consoleLogSpy.mockRestore();
      });

      it('should return null and show help for -h', () => {
        const result = parseArgs(['-h']);
        expect(result).toBeNull();
        expect(consoleLogSpy).toHaveBeenCalled();
      });

      it('should return null and show help for --help', () => {
        const result = parseArgs(['--help']);
        expect(result).toBeNull();
        expect(consoleLogSpy).toHaveBeenCalled();
      });

      it('should return null and show version for -v', () => {
        const result = parseArgs(['-v']);
        expect(result).toBeNull();
        expect(consoleLogSpy).toHaveBeenCalled();
      });

      it('should return null and show version for --version', () => {
        const result = parseArgs(['--version']);
        expect(result).toBeNull();
        expect(consoleLogSpy).toHaveBeenCalled();
      });
    });
  });

  describe('showHelp', () => {
    let consoleLogSpy: any;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should output help text', () => {
      showHelp();
      expect(consoleLogSpy).toHaveBeenCalled();

      const output = consoleLogSpy.mock.calls[0][0];
      expect(output).toContain('wiremd');
      expect(output).toContain('USAGE:');
      expect(output).toContain('OPTIONS:');
      expect(output).toContain('EXAMPLES:');
      expect(output).toContain('STYLES:');
    });

    it('should list all available options', () => {
      showHelp();
      const output = consoleLogSpy.mock.calls[0][0];

      expect(output).toContain('--output');
      expect(output).toContain('--format');
      expect(output).toContain('--style');
      expect(output).toContain('--watch');
      expect(output).toContain('--serve');
      expect(output).toContain('--watch-pattern');
      expect(output).toContain('--ignore');
      expect(output).toContain('--pretty');
      expect(output).toContain('--help');
      expect(output).toContain('--version');
    });

    it('should list all available styles', () => {
      showHelp();
      const output = consoleLogSpy.mock.calls[0][0];

      expect(output).toContain('sketch');
      expect(output).toContain('clean');
      expect(output).toContain('wireframe');
      expect(output).toContain('none');
      expect(output).toContain('tailwind');
      expect(output).toContain('material');
      expect(output).toContain('brutal');
    });
  });

  describe('showVersion', () => {
    let consoleLogSpy: any;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should output version string', () => {
      showVersion();
      expect(consoleLogSpy).toHaveBeenCalled();

      const output = consoleLogSpy.mock.calls[0][0];
      expect(output).toMatch(/wiremd v\d+\.\d+\.\d+/);
    });
  });

  describe('checkFileSize', () => {
    const TEST_DIR = './test-temp-cli-unit';
    const SMALL_FILE = `${TEST_DIR}/small.md`;
    const LARGE_FILE = `${TEST_DIR}/large.md`;

    beforeEach(() => {
      // Create test directory
      if (!existsSync(TEST_DIR)) {
        mkdirSync(TEST_DIR, { recursive: true });
      }

      // Create a small file (1KB)
      writeFileSync(SMALL_FILE, 'a'.repeat(1024), 'utf-8');

      // Create a large file (11MB - over the 10MB threshold)
      const chunk = 'a'.repeat(1024 * 1024); // 1MB
      let content = '';
      for (let i = 0; i < 11; i++) {
        content += chunk;
      }
      writeFileSync(LARGE_FILE, content, 'utf-8');
    });

    afterEach(() => {
      // Clean up test files
      if (existsSync(TEST_DIR)) {
        rmSync(TEST_DIR, { recursive: true, force: true });
      }
    });

    it('should not warn for small files', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      checkFileSize(SMALL_FILE);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      consoleLogSpy.mockRestore();
    });

    it('should warn for large files', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      checkFileSize(LARGE_FILE);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('Large file detected')
      );
      consoleLogSpy.mockRestore();
    });

    it('should not throw on non-existent files', () => {
      expect(() => checkFileSize('nonexistent.md')).not.toThrow();
    });
  });

  describe('generateOutput', () => {
    const TEST_DIR = './test-temp-cli-unit';
    const TEST_FILE = `${TEST_DIR}/test.md`;

    beforeEach(() => {
      // Create test directory
      if (!existsSync(TEST_DIR)) {
        mkdirSync(TEST_DIR, { recursive: true });
      }

      // Create test markdown file
      writeFileSync(
        TEST_FILE,
        '# Test Wireframe\n\n## Button\n[Click Me]\n',
        'utf-8'
      );
    });

    afterEach(() => {
      // Clean up test files
      if (existsSync(TEST_DIR)) {
        rmSync(TEST_DIR, { recursive: true, force: true });
      }
    });

    it('should generate HTML output', async () => {
      const options: CLIOptions = {
        input: TEST_FILE,
        format: 'html',
        style: 'sketch',
        pretty: true,
      };

      const output = await generateOutput(options);

      expect(output).toContain('<html');
      expect(output).toContain('</html>');
      expect(output).toContain('Test Wireframe');
      expect(output).toContain('button');
    });

    it('should generate JSON output', async () => {
      const options: CLIOptions = {
        input: TEST_FILE,
        format: 'json',
        pretty: true,
      };

      const output = await generateOutput(options);

      expect(() => JSON.parse(output as string)).not.toThrow();
      const json = JSON.parse(output as string);
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('children');
    });

    it('should apply sketch style', async () => {
      const options: CLIOptions = {
        input: TEST_FILE,
        format: 'html',
        style: 'sketch',
        pretty: true,
      };

      const output = await generateOutput(options);
      expect(output).toContain('style');
    });

    it('should apply clean style', async () => {
      const options: CLIOptions = {
        input: TEST_FILE,
        format: 'html',
        style: 'clean',
        pretty: true,
      };

      const output = await generateOutput(options);
      expect(output).toContain('<html');
    });

    it('should apply wireframe style', async () => {
      const options: CLIOptions = {
        input: TEST_FILE,
        format: 'html',
        style: 'wireframe',
        pretty: true,
      };

      const output = await generateOutput(options);
      expect(output).toContain('<html');
    });

    it('should apply none style', async () => {
      const options: CLIOptions = {
        input: TEST_FILE,
        format: 'html',
        style: 'none',
        pretty: true,
      };

      const output = await generateOutput(options);
      expect(output).toContain('<html');
    });

    it('should throw error for non-existent file', async () => {
      const options: CLIOptions = {
        input: 'nonexistent.md',
        format: 'html',
        style: 'sketch',
        pretty: true,
      };

      await expect(generateOutput(options)).rejects.toThrow('File not found: nonexistent.md');
    });

    it('should handle malformed markdown gracefully', async () => {
      const malformedFile = `${TEST_DIR}/malformed.md`;
      writeFileSync(malformedFile, '<<< invalid >>> markdown', 'utf-8');

      const options: CLIOptions = {
        input: malformedFile,
        format: 'html',
        style: 'sketch',
        pretty: true,
      };

      // Should not throw - parser handles malformed input
      await expect(generateOutput(options)).resolves.not.toThrow();
    });
  });
});
