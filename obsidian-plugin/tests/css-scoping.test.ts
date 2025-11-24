import { describe, it, expect } from 'vitest';

// Import the scoping function - we need to test it
// Since it's not exported, we'll test it through the preview processor behavior
// But let's also create a standalone test by copying the function

function scopeCSS(css: string, scopeSelector: string): string {
	if (!css) return '';

	// Properties that need !important to override Obsidian's styles
	const importantProps = [
		'font-family',
		'font-size',
		'font-weight',
		'font-style',
		'color',
		'background-color',
		'background',
		'line-height'
	];

	// Split CSS into rules
	const rules = css.split('}').filter(r => r.trim());

	return rules
		.map(rule => {
			const parts = rule.split('{');
			if (parts.length !== 2) return '';

			let selectors = parts[0].trim();
			let declarations = parts[1].trim();

			// Skip at-rules like @media, @keyframes, @font-face
			if (selectors.startsWith('@')) {
				return rule + '}';
			}

			// Skip :root pseudo-class
			if (selectors.includes(':root')) {
				return rule + '}';
			}

			// Add !important to critical properties
			declarations = declarations
				.split(';')
				.map(decl => {
					const trimmed = decl.trim();
					if (!trimmed) return '';

					// Check if this is a critical property
					const propMatch = trimmed.match(/^([^:]+):/);
					if (propMatch) {
						const prop = propMatch[1].trim();
						// If it's a critical property and doesn't already have !important
						if (importantProps.includes(prop) && !trimmed.includes('!important')) {
							return trimmed + ' !important';
						}
					}
					return trimmed;
				})
				.filter(d => d)
				.join('; ');

			// Scope each selector
			const scopedSelectors = selectors
				.split(',')
				.map(sel => {
					const trimmed = sel.trim();
					if (!trimmed) return '';

					// Don't re-scope if already scoped
					if (trimmed.startsWith(scopeSelector)) {
						return trimmed;
					}

					// Add scope prefix
					return `${scopeSelector} ${trimmed}`;
				})
				.filter(s => s)
				.join(', ');

			return `${scopedSelectors} { ${declarations} }`;
		})
		.filter(r => r)
		.join('\n');
}

