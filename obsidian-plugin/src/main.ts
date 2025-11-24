import { Plugin, MarkdownPostProcessorContext, Notice, Editor, MarkdownView } from "obsidian";
import { WiremdSettings, DEFAULT_SETTINGS, WiremdSettingTab, WIREMD_STYLES, WiremdStyle } from "./settings";
import { WiremdPreviewProcessor } from "./preview";
import { WiremdExporter } from "./export";

export default class WiremdPlugin extends Plugin {
	settings: WiremdSettings;
	private processor: WiremdPreviewProcessor;

	async onload() {
		console.log('Loading Wiremd Preview plugin');

		// Load settings
		await this.loadSettings();

		// Initialize preview processor
		this.processor = new WiremdPreviewProcessor(this.settings);

		// Register markdown code block processor for 'wiremd'
		this.registerMarkdownCodeBlockProcessor(
			'wiremd',
			(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
				// Store source for later refresh
				el.setAttribute('data-wiremd-source', source);

				// Process the code block
				this.processor.processCodeBlock(source, el);
			}
		);

		// Add ribbon icon
		this.addRibbonIcon('layout-template', 'Wiremd Preview Settings', () => {
			this.openSettings();
		});

		// Add settings tab
		this.addSettingTab(new WiremdSettingTab(this.app, this));

		// Add command palette commands for quick style switching
		WIREMD_STYLES.forEach(style => {
			this.addCommand({
				id: `set-style-${style.value}`,
				name: `Set style to ${style.name}`,
				callback: async () => {
					await this.setStyle(style.value);
					new Notice(`Wiremd style set to ${style.name}`);
				}
			});
		});

		// Add command to toggle auto-preview
		this.addCommand({
			id: 'toggle-auto-preview',
			name: 'Toggle auto-preview',
			callback: async () => {
				this.settings.autoPreview = !this.settings.autoPreview;
				await this.saveSettings();
				await this.refreshAllPreviews();
				new Notice(`Wiremd auto-preview ${this.settings.autoPreview ? 'enabled' : 'disabled'}`);
			}
		});

		// Add command to refresh all previews
		this.addCommand({
			id: 'refresh-all-previews',
			name: 'Refresh all wiremd previews',
			callback: async () => {
				await this.refreshAllPreviews();
				new Notice('All wiremd previews refreshed');
			}
		});

		// Add command to export selected wiremd as HTML
		this.addCommand({
			id: 'export-wiremd-html',
			name: 'Export selected wiremd as HTML',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const source = this.getWiremdSource(editor);
				if (source) {
					await WiremdExporter.exportAsHTML(source, this.settings.style);
				} else {
					new Notice('No wiremd code block selected');
				}
			}
		});

		// Add command to export selected wiremd with all styles
		this.addCommand({
			id: 'export-wiremd-all-styles',
			name: 'Export selected wiremd with all styles',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const source = this.getWiremdSource(editor);
				if (source) {
					await WiremdExporter.exportAllStyles(source);
				} else {
					new Notice('No wiremd code block selected');
				}
			}
		});

		// Add command to copy wiremd HTML to clipboard
		this.addCommand({
			id: 'copy-wiremd-html',
			name: 'Copy selected wiremd HTML to clipboard',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const source = this.getWiremdSource(editor);
				if (source) {
					await WiremdExporter.copyToClipboard(source, this.settings.style);
				} else {
					new Notice('No wiremd code block selected');
				}
			}
		});
	}

	onunload() {
		console.log('Unloading Wiremd Preview plugin');
		this.processor.cleanup();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.processor.updateSettings(this.settings);
	}

	async setStyle(style: WiremdStyle) {
		this.settings.style = style;
		await this.saveSettings();
		await this.refreshAllPreviews();
	}

	async refreshAllPreviews() {
		// Trigger a layout change to force Obsidian to re-render markdown
		this.app.workspace.trigger('layout-change');

		// Also refresh tracked previews in processor
		await this.processor.refreshAllPreviews();
	}

	openSettings() {
		// @ts-ignore - Obsidian API
		this.app.setting.open();
		// @ts-ignore - Obsidian API
		this.app.setting.openTabById(this.manifest.id);
	}

	/**
	 * Extract wiremd source from editor
	 * Looks for wiremd code block at cursor or in selection
	 */
	private getWiremdSource(editor: Editor): string | null {
		const selection = editor.getSelection();

		// If there's a selection, try to extract wiremd code from it
		if (selection) {
			// Check if selection is a wiremd code block
			const wiremdMatch = selection.match(/```wiremd\s*\n([\s\S]*?)\n```/);
			if (wiremdMatch) {
				return wiremdMatch[1];
			}

			// If selection doesn't include the markers, assume it's the content
			if (!selection.includes('```')) {
				return selection;
			}
		}

		// If no selection, try to find wiremd block at cursor
		const cursor = editor.getCursor();
		const line = cursor.line;
		const content = editor.getValue();
		const lines = content.split('\n');

		// Search backwards for opening ```wiremd
		let startLine = -1;
		for (let i = line; i >= 0; i--) {
			if (lines[i].trim().startsWith('```wiremd')) {
				startLine = i;
				break;
			}
			if (lines[i].trim().startsWith('```') && !lines[i].includes('wiremd')) {
				// Found a different code block
				break;
			}
		}

		if (startLine === -1) {
			return null;
		}

		// Search forward for closing ```
		let endLine = -1;
		for (let i = startLine + 1; i < lines.length; i++) {
			if (lines[i].trim().startsWith('```')) {
				endLine = i;
				break;
			}
		}

		if (endLine === -1) {
			return null;
		}

		// Extract content between markers
		const wiremdLines = lines.slice(startLine + 1, endLine);
		return wiremdLines.join('\n');
	}
}
