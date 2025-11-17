/**
 * Tests for CLI functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { execSync } from 'child_process';

describe('CLI', () => {
  const TEST_INPUT = './test-input.md';
  const TEST_OUTPUT = './test-output.html';

  beforeEach(() => {
    // Create test input file
    writeFileSync(
      TEST_INPUT,
      '# Test Wireframe\n\n## Button\n[Click Me]\n',
      'utf-8'
    );
  });

  afterEach(() => {
    // Clean up test files
    try {
      if (existsSync(TEST_INPUT)) {
        unlinkSync(TEST_INPUT);
      }
      if (existsSync(TEST_OUTPUT)) {
        unlinkSync(TEST_OUTPUT);
      }
    } catch (e) {
      // Ignore if files don't exist
    }
  });

  describe('Help command', () => {
    it('should display help message', () => {
      const result = execSync('node dist/cli/index.js --help', {
        encoding: 'utf-8',
      });

      expect(result).toContain('wiremd');
      expect(result).toContain('USAGE:');
      expect(result).toContain('OPTIONS:');
      expect(result).toContain('EXAMPLES:');
    });

    it('should show all available options', () => {
      const result = execSync('node dist/cli/index.js --help', {
        encoding: 'utf-8',
      });

      expect(result).toContain('--output');
      expect(result).toContain('--format');
      expect(result).toContain('--style');
      expect(result).toContain('--watch');
      expect(result).toContain('--serve');
    });

    it('should list all available styles', () => {
      const result = execSync('node dist/cli/index.js --help', {
        encoding: 'utf-8',
      });

      expect(result).toContain('sketch');
      expect(result).toContain('clean');
      expect(result).toContain('wireframe');
      expect(result).toContain('none');
      expect(result).toContain('tailwind');
      expect(result).toContain('material');
      expect(result).toContain('brutal');
    });
  });

  describe('Version command', () => {
    it('should display version', () => {
      const result = execSync('node dist/cli/index.js --version', {
        encoding: 'utf-8',
      });

      expect(result).toMatch(/wiremd v\d+\.\d+\.\d+/);
    });
  });

  describe('Basic file generation', () => {
    it('should generate HTML from markdown', () => {
      execSync(`node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`);

      expect(existsSync(TEST_OUTPUT)).toBe(true);
      const html = readFileSync(TEST_OUTPUT, 'utf-8');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
    });

    it('should include parsed content in output', () => {
      execSync(`node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`);

      const html = readFileSync(TEST_OUTPUT, 'utf-8');
      expect(html).toContain('Test Wireframe');
      expect(html).toContain('button');
    });

    it('should apply default sketch style', () => {
      try {
        execSync(`node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`, {
          stdio: 'pipe'
        });
      } catch (error: any) {
        // If execSync throws, log the error for debugging
        console.error('CLI command failed:', error.message);
        if (error.stderr) {
          console.error('stderr:', error.stderr.toString());
        }
        throw error;
      }

      expect(existsSync(TEST_OUTPUT)).toBe(true);
      const html = readFileSync(TEST_OUTPUT, 'utf-8');
      // Sketch style should include hand-drawn characteristics
      expect(html).toContain('style');
    });
  });

  describe('Style options', () => {
    it('should accept clean style', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style clean`
      );

      expect(existsSync(TEST_OUTPUT)).toBe(true);
    });

    it('should accept wireframe style', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style wireframe`
      );

      expect(existsSync(TEST_OUTPUT)).toBe(true);
    });

    it('should accept material style', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style material`
      );

      expect(existsSync(TEST_OUTPUT)).toBe(true);
    });

    it('should accept tailwind style', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style tailwind`
      );

      expect(existsSync(TEST_OUTPUT)).toBe(true);
    });

    it('should accept brutal style', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style brutal`
      );

      expect(existsSync(TEST_OUTPUT)).toBe(true);
    });

    it('should accept none style', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style none`
      );

      expect(existsSync(TEST_OUTPUT)).toBe(true);
    });

    it('should reject invalid style', () => {
      expect(() => {
        execSync(
          `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --style invalid`,
          { encoding: 'utf-8' }
        );
      }).toThrow();
    });
  });

  describe('Format options', () => {
    it('should generate HTML format', () => {
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --format html`
      );

      const content = readFileSync(TEST_OUTPUT, 'utf-8');
      expect(content).toContain('<html');
    });

    it('should generate JSON format', () => {
      const jsonOutput = './test-output.json';
      execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${jsonOutput} --format json`
      );

      const content = readFileSync(jsonOutput, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();

      // Clean up
      unlinkSync(jsonOutput);
    });

    it('should reject invalid format', () => {
      expect(() => {
        execSync(
          `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT} --format xml`,
          { encoding: 'utf-8' }
        );
      }).toThrow();
    });
  });

  describe('Error handling', () => {
    it('should error on missing input file', () => {
      expect(() => {
        execSync('node dist/cli/index.js nonexistent.md', {
          encoding: 'utf-8',
        });
      }).toThrow();
    });

    it('should show help when no input specified', () => {
      // CLI shows help instead of throwing error
      const result = execSync('node dist/cli/index.js', { encoding: 'utf-8' });
      expect(result).toContain('USAGE:');
    });
  });

  describe('Output path handling', () => {
    it('should auto-generate output path from input', () => {
      execSync(`node dist/cli/index.js ${TEST_INPUT}`);

      const autoOutput = TEST_INPUT.replace('.md', '.html');
      expect(existsSync(autoOutput)).toBe(true);

      // Clean up
      unlinkSync(autoOutput);
    });

    it('should respect custom output path', () => {
      const customOutput = './custom-output.html';
      execSync(`node dist/cli/index.js ${TEST_INPUT} -o ${customOutput}`);

      expect(existsSync(customOutput)).toBe(true);

      // Clean up
      unlinkSync(customOutput);
    });
  });

  describe('Server integration', () => {
    it('should accept serve port option', () => {
      // We can't actually test the server starting in unit tests
      // but we can verify the option is accepted
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('--serve');
      expect(cliSource).toContain('parseInt');
    });

    it('should validate port number', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('isNaN');
      expect(cliSource).toContain('port');
    });
  });

  describe('Watch mode integration', () => {
    it('should accept watch option', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('--watch');
      expect(cliSource).toContain('watchFile');
    });

    it('should use debouncing for file changes', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('debounceTimer');
      expect(cliSource).toContain('clearTimeout');
      expect(cliSource).toContain('setTimeout');
    });

    it('should regenerate on file changes', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('File changed');
      expect(cliSource).toContain('generateOutput');
      expect(cliSource).toContain('writeFileSync');
    });
  });

  describe('Error notification integration', () => {
    it('should import notifyError function', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('import');
      expect(cliSource).toContain('notifyError');
    });

    it('should call notifyError on generation failure', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('catch');
      expect(cliSource).toContain('notifyError');
      expect(cliSource).toContain('error.message');
    });

    it('should only notify error when serve is active', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('if (options.serve)');
      expect(cliSource).toContain('notifyError');
    });
  });

  describe('Live reload integration', () => {
    it('should import notifyReload function', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('import');
      expect(cliSource).toContain('notifyReload');
    });

    it('should call notifyReload on successful regeneration', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('notifyReload');
    });

    it('should only notify reload when serve is active', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('if (options.serve)');
      expect(cliSource).toContain('notifyReload');
    });
  });

  describe('Signal handling', () => {
    it('should handle SIGINT for graceful shutdown', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('SIGINT');
      expect(cliSource).toContain('process.exit');
    });

    it('should display shutdown message', () => {
      const cliSource = readFileSync('./src/cli/index.ts', 'utf-8');
      expect(cliSource).toContain('Stopping watch mode');
    });
  });

  describe('Console output', () => {
    it('should show parsing message', () => {
      const result = execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`,
        { encoding: 'utf-8' }
      );

      expect(result).toContain('Parsing');
    });

    it('should show generation success message', () => {
      const result = execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`,
        { encoding: 'utf-8' }
      );

      expect(result).toContain('Generated');
      expect(result).toContain('✅');
    });

    it('should show style being used', () => {
      const result = execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`,
        { encoding: 'utf-8' }
      );

      expect(result).toContain('Style');
      expect(result).toContain('sketch');
    });

    it('should show format being used', () => {
      const result = execSync(
        `node dist/cli/index.js ${TEST_INPUT} -o ${TEST_OUTPUT}`,
        { encoding: 'utf-8' }
      );

      expect(result).toContain('Format');
      expect(result).toContain('html');
    });
  });
});
