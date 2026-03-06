import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');

type GrammarRepositoryEntry = {
  match?: string;
};

type GrammarDefinition = {
  injectionSelector?: string;
  repository?: Record<string, GrammarRepositoryEntry>;
};

describe('textmate grammar for wiremd markdown injection', () => {
  it('declares markdown injection selector and core repository keys', () => {
    const grammarPath = resolve(root, 'syntaxes', 'wiremd-injection.tmLanguage.json');
    const grammar = JSON.parse(readFileSync(grammarPath, 'utf8')) as GrammarDefinition;

    expect(grammar.injectionSelector).toBe('L:text.html.markdown');
    expect(grammar.repository).toBeDefined();

    const repository = grammar.repository ?? {};
    expect(Object.keys(repository)).toEqual(
      expect.arrayContaining([
        'button',
        'input',
        'attribute-block',
        'inline-container',
        'container-hero',
        'container-card',
        'container-alert',
        'container-grid'
      ])
    );
  });

  it('guards button/input patterns so markdown links are not captured', () => {
    const grammarPath = resolve(root, 'syntaxes', 'wiremd-injection.tmLanguage.json');
    const grammar = JSON.parse(readFileSync(grammarPath, 'utf8')) as GrammarDefinition;
    const repository = grammar.repository ?? {};

    const buttonPattern = repository.button?.match;
    const inputPattern = repository.input?.match;

    expect(buttonPattern).toContain('(?!\\s*\\()');
    expect(inputPattern).toContain('(?!\\s*\\()');
  });
});
