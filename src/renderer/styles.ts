/**
 * CSS Styles for wiremd renderer
 * Provides different visual styles: sketch, clean, wireframe, none
 */

/**
 * Get CSS for the specified style
 */
export function getStyleCSS(style: string, prefix: string): string {
  switch (style) {
    case 'sketch':
      return getSketchStyle(prefix);
    case 'clean':
      return getCleanStyle(prefix);
    case 'wireframe':
      return getWireframeStyle(prefix);
    case 'none':
      return getNoneStyle(prefix);
    default:
      return getSketchStyle(prefix);
  }
}

/**
 * Sketch Style - Balsamiq-inspired hand-drawn look
 */
function getSketchStyle(prefix: string): string {
  return `
/* wiremd Sketch Style - Balsamiq-inspired hand-drawn mockups */
* {
  box-sizing: border-box;
}

body.${prefix}root {
  font-family: 'Comic Sans MS', 'Marker Felt', 'Chalkboard', cursive, sans-serif;
  background: #f5f5dc;
  color: #333;
  padding: 20px;
  margin: 0;
  line-height: 1.6;
}

/* Headings */
.${prefix}h1, .${prefix}h2, .${prefix}h3, .${prefix}h4, .${prefix}h5, .${prefix}h6 {
  font-weight: bold;
  margin: 1em 0 0.5em;
  line-height: 1.3;
}

.${prefix}h1 { font-size: 2em; text-decoration: underline; }
.${prefix}h2 { font-size: 1.75em; }
.${prefix}h3 { font-size: 1.5em; }
.${prefix}h4 { font-size: 1.25em; }
.${prefix}h5 { font-size: 1.1em; }
.${prefix}h6 { font-size: 1em; }

/* Paragraph */
.${prefix}paragraph {
  margin: 0.5em 0;
}

/* Buttons */
.${prefix}button {
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  transform: rotate(-0.5deg);
  transition: all 0.1s;
}

.${prefix}button:hover {
  transform: rotate(-0.5deg) translateY(-2px);
  box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
}

.${prefix}button-primary, .${prefix}button.${prefix}primary {
  background: #87CEEB;
  border-color: #4682B4;
}

.${prefix}button-secondary, .${prefix}button.${prefix}secondary {
  background: #DDD;
  border-color: #999;
}

.${prefix}button-danger, .${prefix}button.${prefix}danger {
  background: #FFB6C1;
  border-color: #DC143C;
}

.${prefix}button[disabled], .${prefix}button.${prefix}state-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.${prefix}button.${prefix}loading::after {
  content: '...';
  animation: loading 1s infinite;
}

/* Inputs */
.${prefix}input, .${prefix}textarea, .${prefix}select {
  display: block;
  width: 100%;
  max-width: 400px;
  padding: 8px 12px;
  margin: 4px 0;
  font-family: inherit;
  font-size: 14px;
  background: #fff;
  border: 2px solid #666;
  border-radius: 4px;
  transform: rotate(0.3deg);
}

.${prefix}input:focus, .${prefix}textarea:focus, .${prefix}select:focus {
  outline: 2px solid #4682B4;
  outline-offset: 2px;
}

.${prefix}textarea {
  resize: vertical;
  min-height: 80px;
}

/* Checkboxes and Radios */
.${prefix}checkbox, .${prefix}radio {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  cursor: pointer;
  user-select: none;
}

.${prefix}checkbox input[type="checkbox"],
.${prefix}radio input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Icons */
.${prefix}icon {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin: 0 4px;
  vertical-align: middle;
}

.${prefix}icon::before {
  content: '◉';
  font-size: 1.2em;
}

.${prefix}icon[data-icon="house"]::before { content: '🏠'; }
.${prefix}icon[data-icon="user"]::before { content: '👤'; }
.${prefix}icon[data-icon="gear"]::before { content: '⚙️'; }
.${prefix}icon[data-icon="logo"]::before { content: '⭐'; }
.${prefix}icon[data-icon="rocket"]::before { content: '🚀'; }
.${prefix}icon[data-icon="shield"]::before { content: '🛡️'; }
.${prefix}icon[data-icon="zap"]::before { content: '⚡'; }
.${prefix}icon[data-icon="magnifying-glass"]::before { content: '🔍'; }
.${prefix}icon[data-icon="bell"]::before { content: '🔔'; }
.${prefix}icon[data-icon="inbox"]::before { content: '📥'; }

/* Containers */
.${prefix}container-hero, .${prefix}container-card, .${prefix}container-modal {
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
  transform: rotate(-0.3deg);
}

.${prefix}container-hero {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFE6CC 100%);
  text-align: center;
  padding: 48px 24px;
}

.${prefix}container-card {
  max-width: 400px;
}

.${prefix}container-modal {
  position: relative;
  max-width: 500px;
  margin: 32px auto;
  border-width: 4px;
}

/* Navigation */
.${prefix}nav {
  background: #87CEEB;
  border: 3px solid #4682B4;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
}

.${prefix}nav-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.${prefix}brand {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: auto;
}

.${prefix}nav-item {
  color: #000;
  text-decoration: none;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}

.${prefix}nav-item:hover {
  background: rgba(255,255,255,0.3);
}

.${prefix}nav .${prefix}button {
  margin: 0;
}

/* Grid */
.${prefix}grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
  gap: 24px;
  margin: 24px 0;
}

.${prefix}grid-2 { grid-template-columns: repeat(2, 1fr); }
.${prefix}grid-3 { grid-template-columns: repeat(3, 1fr); }
.${prefix}grid-4 { grid-template-columns: repeat(4, 1fr); }

.${prefix}grid-item {
  background: #fff;
  border: 2px solid #666;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
  transform: rotate(0.5deg);
}

.${prefix}grid-item:nth-child(even) {
  transform: rotate(-0.5deg);
}

/* Lists */
.${prefix}list {
  margin: 12px 0;
  padding-left: 24px;
}

.${prefix}list-item {
  margin: 4px 0;
}

/* Blockquote */
.${prefix}blockquote {
  border-left: 4px solid #666;
  padding-left: 16px;
  margin: 16px 0;
  font-style: italic;
  color: #555;
}

/* Code */
.${prefix}code-inline {
  background: #FFF3CD;
  border: 1px solid #FFC107;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.${prefix}code-block {
  background: #FFF3CD;
  border: 2px solid #FFC107;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
  overflow-x: auto;
}

.${prefix}code-block code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Separator */
.${prefix}separator {
  border: none;
  border-top: 3px dashed #666;
  margin: 24px 0;
}

/* Table */
.${prefix}table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 3px solid #000;
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
}

.${prefix}table th, .${prefix}table td {
  border: 2px solid #666;
  padding: 8px 12px;
  text-align: left;
}

.${prefix}table th {
  background: #DDD;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .${prefix}grid {
    grid-template-columns: 1fr !important;
  }

  .${prefix}nav-content {
    flex-direction: column;
    align-items: stretch;
  }

  .${prefix}brand {
    margin-right: 0;
  }
}

@keyframes loading {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;
}

/**
 * Clean Style - Minimal, modern wireframe
 */
function getCleanStyle(prefix: string): string {
  return `
/* wiremd Clean Style - Minimal modern wireframes */
* {
  box-sizing: border-box;
}

body.${prefix}root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #ffffff;
  color: #1a1a1a;
  padding: 40px;
  margin: 0;
  line-height: 1.6;
}

