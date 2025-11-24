/**
 * wiremd Figma Plugin - Main Entry Point
 * Imports wiremd JSON AST and converts to Figma designs
 */

import { WiremdToFigmaConverter } from './lib/ast-to-figma';
import type { DocumentNode } from './lib/types';

// Show the plugin UI
figma.showUI(__html__, {
  width: 500,
  height: 700,
  themeColors: true,
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'import-wiremd') {
      await handleImport(msg.json, msg.theme);
    } else if (msg.type === 'cancel') {
      figma.closePlugin();
    } else if (msg.type === 'resize') {
      figma.ui.resize(msg.width, msg.height);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

async function handleImport(jsonString: string, theme?: string): Promise<void> {
  try {
    // Notify start
    figma.ui.postMessage({ type: 'import-started' });

    // Parse JSON
    const ast: DocumentNode = JSON.parse(jsonString);

    // Validate it's a wiremd document
    if (!ast || ast.type !== 'document') {
      throw new Error('Invalid wiremd JSON: must be a document node');
    }

    // Create converter with specified theme
    const converter = new WiremdToFigmaConverter({
      theme: (theme as any) || ast.meta?.theme || 'sketch',
    });

    // Convert to Figma
    await converter.convert(ast);

    // Notify success
    figma.notify('✅ wiremd import complete!');
    figma.ui.postMessage({ type: 'import-success' });

    // Auto-close after successful import (with delay for user to see success message)
    setTimeout(() => {
      figma.closePlugin();
    }, 1500);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Import error:', error);
    figma.notify(`❌ Import failed: ${errorMessage}`, { error: true });
    figma.ui.postMessage({
      type: 'error',
      message: errorMessage,
    });
  }
}
