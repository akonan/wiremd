import {
  CompletionItemKind,
  DiagnosticSeverity,
  InsertTextFormat,
  MarkupKind,
  ParameterInformation,
  SemanticTokensBuilder,
  SignatureInformation,
  type CompletionItem,
  type Diagnostic,
  type Hover,
  type Position,
  type Range,
  type SemanticTokens,
  type SignatureHelp
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  WIREMD_ATTRIBUTE_KEYS,
  WIREMD_CLASS_SUGGESTIONS,
  WIREMD_CONTAINER_TYPES,
  WIREMD_HOVER_DOCS,
  WIREMD_INPUT_TYPES,
  WIREMD_SNIPPETS,
  WIREMD_STATE_VALUES
} from './catalog';
import { getCursorContext } from './context';

const containerTypeSet = new Set<string>(WIREMD_CONTAINER_TYPES);
const inputTypeSet = new Set<string>(WIREMD_INPUT_TYPES);
const attributeKeySet = new Set<string>(WIREMD_ATTRIBUTE_KEYS);
const stateValueSet = new Set<string>(WIREMD_STATE_VALUES);

export const semanticTokenTypes = ['keyword', 'type', 'class', 'property', 'string', 'operator', 'decorator'] as const;

const tokenTypeIndex = new Map<string, number>(semanticTokenTypes.map((tokenType, index) => [tokenType, index]));

export function buildCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
  const cursorContext = getCursorContext(document, position);
  const items: CompletionItem[] = [];

  if (cursorContext.inContainerDeclaration) {
    const prefix = cursorContext.containerTypePrefix.toLowerCase();
    for (const typeName of WIREMD_CONTAINER_TYPES) {
      if (typeName.startsWith(prefix)) {
        items.push({
          label: typeName,
          kind: CompletionItemKind.Class,
          detail: 'wiremd container type',
          insertText: typeName,
          sortText: `1-${typeName}`
        });
      }
    }
  }

  if (cursorContext.inAttributes) {
    const typeMatch = cursorContext.attributePrefix.match(/(?:^|\s)type:([a-z0-9-]*)$/i);
    if (typeMatch) {
      const prefix = (typeMatch[1] ?? '').toLowerCase();
      for (const inputType of WIREMD_INPUT_TYPES) {
        if (inputType.startsWith(prefix)) {
          items.push({
            label: inputType,
            kind: CompletionItemKind.EnumMember,
            detail: 'wiremd input type',
            insertText: inputType,
            sortText: `1-${inputType}`
          });
        }
      }
      return items;
    }

    const stateMatch = cursorContext.attributePrefix.match(/(?:^|\s)state:([a-z0-9-]*)$/i);
    if (stateMatch) {
      const prefix = (stateMatch[1] ?? '').toLowerCase();
      for (const state of WIREMD_STATE_VALUES) {
        if (state.startsWith(prefix)) {
          items.push({
            label: state,
            kind: CompletionItemKind.EnumMember,
            detail: 'wiremd state value',
            insertText: state,
            sortText: `1-${state}`
          });
        }
      }
      return items;
    }

    for (const key of WIREMD_ATTRIBUTE_KEYS) {
      const insertText = key === 'required' || key === 'disabled'
        ? key
        : `${key}:${key === 'type' ? '${1:text}' : '${1:value}'}`;

      items.push({
        label: key,
        kind: CompletionItemKind.Property,
        detail: 'wiremd attribute',
        insertText,
        insertTextFormat: InsertTextFormat.Snippet,
        sortText: `2-${key}`
      });
    }

    for (const className of WIREMD_CLASS_SUGGESTIONS) {
      items.push({
        label: className,
        kind: CompletionItemKind.Variable,
        detail: 'wiremd class shorthand',
        insertText: className,
        sortText: `3-${className}`
      });
    }
  }

  if (/^\s*$/.test(cursorContext.linePrefix)) {
    for (const snippet of WIREMD_SNIPPETS) {
      items.push({
        label: snippet.label,
        kind: CompletionItemKind.Snippet,
        detail: snippet.detail,
        insertText: snippet.insertText,
        insertTextFormat: InsertTextFormat.Snippet,
        sortText: `9-${snippet.label}`
      });
    }
  }

  return dedupeCompletionItems(items);
}

