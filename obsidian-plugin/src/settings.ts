import { App, PluginSettingTab, Setting } from "obsidian";
import type WiremdPlugin from "./main";

export type WiremdStyle = 'sketch' | 'clean' | 'wireframe' | 'tailwind' | 'material' | 'brutal' | 'none';

export interface WiremdSettings {
	style: WiremdStyle;
	autoPreview: boolean;
	renderDelay: number;
}

export const DEFAULT_SETTINGS: WiremdSettings = {
	style: 'sketch',
	autoPreview: true,
	renderDelay: 300
};

export const WIREMD_STYLES: { value: WiremdStyle; name: string; description: string }[] = [
	{
		value: 'sketch',
		name: 'Sketch',
		description: 'Hand-drawn Balsamiq-inspired look'
	},
	{
		value: 'clean',
		name: 'Clean',
		description: 'Modern minimal design'
	},
	{
		value: 'wireframe',
		name: 'Wireframe',
		description: 'Traditional grayscale with hatching'
	},
	{
		value: 'tailwind',
		name: 'Tailwind',
		description: 'Utility-first design inspired'
	},
	{
		value: 'material',
		name: 'Material',
		description: 'Material Design inspired'
	},
	{
		value: 'brutal',
		name: 'Brutal',
		description: 'Neo-brutalism with bold colors'
	},
	{
		value: 'none',
		name: 'None',
		description: 'Unstyled semantic HTML'
	}
];

export class WiremdSettingTab extends PluginSettingTab {
	plugin: WiremdPlugin;

	constructor(app: App, plugin: WiremdPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Wiremd Preview Settings' });

		// Style setting
		new Setting(containerEl)
			.setName('Visual Style')
			.setDesc('Choose the default visual style for wiremd previews')
			.addDropdown(dropdown => {
				WIREMD_STYLES.forEach(style => {
					dropdown.addOption(style.value, `${style.name} - ${style.description}`);
				});
				dropdown.setValue(this.plugin.settings.style);
				dropdown.onChange(async (value: string) => {
					this.plugin.settings.style = value as WiremdStyle;
					await this.plugin.saveSettings();
					await this.plugin.refreshAllPreviews();
				});
			});

		// Auto-preview setting
		new Setting(containerEl)
			.setName('Auto Preview')
			.setDesc('Automatically render wiremd code blocks as previews')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.autoPreview);
				toggle.onChange(async (value) => {
					this.plugin.settings.autoPreview = value;
					await this.plugin.saveSettings();
					await this.plugin.refreshAllPreviews();
				});
			});

		// Render delay setting
		new Setting(containerEl)
			.setName('Render Delay')
			.setDesc('Delay (in milliseconds) before rendering preview during typing (default: 300ms)')
			.addSlider(slider => {
				slider
					.setLimits(0, 1000, 50)
					.setValue(this.plugin.settings.renderDelay)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.renderDelay = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
