import { parse, renderToHTML } from "wiremd";
import type { WiremdSettings, WiremdStyle } from "./settings";
import { WIREMD_STYLES } from "./settings";
import { MobileOptimizer } from "./mobile";

/**
 * Scope CSS rules to only apply within a specific selector
 * and add !important to critical properties that Obsidian commonly overrides
 */
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

export class WiremdPreviewProcessor {
	private settings: WiremdSettings;
	private previewElements: Set<HTMLElement> = new Set();
	private renderTimeouts: Map<HTMLElement, number> = new Map();

	constructor(settings: WiremdSettings) {
		this.settings = settings;
	}

	updateSettings(settings: WiremdSettings) {
		this.settings = settings;
	}

	/**
	 * Process a wiremd code block and render it as a preview
	 */
	async processCodeBlock(
		source: string,
		el: HTMLElement,
		style?: WiremdStyle
	): Promise<void> {
		// Clear any pending render timeout for this element
		const existingTimeout = this.renderTimeouts.get(el);
		if (existingTimeout) {
			window.clearTimeout(existingTimeout);
		}

		// If auto-preview is disabled, just show the raw code
		if (!this.settings.autoPreview) {
			el.createEl('pre', { text: source });
			return;
		}

		// Track this preview element
		this.previewElements.add(el);

		// Get mobile-optimized render delay
		const delay = MobileOptimizer.getRenderDelay(this.settings.renderDelay);

		// Debounce rendering
		const timeoutId = window.setTimeout(() => {
			this.renderPreview(source, el, style || this.settings.style);
			this.renderTimeouts.delete(el);
		}, delay);

		this.renderTimeouts.set(el, timeoutId);
	}

	/**
	 * Render wiremd source to HTML preview
	 */
	private renderPreview(source: string, el: HTMLElement, style: WiremdStyle): void {
		try {
			// Parse wiremd syntax to AST
			const ast = parse(source, {
				position: false,
				validate: true
			});

			// Render AST to HTML with selected style
			const fullHtml = renderToHTML(ast, {
				style: style,
				inlineStyles: true, // Required for Obsidian
				pretty: false,
				classPrefix: 'wmd-'
			});

			// Extract body content and classes from full HTML document
			const bodyMatch = fullHtml.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
			const bodyContent = bodyMatch ? bodyMatch[2] : fullHtml;
			const bodyAttrs = bodyMatch ? bodyMatch[1] : '';

			// Extract body classes (like wmd-root, wmd-sketch, etc.)
			const bodyClassMatch = bodyAttrs.match(/class=["']([^"']+)["']/);
			const bodyClasses = bodyClassMatch ? bodyClassMatch[1] : '';

			// Extract styles
			let styleMatch = fullHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
			let styles = styleMatch ? styleMatch[1] : '';

			// Replace body selectors with class selectors so they work without body element
			// 1. body.wmd-root → .wmd-root (for sketch, clean, wireframe, none)
			styles = styles.replace(/\bbody\./g, '.');
			// 2. body { → .wmd-body { (for tailwind, material, brutal that use plain body)
			//    This regex matches 'body' followed by whitespace and {, but not 'body.'
			styles = styles.replace(/\bbody(\s*\{)/g, '.wmd-body$1');

			// Create container
			el.empty();
			el.addClass('wiremd-preview-container');
			el.addClass(MobileOptimizer.getContainerClass());

			// Apply mobile optimizations
			MobileOptimizer.optimizeForMobile(el);

			// Add style badge
			const badge = el.createEl('div', { cls: 'wiremd-style-badge' });
			badge.textContent = `Style: ${style}`;
			badge.setAttribute('data-style', style);
			badge.addEventListener('click', () => {
				this.showStyleSelector(el, source);
			});

			// Add touch interactions to badge
			MobileOptimizer.addTouchInteractions(badge);

			// Add scoped styles to prevent leaking into Obsidian UI
			if (styles) {
				const scopedStyles = scopeCSS(styles, '.wiremd-preview-container');
				const styleEl = el.createEl('style');
				styleEl.textContent = scopedStyles;
			}

			// Add content with body classes applied
			const contentEl = el.createEl('div', { cls: 'wiremd-preview-content' });

			// Always add wmd-body class for styles that use plain body selector
			// (tailwind, material, brutal)
			contentEl.addClass('wmd-body');

			// Apply body classes (wmd-root, wmd-sketch, etc.) to content element
			if (bodyClasses) {
				bodyClasses.split(/\s+/).forEach(cls => {
					if (cls) contentEl.addClass(cls);
				});
			}

			contentEl.innerHTML = bodyContent;

		} catch (error) {
			// Display error
			el.empty();
			el.addClass('wiremd-preview-error');

			const errorHeader = el.createEl('div', {
				cls: 'wiremd-error-header',
				text: 'Wiremd Rendering Error'
			});

			const errorMessage = el.createEl('div', {
				cls: 'wiremd-error-message',
				text: error instanceof Error ? error.message : String(error)
			});

			const errorCode = el.createEl('pre', {
				cls: 'wiremd-error-code',
				text: source
			});
		}
	}

	/**
	 * Show inline style selector for quick style switching
	 */
	private showStyleSelector(el: HTMLElement, source: string): void {
		// Create style selector dropdown
		const selector = el.createEl('div', { cls: 'wiremd-style-selector' });

		WIREMD_STYLES.forEach(style => {
			const option = selector.createEl('div', {
				cls: 'wiremd-style-option',
				text: `${style.name} - ${style.description}`
			});

			if (style.value === this.settings.style) {
				option.addClass('wiremd-style-option-active');
			}

			// Add touch interactions
			MobileOptimizer.addTouchInteractions(option);

			option.addEventListener('click', () => {
				this.renderPreview(source, el, style.value);
				selector.remove();
			});
		});

		// Position selector near badge
		const badge = el.querySelector('.wiremd-style-badge');
		if (badge) {
			badge.after(selector);
		}

		// Apply mobile-specific positioning
		MobileOptimizer.positionStyleSelector(selector, el);

		// Close on click outside
		const closeHandler = (e: MouseEvent) => {
			if (!selector.contains(e.target as Node)) {
				selector.remove();
				document.removeEventListener('click', closeHandler);
			}
		};
		setTimeout(() => document.addEventListener('click', closeHandler), 10);
	}

	/**
	 * Refresh all tracked previews (e.g., when settings change)
	 */
	async refreshAllPreviews(): Promise<void> {
		for (const el of this.previewElements) {
			// Extract the original source from the element
			const source = el.getAttribute('data-wiremd-source');
			if (source) {
				await this.processCodeBlock(source, el);
			}
		}
	}

	/**
	 * Clean up resources
	 */
	cleanup(): void {
		// Clear all pending timeouts
		for (const timeoutId of this.renderTimeouts.values()) {
			window.clearTimeout(timeoutId);
		}
		this.renderTimeouts.clear();
		this.previewElements.clear();
	}
}
