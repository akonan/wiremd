import { describe, expect, it } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  buildCompletionItems,
  buildHover,
  buildSemanticTokens,
  buildSignatureHelp,
  collectLightweightDiagnostics,
  parseErrorToDiagnostic
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

  it('suggests state values after state:', () => {
    const document = createDocument('[Button]{state:l}');
    const items = buildCompletionItems(document, { line: 0, character: 16 });
    const labels = items.map((item) => item.label);

    expect(labels).toContain('loading');
    expect(labels).not.toContain('required');
  });

  it('suggests generic attributes and class shorthands inside attribute blocks', () => {
    const document = createDocument('[Button]{');
    const items = buildCompletionItems(document, { line: 0, character: 9 });
    const labels = items.map((item) => item.label);

    expect(labels).toContain('required');
    expect(labels).toContain('type');
    expect(labels).toContain('.primary');
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

  it('returns hover docs for inline containers and input syntax', () => {
    const inlineDoc = createDocument('[[ Home | Products ]]');
    const inlineHover = buildHover(inlineDoc, { line: 0, character: 4 });
    expect(inlineHover?.contents).toMatchObject({
      kind: 'markdown'
    });

    const inputDoc = createDocument('[Email________]');
    const inputHover = buildHover(inputDoc, { line: 0, character: 6 });
    expect(inputHover?.contents).toMatchObject({
      kind: 'markdown'
    });
  });

  it('returns hover docs for container type, input type, key, and state words', () => {
    const containerDoc = createDocument('hero');
    const inputTypeDoc = createDocument('email');
    const keyDoc = createDocument('type');
    const stateDoc = createDocument('loading');

    expect(buildHover(containerDoc, { line: 0, character: 2 })).not.toBeNull();
    expect(buildHover(inputTypeDoc, { line: 0, character: 2 })).not.toBeNull();
    expect(buildHover(keyDoc, { line: 0, character: 2 })).not.toBeNull();
    expect(buildHover(stateDoc, { line: 0, character: 2 })).not.toBeNull();
  });

  it('returns null hover for unknown token', () => {
    const document = createDocument('plainword');
    expect(buildHover(document, { line: 0, character: 2 })).toBeNull();
  });

  it('provides signature help inside attribute blocks', () => {
    const document = createDocument('[Email___]{type:email required state:}');
    const signature = buildSignatureHelp(document, { line: 0, character: 37 });

    expect(signature).not.toBeNull();
    expect(signature?.activeParameter).toBe(4);
    expect(signature?.signatures[0].label).toContain('type:<inputType>');
  });

  it('returns null signature help outside attribute blocks', () => {
    const document = createDocument('[Save]');
    expect(buildSignatureHelp(document, { line: 0, character: 2 })).toBeNull();
  });

  it('maps active attribute parameter across all signature branches', () => {
    const emptyAttr = createDocument('[Input___]{');
    expect(buildSignatureHelp(emptyAttr, { line: 0, character: 11 })?.activeParameter).toBe(0);

    const classAttr = createDocument('[Input___]{.primary}');
    expect(buildSignatureHelp(classAttr, { line: 0, character: 19 })?.activeParameter).toBe(0);

    const typeAttr = createDocument('[Input___]{type:}');
    expect(buildSignatureHelp(typeAttr, { line: 0, character: 16 })?.activeParameter).toBe(1);

    const rowsAttr = createDocument('[Input___]{rows:}');
    expect(buildSignatureHelp(rowsAttr, { line: 0, character: 16 })?.activeParameter).toBe(2);

    const requiredAttr = createDocument('[Input___]{required}');
    expect(buildSignatureHelp(requiredAttr, { line: 0, character: 19 })?.activeParameter).toBe(3);

    const genericAttr = createDocument('[Input___]{placeholder:value}');
    expect(buildSignatureHelp(genericAttr, { line: 0, character: 28 })?.activeParameter).toBe(1);
  });

  it('produces warnings for unknown container and input type', () => {
    const document = createDocument('::: unknown\n[Input___]{type:not-real}');
    const diagnostics = collectLightweightDiagnostics(document);

    expect(diagnostics.some((d) => d.message.includes('Unknown container type'))).toBe(true);
    expect(diagnostics.some((d) => d.message.includes('Unknown input type'))).toBe(true);
  });

  it('does not report warnings for known container and input type', () => {
    const document = createDocument('::: hero\n[Input___]{type:email}');
    const diagnostics = collectLightweightDiagnostics(document);

    expect(diagnostics).toHaveLength(0);
  });

  it('maps parse errors to diagnostics with position and fallback ranges', () => {
    const document = createDocument('line1\nline2');
    const positionedError = {
      message: 'bad syntax',
      position: {
        start: { line: 2, column: 3 },
        end: { line: 2, column: 8 }
      }
    };

    const withPosition = parseErrorToDiagnostic(document, positionedError);
    expect(withPosition.range.start.line).toBe(1);
    expect(withPosition.range.start.character).toBe(2);
    expect(withPosition.range.end.character).toBeGreaterThan(withPosition.range.start.character);

    const fallback = parseErrorToDiagnostic(document, new Error('fallback'));
    expect(fallback.range.start.line).toBe(0);
    expect(fallback.range.end.character).toBeGreaterThanOrEqual(1);
  });

  it('maps parse errors with non-object and partial/negative locations', () => {
    const document = createDocument('line1\nline2');

    const primitiveFallback = parseErrorToDiagnostic(document, 'primitive-error');
    expect(primitiveFallback.range.start.line).toBe(0);
    expect(primitiveFallback.range.start.character).toBe(0);

    const partialPosition = parseErrorToDiagnostic(document, {
      message: 'partial',
      position: {
        start: {},
        end: {}
      }
    });
    expect(partialPosition.range.start.line).toBe(0);
    expect(partialPosition.range.end.character).toBeGreaterThanOrEqual(1);

    const negativeLine = parseErrorToDiagnostic(document, {
      message: 'negative',
      position: {
        start: { line: 0, column: 0 },
        end: { line: 0, column: 0 }
      }
    });
    expect(negativeLine.range.start.line).toBe(0);
    expect(negativeLine.range.end.line).toBe(0);
  });

  it('builds semantic tokens for wiremd constructs', () => {
    const document = createDocument('::: hero\n[Save]{.primary type:email}');
    const semanticTokens = buildSemanticTokens(document);

    expect(semanticTokens.data.length).toBeGreaterThan(0);
    expect(semanticTokens.data.length % 5).toBe(0);
  });

  it('builds semantic tokens for quoted values and booleans in attributes', () => {
    const document = createDocument('[Input___]{placeholder:\"Name\" required disabled type:email}');
    const semanticTokens = buildSemanticTokens(document);

    expect(semanticTokens.data.length).toBeGreaterThan(0);
    expect(semanticTokens.data.length % 5).toBe(0);
  });
});
