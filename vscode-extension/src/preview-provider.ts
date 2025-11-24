/**
 * Wiremd Preview Provider
 * Handles webview creation and content rendering
 */

import * as vscode from 'vscode';
import { parse, renderToHTML } from 'wiremd';

export class WiremdPreviewProvider implements vscode.WebviewPanelSerializer {
  public static readonly viewType = 'wiremd.preview';

  private panel: vscode.WebviewPanel | undefined;
  private currentEditor: vscode.TextEditor | undefined;
  private updateTimeout: NodeJS.Timeout | undefined;
  private currentStyle: string = 'sketch';
  private currentViewport: string = 'full';
  private disposables: vscode.Disposable[] = [];

  constructor(private readonly context: vscode.ExtensionContext) {
    // Watch for document changes
    vscode.workspace.onDidChangeTextDocument(
      (e) => this.onDocumentChanged(e),
      null,
      this.disposables
    );

    // Watch for active editor changes
    vscode.window.onDidChangeActiveTextEditor(
      (editor) => this.onActiveEditorChanged(editor),
      null,
      this.disposables
    );

    // Watch for configuration changes
    vscode.workspace.onDidChangeConfiguration(
      (e) => {
        if (e.affectsConfiguration('wiremd')) {
          this.refresh();
        }
      },
      null,
      this.disposables
    );

    // Get default style from config
    const config = vscode.workspace.getConfiguration('wiremd');
    this.currentStyle = config.get('defaultStyle', 'sketch');
  }

  /**
   * Restore webview panel from saved state
   */
  async deserializeWebviewPanel(
    webviewPanel: vscode.WebviewPanel,
    state: any
  ): Promise<void> {
    this.panel = webviewPanel;
    this.panel.webview.options = this.getWebviewOptions();
    this.panel.webview.html = await this.getWebviewContent();

    // Restore state
    if (state) {
      this.currentStyle = state.style || 'sketch';
      this.currentViewport = state.viewport || 'full';
    }

    // Set up message handling
    this.panel.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      null,
      this.disposables
    );

