import { describe, expect, it } from 'vitest';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getCursorContext } from '../src/lsp/context';

function createDocument(text: string): TextDocument {
  return TextDocument.create('file:///fixture.md', 'markdown', 1, text);
}

describe('lsp cursor context', () => {
  it('detects container declaration context after :::', () => {
    const document = createDocument('::: he');
    const context = getCursorContext(document, { line: 0, character: 6 });

    expect(context.inContainerDeclaration).toBe(true);
    expect(context.containerTypePrefix).toBe('he');
  });

  it('detects attribute context inside braces', () => {
    const document = createDocument('[Email___]{type:em}');
    const context = getCursorContext(document, { line: 0, character: 18 });

    expect(context.inAttributes).toBe(true);
    expect(context.attributePrefix).toContain('type:em');
  });

  it('distinguishes markdown links from wiremd button syntax', () => {
    const document = createDocument('[Docs](https://example.com) [Save]');

    const linkContext = getCursorContext(document, { line: 0, character: 2 });
    expect(linkContext.inLinkSyntax).toBe(true);
    expect(linkContext.inButtonSyntax).toBe(false);

    const buttonContext = getCursorContext(document, { line: 0, character: 30 });
    expect(buttonContext.inButtonSyntax).toBe(true);
    expect(buttonContext.inLinkSyntax).toBe(false);
  });

  it('detects inline container context', () => {
    const document = createDocument('[[ Home | Products | [Login] ]]');
    const context = getCursorContext(document, { line: 0, character: 10 });

    expect(context.inInlineContainer).toBe(true);
  });
});
