import { describe, expect, it } from 'vitest';
import { renderMarkup } from '../src/renderMarkup.js';

describe('playground renderMarkup', () => {
  it('renders full HTML for valid playground markup', () => {
    const result = renderMarkup('## Login Form\n\n[Sign In]*', 'sketch');

    expect(result.error).toBeNull();
    expect(result.html).toContain('<!DOCTYPE html>');
    expect(result.html).toContain('Login Form');
    expect(result.html).toContain('wmd-sketch');
  });

  it('renders the requested style', () => {
    const result = renderMarkup('[Continue]*', 'clean');

    expect(result.error).toBeNull();
    expect(result.html).toContain('wmd-clean');
  });
});
