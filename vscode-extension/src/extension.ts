import * as vscode from 'vscode';
import * as path from 'node:path';
import { parse, renderToHTML, renderToJSON, type DocumentNode, type ParseOptions, type RenderOptions } from 'wiremd';
import { WiremdPreviewProvider } from './preview-provider';

const output = vscode.window.createOutputChannel('Wiremd');
let previewProvider: WiremdPreviewProvider | undefined;
let languageClient: { stop: () => Promise<void> } | undefined;

const parseOptions: ParseOptions = {
  position: true,
  validate: true,
  strict: false
};

const supportedStyles: Array<NonNullable<RenderOptions['style']>> = [
  'sketch',
  'clean',
  'wireframe',
  'none',
  'tailwind',
  'material',
  'brutal'
];

type MarkdownItStateLike = {
  src?: string;
};

type MarkdownItCoreLike = {
  ruler: {
    after: (
      before: string,
      ruleName: string,
      fn: (state: MarkdownItStateLike) => void
    ) => void;
  };
};

type MarkdownItLike = {
  core: MarkdownItCoreLike;
};

/**
 * Activates the extension and returns the Markdown-It plugin hook.
 */
export function activate(context: vscode.ExtensionContext) {
  output.appendLine('wiremd: activate');
  context.subscriptions.push(output);
  void startLanguageServer(context);

  previewProvider = new WiremdPreviewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer(
      WiremdPreviewProvider.viewType,
      previewProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.openPreview', () => {
      previewProvider?.openPreview(vscode.ViewColumn.Active);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.openPreviewToSide', () => {
      const activeColumn = vscode.window.activeTextEditor?.viewColumn;
      const previewColumn = activeColumn
        ? activeColumn + 1
        : vscode.ViewColumn.Two;
      previewProvider?.openPreview(previewColumn);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.refreshPreview', () => {
      previewProvider?.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.changeStyle', async () => {
      const selected = await vscode.window.showQuickPick(supportedStyles, {
        placeHolder: 'Select a visual style'
      });
      if (selected) {
        previewProvider?.changeStyle(selected);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.changeViewport', async () => {
      const viewports = [
        { label: 'Desktop (1440px)', value: 'desktop' },
        { label: 'Laptop (1024px)', value: 'laptop' },
        { label: 'Tablet (768px)', value: 'tablet' },
        { label: 'Mobile (375px)', value: 'mobile' },
        { label: 'Full Width', value: 'full' }
      ];
      const selected = await vscode.window.showQuickPick(viewports, {
        placeHolder: 'Select viewport size'
      });
      if (selected) {
        previewProvider?.changeViewport(selected.value);
      }
    })
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = '$(eye) Wiremd';
  statusBarItem.tooltip = 'Open Wiremd Preview';
  statusBarItem.command = 'wiremd.openPreviewToSide';
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor?.document.languageId === 'markdown') {
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    })
  );

  if (vscode.window.activeTextEditor?.document.languageId === 'markdown') {
    statusBarItem.show();
  }

  return {
    extendMarkdownIt
  };
}

/**
 * Disposes extension resources when VS Code deactivates the extension.
 */
export function deactivate() {
  if (languageClient) {
    void languageClient.stop();
    languageClient = undefined;
  }

  if (previewProvider) {
    previewProvider.dispose();
    previewProvider = undefined;
  }
  output.dispose();
}

/**
 * Extends VS Code's built-in Markdown-It pipeline to render `wiremd` fences.
 */
export function extendMarkdownIt(md: MarkdownItLike) {
  output.appendLine('wiremd: extendMarkdownIt called');

  md.core.ruler.after('normalize', 'parse-wiremd-code', (state: MarkdownItStateLike) => {
    const source = state.src ?? '';
    state.src = parseWiremdCode(source);
  });

  return md;
}

