import * as vscode from 'vscode';
import { parse, renderToHTML, renderToJSON, type DocumentNode, type ParseOptions, type RenderOptions } from 'wiremd';

const output = vscode.window.createOutputChannel('Wiremd');

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

export function activate(context: vscode.ExtensionContext) {
  output.appendLine('wiremd: activate');
  context.subscriptions.push(output);

  return {
    extendMarkdownIt
  };
}

export function deactivate() {
  output.dispose();
}

// Export to extend the built-in Markdown rendering
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
