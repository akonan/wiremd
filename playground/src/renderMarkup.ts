import { parse, renderToHTML } from 'wiremd';

export type StyleName =
  | 'sketch'
  | 'clean'
  | 'wireframe'
  | 'none'
  | 'tailwind'
  | 'material'
  | 'brutal';

export type RenderMarkupResult =
  | {
      html: string;
      error: null;
    }
  | {
      html: '';
      error: string;
    };

export function renderMarkup(markdown: string, style: StyleName): RenderMarkupResult {
  try {
    const ast = parse(markdown);
    const html = renderToHTML(ast, {
      style,
      inlineStyles: true,
      pretty: true,
    });

    return {
      html,
      error: null,
    };
  } catch (err) {
    return {
      html: '',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
