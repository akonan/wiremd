import { describe, expect, it } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  buildCompletionItems,
  buildHover,
  buildSemanticTokens,
  buildSignatureHelp,
  collectLightweightDiagnostics
} from '../src/lsp/engine';

function createDocument(text: string): TextDocument {
  return TextDocument.create('file:///fixture.md', 'markdown', 1, text);
}

describe('lsp engine', () => {
  it('suggests container types after ::: prefix', () => {
    const document = createDocument('::: he');
    const items = buildCompletionItems(document, { line: 0, character: 6 });

    const labels = items.map((item) => item.label);
    expect(labels).toContain('hero');
    expect(labels).not.toContain('card');
  });

  it('suggests only input types after type:', () => {
    const document = createDocument('[Email___]{type:e}');
    const items = buildCompletionItems(document, { line: 0, character: 17 });
    const labels = items.map((item) => item.label);

    expect(labels).toContain('email');
    expect(labels).not.toContain('number');
    expect(labels).not.toContain('required');
  });

  it('returns snippet completions on empty line', () => {
    const document = createDocument('\n');
    const items = buildCompletionItems(document, { line: 0, character: 0 });
    const labels = items.map((item) => item.label);

    expect(labels).toContain('wiremd.hero');
    expect(labels).toContain('wiremd.card');
  });

  it('returns hover docs for buttons and attributes', () => {
    const buttonDocument = createDocument('[Save]');
    const buttonHover = buildHover(buttonDocument, { line: 0, character: 2 });
    expect(buttonHover?.contents).toMatchObject({
      kind: 'markdown'
    });

    const attributeDocument = createDocument('[Email___]{type:email}');
    const attributeHover = buildHover(attributeDocument, { line: 0, character: 12 });
    expect(attributeHover?.contents).toMatchObject({
      kind: 'markdown'
    });
  });

  it('provides signature help inside attribute blocks', () => {
    const document = createDocument('[Email___]{type:email required state:}');
    const signature = buildSignatureHelp(document, { line: 0, character: 37 });

    expect(signature).not.toBeNull();
    expect(signature?.activeParameter).toBe(4);
    expect(signature?.signatures[0].label).toContain('type:<inputType>');
  });

  it('produces warnings for unknown container and input type', () => {
    const document = createDocument('::: unknown\n[Input___]{type:not-real}');
    const diagnostics = collectLightweightDiagnostics(document);

    expect(diagnostics.some((d) => d.message.includes('Unknown container type'))).toBe(true);
    expect(diagnostics.some((d) => d.message.includes('Unknown input type'))).toBe(true);
  });

  it('builds semantic tokens for wiremd constructs', () => {
    const document = createDocument('::: hero\n[Save]{.primary type:email}');
    const semanticTokens = buildSemanticTokens(document);

    expect(semanticTokens.data.length).toBeGreaterThan(0);
    expect(semanticTokens.data.length % 5).toBe(0);
  });
});
