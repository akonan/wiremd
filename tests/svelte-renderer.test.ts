import { describe, expect, it } from 'vitest';
import { render, renderToSvelte } from '../src/index.js';
import { createFrameworkRendererAst } from './fixtures/render-fixtures.js';

describe('Svelte Renderer', () => {
  it('renders a TypeScript component with bindings and dispatchers by default', () => {
    const output = renderToSvelte(createFrameworkRendererAst(), {
      componentName: 'ProfileForm',
    });

    expect(output).toContain('<script lang="ts">');
    expect(output).toContain('import { createEventDispatcher } from \'svelte\';');
    expect(output).toContain('const dispatch = createEventDispatcher();');
    expect(output).toContain('let email = \'\';');
    expect(output).toContain('let message = \'Hello from wiremd\';');
    expect(output).toContain('let topic = \'support\';');
    expect(output).toContain('let acceptTerms = true;');
    expect(output).toContain('let contactMethod = \'email\';');
    expect(output).toContain('$: formState = { email, message, topic, acceptTerms, contactMethod };');
    expect(output).toContain('bind:value={email}');
    expect(output).toContain('bind:value={message}');
    expect(output).toContain('bind:value={topic}');
    expect(output).toContain('bind:checked={acceptTerms}');
    expect(output).toContain('bind:group={contactMethod}');
    expect(output).toContain('on:submit|preventDefault={handleSubmit}');
    expect(output).toContain(`on:click={() => handleButtonClick('Cancel')}`);
    expect(output).toContain('<nav class="wmd-nav">');
    expect(output).toContain('style="--grid-columns: 2"');
    expect(output).toContain('<table class="wmd-table">');
  });

  it('supports plain JavaScript output through the universal renderer', () => {
    const output = render(createFrameworkRendererAst(), {
      format: 'svelte',
      rendererOptions: {
        typescript: false,
      },
    });

    expect(output).toContain('<script>');
    expect(output).not.toContain('<script lang="ts">');
    expect(output).not.toContain('label: string');
    expect(output).toContain('const dispatch = createEventDispatcher();');
    expect(output).toContain('function handleSubmit() {');
  });
});
