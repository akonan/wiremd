import { describe, it, expect } from 'vitest';
import { resolveNodePlaceholders, resolveTextPlaceholders } from '../src/placeholders/index.js';
import { extractPlaceholderMatches, parsePlaceholderExpression } from '../src/placeholders/parser.js';

describe('Placeholders', () => {
  describe('Placeholder parser', () => {
    it('should parse supported placeholders', () => {
      expect(parsePlaceholderExpression('user.name')).toMatchObject({ kind: 'user.name' });
      expect(parsePlaceholderExpression('user.email')).toMatchObject({ kind: 'user.email' });
      expect(parsePlaceholderExpression('lorem:2')).toMatchObject({ kind: 'lorem', paragraphs: 2 });
      expect(parsePlaceholderExpression('image:400x300')).toMatchObject({ kind: 'image', width: 400, height: 300 });
      expect(parsePlaceholderExpression('date')).toMatchObject({ kind: 'date' });
      expect(parsePlaceholderExpression('number:1000-9999')).toMatchObject({ kind: 'number', min: 1000, max: 9999 });
    });

    it('should reject invalid placeholders', () => {
      expect(parsePlaceholderExpression('user.phone')).toBeNull();
      expect(parsePlaceholderExpression('lorem:0')).toBeNull();
      expect(parsePlaceholderExpression('image:0x200')).toBeNull();
      expect(parsePlaceholderExpression('number:20-10')).toBeNull();
      expect(parsePlaceholderExpression('number:abc-def')).toBeNull();
    });

    it('should extract placeholders from text', () => {
      const matches = extractPlaceholderMatches('Name {{user.name}} - {{number:1-9}} - {{bad}}');

      expect(matches).toHaveLength(3);
      expect(matches[0].token?.kind).toBe('user.name');
      expect(matches[1].token?.kind).toBe('number');
      expect(matches[2].token).toBeNull();
      expect(matches[2].error).toContain('Unsupported placeholder expression');
    });
  });

  describe('Placeholder resolution', () => {
    it('should resolve all proposed placeholders', () => {
      const output = resolveTextPlaceholders(
        [
          '{{user.name}}',
          '{{user.email}}',
          '{{lorem:2}}',
          '{{image:400x300}}',
          '{{date}}',
          '{{number:1000-9999}}',
        ].join(' | '),
        { seed: 'demo-seed', now: new Date('2026-01-15T00:00:00.000Z') }
      );

      expect(output).not.toContain('{{');
      expect(output).toContain('https://placehold.co/400x300?text=Placeholder');
      expect(output).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(output).toMatch(/\b\d{4}\b/);
    });

    it('should generate deterministic output with the same seed', () => {
      const input = 'Name={{user.name}}, Email={{user.email}}, Number={{number:1000-9999}}, Date={{date}}';
      const options = { seed: 'stable-seed', now: new Date('2026-02-01T00:00:00.000Z') };

      const first = resolveTextPlaceholders(input, options);
      const second = resolveTextPlaceholders(input, options);

      expect(first).toBe(second);
    });

    it('should keep unsupported placeholders by default', () => {
      const output = resolveTextPlaceholders('Unknown: {{not.supported}}', { seed: 1 });
      expect(output).toBe('Unknown: {{not.supported}}');
    });

    it('should remove unsupported placeholders when preserveUnknown is false', () => {
      const output = resolveTextPlaceholders('Unknown: {{not.supported}}', {
        seed: 1,
        preserveUnknown: false,
      });
      expect(output).toBe('Unknown: ');
    });

    it('should resolve placeholders recursively in object trees without mutating input', () => {
      const original = {
        type: 'paragraph',
        content: 'Welcome {{user.name}}',
        props: {
          placeholder: 'Ticket {{number:100-105}}',
        },
        children: [
          {
            type: 'text',
            content: '{{date}}',
          },
        ],
      };

      const resolved = resolveNodePlaceholders(original, {
        seed: 'node-seed',
        now: new Date('2026-03-01T00:00:00.000Z'),
      });

      expect(JSON.stringify(resolved)).not.toContain('{{');
      expect(original.content).toBe('Welcome {{user.name}}');
      expect(original.children[0].content).toBe('{{date}}');
    });
  });
});