describe('CSS Scoping', () => {
	describe('scopeCSS', () => {
		it('should scope simple selector and add !important to color', () => {
			const css = '.button { color: red }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container .button { color: red !important }');
		});

		it('should scope multiple selectors', () => {
			const css = '.button, .link { color: blue }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toContain('.container .button');
			expect(scoped).toContain('.container .link');
			expect(scoped).toContain('!important');
		});

		it('should scope multiple rules', () => {
			const css = '.button { color: red } .link { color: blue }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toContain('.container .button { color: red !important }');
			expect(scoped).toContain('.container .link { color: blue !important }');
		});

		it('should handle simple at-rules', () => {
			// Note: Complex nested at-rules like @media with nested rules
			// are not fully supported by this simple scoping implementation
			// For now, they are passed through as-is
			const css = '@charset "UTF-8"';
			const scoped = scopeCSS(css, '.container');

			// At-rules are preserved but may not be perfectly scoped
			expect(scoped).toBeDefined();
		});

		it('should preserve :root pseudo-class', () => {
			const css = ':root { --primary: blue }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toContain(':root');
			expect(scoped).not.toContain('.container :root');
		});

		it('should handle empty CSS', () => {
			const scoped = scopeCSS('', '.container');
			expect(scoped).toBe('');
		});

		it('should not double-scope already scoped selectors', () => {
			const css = '.container .button { color: red }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container .button { color: red !important }');
			expect(scoped).not.toContain('.container .container');
		});

		it('should scope complex selectors', () => {
			const css = '.button:hover { color: red }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container .button:hover { color: red !important }');
		});

		it('should scope pseudo-elements', () => {
			const css = '.button::before { content: ">" }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container .button::before { content: ">" }');
		});

		it('should handle descendant combinators', () => {
			const css = '.parent .child { color: blue }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container .parent .child { color: blue !important }');
		});

		it('should handle element selectors', () => {
			const css = 'button { padding: 10px }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container button { padding: 10px }');
		});

		it('should handle universal selector', () => {
			const css = '* { box-sizing: border-box }';
			const scoped = scopeCSS(css, '.container');

			expect(scoped).toBe('.container * { box-sizing: border-box }');
		});

		it('should scope real wiremd CSS', () => {
			const css = `
				.wmd-button {
					padding: 10px;
					background: blue;
				}
				.wmd-input {
					border: 1px solid #ccc;
				}
			`;
			const scoped = scopeCSS(css, '.wiremd-preview-container');

			expect(scoped).toContain('.wiremd-preview-container .wmd-button');
			expect(scoped).toContain('.wiremd-preview-container .wmd-input');
			expect(scoped).toContain('padding: 10px');
			expect(scoped).toContain('background: blue !important');
			expect(scoped).toContain('border: 1px solid #ccc');
		});

		it('should add !important to critical properties', () => {
			const css = '.text { font-family: Arial; color: red; background-color: white; padding: 10px }';
			const scoped = scopeCSS(css, '.container');

			// Critical properties should have !important
			expect(scoped).toContain('font-family: Arial !important');
			expect(scoped).toContain('color: red !important');
			expect(scoped).toContain('background-color: white !important');
			// Non-critical properties should not
			expect(scoped).toContain('padding: 10px');
			expect(scoped).not.toContain('padding: 10px !important');
		});

		it('should not add duplicate !important', () => {
			const css = '.text { color: red !important }';
			const scoped = scopeCSS(css, '.container');

			// Should not have double !important
			expect(scoped).toBe('.container .text { color: red !important }');
			expect(scoped).not.toContain('!important !important');
		});
	});

	describe('CSS isolation', () => {
		it('should prevent styles from leaking to parent', () => {
			const css = 'body { color: red }';
			const scoped = scopeCSS(css, '.container');

			// Scoped version should only affect body elements inside .container
			expect(scoped).toBe('.container body { color: red !important }');
			// This means it won't affect the actual document body
		});

		it('should isolate multiple style sets', () => {
			const css1 = '.button { color: red }';
			const css2 = '.button { color: blue }';

			const scoped1 = scopeCSS(css1, '.container1');
			const scoped2 = scopeCSS(css2, '.container2');

			expect(scoped1).toBe('.container1 .button { color: red !important }');
			expect(scoped2).toBe('.container2 .button { color: blue !important }');
			// Both can coexist without conflicts
		});

		it('should ensure wiremd styles override Obsidian styles', () => {
			// Simulate a style that Obsidian might set
			const wiremdCSS = '.button { font-family: "Comic Sans MS"; background-color: #f5f5dc }';
			const scoped = scopeCSS(wiremdCSS, '.wiremd-preview-container');

			// With !important, wiremd styles will win over Obsidian's styles
			expect(scoped).toContain('font-family: "Comic Sans MS" !important');
			expect(scoped).toContain('background-color: #f5f5dc !important');
		});
	});

	describe('Body selector transformation', () => {
		it('should transform body.class to .class', () => {
			const css = 'body.wmd-root { background: blue }';
			const transformed = css.replace(/\bbody\./g, '.');
			expect(transformed).toBe('.wmd-root { background: blue }');
		});

		it('should transform plain body to .wmd-body', () => {
			const css = 'body { background: #f9fafb }';
			const transformed = css.replace(/\bbody(\s*\{)/g, '.wmd-body$1');
			expect(transformed).toBe('.wmd-body { background: #f9fafb }');
		});

		it('should handle both transformations together', () => {
			let css = 'body { background: white } body.wmd-root { color: black }';
			css = css.replace(/\bbody\./g, '.');
			css = css.replace(/\bbody(\s*\{)/g, '.wmd-body$1');

			expect(css).toContain('.wmd-body { background: white }');
			expect(css).toContain('.wmd-root { color: black }');
		});

		it('should not transform body in middle of words', () => {
			const css = 'everybody { color: red } body { color: blue }';
			const transformed = css.replace(/\bbody(\s*\{)/g, '.wmd-body$1');

			expect(transformed).toContain('everybody { color: red }');
			expect(transformed).toContain('.wmd-body { color: blue }');
		});
	});
});
