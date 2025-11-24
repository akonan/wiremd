import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEFAULT_SETTINGS, WIREMD_STYLES, WiremdSettingTab } from '../src/settings';
import type { WiremdSettings } from '../src/settings';
import { App } from 'obsidian';

describe('Settings', () => {
  describe('DEFAULT_SETTINGS', () => {
    it('should have sketch as default style', () => {
      expect(DEFAULT_SETTINGS.style).toBe('sketch');
    });

    it('should have autoPreview enabled by default', () => {
      expect(DEFAULT_SETTINGS.autoPreview).toBe(true);
    });

    it('should have 300ms render delay by default', () => {
      expect(DEFAULT_SETTINGS.renderDelay).toBe(300);
    });
  });

  describe('WIREMD_STYLES', () => {
    it('should have 7 styles', () => {
      expect(WIREMD_STYLES).toHaveLength(7);
    });

    it('should include all expected styles', () => {
      const styleValues = WIREMD_STYLES.map(s => s.value);
      expect(styleValues).toContain('sketch');
      expect(styleValues).toContain('clean');
      expect(styleValues).toContain('wireframe');
      expect(styleValues).toContain('tailwind');
      expect(styleValues).toContain('material');
      expect(styleValues).toContain('brutal');
      expect(styleValues).toContain('none');
    });

    it('should have name and description for each style', () => {
      WIREMD_STYLES.forEach(style => {
        expect(style.value).toBeTruthy();
        expect(style.name).toBeTruthy();
        expect(style.description).toBeTruthy();
      });
    });
  });

  describe('WiremdSettingTab', () => {
    let app: App;
    let mockPlugin: any;

    beforeEach(() => {
      app = new App();
      mockPlugin = {
        settings: { ...DEFAULT_SETTINGS },
        saveSettings: vi.fn().mockResolvedValue(undefined),
        refreshAllPreviews: vi.fn().mockResolvedValue(undefined)
      };
    });

    it('should create a setting tab', () => {
      const tab = new WiremdSettingTab(app, mockPlugin);
      expect(tab).toBeDefined();
      expect(tab.plugin).toBe(mockPlugin);
    });

    it('should have display method', () => {
      const tab = new WiremdSettingTab(app, mockPlugin);
      expect(typeof tab.display).toBe('function');
    });

    it('should create settings UI on display', () => {
      const tab = new WiremdSettingTab(app, mockPlugin);
      tab.display();

      // Container should be cleared and have content
      expect(tab.containerEl).toBeDefined();
    });
  });

  describe('Settings validation', () => {
    it('should accept valid style values', () => {
      const validStyles: WiremdSettings['style'][] = [
        'sketch', 'clean', 'wireframe', 'tailwind', 'material', 'brutal', 'none'
      ];

      validStyles.forEach(style => {
        const settings: WiremdSettings = {
          ...DEFAULT_SETTINGS,
          style
        };
        expect(settings.style).toBe(style);
      });
    });

    it('should accept valid autoPreview values', () => {
      const settings1: WiremdSettings = { ...DEFAULT_SETTINGS, autoPreview: true };
      const settings2: WiremdSettings = { ...DEFAULT_SETTINGS, autoPreview: false };

      expect(settings1.autoPreview).toBe(true);
      expect(settings2.autoPreview).toBe(false);
    });

    it('should accept valid renderDelay values', () => {
      const settings1: WiremdSettings = { ...DEFAULT_SETTINGS, renderDelay: 0 };
      const settings2: WiremdSettings = { ...DEFAULT_SETTINGS, renderDelay: 500 };
      const settings3: WiremdSettings = { ...DEFAULT_SETTINGS, renderDelay: 1000 };

      expect(settings1.renderDelay).toBe(0);
      expect(settings2.renderDelay).toBe(500);
      expect(settings3.renderDelay).toBe(1000);
    });
  });
});