export function buildHover(document: TextDocument, position: Position): Hover | null {
  const cursorContext = getCursorContext(document, position);
  const lowerWord = cursorContext.word.toLowerCase();

  if (cursorContext.inInlineContainer) {
    return markdownHover(WIREMD_HOVER_DOCS.inlineContainer);
  }

  if (cursorContext.inInputSyntax) {
    return markdownHover(WIREMD_HOVER_DOCS.input);
  }

  if (cursorContext.inButtonSyntax) {
    return markdownHover(WIREMD_HOVER_DOCS.button);
  }

  if (cursorContext.inAttributes) {
    return markdownHover(WIREMD_HOVER_DOCS.attributes);
  }

  if (containerTypeSet.has(lowerWord)) {
    return markdownHover(`${WIREMD_HOVER_DOCS.container}\n\nContainer: \`${lowerWord}\`.`);
  }

  if (inputTypeSet.has(lowerWord)) {
    return markdownHover(`${WIREMD_HOVER_DOCS.type}\n\nType value: \`${lowerWord}\`.`);
  }

  if (attributeKeySet.has(lowerWord)) {
    return markdownHover(`${WIREMD_HOVER_DOCS.attributes}\n\nAttribute: \`${lowerWord}\`.`);
  }

  if (stateValueSet.has(lowerWord)) {
    return markdownHover(`${WIREMD_HOVER_DOCS.attributes}\n\nState value: \`${lowerWord}\`.`);
  }

  return null;
}

export function buildSignatureHelp(document: TextDocument, position: Position): SignatureHelp | null {
  const cursorContext = getCursorContext(document, position);
  if (!cursorContext.inAttributes) {
    return null;
  }

  const parameters = [
    ParameterInformation.create('.class', 'CSS class shorthand.'),
    ParameterInformation.create('type:<inputType>', 'Input type, for example `type:email`.'),
    ParameterInformation.create('rows:<number>', 'Textarea rows, for example `rows:5`.'),
    ParameterInformation.create('required | disabled', 'Boolean attributes.'),
    ParameterInformation.create('state:<value>', 'Component state such as `loading` or `error`.')
  ];

  const signature = SignatureInformation.create(
    '{.class type:<inputType> rows:<number> required disabled state:<value>}',
    'wiremd attribute hints',
    ...parameters
  );

  return {
    signatures: [signature],
    activeSignature: 0,
    activeParameter: getActiveAttributeParameter(cursorContext.attributePrefix)
  };
}

export function parseErrorToDiagnostic(document: TextDocument, error: unknown): Diagnostic {
  const message = error instanceof Error ? error.message : String(error);
  const position = getErrorLocation(error);

  return {
    severity: DiagnosticSeverity.Error,
    source: 'wiremd-lsp',
    message,
    range: positionToRange(document, position)
  };
}

