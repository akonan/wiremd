import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';
import { renderToHTML, renderToJSON } from '../src/renderer/index.js';

describe('HTML Renderer', () => {
  describe('Basic Components', () => {
    it('should render a button', () => {
      const ast = parse('[Click Me]');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<button');
      expect(html).toContain('Click Me');
      expect(html).toContain('wmd-button');
    });

    it('should render a primary button', () => {
      const ast = parse('[Submit]*');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-button-primary');
      expect(html).toContain('Submit');
    });

    it('should render a text input', () => {
      const ast = parse('[Email_______________________]');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<input');
      expect(html).toContain('type="text"');
      expect(html).toContain('wmd-input');
    });

    it('should render an email input with attributes', () => {
      const ast = parse('[Email___]{type:email required}');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('type="email"');
      expect(html).toContain('required');
    });

    it('should render a checkbox', () => {
      const ast = parse('- [x] Checked item');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
      expect(html).toContain('Checked item');
    });

    it('should render a radio button', () => {
      const ast = parse('- (•) Selected option');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('type="radio"');
      expect(html).toContain('checked');
      expect(html).toContain('Selected option');
    });

    it('should render an icon', () => {
      const ast = parse(':house:');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-icon');
      expect(html).toContain('data-icon="house"');
    });
  });

  describe('Containers', () => {
    it('should render a hero container', () => {
      const input = `
::: hero

# Welcome

[Get Started]*

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-container-hero');
      expect(html).toContain('<h1');
      expect(html).toContain('Welcome');
      expect(html).toContain('Get Started');
    });

    it('should render a card container with attributes', () => {
      const input = `
::: card {.featured}

## Card Title

Content

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-container-card');
      expect(html).toContain('wmd-featured');
      expect(html).toContain('Card Title');
    });
  });

  describe('Navigation', () => {
    it('should render a navigation bar', () => {
      const input = `[[ :logo: MyApp | Home | Products | [Sign In] ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<nav');
      expect(html).toContain('wmd-nav');
      expect(html).toContain('wmd-brand');
      expect(html).toContain('MyApp');
      expect(html).toContain('wmd-nav-item');
      expect(html).toContain('Home');
      expect(html).toContain('Sign In');
    });

    it('should render *active* nav items without literal asterisks', () => {
      const input = `[[ Home | *About* | Contact ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).not.toContain('*About*');
      expect(html).toContain('About');
      expect(html).toContain('wmd-nav-item');
    });

    it('should render [Link](url)* nav item as primary button', () => {
      const input = `[[ Home | [Get Started](./start.md)* ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('href="./start.md"');
      expect(html).toContain('wmd-button-primary');
    });

    it('should render nav items with links as <a> tags with href', () => {
      const input = `[[ :logo: MyApp | Home | [About](./about.md) | [Contact](./contact.md) ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('href="./about.md"');
      expect(html).toContain('href="./contact.md"');
      expect(html).toContain('About');
      expect(html).toContain('Contact');
    });

    it('should render navigation items with button styling', () => {
      const input = `[[ Logo | Sign In | Help ]]`;
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      // Check that nav items are rendered as links with proper classes
      expect(html).toContain('class="wmd-nav-item"');
      expect(html).toContain('Logo');
      expect(html).toContain('Sign In');
      expect(html).toContain('Help');

      // Check that the CSS includes button-like styling for nav items
      expect(html).toContain('.wmd-nav-item');
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*display:\s*inline-block/);
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*background:\s*#fff/);
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*border:\s*2px solid/);
      expect(html).toMatch(/\.wmd-nav-item\s*\{[^}]*box-shadow/);
    });
  });

  describe('Grid Layout', () => {
    it('should render a 3-column grid', () => {
      const input = `
::: grid-3

### Feature One
Fast

### Feature Two
Secure

### Feature Three
Powerful

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-grid');
      expect(html).toContain('wmd-grid-3');
      expect(html).toContain('--grid-columns: 3');
      expect(html).toContain('wmd-grid-item');
      expect(html).toContain('Feature One');
      expect(html).toContain('Feature Two');
      expect(html).toContain('Feature Three');
    });

    it('should render wmd-grid-item-card class when card modifier is set', () => {
      const input = `
::: grid-3 card

### Fast
Quick

### Secure
Safe

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/class="[^"]*wmd-grid-item-card/);
    });

    it('should NOT render wmd-grid-item-card class without card modifier', () => {
      const input = `
::: grid-3

### Fast
Quick

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).not.toMatch(/class="[^"]*wmd-grid-item-card/);
    });

    it('should NOT render grid label text in output', () => {
      const input = `
::: grid-3

### Item One
Content

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<div class="[^"]*wmd-grid[^"]*"/);
    });

    it('should render col-span class on grid item', () => {
      const input = `
::: grid-3

### Wide {.col-span-2}
Spans two columns

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/class="[^"]*wmd-col-span-2/);
    });

    it('should include col-span mobile reset in CSS', () => {
      const ast = parse('::: grid-3\n\n### Item\nContent\n\n:::');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/max-width:\s*768px[\s\S]*?col-span-2[\s\S]*?grid-column:\s*span 1/);
    });

    it('should render col-span combined with card modifier', () => {
      const input = `
::: grid-3 card

### Wide {.col-span-2}
Spans two

:::
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/class="[^"]*wmd-grid-item-card/);
      expect(html).toMatch(/class="[^"]*wmd-col-span-2/);
    });
  });

  describe('Row layout rendering', () => {
    it('should render ::: row as a flex container', () => {
      const input = `
::: row

###
[All]*

###
[+ New]*

:::
      `.trim();

      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-row');
      expect(html).toContain('wmd-grid-item');
      expect(html).toContain('display: flex');
    });

    it('should render align-left and align-right classes on grid-items', () => {
      const input = `
::: row

### {.left}
[All]*

### {.right}
[+ New]*

:::
      `.trim();

      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-align-left');
      expect(html).toContain('wmd-align-right');
      expect(html).toContain('margin-right: auto');
      expect(html).toContain('margin-left: auto');
    });

    it('dropdown inside implicit row renders <select> with <option> elements (not a stray <ul>)', () => {
      const input = `
::: row

[Select Team_________v]
- All Teams
- Team A
- Team B

:::
      `.trim();

      const html = renderToHTML(parse(input), { style: 'clean' });
      expect(html).toContain('<select');
      expect(html).toContain('<option');
      expect(html).toContain('All Teams');
      expect(html).not.toMatch(/<ul[^>]*>[\s\S]*?All Teams/);
    });

    it('search + dropdown inside implicit row renders no stray bullet list', () => {
      const input = `
::: row

[Search_______________]{type:search}

[Select Team_________v]
- All Teams
- Team A

:::
      `.trim();

      const html = renderToHTML(parse(input), { style: 'clean' });
      expect(html).toContain('wmd-select');
      expect(html).not.toMatch(/<ul[\s\S]*?All Teams/);
    });

    it('should render align-center class on grid-item with {.center}', () => {
      const input = `
::: row

### {.center}
Centered

:::
      `.trim();

      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-align-center');
    });
  });

  describe('Multiple inline button-links', () => {
    it('should render two [[btn](url)] on one line as button elements (not a paragraph)', () => {
      const ast = parse('[[Get Started](./about.md)]* [[See Features](./about.md)]');
      const html = renderToHTML(ast, { style: 'sketch' });
      // Must render as <a class="wmd-button..."> — not as a <p> wrapping raw links
      expect(html).toMatch(/<a href="\.\/about\.md" class="[^"]*wmd-button-primary[^"]*">Get Started<\/a>/);
      expect(html).toMatch(/<a href="\.\/about\.md" class="[^"]*wmd-button[^"]*">See Features<\/a>/);
      // Must not wrap in a <p> paragraph element with literal brackets
      expect(html).not.toMatch(/<p[^>]*wmd-paragraph/);
    });

    it('should render two [[btn](url)] on one line without literal bracket text', () => {
      const ast = parse('[[Docs](./docs.md)] [[API](./api.md)]');
      const html = renderToHTML(ast, { style: 'sketch' });
      // No literal ][ in the output (would appear between two paragraph-rendered links)
      expect(html).not.toMatch(/\].*\[/);
      expect(html).toMatch(/<a href="\.\/docs\.md" class="[^"]*wmd-button[^"]*">Docs<\/a>/);
      expect(html).toMatch(/<a href="\.\/api\.md" class="[^"]*wmd-button[^"]*">API<\/a>/);
    });
  });

  describe('Button links', () => {
    it('should render button with href as <a> tag', () => {
      const ast = parse('[Go to Docs]{href:./docs.md}');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<a href="\.\/docs\.md" class="[^"]*wmd-button[^"]*">/);
      expect(html).not.toContain('<button');
    });

    it('should render primary button with href as <a> tag', () => {
      const ast = parse('[Get Started]*{href:./start.md}');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<a href="\.\/start\.md"/);
      expect(html).toContain('wmd-button-primary');
    });

    it('should render [[Button](url)] as a clickable <a> button', () => {
      const ast = parse('[[Go to Docs](./docs.md)]');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<a href="\.\/docs\.md" class="[^"]*wmd-button[^"]*">/);
      expect(html).not.toContain('<button');
    });

    it('should reset link styling on button <a> tags', () => {
      const ast = parse('[[Docs](./docs.md)]');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('text-decoration: none');
      expect(html).toContain('color: inherit');
    });

    it('should render [[Button]*(url)] as primary <a> button', () => {
      const ast = parse('[[Get Started](./start.md)]*');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<a href="\.\/start\.md"/);
      expect(html).toContain('wmd-button-primary');
    });
  });

  describe('Dropdowns', () => {
    it('should render a dropdown with options', () => {
      const input = `
[Select topic___v]
- Sales
- Support
- Other
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<select');
      expect(html).toContain('wmd-select');
      expect(html).toContain('<option');
      expect(html).toContain('Sales');
      expect(html).toContain('Support');
      expect(html).toContain('Other');
    });
  });

  describe('Complete Form', () => {
    it('should render a complete contact form', () => {
      const input = `
## Contact Form

Name

[_____________________________]{required}

Email

[_____________________________]{type:email required}

[Submit]*
      `.trim();

      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('<h2');
      expect(html).toContain('Contact Form');
      expect(html).toContain('type="text"');
      expect(html).toContain('type="email"');
      expect(html).toContain('required');
      expect(html).toContain('wmd-button-primary');
      expect(html).toContain('Submit');
    });
  });

  describe('Styles', () => {
    it('should render with sketch style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'sketch' });

      expect(html).toContain('wmd-sketch');
      expect(html).toContain('Comic Sans');
    });

    it('should render with clean style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'clean' });

      expect(html).toContain('wmd-clean');
      expect(html).toContain('Segoe UI');
    });

    it('should render with wireframe style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'wireframe' });

      expect(html).toContain('wmd-wireframe');
      expect(html).toContain('repeating-linear-gradient');
    });

    it('should render with none style', () => {
      const ast = parse('[Button]');
      const html = renderToHTML(ast, { style: 'none' });

      expect(html).toContain('wmd-none');
      expect(html).toContain('<button');
    });
  });

  describe('Grid inside container', () => {
    it('should render a grid nested inside a card container', () => {
      const input = `
::: card

::: grid-3

### Fast
Quick

### Secure
Safe

### Powerful
Strong

:::

:::
      `.trim();
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      // Must produce an actual grid div, not just CSS class strings
      expect(html).toMatch(/<div class="[^"]*wmd-grid[^"]*wmd-grid-3[^"]*"/);
      expect(html).toMatch(/<div class="[^"]*wmd-grid-item[^"]*">/);
      expect(html).toContain('Fast');
      expect(html).toContain('Secure');
      expect(html).toContain('Powerful');
    });

    it('should render a grid nested inside sidebar-main layout main section', () => {
      const input = `
::: layout {.sidebar-main}

::: sidebar
Nav
:::

::: main

::: grid-3

### Done
48

### Active
12

### Pending
5

:::

:::

:::
      `.trim();
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<div class="[^"]*wmd-grid[^"]*wmd-grid-3[^"]*"/);
      expect(html).toMatch(/<div class="[^"]*wmd-grid-item[^"]*">/);
      expect(html).toContain('Done');
      expect(html).toContain('Active');
      expect(html).toContain('Pending');
    });
  });

  describe('Sidebar Layout', () => {
    const sidebarInput = `
::: layout {.sidebar-main}

::: sidebar
- [Home](#)
- [Settings](#)

:::

::: main

### Dashboard
Content here

:::

:::
    `.trim();

    it('should render sidebar-main layout with correct wrapper class', () => {
      const ast = parse(sidebarInput);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('wmd-container-layout');
      expect(html).toContain('wmd-sidebar-main');
    });

    it('should render sidebar and main sections as separate divs', () => {
      const ast = parse(sidebarInput);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('wmd-layout-sidebar');
      expect(html).toContain('wmd-layout-main');
    });

    it('should NOT render the section heading labels as visible text', () => {
      const ast = parse(sidebarInput);
      const html = renderToHTML(ast, { style: 'sketch' });
      // Heading text "Sidebar" and "Main" used as structural markers should not appear in output
      expect(html).not.toMatch(/<h\d[^>]*>[^<]*\bSidebar\b/);
      expect(html).not.toMatch(/<h\d[^>]*>[^<]*\bMain\b/);
    });

    it('should place sidebar content inside layout-sidebar div', () => {
      const ast = parse(sidebarInput);
      const html = renderToHTML(ast, { style: 'sketch' });
      // Extract just the body content (after </style>) to avoid CSS false positives
      const bodyStart = html.indexOf('</style>');
      const body = html.slice(bodyStart);
      const sidebarDivPos = body.indexOf('class="wmd-layout-sidebar"');
      const mainDivPos = body.indexOf('class="wmd-layout-main"');
      const homePos = body.indexOf('>Home<');
      expect(sidebarDivPos).toBeGreaterThan(-1);
      expect(homePos).toBeGreaterThan(sidebarDivPos);
      expect(homePos).toBeLessThan(mainDivPos);
    });

    it('should place main content inside layout-main div', () => {
      const ast = parse(sidebarInput);
      const html = renderToHTML(ast, { style: 'sketch' });
      const bodyStart = html.indexOf('</style>');
      const body = html.slice(bodyStart);
      const mainDivPos = body.indexOf('class="wmd-layout-main"');
      const dashPos = body.indexOf('Dashboard');
      expect(dashPos).toBeGreaterThan(mainDivPos);
    });

    it('should include sidebar-main grid CSS', () => {
      const ast = parse(sidebarInput);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/grid-template-columns:\s*\d+px\s+1fr/);
    });

    it('should include container-sidebar CSS', () => {
      const ast = parse('::: sidebar\n- [Home](#)\n:::\n');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('wmd-container-sidebar');
      expect(html).toMatch(/\.wmd-container-sidebar\s*\{/);
    });
  });

  describe('Tabs', () => {
    const input = `
::: tabs

::: tab Overview
Overview panel

:::

::: tab Details
Details panel

:::

:::
    `.trim();

    it('should render a tabs container with headers and panels', () => {
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('wmd-tabs');
      expect(html).toContain('wmd-tab-header');
      expect(html).toContain('wmd-tab-panel');
    });

    it('should render tab labels as header buttons', () => {
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<button[^>]*wmd-tab-header[^>]*>Overview<\/button>/);
      expect(html).toMatch(/<button[^>]*wmd-tab-header[^>]*>Details<\/button>/);
    });

    it('should mark the active header with wmd-active', () => {
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      const headerMatches = [...html.matchAll(/<button[^>]*class="([^"]*)"[^>]*>(Overview|Details)<\/button>/g)];
      expect(headerMatches).toHaveLength(2);
      const overviewClasses = headerMatches.find((m) => m[2] === 'Overview')![1];
      const detailsClasses = headerMatches.find((m) => m[2] === 'Details')![1];
      expect(overviewClasses).toContain('wmd-active');
      expect(detailsClasses).not.toContain('wmd-active');
    });

    it('should hide inactive panels via the hidden attribute', () => {
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      const panels = [...html.matchAll(/<div[^>]*data-wmd-tab-panel="\d+"[^>]*>/g)].map((m) => m[0]);
      expect(panels).toHaveLength(2);
      expect(panels[0]).not.toContain('hidden');
      expect(panels[1]).toContain('hidden');
    });

    it('should render panel children', () => {
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('Overview panel');
      expect(html).toContain('Details panel');
    });

    it('should inject a tabs interactivity script', () => {
      const ast = parse(input);
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toMatch(/<script>[\s\S]*wmd-tab-header[\s\S]*<\/script>/);
    });
  });

  describe('JSON Renderer', () => {
    it('should render to JSON', () => {
      const ast = parse('[Button]');
      const json = renderToJSON(ast);

      expect(json).toContain('"type": "document"');
      expect(json).toContain('"type": "button"');
      expect(json).toContain('"content": "Button"');
    });

    it('should render compact JSON', () => {
      const ast = parse('[Button]');
      const json = renderToJSON(ast, { pretty: false });

      expect(json).not.toContain('\n');
      expect(json).toContain('"type":"document"');
    });
  });

  describe('Row — labeled input (form-group) renders as block inside flex item', () => {
    it('should render form-group inside row as grid-item containing form-group, not button-group', () => {
      const md = `::: row\n\nSearch\n[Search__________________________]\n\n:::`;
      const html = renderToHTML(parse(md), { style: 'clean' });
      expect(html).toContain('wmd-container-form-group');
      expect(html).not.toMatch(/wmd-container-button-group[^"]*">\s*Search/);
    });

    it('CSS: row input override must use child combinator (>) not descendant ( ) to avoid breaking form-groups', () => {
      const md = `::: row\n\nSearch\n[Search__________________________]\n\n:::`;
      const html = renderToHTML(parse(md), { style: 'clean' });
      // Descendant selector ".wmd-row .wmd-input" would override block display inside form-groups.
      // Must use child combinator: ".wmd-row > .wmd-grid-item > .wmd-input" instead.
      expect(html).not.toMatch(/\.wmd-row\s+\.wmd-input/);
    });
  });

  describe('Badge/Pill Components', () => {
    it('should render a basic badge', () => {
      const ast = parse('|Active|');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('<span');
      expect(html).toContain('wmd-badge');
      expect(html).toContain('Active');
    });

    it('should render a badge with success variant', () => {
      const ast = parse('|Active|{.success}');
      const html = renderToHTML(ast, { style: 'sketch' });
      expect(html).toContain('wmd-badge-success');
      expect(html).toContain('Active');
    });

    it('should render a warning badge', () => {
      const ast = parse('|3|{.warning}');
      const html = renderToHTML(ast, { style: 'clean' });
      expect(html).toContain('wmd-badge-warning');
      expect(html).toContain('>3<');
    });

    it('should render a badge in all styles', () => {
      const ast = parse('|Beta|{.primary}');
      for (const style of ['sketch', 'clean', 'wireframe', 'none', 'tailwind', 'material', 'brutal'] as const) {
        const html = renderToHTML(ast, { style });
        expect(html).toContain('wmd-badge');
        expect(html).toContain('Beta');
      }
    });

    it('should render badges mixed with text', () => {
      const ast = parse('Status: |Active|{.success}');
      const html = renderToHTML(ast, { style: 'clean' });
      expect(html).toContain('Status:');
      expect(html).toContain('wmd-badge-success');
      expect(html).toContain('Active');
    });
  });

  describe('::: container-based layout rendering', () => {
    it('should render ::: grid-3 as a 3-column grid', () => {
      const input = `
::: grid-3

### Feature One
Fast

### Feature Two
Secure

### Feature Three
Powerful

:::
      `.trim();
      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-grid');
      expect(html).toContain('wmd-grid-3');
      expect(html).toContain('--grid-columns: 3');
      expect(html).toContain('Feature One');
      expect(html).toContain('Feature Two');
    });

    it('should render ::: grid-3 card with card class on items', () => {
      const input = `
::: grid-3 card

### Fast
Quick

### Secure
Safe

:::
      `.trim();
      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toMatch(/class="[^"]*wmd-grid-item-card/);
    });

    it('should render ::: row as a flex container', () => {
      const input = `
::: row

[All]* [Active]

[+ New]*

:::
      `.trim();
      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-row');
    });

    it('should render ::: tabs with tab headers and panels', () => {
      const input = `
::: tabs

::: tab Overview
Overview text

:::

::: tab Details
[Buy Now]*

:::

:::
      `.trim();
      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-tabs');
      expect(html).toContain('Overview');
      expect(html).toContain('Details');
    });

    it('should render ::: layout {.sidebar-main} with nested ::: sidebar and ::: main', () => {
      const input = `
::: layout {.sidebar-main}

::: sidebar
- [Home](#)
:::

::: main
### Page Title
Content
:::

:::
      `.trim();
      const html = renderToHTML(parse(input), { style: 'sketch' });
      expect(html).toContain('wmd-layout-sidebar');
      expect(html).toContain('wmd-layout-main');
      expect(html).toContain('Page Title');
    });
  });
});