function parseWiremdCode(source: string): string {
  output.appendLine('wiremd: parseWiremdCode called');
  const wiremdPattern = /```wiremd([^\r\n]*)\r?\n([\s\S]*?)\r?\n```/gi;
  let blockIndex = 0;

  return source.replace(wiremdPattern, (fullMatch: string, rawOptions: string, code: string) => {
    try {
      const documentNode: DocumentNode = parse(code, parseOptions);
      const options = parseFenceOptions(rawOptions);
      blockIndex += 1;

      if (options.view === 'json') {
        const renderedDocumentNode = renderToJSON(documentNode, { pretty: true });
        return `\`\`\`json\n${renderedDocumentNode}\n\`\`\``;
      }

      return renderWiremdFragment(documentNode, options.style, blockIndex);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      output.appendLine(`wiremd: parse error: ${message}`);
      return fullMatch;
    }
  });
}

function parseFenceOptions(rawOptions: string): {
  view: 'html' | 'json';
  style: NonNullable<RenderOptions['style']>;
} {
  const tokens = rawOptions
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  let view: 'html' | 'json' = 'html';
  let style: NonNullable<RenderOptions['style']> = 'sketch';

  for (const token of tokens) {
    if (token === 'html' || token === 'json') {
      view = token;
      continue;
    }

    if (supportedStyles.includes(token as NonNullable<RenderOptions['style']>)) {
      style = token as NonNullable<RenderOptions['style']>;
    }
  }

  return { view, style };
}

function renderWiremdFragment(
  documentNode: DocumentNode,
  style: NonNullable<RenderOptions['style']>,
  blockIndex: number
): string {
  const classPrefix = `wmd-${blockIndex}-`;
  const scopeClass = `wiremd-preview-${blockIndex}`;

  const fullHtml = renderToHTML(documentNode, {
    style,
    inlineStyles: true,
    pretty: true,
    classPrefix
  });

  const cssMatch = fullHtml.match(/<style>\s*([\s\S]*?)\s*<\/style>/i);
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!cssMatch || !bodyMatch) {
    return fullHtml;
  }

  const scopedCss = cssMatch[1]
    .replace(/(^|\n)\s*\*\s*\{/g, `$1.${scopeClass}, .${scopeClass} * {`)
    .replace(/(^|\n)\s*body\s*\{/g, `$1.${scopeClass}.${classPrefix}root {`)
    .replace(new RegExp(`body\\.${classPrefix}root`, 'g'), `.${scopeClass}.${classPrefix}root`);
  const bodyContent = bodyMatch[1].trim();

  return `<style>\n${scopedCss}\n</style>\n<div class="wiremd-preview ${scopeClass} ${classPrefix}root ${classPrefix}${style}">\n${bodyContent}\n</div>`;
}

function shouldStartLanguageServer(context: vscode.ExtensionContext): boolean {
  const workspaceLike = vscode.workspace as unknown as {
    createFileSystemWatcher?: (...args: unknown[]) => unknown;
  };

  return typeof context.asAbsolutePath === 'function'
    && typeof workspaceLike.createFileSystemWatcher === 'function';
}

async function startLanguageServer(context: vscode.ExtensionContext): Promise<void> {
  if (!shouldStartLanguageServer(context)) {
    output.appendLine('wiremd: language server skipped');
    return;
  }

  try {
    const clientModule = await import('vscode-languageclient/node');
    const serverModule = context.asAbsolutePath(path.join('dist', 'lsp', 'server.js'));
    const serverOptions = {
      run: {
        module: serverModule,
        transport: clientModule.TransportKind.ipc
      },
      debug: {
        module: serverModule,
        transport: clientModule.TransportKind.ipc,
        options: {
          execArgv: ['--nolazy', '--inspect=6011']
        }
      }
    };
    const clientOptions = {
      documentSelector: [{ scheme: 'file', language: 'markdown' }]
    };

    const client = new clientModule.LanguageClient(
      'wiremdLanguageServer',
      'Wiremd Language Server',
      serverOptions,
      clientOptions
    );

    void client.start();
    context.subscriptions.push({
      dispose: () => {
        void client.stop();
      }
    });
    languageClient = client;
    output.appendLine('wiremd: language server started');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    output.appendLine(`wiremd: language server failed to start: ${message}`);
  }
}