export function collectLightweightDiagnostics(document: TextDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber += 1) {
    const lineText = getLineText(document, lineNumber);

    const containerMatch = lineText.match(/^\s*:::\s+([a-z0-9-]+)/i);
    if (containerMatch?.[1]) {
      const containerType = containerMatch[1].toLowerCase();
      if (!containerTypeSet.has(containerType)) {
        const startCharacter = lineText.indexOf(containerMatch[1]);
        diagnostics.push({
          severity: DiagnosticSeverity.Warning,
          source: 'wiremd-lsp',
          message: `Unknown container type: "${containerType}".`,
          range: {
            start: { line: lineNumber, character: startCharacter },
            end: { line: lineNumber, character: startCharacter + containerMatch[1].length }
          }
        });
      }
    }

    const attributeRegex = /\{[^}\n]*\btype:([a-z0-9-]+)\b[^}\n]*\}/gi;
    for (const match of lineText.matchAll(attributeRegex)) {
      if (!match[1] || match.index === undefined) {
        continue;
      }

      const typeValue = match[1].toLowerCase();
      if (!inputTypeSet.has(typeValue)) {
        const absoluteStart = match.index + match[0].indexOf(match[1]);
        diagnostics.push({
          severity: DiagnosticSeverity.Warning,
          source: 'wiremd-lsp',
          message: `Unknown input type: "${typeValue}".`,
          range: {
            start: { line: lineNumber, character: absoluteStart },
            end: { line: lineNumber, character: absoluteStart + match[1].length }
          }
        });
      }
    }
  }

  return diagnostics;
}

export function buildSemanticTokens(document: TextDocument): SemanticTokens {
  const builder = new SemanticTokensBuilder();

  for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber += 1) {
    const lineText = getLineText(document, lineNumber);

    for (const match of lineText.matchAll(/:::\s+([a-z0-9-]+)/gi)) {
      if (match.index === undefined || !match[1]) {
        continue;
      }

      pushToken(builder, lineNumber, match.index, 3, 'operator');
      const typeStart = match.index + match[0].indexOf(match[1]);
      pushToken(builder, lineNumber, typeStart, match[1].length, 'type');
    }

    for (const match of lineText.matchAll(/\[\[[^\]\n]*\]\]/g)) {
      if (match.index === undefined) {
        continue;
      }

      pushToken(builder, lineNumber, match.index, 2, 'operator');
      pushToken(builder, lineNumber, match.index + match[0].length - 2, 2, 'operator');
    }

    for (const match of lineText.matchAll(/\[[^\]\n]*\](\*)?(?!\()/g)) {
      if (match.index === undefined) {
        continue;
      }

      if (match[0].startsWith('[[')) {
        continue;
      }

      const inner = match[0].replace(/^\[/, '').replace(/\]\*?$/, '');
      const tokenType = /[_*]/.test(inner) ? 'decorator' : 'keyword';
      pushToken(builder, lineNumber, match.index, match[0].length, tokenType);
    }

    for (const match of lineText.matchAll(/\{[^}\n]*\}/g)) {
      if (match.index === undefined) {
        continue;
      }

      const attributeText = match[0];
      pushToken(builder, lineNumber, match.index, 1, 'operator');
      pushToken(builder, lineNumber, match.index + attributeText.length - 1, 1, 'operator');

      for (const classMatch of attributeText.matchAll(/\.[A-Za-z][A-Za-z0-9_-]*/g)) {
        if (classMatch.index === undefined) {
          continue;
        }
        pushToken(builder, lineNumber, match.index + classMatch.index, classMatch[0].length, 'class');
      }

      for (const keyValueMatch of attributeText.matchAll(/([A-Za-z][A-Za-z0-9_-]*)(:)("[^"]*"|[^\s\}]+)/g)) {
        if (keyValueMatch.index === undefined || !keyValueMatch[1] || !keyValueMatch[3]) {
          continue;
        }

        const keyStart = match.index + keyValueMatch.index;
        const key = keyValueMatch[1].toLowerCase();
        const value = keyValueMatch[3].replace(/^"|"$/g, '');
        const valueType = key === 'type' && inputTypeSet.has(value.toLowerCase()) ? 'type' : 'string';

        pushToken(builder, lineNumber, keyStart, keyValueMatch[1].length, 'property');
        pushToken(builder, lineNumber, keyStart + keyValueMatch[1].length, 1, 'operator');

        const rawValueStart = keyValueMatch[0].indexOf(keyValueMatch[3]);
        if (rawValueStart >= 0) {
          pushToken(builder, lineNumber, keyStart + rawValueStart, keyValueMatch[3].length, valueType);
        }
      }

      for (const booleanMatch of attributeText.matchAll(/\b(required|disabled|checked|selected|multiple|readonly|autofocus)\b/g)) {
        if (booleanMatch.index === undefined) {
          continue;
        }
        pushToken(builder, lineNumber, match.index + booleanMatch.index, booleanMatch[0].length, 'property');
      }
    }
  }

  return builder.build();
}

