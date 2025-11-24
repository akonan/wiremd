import { vi } from 'vitest';

// Mock HTMLElement extensions
class MockHTMLElement {
  classList = new Set<string>();
  style: any = {};
  children: any[] = [];
  innerHTML = '';
  textContent = '';
  attributes: Map<string, string> = new Map();

  addClass(cls: string) {
    this.classList.add(cls);
  }

  removeClass(cls: string) {
    this.classList.delete(cls);
  }

  empty() {
    this.innerHTML = '';
    this.children = [];
  }

  createEl(tag: string, options?: any): any {
    const el = new MockHTMLElement();
    if (options?.cls) {
      el.addClass(options.cls);
    }
    if (options?.text) {
      el.textContent = options.text;
    }
    this.children.push(el);
    return el;
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) || null;
  }

  querySelector(selector: string): any {
    return null;
  }

  addEventListener(event: string, handler: Function) {}

  after(element: any) {}

  remove() {}

  contains(node: any): boolean {
    return false;
  }
}

// Mock App
export class App {
  workspace: any = {
    trigger: vi.fn()
  };
  setting: any = {
    open: vi.fn(),
    openTabById: vi.fn()
  };
}

// Mock Plugin
export class Plugin {
  app: App;
  manifest: any = {
    id: 'wiremd-preview',
    name: 'Wiremd Preview',
    version: '0.1.0'
  };

  constructor(app: App, manifest: any) {
    this.app = app;
    this.manifest = manifest;
  }

  addRibbonIcon(icon: string, title: string, callback: Function) {
    return { remove: vi.fn() };
  }

  addCommand(command: any) {}

  addSettingTab(tab: any) {}

  registerMarkdownCodeBlockProcessor(language: string, handler: Function) {}

  loadData(): Promise<any> {
    return Promise.resolve({});
  }

  saveData(data: any): Promise<void> {
    return Promise.resolve();
  }
}

// Mock PluginSettingTab
export class PluginSettingTab {
  app: App;
  plugin: any;
  containerEl: any;

  constructor(app: App, plugin: any) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = new MockHTMLElement();
  }

  display() {}
  hide() {}
}

// Mock Setting
export class Setting {
  settingEl: any;

  constructor(containerEl: any) {
    this.settingEl = new MockHTMLElement();
  }

  setName(name: string): this {
    return this;
  }

  setDesc(desc: string): this {
    return this;
  }

  addText(callback: Function): this {
    callback({
      setValue: vi.fn().mockReturnThis(),
      onChange: vi.fn().mockReturnThis()
    });
    return this;
  }

  addToggle(callback: Function): this {
    callback({
      setValue: vi.fn().mockReturnThis(),
      onChange: vi.fn().mockReturnThis()
    });
    return this;
  }

  addDropdown(callback: Function): this {
    callback({
      addOption: vi.fn().mockReturnThis(),
      setValue: vi.fn().mockReturnThis(),
      onChange: vi.fn().mockReturnThis()
    });
    return this;
  }

  addSlider(callback: Function): this {
    callback({
      setLimits: vi.fn().mockReturnThis(),
      setValue: vi.fn().mockReturnThis(),
      setDynamicTooltip: vi.fn().mockReturnThis(),
      onChange: vi.fn().mockReturnThis()
    });
    return this;
  }
}

// Mock Notice
export class Notice {
  constructor(message: string, timeout?: number) {}
}

// Mock Platform
export const Platform = {
  isMobile: false,
  isDesktop: true,
  isIOS: false,
  isAndroid: false,
  isMacOS: false,
  isWin: false,
  isLinux: true
};

// Mock Editor
export class Editor {
  private value = '';
  private cursor = { line: 0, ch: 0 };

  getValue(): string {
    return this.value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getSelection(): string {
    return '';
  }

  getCursor(): any {
    return this.cursor;
  }
}

// Mock MarkdownView
export class MarkdownView {
  editor: Editor;

  constructor() {
    this.editor = new Editor();
  }
}

// Mock MarkdownPostProcessorContext
export class MarkdownPostProcessorContext {
  docId: string = 'test-doc';
  sourcePath: string = 'test.md';
}
