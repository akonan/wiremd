# Figma Export Investigation for wiremd

**Date**: 2025-11-09
**Status**: Research Complete
**Conclusion**: ✅ Feasible with multiple implementation paths

---

## Executive Summary

Yes, **wiremd can create Figma exports**, but with important constraints. Figma's architecture requires either:
1. A **Figma plugin** (recommended approach)
2. An **HTML intermediary** using existing conversion tools
3. Experimental **direct file generation** (not recommended)

The most viable path is developing a **Figma Plugin** that consumes wiremd's JSON AST and generates native Figma nodes using the Plugin API.

---

## Current wiremd Architecture

### Output Capabilities (as of now)
- ✅ HTML renderer with styled output
- ✅ JSON renderer (outputs AST)
- ✅ Multiple visual styles (sketch, clean, wireframe, none)

### AST Structure
wiremd uses a well-defined AST with discriminated unions:
```typescript
DocumentNode → WiremdNode[] → (button | input | container | grid | nav | heading | etc.)
```

**Key strengths for Figma integration:**
- Clean type system with 30+ component types
- Hierarchical structure maps well to Figma's scene graph
- Component properties align with Figma node properties
- Layout information (grids, containers) is preserved

---

## Figma Export Options Analysis

### Option 1: Figma Plugin (⭐ RECOMMENDED)

**How it works:**
- Build a Figma plugin using TypeScript
- Plugin runs inside Figma application
- Accepts wiremd JSON AST as input
- Uses Plugin API to create native Figma nodes

**Technical Details:**

The Figma Plugin API provides methods to create nodes:
```typescript
// Create frames
const frame = figma.createFrame();
frame.name = "Hero Section";
frame.resize(1440, 600);

// Create text
const text = figma.createText();
await figma.loadFontAsync(text.fontName);
text.characters = "Welcome";

// Create rectangles (buttons, containers)
const rect = figma.createRectangle();
rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];

// Create auto-layout frames (for responsive designs)
const autoFrame = figma.createFrame();
autoFrame.layoutMode = "VERTICAL";
autoFrame.primaryAxisSizingMode = "AUTO";
```

**Mapping wiremd → Figma:**

| wiremd Node | Figma Node | Notes |
|-------------|------------|-------|
| `button` | RectangleNode + TextNode | Grouped with auto-layout |
| `input` | RectangleNode + TextNode | Placeholder text styling |
| `textarea` | RectangleNode + TextNode | Multi-line text |
| `container` | FrameNode | With auto-layout properties |
| `grid` | FrameNode | CSS Grid → Auto-layout grid |
| `nav` | FrameNode | Horizontal auto-layout |
| `heading` | TextNode | fontSize based on level |
| `paragraph` | TextNode | |
| `image` | RectangleNode | With image fills |
| `icon` | VectorNode or TextNode | Unicode symbols or vectors |
| `checkbox/radio` | ComponentNode | Reusable components |

**Advantages:**
- ✅ Creates native, fully editable Figma designs
- ✅ Supports all Figma features (components, auto-layout, styles)
- ✅ Best quality output
- ✅ Direct API access, no intermediaries
- ✅ Can generate design systems (components, variants)

**Disadvantages:**
- ❌ Requires user to have Figma file open
- ❌ Cannot run headlessly or via CLI alone
- ❌ Users need Figma desktop/web app
- ❌ Additional development effort (plugin architecture)

**Implementation Effort:** Medium (2-3 weeks)

