import {
  createConnection,
  ProposedFeatures,
  TextDocumentSyncKind,
  TextDocuments,
  type CompletionItem,
  type Hover,
  type InitializeResult,
  type SemanticTokens,
  type SignatureHelp
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { parse, type ParseOptions } from 'wiremd';
import {
  buildCompletionItems,
  buildHover,
  buildSemanticTokens,
  buildSignatureHelp,
  collectLightweightDiagnostics,
  parseErrorToDiagnostic,
  semanticTokenTypes
} from './engine';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

const parseOptions: ParseOptions = {
  position: true,
  validate: true,
  strict: false
};

connection.onInitialize((): InitializeResult => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    completionProvider: {
      triggerCharacters: [':', '{', '.', '[']
    },
    hoverProvider: true,
    signatureHelpProvider: {
      triggerCharacters: [':', '{', '.', ' '],
      retriggerCharacters: [' ']
    },
    semanticTokensProvider: {
      legend: {
        tokenTypes: [...semanticTokenTypes],
        tokenModifiers: []
      },
      full: true
    }
  }
}));

connection.onCompletion(({ textDocument, position }): CompletionItem[] => {
  const document = documents.get(textDocument.uri);
  if (!document) {
    return [];
  }

  return buildCompletionItems(document, position);
});

connection.onHover(({ textDocument, position }): Hover | null => {
  const document = documents.get(textDocument.uri);
  if (!document) {
    return null;
  }

  return buildHover(document, position);
});

connection.onSignatureHelp(({ textDocument, position }): SignatureHelp | null => {
  const document = documents.get(textDocument.uri);
  if (!document) {
    return null;
  }

  return buildSignatureHelp(document, position);
});

connection.languages.semanticTokens.on(({ textDocument }): SemanticTokens => {
  const document = documents.get(textDocument.uri);
  if (!document) {
    return { data: [] };
  }

  return buildSemanticTokens(document);
});

documents.onDidOpen((event) => {
  void validateDocument(event.document);
});

documents.onDidChangeContent((event) => {
  void validateDocument(event.document);
});

documents.onDidSave((event) => {
  void validateDocument(event.document);
});

documents.onDidClose((event) => {
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

documents.listen(connection);
connection.listen();

async function validateDocument(document: TextDocument): Promise<void> {
  const diagnostics = collectLightweightDiagnostics(document);

  try {
    parse(document.getText(), parseOptions);
  } catch (error: unknown) {
    diagnostics.unshift(parseErrorToDiagnostic(document, error));
  }

  connection.sendDiagnostics({
    uri: document.uri,
    diagnostics
  });
}