    this.refresh();
  }

  /**
   * Open preview in specified column
   */
  public openPreview(column: vscode.ViewColumn): void {
    this.currentEditor = vscode.window.activeTextEditor;

    if (!this.currentEditor) {
      vscode.window.showErrorMessage('No active markdown file');
      return;
    }

    if (this.currentEditor.document.languageId !== 'markdown') {
      vscode.window.showWarningMessage('Active file is not a markdown file');
      return;
    }

    if (this.panel) {
      // Panel already exists, reveal it
      this.panel.reveal(column);
    } else {
      // Create new panel
      this.panel = vscode.window.createWebviewPanel(
        WiremdPreviewProvider.viewType,
        'Wiremd Preview',
        column,
        this.getWebviewOptions()
      );

      // Handle panel disposal
      this.panel.onDidDispose(() => {
        this.panel = undefined;
      }, null, this.disposables);

      // Handle messages from webview
      this.panel.webview.onDidReceiveMessage(
        (message) => this.handleMessage(message),
        null,
        this.disposables
      );
    }

    // Update content
    this.refresh();
  }

  /**
   * Refresh preview content
   */
  public async refresh(): Promise<void> {
    if (!this.panel) {
      return;
    }

    try {
      const html = await this.getWebviewContent();
      this.panel.webview.html = html;
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  /**
   * Change visual style
   */
  public changeStyle(style: string): void {
    this.currentStyle = style;
    this.refresh();
  }

  /**
   * Change viewport size
   */
  public changeViewport(viewport: string): void {
    this.currentViewport = viewport;
    this.refresh();
  }

  /**
   * Get viewport label for display
   */
  private getViewportLabel(viewport: string): string {
    const labels: Record<string, string> = {
      full: 'Full Width',
      desktop: '💻 Desktop',
      laptop: '💻 Laptop',
      tablet: '📱 Tablet',
      mobile: '📱 Mobile'
    };
    return labels[viewport] || 'Full Width';
  }

  /**
   * Show error in preview
   */
  private showError(message: string): void {
    if (!this.panel) {
      return;
    }

    const config = vscode.workspace.getConfiguration('wiremd');
    const showOverlay = config.get('showErrorOverlay', true);

    if (showOverlay) {
      this.panel.webview.postMessage({
        type: 'error',
        message: message
      });
    }
  }

  /**
   * Handle document changes
   */
  private onDocumentChanged(e: vscode.TextDocumentChangeEvent): void {
    if (
      !this.panel ||
      !this.currentEditor ||
      e.document !== this.currentEditor.document
    ) {
      return;
    }

    const config = vscode.workspace.getConfiguration('wiremd');
    const autoRefresh = config.get('autoRefresh', true);

    if (!autoRefresh) {
      return;
    }

    // Debounce updates
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    const delay = config.get('refreshDelay', 300);
    this.updateTimeout = setTimeout(() => {
      this.refresh();
    }, delay);
  }

  /**
   * Handle active editor changes
   */
  private onActiveEditorChanged(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') {
      return;
    }

    this.currentEditor = editor;
    this.refresh();
  }

  /**
   * Handle messages from webview
   */
  private handleMessage(message: any): void {
    switch (message.type) {
      case 'ready':
        // Webview is ready
        this.refresh();
        break;

      case 'changeStyle':
        this.changeStyle(message.style);
        break;

      case 'changeViewport':
        this.changeViewport(message.viewport);
        break;

      case 'requestStyleChange':
        // Trigger the VS Code command to show style picker
        vscode.commands.executeCommand('wiremd.changeStyle');
        break;

      case 'requestViewportChange':
        // Trigger the VS Code command to show viewport picker
        vscode.commands.executeCommand('wiremd.changeViewport');
        break;

      case 'error':
        vscode.window.showErrorMessage(`Wiremd: ${message.message}`);
        break;

      case 'info':
        vscode.window.showInformationMessage(`Wiremd: ${message.message}`);
        break;
    }
  }

  /**
   * Get webview content HTML
   */
  private async getWebviewContent(): Promise<string> {
    if (!this.currentEditor) {
      return this.getEmptyStateHTML();
    }

    const document = this.currentEditor.document;
    const markdown = document.getText();

    try {
      // Render using wiremd
      const ast = parse(markdown);
      const html = renderToHTML(ast, {
        style: this.currentStyle as any,
        pretty: true,
        inlineStyles: true
      });

      return this.wrapHTML(html);
    } catch (error: any) {
      return this.getErrorHTML(error.message);
    }
  }

  /**
   * Extract styles and body content from wiremd HTML
   */
  private extractHTMLParts(html: string): { styles: string; content: string; fontLinks: string } {
    // Extract <style> content
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    let styles = styleMatch ? styleMatch[1] : '';

    // Extract @import statements and convert to link tags
    const importMatches = styles.match(/@import\s+url\(['"]([^'"]+)['"]\);?/g) || [];
    const fontLinks = importMatches
      .map(imp => {
        const urlMatch = imp.match(/url\(['"]([^'"]+)['"]\)/);
        return urlMatch ? `<link rel="stylesheet" href="${urlMatch[1]}">` : '';
      })
      .join('\n  ');

    // Remove @import statements from styles
    styles = styles.replace(/@import\s+url\(['"]([^'"]+)['"]\);?\s*/g, '');

    // Extract <body> content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    const content = bodyMatch ? bodyMatch[1] : html;

    return { styles, content, fontLinks };
  }

  /**
   * Wrap rendered HTML with preview chrome
   */
  private wrapHTML(content: string): string {
    const { styles, content: bodyContent, fontLinks } = this.extractHTMLParts(content);

    const viewportWidths: Record<string, string> = {
      desktop: '1440px',
      laptop: '1024px',
      tablet: '768px',
      mobile: '375px',
      full: '100%'
    };

    const viewportWidth = viewportWidths[this.currentViewport] || '100%';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src https: data:; script-src 'unsafe-inline';">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <title>Wiremd Preview</title>
  ${fontLinks}
  <style>
    /* Wiremd styles */
    ${styles}

    /* Preview wrapper styles - scoped to not interfere with wiremd content */
    html, body {
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      overflow-x: hidden;
    }

    /* Fix for div.wmd-root instead of body.wmd-root */
    .wmd-root {
      font-family: 'Kalam', 'Comic Sans MS', 'Marker Felt', 'Chalkboard', cursive, sans-serif !important;
      background: #f5f5dc;
      color: #333 !important;
      padding: 20px;
    }

    .wmd-root * {
      color: inherit;
    }

    #toolbar {
      position: sticky;
      top: 0;
      background: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    #toolbar button {
      padding: 6px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      background: white;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    #toolbar button:hover {
      background: #f5f5f5;
      border-color: #999;
    }

    #toolbar button:focus {
      outline: 2px solid #007acc;
      outline-offset: 2px;
    }

    #toolbar .dropdown-btn {
      min-width: 120px;
      text-align: left;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
    }

    #toolbar .dropdown-btn:hover {
      background: #e8e8e8;
      border-color: #007acc;
    }

    #toolbar span {
      font-size: 13px;
      color: #333;
    }

    .toolbar-separator {
      width: 1px;
      height: 20px;
      background: #e0e0e0;
      margin: 0 4px;
    }

    #viewport-indicator {
      font-size: 12px;
      color: #666;
      margin-left: auto;
    }

    #preview-container {
      display: flex;
      justify-content: center;
      padding: 20px;
      min-height: calc(100vh - 60px);
    }

    #preview-frame {
      width: ${viewportWidth};
      max-width: 100%;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
      transition: width 0.3s ease;
    }

    #error-overlay {
      display: none;
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff4444;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 2000;
      max-width: 600px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    #error-overlay.show {
      display: block;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading::after {
      content: '...';
      animation: dots 1.5s steps(4, end) infinite;
    }

    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }
  </style>
