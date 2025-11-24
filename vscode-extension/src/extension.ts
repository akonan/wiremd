/**
 * Wiremd VS Code Extension
 * Provides live preview for markdown mockups
 */

import * as vscode from 'vscode';
import { WiremdPreviewProvider } from './preview-provider';

let previewProvider: WiremdPreviewProvider;

export function activate(context: vscode.ExtensionContext) {
  // Create preview provider
  previewProvider = new WiremdPreviewProvider(context);

  // Register preview provider
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer(
      WiremdPreviewProvider.viewType,
      previewProvider
    )
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.openPreview', () => {
      previewProvider.openPreview(vscode.ViewColumn.Active);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.openPreviewToSide', () => {
      const activeColumn = vscode.window.activeTextEditor?.viewColumn;
      const previewColumn = activeColumn
        ? activeColumn + 1
        : vscode.ViewColumn.Two;
      previewProvider.openPreview(previewColumn);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.refreshPreview', () => {
      previewProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.changeStyle', async () => {
      const styles = ['sketch', 'clean', 'wireframe', 'none', 'tailwind', 'material', 'brutal'];
      const selected = await vscode.window.showQuickPick(styles, {
        placeHolder: 'Select a visual style'
      });
      if (selected) {
        previewProvider.changeStyle(selected);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('wiremd.changeViewport', async () => {
      const viewports = [
        { label: 'Desktop (1440px)', value: 'desktop' },
        { label: 'Laptop (1024px)', value: 'laptop' },
        { label: 'Tablet (768px)', value: 'tablet' },
        { label: 'Mobile (375px)', value: 'mobile' },
        { label: 'Full Width', value: 'full' }
      ];
      const selected = await vscode.window.showQuickPick(viewports, {
        placeHolder: 'Select viewport size'
      });
      if (selected) {
        previewProvider.changeViewport(selected.value);
      }
    })
  );

  // Auto-open preview if configured
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === 'markdown') {
        const config = vscode.workspace.getConfiguration('wiremd');
        if (config.get('autoOpenPreview')) {
          // Auto-open preview
        }
      }
    })
  );

  // Status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = '$(eye) Wiremd';
  statusBarItem.tooltip = 'Open Wiremd Preview';
  statusBarItem.command = 'wiremd.openPreviewToSide';
  context.subscriptions.push(statusBarItem);

  // Show status bar for markdown files
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === 'markdown') {
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    })
  );

  // Show initially if markdown file is open
  if (
    vscode.window.activeTextEditor &&
    vscode.window.activeTextEditor.document.languageId === 'markdown'
  ) {
    statusBarItem.show();
  }
}

export function deactivate() {
  if (previewProvider) {
    previewProvider.dispose();
  }
}