**Resources:**
- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Plugin Samples on GitHub](https://github.com/figma/plugin-samples)
- [TypeScript Plugin Development](https://www.figma.com/plugin-docs/typescript/)

---

### Option 2: HTML Intermediary Method

**How it works:**
1. wiremd renders to HTML (already implemented)
2. Use existing HTML-to-Figma converter tools
3. Tools run as Figma plugins or browser extensions

**Available Tools (2025):**

1. **html.to.design** (by div RIOTS)
   - Chrome extension + Figma plugin
   - Converts live websites to Figma
   - Free tier available

2. **Builder.io Figma Plugin**
   - 80-90% conversion accuracy
   - Auto-layout support (beta)
   - Open-source (deprecated, but code available)

3. **Codia HTML to Design**
   - AI-powered conversion
   - Supports responsive layouts
   - Handles complex CSS

4. **Web to Figma**
   - One-click conversion
   - Supports desktop/tablet/mobile

**Workflow:**
```
wiremd markdown → HTML render → Serve locally → html.to.design → Figma
```

**Advantages:**
- ✅ No plugin development needed
- ✅ Leverages existing, maintained tools
- ✅ Can use wiremd CLI immediately
- ✅ Users choose their preferred converter

**Disadvantages:**
- ❌ Indirect approach, lossy conversion
- ❌ Limited control over Figma output
- ❌ Depends on third-party tools
- ❌ May not preserve semantic wireframe structure
- ❌ Some tools are paid or have usage limits

**Implementation Effort:** Low (1-2 days)
- Add documentation on workflow
- Potentially add `--serve` flag to CLI for easy local hosting

---

### Option 3: Direct .fig File Generation (⚠️ NOT RECOMMENDED)

**How it works:**
- Reverse-engineer Figma's .fig file format
- Generate .fig files directly from wiremd AST

**Technical Findings:**
- .fig format is proprietary and undocumented
- Uses Protocol Buffers-like format (Kiwi schema)
- Format is "unstable internal implementation detail"
- No official specification exists
- Community parsers exist but may break with updates

**Advantages:**
- ✅ Theoretically allows CLI-only workflow
- ✅ No Figma app required during generation

**Disadvantages:**
- ❌ No official specification
- ❌ High risk of breaking with Figma updates
- ❌ Reverse-engineering violates ToS potentially
- ❌ Extremely complex implementation
- ❌ No support or documentation
- ❌ Legal/licensing concerns

**Recommendation:** ⛔ **Do not pursue this approach**

**Implementation Effort:** Very High (8+ weeks) + ongoing maintenance burden

---

### Option 4: Figma REST API (❌ NOT POSSIBLE)

**Limitation:** Figma's REST API is **read-only** as of 2025.

The REST API can:
- ✅ Read files, extract design data
- ✅ Get images, export assets
- ✅ Access comments, version history

The REST API cannot:
- ❌ Create new files
- ❌ Add frames, components, or shapes
- ❌ Modify existing designs

**Conclusion:** Cannot use REST API for generating Figma designs.

---

## Recommended Implementation Path

### Phase 1: HTML Intermediary (Quick Win) ⚡
**Timeline:** 1-2 days

1. Document the workflow in README:
   ```bash
   # Generate HTML
   mdmock wireframe.md -o output.html --serve 3000

   # Then use html.to.design Chrome extension to import to Figma
   ```

2. Add `--serve` flag to CLI if not already present
3. Test with multiple HTML-to-Figma tools
4. Create tutorial/guide with screenshots

**Deliverables:**
- Updated documentation
- Example workflow guide
- Optional: CLI enhancements for easier serving

---

### Phase 2: Figma Plugin (Full Solution) 🎯
**Timeline:** 2-4 weeks

#### Architecture

```
┌─────────────┐
│  wiremd CLI │
│             │
│  Markdown   │
│     ↓       │
│  Parser     │
│     ↓       │
│   AST       │
└──────┬──────┘
       │
       │ JSON Export
       ↓
┌─────────────────────────┐
│  Figma Plugin           │
│                         │
│  Input: wiremd JSON     │
│     ↓                   │
│  AST Traverser          │
│     ↓                   │
│  Node Generator         │
│     ↓                   │
│  Figma Nodes Created    │
└─────────────────────────┘
```

#### Plugin Structure

```
wiremd-figma-plugin/
├── manifest.json          # Figma plugin configuration
├── code.ts                # Main plugin logic (runs in sandbox)
├── ui.html                # Plugin UI (optional)
├── ui.ts                  # UI logic (optional)
├── lib/
│   ├── ast-to-figma.ts   # AST → Figma node conversion
│   ├── layout-engine.ts  # Auto-layout calculations
│   ├── style-mapper.ts   # wiremd styles → Figma styles
│   └── types.ts          # Shared types
└── package.json
```

#### Core Implementation

**1. AST to Figma Converter:**

```typescript
// ast-to-figma.ts
import type { WiremdNode, DocumentNode } from 'wiremd';

export class WiremdToFigmaConverter {
  async convert(ast: DocumentNode): Promise<void> {
    const page = figma.createPage();
    page.name = ast.meta.title || 'wiremd Import';

    for (const node of ast.children) {
      const figmaNode = await this.convertNode(node);
      if (figmaNode) {
        page.appendChild(figmaNode);
      }
    }

    figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView([page]);
  }

  private async convertNode(node: WiremdNode): Promise<SceneNode | null> {
    switch (node.type) {
      case 'button':
        return this.createButton(node);
      case 'input':
        return this.createInput(node);
      case 'container':
        return this.createContainer(node);
      case 'grid':
        return this.createGrid(node);
      case 'nav':
        return this.createNav(node);
      case 'heading':
        return this.createHeading(node);
      // ... more cases
      default:
        console.warn(`Unknown node type: ${node.type}`);
        return null;
    }
  }

  private async createButton(node: Extract<WiremdNode, { type: 'button' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = "Button";
    frame.layoutMode = "HORIZONTAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.paddingLeft = 24;
    frame.paddingRight = 24;
    frame.paddingTop = 12;
    frame.paddingBottom = 12;
    frame.itemSpacing = 8;

    // Style based on variant
    if (node.props.variant === 'primary') {
      frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0.5, b: 1 } }];
    } else {
      frame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
    }

    frame.cornerRadius = 8;

    // Add text
    const text = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    text.characters = node.content || node.children?.[0]?.content || "Button";
    text.fontSize = 16;

    if (node.props.variant === 'primary') {
      text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    }

    frame.appendChild(text);

    return frame;
  }

  private async createContainer(node: Extract<WiremdNode, { type: 'container' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = `Container (${node.containerType})`;
    frame.layoutMode = "VERTICAL";
    frame.itemSpacing = 16;

    // Apply container-specific styling
    switch (node.containerType) {
      case 'hero':
        frame.paddingLeft = 64;
        frame.paddingRight = 64;
        frame.paddingTop = 80;
        frame.paddingBottom = 80;
        frame.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
        break;
      case 'card':
        frame.cornerRadius = 12;
        frame.paddingLeft = 24;
        frame.paddingRight = 24;
        frame.paddingTop = 24;
        frame.paddingBottom = 24;
        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        frame.effects = [{
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: 2 },
          radius: 8,
          visible: true,
          blendMode: 'NORMAL'
        }];
        break;
    }

    // Recursively add children
    for (const child of node.children) {
      const childNode = await this.convertNode(child);
      if (childNode) {
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  private async createGrid(node: Extract<WiremdNode, { type: 'grid' }>): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = `Grid (${node.columns} columns)`;
    frame.layoutMode = "HORIZONTAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = 16;

    // Create grid columns
    const columns = node.columns || 3;
    const childrenPerColumn = Math.ceil(node.children.length / columns);

    for (let i = 0; i < columns; i++) {
      const column = figma.createFrame();
      column.layoutMode = "VERTICAL";
      column.itemSpacing = 16;
      column.primaryAxisSizingMode = "AUTO";

      const startIdx = i * childrenPerColumn;
      const endIdx = Math.min(startIdx + childrenPerColumn, node.children.length);

      for (let j = startIdx; j < endIdx; j++) {
        const childNode = await this.convertNode(node.children[j]);
        if (childNode) {
          column.appendChild(childNode);
        }
      }

      frame.appendChild(column);
    }

    return frame;
  }

  private async createHeading(node: Extract<WiremdNode, { type: 'heading' }>): Promise<TextNode> {
    const text = figma.createText();

    // Font size based on heading level
    const fontSizes = [48, 36, 28, 24, 20, 18];
    const fontSize = fontSizes[node.level - 1] || 16;

    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    text.characters = node.content || node.children?.[0]?.content || "";
    text.fontSize = fontSize;
    text.fontName = { family: "Inter", style: "Bold" };

    return text;
  }
}
```

**2. Plugin Entry Point:**

```typescript
// code.ts
import { WiremdToFigmaConverter } from './lib/ast-to-figma';

// Show UI
figma.showUI(__html__, { width: 400, height: 600 });

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-wiremd') {
    try {
      const ast = JSON.parse(msg.json);
      const converter = new WiremdToFigmaConverter();
      await converter.convert(ast);

      figma.notify('✅ wiremd import complete!');
      figma.ui.postMessage({ type: 'import-success' });
    } catch (error) {
      figma.notify('❌ Import failed: ' + error.message);
      figma.ui.postMessage({ type: 'import-error', error: error.message });
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
```

**3. Plugin UI (Optional):**

```html
<!-- ui.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; padding: 16px; }
    textarea { width: 100%; height: 400px; font-family: monospace; }
    button { margin-top: 16px; padding: 8px 16px; }
  </style>
</head>
<body>
  <h2>Import wiremd</h2>
  <p>Paste wiremd JSON AST below:</p>
  <textarea id="json-input" placeholder='{"type": "document", ...}'></textarea>
  <button id="import-btn">Import to Figma</button>
  <button id="cancel-btn">Cancel</button>

  <script>
    document.getElementById('import-btn').onclick = () => {
      const json = document.getElementById('json-input').value;
      parent.postMessage({ pluginMessage: { type: 'import-wiremd', json } }, '*');
    };

    document.getElementById('cancel-btn').onclick = () => {
      parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    };
  </script>
</body>
</html>
```

**4. Plugin Manifest:**

```json
{
  "name": "wiremd Importer",
  "id": "wiremd-figma-plugin",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

#### Development Steps

1. **Setup** (Day 1)
   - Initialize Figma plugin project
   - Set up TypeScript + build pipeline
   - Create basic manifest.json

2. **Core Converter** (Days 2-5)
   - Implement AST → Figma node mapping
   - Handle layout (containers, grids)
   - Text rendering with proper fonts
   - Form elements (buttons, inputs)

3. **Styling** (Days 6-8)
   - Map wiremd styles to Figma fills/strokes
   - Support sketch/clean/wireframe themes
   - Component variants for button states

4. **Advanced Features** (Days 9-12)
   - Auto-layout optimization
   - Component creation (reusable elements)
   - Style generation (Figma local styles)
   - Error handling and validation

5. **Testing & Polish** (Days 13-15)
   - Test with example wiremd files
   - UI improvements
   - Documentation
   - Publishing to Figma Community

#### Integration with wiremd CLI

```bash
# Generate JSON for Figma import
mdmock wireframe.md --format json -o wireframe.json

# User then:
# 1. Opens Figma
# 2. Runs "wiremd Importer" plugin
# 3. Pastes JSON or uploads wireframe.json
# 4. Plugin generates design
```

**Optional enhancement:**
Add direct plugin integration:
```bash
# Future: direct integration (would require plugin to accept URLs)
mdmock wireframe.md --export figma --open
```

---

### Phase 3: Enhanced Features (Future)

**Component Library Generation:**
- Create Figma component set from wiremd components
- Variants for different states (hover, disabled, etc.)
- Design system export

**Bi-directional Sync:**
- Export Figma designs back to wiremd
- Keep designs in sync with markdown source
- Version control integration

**Advanced Layouts:**
- Better responsive design handling
- Breakpoint support
- Constraints and resizing rules

**Figma API Integration:**
- If Figma releases write-enabled REST API
- Headless generation becomes possible

---

## Comparison Matrix

| Approach | Effort | Quality | Maintenance | User Experience | Recommended |
|----------|--------|---------|-------------|-----------------|-------------|
| **Figma Plugin** | Medium | ⭐⭐⭐⭐⭐ | Low | Good | ✅ YES |
| **HTML Intermediary** | Low | ⭐⭐⭐ | None | Fair | ✅ YES (Quick Win) |
| **Direct .fig** | Very High | ⭐⭐⭐⭐ | Very High | Good | ❌ NO |
| **REST API** | N/A | N/A | N/A | N/A | ❌ Not Possible |

---

## Resources

### Figma Plugin Development
- [Official Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Plugin Quickstart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/)
- [TypeScript Documentation](https://www.figma.com/plugin-docs/typescript/)
- [Plugin Samples GitHub](https://github.com/figma/plugin-samples)
- [Node Types Reference](https://www.figma.com/plugin-docs/api/nodes/)

### HTML-to-Figma Tools
- [html.to.design](https://html.to.design/)
- [Builder.io Plugin](https://www.builder.io/c/docs/chrome-extension)
- [Codia HTML to Design](https://codia.ai/html-to-figma-design)

### Community Projects
- [BuilderIO/figma-html (deprecated)](https://github.com/BuilderIO/figma-html)
- [Figma Plugin Samples](https://github.com/figma/plugin-samples)

---

## Conclusion

**wiremd → Figma export is definitely feasible and recommended.**

**Two-phase approach:**

1. **Short-term (Phase 1):** Document HTML intermediary workflow
   - Users can immediately use existing tools
   - Low effort, immediate value
   - Good enough for many use cases

2. **Medium-term (Phase 2):** Build official Figma plugin
   - Best quality and user experience
   - Full control over output
   - Positions wiremd as professional tool
   - 2-4 week development timeline

Both approaches can coexist. The HTML method provides immediate value while the plugin is being developed, and after plugin launch, users can choose their preferred workflow based on their needs.

**Next Steps:**
1. ✅ Review this investigation report
2. Decide on implementation priority (Phase 1, Phase 2, or both)
3. Create GitHub issues for tracking
4. Assign development resources
5. Start implementation

---

**Questions or want to proceed?** Let me know which phase to start with!
