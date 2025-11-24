import { parse, renderToHTML } from "wiremd";
import { Notice } from "obsidian";
import type { WiremdStyle } from "./settings";

export class WiremdExporter {
	/**
	 * Export wiremd source as a standalone HTML file
	 */
	static async exportAsHTML(
		source: string,
		style: WiremdStyle,
		filename?: string
	): Promise<void> {
		try {
			// Parse and render
			const ast = parse(source, {
				position: false,
				validate: true
			});

			const html = renderToHTML(ast, {
				style: style,
				inlineStyles: true,
				pretty: true,
				classPrefix: 'wmd-'
			});

			// Create blob
			const blob = new Blob([html], { type: 'text/html;charset=utf-8' });

			// Generate filename
			const exportFilename = filename || `wiremd-export-${Date.now()}.html`;

			// Download file
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = exportFilename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			new Notice(`Exported to ${exportFilename}`);
		} catch (error) {
			new Notice(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
			throw error;
		}
	}

	/**
	 * Export wiremd source with all styles (multi-file export)
	 */
	static async exportAllStyles(
		source: string,
		baseFilename?: string
	): Promise<void> {
		const styles: WiremdStyle[] = ['sketch', 'clean', 'wireframe', 'tailwind', 'material', 'brutal', 'none'];
		const base = baseFilename || `wiremd-export-${Date.now()}`;

		let successCount = 0;

		for (const style of styles) {
			try {
				const filename = `${base}-${style}.html`;
				await this.exportAsHTML(source, style, filename);
				successCount++;
			} catch (error) {
				console.error(`Failed to export style ${style}:`, error);
			}
		}

		new Notice(`Exported ${successCount}/${styles.length} style variations`);
	}

	/**
	 * Copy wiremd HTML to clipboard
	 */
	static async copyToClipboard(
		source: string,
		style: WiremdStyle
	): Promise<void> {
		try {
			const ast = parse(source, {
				position: false,
				validate: true
			});

			const html = renderToHTML(ast, {
				style: style,
				inlineStyles: true,
				pretty: true,
				classPrefix: 'wmd-'
			});

			await navigator.clipboard.writeText(html);
			new Notice('HTML copied to clipboard');
		} catch (error) {
			new Notice(`Copy failed: ${error instanceof Error ? error.message : String(error)}`);
			throw error;
		}
	}
}