function getErrorLocation(error: unknown): {
  startLine: number;
  startCharacter: number;
  endLine: number;
  endCharacter: number;
} {
  const fallback = {
    startLine: 0,
    startCharacter: 0,
    endLine: 0,
    endCharacter: 1
  };

  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const maybePosition = (error as {
    position?: {
      start?: { line?: number; column?: number };
      end?: { line?: number; column?: number };
    };
  }).position;

  if (!maybePosition?.start) {
    return fallback;
  }

  const startLine = Math.max((maybePosition.start.line ?? 1) - 1, 0);
  const startCharacter = Math.max((maybePosition.start.column ?? 1) - 1, 0);
  const endLine = Math.max((maybePosition.end?.line ?? maybePosition.start.line ?? 1) - 1, 0);
  const endCharacter = Math.max((maybePosition.end?.column ?? (startCharacter + 1)) - 1, startCharacter + 1);

  return {
    startLine,
    startCharacter,
    endLine,
    endCharacter
  };
}

function positionToRange(
  document: TextDocument,
  location: { startLine: number; startCharacter: number; endLine: number; endCharacter: number }
): Range {
  const maxLine = Math.max(document.lineCount - 1, 0);

  const startLine = Math.min(location.startLine, maxLine);
  const endLine = Math.min(location.endLine, maxLine);
  const startLineText = getLineText(document, startLine);
  const endLineText = getLineText(document, endLine);

  return {
    start: {
      line: startLine,
      character: Math.min(location.startCharacter, startLineText.length)
    },
    end: {
      line: endLine,
      character: Math.min(Math.max(location.endCharacter, 1), Math.max(endLineText.length, 1))
    }
  };
}

function getLineText(document: TextDocument, line: number): string {
  if (line < 0 || line >= document.lineCount) {
    return '';
  }

  const startOffset = document.offsetAt({ line, character: 0 });
  const endOffset = line + 1 < document.lineCount
    ? document.offsetAt({ line: line + 1, character: 0 })
    : document.getText().length;

  return document.getText().slice(startOffset, endOffset).replace(/[\r\n]+$/g, '');
}

function pushToken(
  builder: SemanticTokensBuilder,
  line: number,
  character: number,
  length: number,
  tokenType: typeof semanticTokenTypes[number]
): void {
  if (length <= 0) {
    return;
  }

  const tokenTypeId = tokenTypeIndex.get(tokenType);
  if (tokenTypeId === undefined) {
    return;
  }

  builder.push(line, character, length, tokenTypeId, 0);
}

function getActiveAttributeParameter(attributePrefix: string): number {
  const tokens = attributePrefix.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return 0;
  }

  const activeToken = tokens[tokens.length - 1];

  if (activeToken.startsWith('.')) {
    return 0;
  }

  if (activeToken.startsWith('type:')) {
    return 1;
  }

  if (activeToken.startsWith('rows:')) {
    return 2;
  }

  if (activeToken === 'required' || activeToken === 'disabled') {
    return 3;
  }

  if (activeToken.startsWith('state:')) {
    return 4;
  }

  return Math.min(tokens.length, 4);
}

function markdownHover(value: string): Hover {
  return {
    contents: {
      kind: MarkupKind.Markdown,
      value
    }
  };
}

function dedupeCompletionItems(items: CompletionItem[]): CompletionItem[] {
  const unique = new Map<string, CompletionItem>();

  for (const item of items) {
    if (!unique.has(item.label)) {
      unique.set(item.label, item);
    }
  }

  return [...unique.values()];
}
