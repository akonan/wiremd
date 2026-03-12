import { describe, expect, it } from 'vitest';
import {
  parse,
  render,
  renderToHTML,
  renderToReact,
  renderToSvelte,
  renderToTailwind,
  renderToVue,
} from '../src/index.js';
import { createRadioGroupAst } from './fixtures/render-fixtures.js';

describe('Render Routing And Regression', () => {
  it('routes single-artifact formats through the universal render API without changing output', () => {
    const ast = parse('[Submit]*');

    expect(render(ast, { format: 'html' })).toBe(renderToHTML(ast));
    expect(render(ast, { format: 'react' })).toBe(renderToReact(ast));
    expect(render(ast, { format: 'tailwind' })).toBe(renderToTailwind(ast));
    expect(render(ast, { format: 'vue' })).toBe(renderToVue(ast));
    expect(render(ast, { format: 'svelte' })).toBe(renderToSvelte(ast));
  });

  it('renders deterministic radio-group names across legacy renderers', () => {
    const ast = createRadioGroupAst();
    const htmlA = renderToHTML(ast);
    const htmlB = renderToHTML(ast);
    const reactA = renderToReact(ast);
    const reactB = renderToReact(ast);
    const tailwindA = renderToTailwind(ast);
    const tailwindB = renderToTailwind(ast);

    expect(htmlA).toBe(htmlB);
    expect(reactA).toBe(reactB);
    expect(tailwindA).toBe(tailwindB);
    expect(htmlA).toContain('name="radio-1"');
    expect(reactA).toContain('name="radio-1"');
    expect(tailwindA).toContain('name="radio-1"');
  });
});
