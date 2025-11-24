# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository contains documentation for building an Obsidian plugin that provides live preview functionality for wiremd mockup files. The main content is a comprehensive implementation guide in `OBSIDIAN_PLUGIN_GUIDE.md`.

## Project Status

This is currently a documentation-only repository. The actual plugin implementation has not yet been created. The guide provides complete step-by-step instructions for building the plugin from scratch.

## Planned Plugin Architecture

When implemented, the Obsidian plugin will:

- Detect wiremd mockup syntax in Markdown code blocks (```wiremd)
- Provide real-time live preview of UI mockups
- Allow users to switch between 7 visual styles: sketch, clean, wireframe, tailwind, material, brutal, none
- Render mockups inline within the Obsidian editor

### Core Components (when implemented)

1. **Main Plugin Class** (`src/main.ts`): Plugin entry point extending Obsidian's Plugin class
2. **Preview Processor** (`src/preview.ts`): Handles wiremd parsing and HTML rendering using wiremd library
3. **Settings Management** (`src/settings.ts`): UI for style selection and configuration
4. **Styles** (`src/styles.css`): Plugin-specific CSS

## Technology Stack

- **TypeScript**: Main development language
- **Node.js** 18.x or higher
- **esbuild**: Build tool for bundling
- **wiremd library**: Core dependency for parsing and rendering mockups
- **Obsidian API**: Plugin integration

## Development Commands (when plugin is implemented)

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Production build
npm run build

# Type checking
npm run build  # Includes tsc -noEmit -skipLibCheck
```

## Key Integration Points

### wiremd Library Integration

The plugin integrates wiremd through three steps:

1. **Parse**: Convert markdown to wiremd AST using `parse()` from wiremd/parser
2. **Render**: Convert AST to HTML using `renderToHTML()` from wiremd/renderer with style options
3. **Display**: Inject generated HTML into Obsidian view

### Available Styles

- `sketch`: Balsamiq-inspired hand-drawn look (default)
- `clean`: Modern minimal design
- `wireframe`: Traditional grayscale with hatching
- `tailwind`: Utility-first design inspired
- `material`: Material Design inspired
- `brutal`: Neo-brutalism with bold colors
- `none`: Unstyled semantic HTML

## Build Configuration

When implemented, the build process uses:

- **esbuild.config.mjs**: Bundles TypeScript to single main.js file
- **tsconfig.json**: Target ES2020, module ESNext
- **manifest.json**: Plugin metadata for Obsidian

The build externalizes Obsidian API and CodeMirror dependencies.

## Installation for Development (when implemented)

Copy built files to Obsidian vault:
```bash
# Typical plugin location
~/.config/obsidian/plugins/wiremd-preview/  # Linux
~/Library/Application Support/obsidian/plugins/  # macOS
%APPDATA%\Obsidian\plugins\  # Windows

# Or in specific vault
/path/to/vault/.obsidian/plugins/wiremd-preview/
```

## Plugin Architecture Notes

### Markdown Processing
- Registers markdown code block processor for `wiremd` language identifier
- Uses debounced rendering (default 300ms) for performance
- Maintains set of preview elements for batch refresh when settings change

### Settings System
- Persistent settings stored via Obsidian's loadData/saveData API
- Settings tab in Obsidian preferences
- Command palette integration for quick style switching
- Ribbon icon for quick access to settings

### Preview Rendering
- Extracts HTML body content from wiremd's full document output
- Injects styles inline for proper rendering
- Shows style badge with click handler for quick style changes
- Error handling with user-friendly error display

## Performance Considerations

- Debounced rendering to prevent excessive re-renders during typing
- Configurable render delay (default 300ms, adjustable in settings)
- Uses requestAnimationFrame pattern for smooth updates
- Clears timeout timers properly to prevent memory leaks