</head>
<body>
  <div id="toolbar">
    <button id="refresh-btn" title="Refresh Preview">🔄 Refresh</button>
    <div class="toolbar-separator"></div>

    <span>Style:</span>
    <button id="style-btn" class="dropdown-btn" title="Change Style">
      ${this.currentStyle.charAt(0).toUpperCase() + this.currentStyle.slice(1)} ▾
    </button>

    <div class="toolbar-separator"></div>

    <span>Viewport:</span>
    <button id="viewport-btn" class="dropdown-btn" title="Change Viewport">
      ${this.getViewportLabel(this.currentViewport)} ▾
    </button>

    <span id="viewport-indicator">${viewportWidth}</span>
  </div>

  <div id="error-overlay"></div>

  <div id="preview-container">
    <div id="preview-frame" class="wmd-root wmd-${this.currentStyle}">
      ${bodyContent}
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    // Restore state
    const state = vscode.getState() || {};

    // Handle refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
      vscode.postMessage({ type: 'ready' });
    });

    // Handle style button - trigger VS Code command
    document.getElementById('style-btn').addEventListener('click', () => {
      vscode.postMessage({ type: 'requestStyleChange' });
    });

    // Handle viewport button - trigger VS Code command
    document.getElementById('viewport-btn').addEventListener('click', () => {
      vscode.postMessage({ type: 'requestViewportChange' });
    });

    // Handle messages from extension
    window.addEventListener('message', (event) => {
      const message = event.data;
      switch (message.type) {
        case 'error':
          showError(message.message);
          break;
      }
    });

    function showError(message) {
      const overlay = document.getElementById('error-overlay');
      overlay.textContent = '⚠️ ' + message;
      overlay.classList.add('show');
      setTimeout(() => {
        overlay.classList.remove('show');
      }, 5000);
    }

    // Notify ready
    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
  }

  /**
   * Get empty state HTML
   */
  private getEmptyStateHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wiremd Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
      color: #333;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
    }
    .empty-state h2 {
      font-size: 24px;
      margin-bottom: 12px;
    }
    .empty-state p {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="empty-state">
    <h2>👀 No Markdown File Open</h2>
    <p>Open a markdown file to see the wiremd preview</p>
  </div>
</body>
</html>`;
  }

  /**
   * Get error state HTML
   */
  private getErrorHTML(message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wiremd Preview - Error</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
      color: #333;
    }
    .error-state {
      text-align: center;
      padding: 40px;
      max-width: 600px;
    }
    .error-state h2 {
      font-size: 24px;
      margin-bottom: 12px;
      color: #d32f2f;
    }
    .error-state pre {
      background: #fff3e0;
      border: 1px solid #ff9800;
      padding: 16px;
      border-radius: 4px;
      text-align: left;
      font-size: 13px;
      overflow-x: auto;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="error-state">
    <h2>⚠️ Preview Error</h2>
    <p>Failed to render the wiremd preview:</p>
    <pre>${this.escapeHtml(message)}</pre>
  </div>
</body>
</html>`;
  }

  /**
   * Get webview options
   */
  private getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };
  }

  /**
   * Escape HTML
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];

    if (this.panel) {
      this.panel.dispose();
    }
  }
}
