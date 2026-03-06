import { type Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

export type CursorContext = {
  lineText: string;
  linePrefix: string;
  inContainerDeclaration: boolean;
  containerTypePrefix: string;
  inAttributes: boolean;
  attributePrefix: string;
  inInlineContainer: boolean;
  inButtonSyntax: boolean;
  inInputSyntax: boolean;
  inLinkSyntax: boolean;
  word: string;
};

const WORD_REGEX = /[A-Za-z0-9_.:-]/;

export function getCursorContext(document: TextDocument, position: Position): CursorContext {
  const lineText = getLineText(document, position.line);
  const linePrefix = lineText.slice(0, position.character);

  const containerMatch = linePrefix.match(/^\s*:::\s*([a-z0-9-]*)$/i);
  const inContainerDeclaration = Boolean(containerMatch);
  const containerTypePrefix = containerMatch?.[1] ?? '';

  const attributeInfo = getUnclosedBraceInfo(linePrefix);
  const inAttributes = attributeInfo !== null;
  const attributePrefix = attributeInfo?.content ?? '';

  const inlineRange = getEnclosingInlineContainerRange(lineText, position.character);
  const inInlineContainer = inlineRange !== null;

  const bracketRange = getEnclosingBracketRange(lineText, position.character);
  const inBracketToken = bracketRange !== null;
  const bracketText = bracketRange?.text ?? '';

  const inLinkSyntax = inBracketToken && isLikelyMarkdownLink(lineText, bracketRange.end);
  const inInputSyntax = inBracketToken && /[_*]/.test(bracketText);
  const inButtonSyntax = inBracketToken && !inInputSyntax && !inLinkSyntax;

  const word = getWordAtPosition(lineText, position.character);

  return {
    lineText,
    linePrefix,
    inContainerDeclaration,
    containerTypePrefix,
    inAttributes,
    attributePrefix,
    inInlineContainer,
    inButtonSyntax,
    inInputSyntax,
    inLinkSyntax,
    word
  };
}

function getLineText(document: TextDocument, line: number): string {
  const lineCount = document.lineCount;
  if (line < 0 || line >= lineCount) {
    return '';
  }

  const lineStart = document.offsetAt({ line, character: 0 });
  const nextLineStart = line + 1 < lineCount
    ? document.offsetAt({ line: line + 1, character: 0 })
    : document.getText().length;

  const rawLine = document.getText().slice(lineStart, nextLineStart);
  return rawLine.replace(/[\r\n]+$/g, '');
}

function getUnclosedBraceInfo(text: string): { start: number; content: string } | null {
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '{') {
      depth += 1;
      if (depth === 1) {
        start = i;
      }
      continue;
    }

    if (char === '}' && depth > 0) {
      depth -= 1;
      if (depth === 0) {
        start = -1;
      }
    }
  }

  if (depth > 0 && start >= 0) {
    return {
      start,
      content: text.slice(start + 1)
    };
  }

  return null;
}

function getEnclosingInlineContainerRange(lineText: string, character: number): {
  start: number;
  end: number;
  text: string;
} | null {
  const regex = /\[\[[^\n]*?\]\]/g;

  for (const match of lineText.matchAll(regex)) {
    if (match.index === undefined) {
      continue;
    }

    const start = match.index;
    const end = start + match[0].length;
    if (character >= start && character <= end) {
      return { start, end, text: match[0] };
    }
  }

  return null;
}

function getEnclosingBracketRange(lineText: string, character: number): {
  start: number;
  end: number;
  text: string;
} | null {
  const regex = /\[[^\]\n]*\](\*)?/g;

  for (const match of lineText.matchAll(regex)) {
    if (match.index === undefined) {
      continue;
    }

    // Skip `[[...]]` ranges, handled separately.
    if (match[0].startsWith('[[')) {
      continue;
    }

    const start = match.index;
    const end = start + match[0].length;
    if (character >= start && character <= end) {
      return { start, end, text: match[0] };
    }
  }

  return null;
}

function isLikelyMarkdownLink(lineText: string, bracketEnd: number): boolean {
  const rest = lineText.slice(bracketEnd);
  return /^\s*\(/.test(rest);
}

function getWordAtPosition(lineText: string, character: number): string {
  if (lineText.length === 0) {
    return '';
  }

  const safeCharacter = Math.max(0, Math.min(character, lineText.length - 1));

  if (!WORD_REGEX.test(lineText[safeCharacter])) {
    return '';
  }

  let start = safeCharacter;
  let end = safeCharacter;

  while (start > 0 && WORD_REGEX.test(lineText[start - 1])) {
    start -= 1;
  }

  while (end + 1 < lineText.length && WORD_REGEX.test(lineText[end + 1])) {
    end += 1;
  }

  return lineText.slice(start, end + 1);
}
