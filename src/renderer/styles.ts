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
    case 'tailwind':
      return getTailwindStyle(prefix);
    case 'material':
      return getMaterialStyle(prefix);
    case 'brutal':
      return getBrutalStyle(prefix);
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

.${prefix}input[disabled], .${prefix}input.${prefix}state-disabled,
.${prefix}textarea[disabled], .${prefix}textarea.${prefix}state-disabled,
.${prefix}select[disabled], .${prefix}select.${prefix}state-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
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
  font-size: 1.2em;
  line-height: 1;
  vertical-align: middle;
  margin: 0 0.2em;
}

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

/* Radio Groups */
.${prefix}radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0;
}

.${prefix}radio-group-inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
}

.${prefix}radio-group-inline .${prefix}radio {
  margin: 0;
}

/* Icons */
.${prefix}icon {
  display: inline-block;
  font-size: 1.2em;
  line-height: 1;
  vertical-align: middle;
  margin: 0 0.2em;
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

/* Table cell alignment - more specific to override th/td defaults */
.${prefix}table .${prefix}align-left {
  text-align: left !important;
}

.${prefix}table .${prefix}align-center {
  text-align: center !important;
}

.${prefix}table .${prefix}align-right {
  text-align: right !important;
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

.${prefix}input[disabled], .${prefix}input.${prefix}state-disabled,
.${prefix}textarea[disabled], .${prefix}textarea.${prefix}state-disabled,
.${prefix}select[disabled], .${prefix}select.${prefix}state-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
  border-color: #e0e0e0;
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

/* Radio Groups */
.${prefix}radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0;
}

.${prefix}radio-group-inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.${prefix}radio-group-inline .${prefix}radio {
  margin: 0;
}

/* Icons */
.${prefix}icon {
  display: inline-block;
  font-size: 1.1em;
  line-height: 1;
  vertical-align: middle;
  margin: 0 0.25em;
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

.${prefix}input[disabled], .${prefix}input.${prefix}state-disabled,
.${prefix}textarea[disabled], .${prefix}textarea.${prefix}state-disabled,
.${prefix}select[disabled], .${prefix}select.${prefix}state-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f0f0f0;
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
  font-size: 1em;
  line-height: 1;
  margin: 0 4px;
  vertical-align: middle;
}

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

/**
 * Tailwind Style - Modern utility-first inspired design
 * Clean, minimal with purple/indigo accent colors
 */
function getTailwindStyle(prefix: string): string {
  return `
/* Tailwind-Inspired Style */
body {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #f9fafb;
  color: #111827;
  line-height: 1.5;
  margin: 0;
  padding: 20px;
}

/* Typography */
.${prefix}h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
}

.${prefix}h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1.5rem 0 1rem 0;
  letter-spacing: -0.025em;
}

.${prefix}h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 1.25rem 0 0.75rem 0;
}

.${prefix}h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4b5563;
  margin: 1rem 0 0.5rem 0;
}

.${prefix}paragraph {
  color: #6b7280;
  margin: 0.75rem 0;
  font-size: 1rem;
}

/* Buttons */
.${prefix}button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  background: #e5e7eb;
  color: #374151;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.${prefix}button:hover {
  background: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.${prefix}button-primary, .${prefix}button.${prefix}button-primary {
  background: #6366f1;
  color: white;
}

.${prefix}button-primary:hover, .${prefix}button.${prefix}button-primary:hover {
  background: #4f46e5;
}

.${prefix}button:disabled, .${prefix}button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Button States */
.${prefix}state-loading {
  background: #e0e7ff !important;
  color: #6366f1 !important;
  position: relative;
  padding-left: 2.5rem;
}

.${prefix}state-loading::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid #6366f1;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.${prefix}state-error {
  background: #fef2f2 !important;
  color: #ef4444 !important;
  border: 1px solid #fca5a5;
}

.${prefix}state-success {
  background: #f0fdf4 !important;
  color: #22c55e !important;
  border: 1px solid #86efac;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Forms */
.${prefix}input, .${prefix}textarea, .${prefix}select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.15s ease;
  color: #111827;
}

.${prefix}input:focus, .${prefix}textarea:focus, .${prefix}select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.${prefix}input::placeholder, .${prefix}textarea::placeholder {
  color: #9ca3af;
}

.${prefix}input[disabled], .${prefix}input.${prefix}state-disabled,
.${prefix}textarea[disabled], .${prefix}textarea.${prefix}state-disabled,
.${prefix}select[disabled], .${prefix}select.${prefix}state-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f9fafb;
  border-color: #e5e7eb;
}

.${prefix}textarea {
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
}

.${prefix}select {
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5rem;
  padding-right: 2.5rem;
}

/* Checkboxes and Radios */
.${prefix}checkbox, .${prefix}radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  cursor: pointer;
}

.${prefix}checkbox input[type="checkbox"],
.${prefix}radio input[type="radio"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #6366f1;
}

/* Cards and Containers */
.${prefix}container-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin: 1rem 0;
}

.${prefix}container-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  margin: 2rem 0;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.${prefix}container-hero .${prefix}h1,
.${prefix}container-hero .${prefix}h2,
.${prefix}container-hero .${prefix}h3,
.${prefix}container-hero .${prefix}paragraph {
  color: white;
}

.${prefix}container-modal {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  position: relative;
}

.${prefix}container-footer {
  background: #1f2937;
  color: #e5e7eb;
  padding: 2rem;
  margin-top: 3rem;
  border-radius: 0.75rem;
}

.${prefix}container-footer .${prefix}paragraph,
.${prefix}container-footer .${prefix}nav-item {
  color: #e5e7eb;
}

.${prefix}container-section {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.${prefix}container-section:last-child {
  border-bottom: none;
}

/* Alerts */
.${prefix}container-alert {
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  border-left: 4px solid;
}

.${prefix}container-alert.${prefix}warning {
  background: #fef3c7;
  border-left-color: #f59e0b;
  color: #92400e;
}

.${prefix}container-alert.${prefix}state-error {
  background: #fee2e2;
  border-left-color: #ef4444;
  color: #991b1b;
}

.${prefix}container-alert.${prefix}state-success {
  background: #d1fae5;
  border-left-color: #10b981;
  color: #065f46;
}

/* Navigation */
.${prefix}nav {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
}

.${prefix}nav-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.${prefix}nav-item {
  color: #4b5563;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.${prefix}nav-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.${prefix}brand {
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Lists */
.${prefix}list {
  margin: 1rem 0;
  padding: 0;
  list-style: none;
}

.${prefix}list-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
}

.${prefix}list-item:last-child {
  border-bottom: none;
}

/* Grid */
.${prefix}grid {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
}

.${prefix}grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.${prefix}grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.${prefix}grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Tables */
.${prefix}table {
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin: 1rem 0;
  border-collapse: separate;
  border-spacing: 0;
}

.${prefix}table th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.${prefix}table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #4b5563;
}

.${prefix}table tr:last-child td {
  border-bottom: none;
}

/* Table cell alignment - more specific to override th/td defaults */
.${prefix}table .${prefix}align-left {
  text-align: left !important;
}

.${prefix}table .${prefix}align-center {
  text-align: center !important;
}

.${prefix}table .${prefix}align-right {
  text-align: right !important;
}

/* Icons */
.${prefix}icon {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  vertical-align: middle;
}


/* Utility classes */
.${prefix}separator {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2rem 0;
}

.${prefix}image {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.${prefix}code {
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace;
  font-size: 0.875rem;
  color: #6366f1;
}

.${prefix}blockquote {
  border-left: 4px solid #6366f1;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #4b5563;
  font-style: italic;
}

/* Button group */
.${prefix}container-button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 1rem 0;
}

/* Form group */
.${prefix}container-form-group {
  margin: 1rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .${prefix}grid-2,
  .${prefix}grid-3,
  .${prefix}grid-4 {
    grid-template-columns: 1fr;
  }

  .${prefix}nav-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .${prefix}brand {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
`;
}

/**
 * Material Style - Material Design inspired
 * Professional with elevation system and bold colors
 */
function getMaterialStyle(prefix: string): string {
  return `
/* Material Design Inspired Style */
body {
  font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  background: #fafafa;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.5;
  margin: 0;
  padding: 20px;
}

/* Typography - Material Design Type Scale */
.${prefix}h1 {
  font-size: 2.125rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 0 1rem 0;
  letter-spacing: 0;
}

.${prefix}h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  margin: 1.5rem 0 1rem 0;
  letter-spacing: 0.0075em;
}

.${prefix}h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  margin: 1.25rem 0 0.75rem 0;
  letter-spacing: 0.0125em;
}

.${prefix}h4 {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  margin: 1rem 0 0.5rem 0;
  letter-spacing: 0.015em;
}

.${prefix}paragraph {
  color: rgba(0, 0, 0, 0.6);
  margin: 0.75rem 0;
  font-size: 1rem;
  letter-spacing: 0.00938em;
}

/* Material Buttons */
.${prefix}button {
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
              border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  background: transparent;
  color: #6200ee;
  position: relative;
  overflow: hidden;
}

.${prefix}button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(98, 0, 238, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.${prefix}button:hover::before {
  width: 300px;
  height: 300px;
}

.${prefix}button:hover {
  background: rgba(98, 0, 238, 0.04);
}

.${prefix}button-primary, .${prefix}button.${prefix}button-primary {
  background: #6200ee;
  color: white;
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2),
              0px 2px 2px 0px rgba(0,0,0,0.14),
              0px 1px 5px 0px rgba(0,0,0,0.12);
}

.${prefix}button-primary::before {
  background: rgba(255, 255, 255, 0.2);
}

.${prefix}button-primary:hover, .${prefix}button.${prefix}button-primary:hover {
  background: #6200ee;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2),
              0px 4px 5px 0px rgba(0,0,0,0.14),
              0px 1px 10px 0px rgba(0,0,0,0.12);
}

.${prefix}button:disabled, .${prefix}button[disabled] {
  color: rgba(0, 0, 0, 0.26);
  background: rgba(0, 0, 0, 0.12);
  cursor: not-allowed;
  box-shadow: none;
}

/* Button States */
.${prefix}state-loading {
  background: #e8eaf6 !important;
  color: #6200ee !important;
  position: relative;
  padding-left: 2.5rem;
}

.${prefix}state-loading::after {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid #6200ee;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.${prefix}state-error {
  background: #b00020 !important;
  color: white !important;
}

.${prefix}state-success {
  background: #00c853 !important;
  color: white !important;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

/* Material Form Inputs */
.${prefix}input, .${prefix}textarea, .${prefix}select {
  width: 100%;
  padding: 12px;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  font-size: 1rem;
  background: transparent;
  transition: border-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  color: rgba(0, 0, 0, 0.87);
}

.${prefix}input:focus, .${prefix}textarea:focus, .${prefix}select:focus {
  outline: none;
  border-bottom: 2px solid #6200ee;
  margin-bottom: -1px;
}

.${prefix}input::placeholder, .${prefix}textarea::placeholder {
  color: rgba(0, 0, 0, 0.42);
}

.${prefix}input[disabled], .${prefix}input.${prefix}state-disabled,
.${prefix}textarea[disabled], .${prefix}textarea.${prefix}state-disabled,
.${prefix}select[disabled], .${prefix}select.${prefix}state-disabled {
  color: rgba(0, 0, 0, 0.38);
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.02);
  border-bottom-color: rgba(0, 0, 0, 0.26);
}

.${prefix}textarea {
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  padding: 12px;
}

.${prefix}textarea:focus {
  border: 2px solid #6200ee;
  margin: -1px;
}

.${prefix}select {
  cursor: pointer;
}

/* Checkboxes and Radios - Material Style */
.${prefix}checkbox, .${prefix}radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
  cursor: pointer;
}

.${prefix}checkbox input[type="checkbox"],
.${prefix}radio input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #6200ee;
}

/* Material Cards - Elevation System */
.${prefix}container-card {
  background: white;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),
              0px 1px 1px 0px rgba(0,0,0,0.14),
              0px 1px 3px 0px rgba(0,0,0,0.12);
  padding: 16px;
  margin: 16px 0;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.${prefix}container-card:hover {
  box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2),
              0px 3px 4px 0px rgba(0,0,0,0.14),
              0px 1px 8px 0px rgba(0,0,0,0.12);
}

.${prefix}container-hero {
  background: linear-gradient(135deg, #6200ee 0%, #3700b3 100%);
  color: white;
  border-radius: 4px;
  padding: 48px 24px;
  margin: 24px 0;
  text-align: center;
  box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2),
              0px 6px 10px 0px rgba(0,0,0,0.14),
              0px 1px 18px 0px rgba(0,0,0,0.12);
}

.${prefix}container-hero .${prefix}h1,
.${prefix}container-hero .${prefix}h2,
.${prefix}container-hero .${prefix}h3,
.${prefix}container-hero .${prefix}paragraph {
  color: white;
}

.${prefix}container-modal {
  background: white;
  border-radius: 4px;
  box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2),
              0px 24px 38px 3px rgba(0,0,0,0.14),
              0px 9px 46px 8px rgba(0,0,0,0.12);
  padding: 24px;
  margin: 24px auto;
  max-width: 600px;
  position: relative;
}

.${prefix}container-footer {
  background: #212121;
  color: rgba(255, 255, 255, 0.87);
  padding: 24px;
  margin-top: 48px;
  border-radius: 4px;
}

.${prefix}container-footer .${prefix}paragraph,
.${prefix}container-footer .${prefix}nav-item {
  color: rgba(255, 255, 255, 0.87);
}

.${prefix}container-section {
  padding: 24px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.${prefix}container-section:last-child {
  border-bottom: none;
}

/* Material Alerts */
.${prefix}container-alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin: 16px 0;
  display: flex;
  align-items: center;
}

.${prefix}container-alert.${prefix}warning {
  background: #fff3e0;
  color: #e65100;
}

.${prefix}container-alert.${prefix}state-error {
  background: #ffebee;
  color: #c62828;
}

.${prefix}container-alert.${prefix}state-success {
  background: #e8f5e9;
  color: #2e7d32;
}

/* Material Navigation - App Bar Style */
.${prefix}nav {
  background: #6200ee;
  color: white;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2),
              0px 4px 5px 0px rgba(0,0,0,0.14),
              0px 1px 10px 0px rgba(0,0,0,0.12);
  margin-bottom: 24px;
  border-radius: 4px;
}

.${prefix}nav-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  width: 100%;
}

.${prefix}nav-item {
  color: rgba(255, 255, 255, 0.87);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-size: 0.875rem;
  font-weight: 500;
}

.${prefix}nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.${prefix}brand {
  font-weight: 500;
  font-size: 1.25rem;
  color: white;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Material Lists */
.${prefix}list {
  margin: 16px 0;
  padding: 0;
  list-style: none;
  background: white;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),
              0px 1px 1px 0px rgba(0,0,0,0.14),
              0px 2px 1px -1px rgba(0,0,0,0.12);
}

.${prefix}list-item {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.${prefix}list-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.${prefix}list-item:last-child {
  border-bottom: none;
}

/* Material Grid */
.${prefix}grid {
  display: grid;
  gap: 16px;
  margin: 24px 0;
}

.${prefix}grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.${prefix}grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.${prefix}grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Material Tables */
.${prefix}table {
  width: 100%;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),
              0px 1px 1px 0px rgba(0,0,0,0.14),
              0px 2px 1px -1px rgba(0,0,0,0.12);
  margin: 16px 0;
}

.${prefix}table th {
  background: #fafafa;
  padding: 16px;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.${prefix}table td {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
}

.${prefix}table tr:last-child td {
  border-bottom: none;
}

.${prefix}table tr:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Table cell alignment - more specific to override th/td defaults */
.${prefix}table .${prefix}align-left {
  text-align: left !important;
}

.${prefix}table .${prefix}align-center {
  text-align: center !important;
}

.${prefix}table .${prefix}align-right {
  text-align: right !important;
}

/* Material Icons */
.${prefix}icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

/* Utility classes */
.${prefix}separator {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 24px 0;
}

.${prefix}image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),
              0px 1px 1px 0px rgba(0,0,0,0.14),
              0px 2px 1px -1px rgba(0,0,0,0.12);
}

.${prefix}code {
  background: rgba(98, 0, 238, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Roboto Mono", monospace;
  font-size: 0.875rem;
  color: #6200ee;
}

.${prefix}blockquote {
  border-left: 4px solid #6200ee;
  padding-left: 16px;
  margin: 16px 0;
  color: rgba(0, 0, 0, 0.6);
  font-style: italic;
}

/* Button group */
.${prefix}container-button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0;
}

/* Form group */
.${prefix}container-form-group {
  margin: 16px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .${prefix}grid-2,
  .${prefix}grid-3,
  .${prefix}grid-4 {
    grid-template-columns: 1fr;
  }

  .${prefix}nav-content {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    padding: 12px 0;
  }

  .${prefix}nav {
    height: auto;
  }

  .${prefix}brand {
    margin-right: 0;
    margin-bottom: 8px;
  }
}
`;
}

/**
 * Brutal Style - Neo-brutalism design
 * Bold borders, hard shadows, vibrant colors
 */
function getBrutalStyle(prefix: string): string {
  return `
/* Neo-Brutalism Style */
body {
  font-family: "Space Grotesk", "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  background: #fffcf2;
  color: #000000;
  line-height: 1.4;
  margin: 0;
  padding: 20px;
}

/* Typography - Bold and Aggressive */
.${prefix}h1 {
  font-size: 3rem;
  font-weight: 900;
  color: #000000;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-shadow: 3px 3px 0 #ffd93d;
}

.${prefix}h2 {
  font-size: 2.25rem;
  font-weight: 900;
  color: #000000;
  margin: 1.5rem 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

.${prefix}h3 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #000000;
  margin: 1.25rem 0 0.75rem 0;
  text-transform: uppercase;
}

.${prefix}h4 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #000000;
  margin: 1rem 0 0.5rem 0;
  text-transform: uppercase;
}

.${prefix}paragraph {
  color: #000000;
  margin: 0.75rem 0;
  font-size: 1rem;
  font-weight: 500;
}

/* Brutal Buttons */
.${prefix}button {
  padding: 12px 24px;
  border: 3px solid #000000;
  border-radius: 0;
  font-weight: 900;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.1s ease;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  background: #ffffff;
  color: #000000;
  box-shadow: 4px 4px 0 #000000;
  position: relative;
}

.${prefix}button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000000;
}

.${prefix}button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000000;
}

.${prefix}button-primary, .${prefix}button.${prefix}button-primary {
  background: #ffd93d;
  color: #000000;
}

.${prefix}button-primary:hover, .${prefix}button.${prefix}button-primary:hover {
  background: #ffcc00;
}

.${prefix}button:disabled, .${prefix}button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 4px 4px 0 #000000 !important;
}

/* Button States */
.${prefix}state-loading {
  background: #bcf0da !important;
  color: #000000 !important;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.${prefix}state-error {
  background: #ff6b6b !important;
  color: #000000 !important;
}

.${prefix}state-success {
  background: #6bcf7f !important;
  color: #000000 !important;
}

/* Brutal Forms */
.${prefix}input, .${prefix}textarea, .${prefix}select {
  width: 100%;
  padding: 12px;
  border: 3px solid #000000;
  border-radius: 0;
  font-size: 1rem;
  font-weight: 600;
  background: #ffffff;
  color: #000000;
  box-shadow: 4px 4px 0 #000000;
  transition: all 0.1s ease;
}

.${prefix}input:focus, .${prefix}textarea:focus, .${prefix}select:focus {
  outline: none;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000000;
  background: #ffd93d;
}

.${prefix}input::placeholder, .${prefix}textarea::placeholder {
  color: #666666;
  font-weight: 600;
}

.${prefix}input[disabled], .${prefix}input.${prefix}state-disabled,
.${prefix}textarea[disabled], .${prefix}textarea.${prefix}state-disabled,
.${prefix}select[disabled], .${prefix}select.${prefix}state-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #e0e0e0;
  box-shadow: none;
  transform: none !important;
}

.${prefix}textarea {
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
}

.${prefix}select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='square'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

/* Brutal Checkboxes and Radios */
.${prefix}checkbox, .${prefix}radio {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  cursor: pointer;
  font-weight: 600;
}

.${prefix}checkbox input[type="checkbox"],
.${prefix}radio input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 3px solid #000000;
  accent-color: #ffd93d;
}

/* Brutal Cards and Containers */
.${prefix}container-card {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 0;
  box-shadow: 8px 8px 0 #000000;
  padding: 24px;
  margin: 24px 0;
  transition: all 0.1s ease;
}

.${prefix}container-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 10px 10px 0 #000000;
}

.${prefix}container-hero {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
  color: #000000;
  border: 3px solid #000000;
  border-radius: 0;
  padding: 48px 32px;
  margin: 32px 0;
  text-align: center;
  box-shadow: 12px 12px 0 #000000;
  position: relative;
  overflow: hidden;
}

.${prefix}container-hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.05) 10px,
    rgba(0, 0, 0, 0.05) 20px
  );
  pointer-events: none;
}

.${prefix}container-hero .${prefix}h1,
.${prefix}container-hero .${prefix}h2,
.${prefix}container-hero .${prefix}h3,
.${prefix}container-hero .${prefix}paragraph {
  color: #000000;
  position: relative;
}

.${prefix}container-modal {
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 0;
  box-shadow: 12px 12px 0 #000000;
  padding: 32px;
  margin: 32px auto;
  max-width: 600px;
  position: relative;
}

.${prefix}container-footer {
  background: #000000;
  color: #ffffff;
  padding: 32px;
  margin-top: 48px;
  border: 3px solid #000000;
  box-shadow: 8px 8px 0 #ffd93d;
}

.${prefix}container-footer .${prefix}paragraph,
.${prefix}container-footer .${prefix}nav-item {
  color: #ffffff;
  font-weight: 600;
}

.${prefix}container-section {
  padding: 24px 0;
  border-bottom: 3px solid #000000;
}

.${prefix}container-section:last-child {
  border-bottom: none;
}

/* Brutal Alerts */
.${prefix}container-alert {
  padding: 16px 20px;
  border: 3px solid #000000;
  border-radius: 0;
  margin: 20px 0;
  box-shadow: 6px 6px 0 #000000;
  font-weight: 600;
}

.${prefix}container-alert.${prefix}warning {
  background: #ffeb3b;
  color: #000000;
}

.${prefix}container-alert.${prefix}state-error {
  background: #ff6b6b;
  color: #000000;
}

.${prefix}container-alert.${prefix}state-success {
  background: #6bcf7f;
  color: #000000;
}

/* Brutal Navigation */
.${prefix}nav {
  background: #ffd93d;
  border: 3px solid #000000;
  padding: 16px 20px;
  box-shadow: 6px 6px 0 #000000;
  margin-bottom: 32px;
}

.${prefix}nav-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.${prefix}nav-item {
  color: #000000;
  text-decoration: none;
  padding: 8px 16px;
  border: 2px solid transparent;
  transition: all 0.1s ease;
  font-size: 0.875rem;
  font-weight: 900;
  text-transform: uppercase;
}

.${prefix}nav-item:hover {
  background: #000000;
  color: #ffd93d;
  border: 2px solid #000000;
  transform: translate(-2px, -2px);
  box-shadow: 2px 2px 0 #000000;
}

.${prefix}brand {
  font-weight: 900;
  font-size: 1.5rem;
  color: #000000;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

/* Brutal Lists */
.${prefix}list {
  margin: 20px 0;
  padding: 0;
  list-style: none;
  border: 3px solid #000000;
  background: #ffffff;
  box-shadow: 6px 6px 0 #000000;
}

.${prefix}list-item {
  padding: 16px 20px;
  border-bottom: 3px solid #000000;
  color: #000000;
  font-weight: 600;
  transition: all 0.1s ease;
}

.${prefix}list-item:hover {
  background: #ffd93d;
  padding-left: 28px;
}

.${prefix}list-item:last-child {
  border-bottom: none;
}

/* Brutal Grid */
.${prefix}grid {
  display: grid;
  gap: 24px;
  margin: 32px 0;
}

.${prefix}grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.${prefix}grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.${prefix}grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.${prefix}grid > * {
  border: 3px solid #000000;
  background: #ffffff;
  padding: 20px;
  box-shadow: 6px 6px 0 #000000;
}

/* Brutal Tables */
.${prefix}table {
  width: 100%;
  background: #ffffff;
  border: 3px solid #000000;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 8px 8px 0 #000000;
  margin: 20px 0;
}

.${prefix}table th {
  background: #ffd93d;
  padding: 16px;
  text-align: left;
  font-weight: 900;
  font-size: 0.875rem;
  color: #000000;
  border-bottom: 3px solid #000000;
  border-right: 3px solid #000000;
  text-transform: uppercase;
}

.${prefix}table th:last-child {
  border-right: none;
}

.${prefix}table td {
  padding: 16px;
  border-bottom: 3px solid #000000;
  border-right: 3px solid #000000;
  font-size: 0.875rem;
  font-weight: 600;
  color: #000000;
}

.${prefix}table td:last-child {
  border-right: none;
}

.${prefix}table tr:last-child td {
  border-bottom: none;
}

.${prefix}table tr:hover td {
  background: #bcf0da;
}

/* Table cell alignment - more specific to override th/td defaults */
.${prefix}table .${prefix}align-left {
  text-align: left !important;
}

.${prefix}table .${prefix}align-center {
  text-align: center !important;
}

.${prefix}table .${prefix}align-right {
  text-align: right !important;
}

/* Brutal Icons */
.${prefix}icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  vertical-align: middle;
  font-weight: 900;
}

/* Utility classes */
.${prefix}separator {
  border: none;
  border-top: 3px solid #000000;
  margin: 32px 0;
}

.${prefix}image {
  max-width: 100%;
  height: auto;
  border: 3px solid #000000;
  box-shadow: 6px 6px 0 #000000;
}

.${prefix}code {
  background: #ffd93d;
  padding: 4px 8px;
  border: 2px solid #000000;
  font-family: "JetBrains Mono", "Courier New", monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: #000000;
}

.${prefix}blockquote {
  border-left: 6px solid #000000;
  padding-left: 20px;
  margin: 20px 0;
  color: #000000;
  font-weight: 600;
  font-style: normal;
  background: linear-gradient(to right, rgba(255, 217, 61, 0.2), transparent);
}

/* Button group */
.${prefix}container-button-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 20px 0;
}

/* Form group */
.${prefix}container-form-group {
  margin: 20px 0;
}

.${prefix}container-form-group .${prefix}input:not(:last-child),
.${prefix}container-form-group .${prefix}textarea:not(:last-child),
.${prefix}container-form-group .${prefix}select:not(:last-child) {
  margin-bottom: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .${prefix}h1 {
    font-size: 2rem;
  }

  .${prefix}h2 {
    font-size: 1.75rem;
  }

  .${prefix}grid-2,
  .${prefix}grid-3,
  .${prefix}grid-4 {
    grid-template-columns: 1fr;
  }

  .${prefix}nav-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .${prefix}brand {
    margin-right: 0;
    margin-bottom: 12px;
    font-size: 1.25rem;
  }

  .${prefix}container-card,
  .${prefix}container-modal {
    box-shadow: 6px 6px 0 #000000;
  }
}
`;
}