/* Headings */
.${prefix}h1, .${prefix}h2, .${prefix}h3, .${prefix}h4, .${prefix}h5, .${prefix}h6 {
  font-weight: 600;
  margin: 1.5em 0 0.75em;
  color: #000;
  letter-spacing: -0.02em;
}

.${prefix}h1 { font-size: 2.5em; border-bottom: 2px solid #e0e0e0; padding-bottom: 0.3em; }
.${prefix}h2 { font-size: 2em; }
.${prefix}h3 { font-size: 1.5em; }
.${prefix}h4 { font-size: 1.25em; }
.${prefix}h5 { font-size: 1.1em; }
.${prefix}h6 { font-size: 1em; }

/* Paragraph */
.${prefix}paragraph {
  margin: 0.75em 0;
  color: #4a4a4a;
}

/* Buttons */
.${prefix}button {
  display: inline-block;
  padding: 10px 20px;
  margin: 6px;
  background: #f5f5f5;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.${prefix}button:hover {
  background: #e8e8e8;
  border-color: #b0b0b0;
}

.${prefix}button-primary, .${prefix}button.${prefix}primary {
  background: #0066cc;
  color: #fff;
  border-color: #0052a3;
}

.${prefix}button-primary:hover, .${prefix}button.${prefix}primary:hover {
  background: #0052a3;
}

.${prefix}button-secondary, .${prefix}button.${prefix}secondary {
  background: #fff;
  border: 2px solid #d0d0d0;
}

.${prefix}button-danger, .${prefix}button.${prefix}danger {
  background: #dc3545;
  color: #fff;
  border-color: #c82333;
}

.${prefix}button[disabled], .${prefix}button.${prefix}state-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Inputs */
.${prefix}input, .${prefix}textarea, .${prefix}select {
  display: block;
  width: 100%;
  max-width: 400px;
  padding: 10px 12px;
  margin: 6px 0;
  font-family: inherit;
  font-size: 14px;
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.${prefix}input:focus, .${prefix}textarea:focus, .${prefix}select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.${prefix}textarea {
  resize: vertical;
  min-height: 100px;
}

/* Checkboxes and Radios */
.${prefix}checkbox, .${prefix}radio {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  cursor: pointer;
}

.${prefix}checkbox input[type="checkbox"],
.${prefix}radio input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Icons */
.${prefix}icon {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin: 0 4px;
  vertical-align: middle;
  color: #666;
}

.${prefix}icon::before {
  content: '●';
  font-size: 1em;
}

.${prefix}icon[data-icon="house"]::before { content: '⌂'; }
.${prefix}icon[data-icon="user"]::before { content: '👤'; }
.${prefix}icon[data-icon="gear"]::before { content: '⚙'; }
.${prefix}icon[data-icon="logo"]::before { content: '★'; }
.${prefix}icon[data-icon="rocket"]::before { content: '↗'; }
.${prefix}icon[data-icon="shield"]::before { content: '⛨'; }
.${prefix}icon[data-icon="zap"]::before { content: '⚡'; }

/* Containers */
.${prefix}container-hero, .${prefix}container-card, .${prefix}container-modal {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 32px;
  margin: 24px 0;
}

.${prefix}container-hero {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  text-align: center;
  padding: 60px 32px;
}

.${prefix}container-card {
  max-width: 400px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.${prefix}container-modal {
  max-width: 500px;
  margin: 40px auto;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

/* Navigation */
.${prefix}nav {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px 24px;
  margin: 24px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.${prefix}nav-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.${prefix}brand {
  font-weight: 600;
  font-size: 1.25em;
  margin-right: auto;
}

.${prefix}nav-item {
  color: #4a4a4a;
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.${prefix}nav-item:hover {
  background: #f5f5f5;
}

/* Grid */
.${prefix}grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
  gap: 24px;
  margin: 32px 0;
}

.${prefix}grid-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  transition: box-shadow 0.2s;
}

.${prefix}grid-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Lists */
.${prefix}list {
  margin: 16px 0;
  padding-left: 28px;
}

.${prefix}list-item {
  margin: 6px 0;
}

/* Blockquote */
.${prefix}blockquote {
  border-left: 3px solid #0066cc;
  padding-left: 20px;
  margin: 20px 0;
  color: #4a4a4a;
}

/* Code */
.${prefix}code-inline {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.9em;
  color: #d63384;
}

.${prefix}code-block {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

.${prefix}code-block code {
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.9em;
  color: #1a1a1a;
}

/* Separator */
.${prefix}separator {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 32px 0;
}

/* Responsive */
@media (max-width: 768px) {
  body.${prefix}root {
    padding: 20px;
  }

  .${prefix}grid {
    grid-template-columns: 1fr !important;
  }

  .${prefix}nav-content {
    flex-direction: column;
    align-items: stretch;
  }
}
`;
}

/**
 * Wireframe Style - Traditional grayscale wireframe
 */
function getWireframeStyle(prefix: string): string {
  return `
/* wiremd Wireframe Style - Traditional grayscale wireframes */
* {
  box-sizing: border-box;
}

body.${prefix}root {
  font-family: Arial, Helvetica, sans-serif;
  background: #f0f0f0;
  color: #000;
  padding: 30px;
  margin: 0;
  line-height: 1.5;
}

/* Headings */
.${prefix}h1, .${prefix}h2, .${prefix}h3, .${prefix}h4, .${prefix}h5, .${prefix}h6 {
  font-weight: bold;
  margin: 1.2em 0 0.6em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.${prefix}h1 { font-size: 2em; }
.${prefix}h2 { font-size: 1.75em; }
.${prefix}h3 { font-size: 1.5em; }
.${prefix}h4 { font-size: 1.25em; }
.${prefix}h5 { font-size: 1.1em; }
.${prefix}h6 { font-size: 1em; }

/* Paragraph */
.${prefix}paragraph {
  margin: 0.6em 0;
}

/* Buttons */
.${prefix}button {
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  background: repeating-linear-gradient(
    45deg,
    #ddd,
    #ddd 10px,
    #ccc 10px,
    #ccc 20px
  );
  border: 2px solid #000;
  border-radius: 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
}

.${prefix}button-primary, .${prefix}button.${prefix}primary {
  background: repeating-linear-gradient(
    45deg,
    #888,
    #888 10px,
    #777 10px,
    #777 20px
  );
  color: #fff;
}

.${prefix}button-secondary, .${prefix}button.${prefix}secondary {
  background: #fff;
}

.${prefix}button-danger, .${prefix}button.${prefix}danger {
  background: repeating-linear-gradient(
    45deg,
    #666,
    #666 10px,
    #555 10px,
    #555 20px
  );
  color: #fff;
}

.${prefix}button[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Inputs */
.${prefix}input, .${prefix}textarea, .${prefix}select {
  display: block;
  width: 100%;
  max-width: 400px;
  padding: 6px 10px;
  margin: 4px 0;
  font-family: inherit;
  font-size: 13px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 0;
}

.${prefix}input::placeholder, .${prefix}textarea::placeholder {
  color: #999;
  font-style: italic;
}

.${prefix}textarea {
  resize: vertical;
  min-height: 80px;
}

/* Checkboxes and Radios */
.${prefix}checkbox, .${prefix}radio {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  cursor: pointer;
}

.${prefix}checkbox input[type="checkbox"],
.${prefix}radio input[type="radio"] {
  width: 18px;
  height: 18px;
  border: 2px solid #000;
  cursor: pointer;
}

/* Icons */
.${prefix}icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 4px;
  vertical-align: middle;
  background: #666;
  border: 1px solid #000;
  border-radius: 0;
}

.${prefix}icon[data-icon="house"]::before { content: '⌂'; }
.${prefix}icon[data-icon="user"]::before { content: '●'; }
.${prefix}icon[data-icon="gear"]::before { content: '⚙'; }

/* Containers */
.${prefix}container-hero, .${prefix}container-card, .${prefix}container-modal {
  background: #fff;
  border: 3px solid #000;
  padding: 24px;
  margin: 16px 0;
}

.${prefix}container-hero {
  background: repeating-linear-gradient(
    0deg,
    #fafafa,
    #fafafa 2px,
    #fff 2px,
    #fff 4px
  );
  text-align: center;
  padding: 48px 24px;
}

.${prefix}container-card {
  max-width: 400px;
}

.${prefix}container-modal {
  max-width: 500px;
  margin: 32px auto;
  border-width: 4px;
}

/* Navigation */
.${prefix}nav {
  background: repeating-linear-gradient(
    90deg,
    #e0e0e0,
    #e0e0e0 2px,
    #d0d0d0 2px,
    #d0d0d0 4px
  );
  border: 2px solid #000;
  padding: 12px 16px;
  margin: 16px 0;
}

.${prefix}nav-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.${prefix}brand {
  font-weight: bold;
  font-size: 1.1em;
  text-transform: uppercase;
  margin-right: auto;
}

.${prefix}nav-item {
  color: #000;
  text-decoration: underline;
  font-weight: normal;
}

/* Grid */
.${prefix}grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
  gap: 20px;
  margin: 20px 0;
}

.${prefix}grid-item {
  background: #fff;
  border: 2px solid #000;
  padding: 16px;
}

/* Lists */
.${prefix}list {
  margin: 12px 0;
  padding-left: 24px;
}

.${prefix}list-item {
  margin: 4px 0;
}

/* Blockquote */
.${prefix}blockquote {
  border-left: 4px solid #000;
  padding-left: 16px;
  margin: 16px 0;
  background: #f5f5f5;
  padding: 12px 16px;
}

/* Code */
.${prefix}code-inline {
  background: #e0e0e0;
  border: 1px solid #000;
  padding: 2px 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.${prefix}code-block {
  background: #f0f0f0;
  border: 2px solid #000;
  padding: 12px;
  margin: 12px 0;
  overflow-x: auto;
}

.${prefix}code-block code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Separator */
.${prefix}separator {
  border: none;
  border-top: 2px solid #000;
  margin: 24px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .${prefix}grid {
    grid-template-columns: 1fr !important;
  }
}
`;
}

/**
 * None Style - Minimal semantic HTML only
 */
function getNoneStyle(prefix: string): string {
  return `
/* wiremd None Style - Minimal semantic styling */
* {
  box-sizing: border-box;
}

body.${prefix}root {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

.${prefix}button {
  padding: 8px 16px;
  margin: 4px;
}

.${prefix}input, .${prefix}textarea, .${prefix}select {
  display: block;
  width: 100%;
  max-width: 400px;
  padding: 8px;
  margin: 4px 0;
}

.${prefix}grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
  gap: 20px;
  margin: 20px 0;
}

.${prefix}nav-content {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.${prefix}brand {
  margin-right: auto;
  font-weight: bold;
}

@media (max-width: 768px) {
  .${prefix}grid {
    grid-template-columns: 1fr !important;
  }
}
`;
}
