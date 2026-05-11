import * as path from 'path'
import type { Plugin } from 'vite'
// Import from the built package (dist/) so this works in both dev and build.
// Run `npm run build` before `npm run docs:dev` to keep dist/ fresh.
import { parse, renderToHTML, resolveIncludes } from '../../../dist/index.js'

export function wiremdDemoPlugin(): Plugin {
  return {
    name: 'wiremd-demo',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return null
      return transformMarkdown(code, id)
    }
  }
}

type StackEntry = { type: string; invisible: boolean }

// VitePress's own container types — leave them untouched
const VITEPRESS_CONTAINERS = new Set(['tip', 'warning', 'danger', 'info', 'details'])

/**
 * Transforms a wiremd-flavoured markdown file so VitePress can render it:
 *
 * - Strips :::layout and :::main wrappers (VitePress handles layout itself)
 * - Strips top-level ![[...]] includes (VitePress handles sidebar)
 * - Replaces :::demo blocks with an iframe preview + source panel
 * - Renders any other unknown wiremd container as a preview-only iframe
 */
function transformMarkdown(markdown: string, filePath: string): string {
  const lines = markdown.split('\n')
  const result: string[] = []
  const stack: StackEntry[] = []
  let i = 0
  let inFence = false
  let fenceChar = ''
  let fenceLen = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Track fenced code blocks so ::: inside them isn't treated as containers
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/)
    if (fenceMatch) {
      const char = fenceMatch[1][0]
      const len = fenceMatch[1].length
      if (!inFence) {
        inFence = true
        fenceChar = char
        fenceLen = len
        result.push(line)
        i++
        continue
      } else if (char === fenceChar && len >= fenceLen && !trimmed.slice(len).trim()) {
        inFence = false
        result.push(line)
        i++
        continue
      }
    }

    if (inFence) {
      result.push(line)
      i++
      continue
    }

    // Strip top-level ![[...]] wiremd includes (sidebar refs etc.)
    if (/^\!\[\[.+\]\]$/.test(trimmed)) {
      i++
      continue
    }

    // Bare ::: = container closer
    if (trimmed === ':::') {
      const last = stack.pop()
      if (!last?.invisible) result.push(line)
      i++
      continue
    }

    // ::: opener
    const openerMatch = trimmed.match(/^:::\s*(\S+)/)
    if (openerMatch) {
      const containerType = openerMatch[1]

      if (containerType === 'demo') {
        const { renderedHtml, source, nextLine } = extractDemo(lines, i + 1, filePath)
        result.push(buildDemoHtml(renderedHtml, source))
        i = nextLine
        continue
      }

      // Strip layout / main wrappers — VitePress owns page structure
      if (containerType === 'layout' || containerType === 'main') {
        stack.push({ type: containerType, invisible: true })
        i++
        continue
      }

      // VitePress built-in containers — pass through unchanged
      if (VITEPRESS_CONTAINERS.has(containerType)) {
        stack.push({ type: containerType, invisible: false })
        result.push(line)
        i++
        continue
      }

      // Any other wiremd container — render as preview-only iframe
      const { renderedHtml: wiremdHtml, nextLine: wiremdNext } = extractWiremdContainer(lines, i, filePath)
      result.push(buildPreviewHtml(wiremdHtml))
      i = wiremdNext
      continue
    }

    result.push(line)
    i++
  }

  return result.join('\n')
}

function extractDemo(
  lines: string[],
  startLine: number,
  filePath: string
): { renderedHtml: string; source: string; nextLine: number } {
  const contentLines: string[] = []
  let depth = 1
  let i = startLine

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (trimmed === ':::') {
      depth--
      if (depth === 0) {
        i++
        break
      }
      contentLines.push(lines[i])
    } else if (/^:::\s*\S/.test(trimmed)) {
      depth++
      contentLines.push(lines[i])
    } else {
      contentLines.push(lines[i])
    }
    i++
  }

  const source = contentLines.join('\n').trim()
  let renderedHtml = ''

  try {
    const basePath = path.dirname(filePath)
    const resolved = resolveIncludes(source, basePath)
    const ast = parse(resolved)
    renderedHtml = renderToHTML(ast, { style: 'sketch' })
  } catch (err) {
    const msg = String(err).replace(/</g, '&lt;')
    renderedHtml = `<html><body style="font-family:sans-serif;padding:1rem;color:red">wiremd render error: ${msg}</body></html>`
  }

  return { renderedHtml, source, nextLine: i }
}

/** Collect a non-demo wiremd container (opener through matching closer) and render it. */
function extractWiremdContainer(
  lines: string[],
  startLine: number,
  filePath: string
): { renderedHtml: string; nextLine: number } {
  const blockLines: string[] = []
  let depth = 1
  let i = startLine
  blockLines.push(lines[i]) // include opener
  i++

  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (trimmed === ':::') {
      depth--
      blockLines.push(lines[i])
      if (depth === 0) { i++; break }
    } else if (/^:::\s*\S/.test(trimmed)) {
      depth++
      blockLines.push(lines[i])
    } else {
      blockLines.push(lines[i])
    }
    i++
  }

  const source = blockLines.join('\n')
  let renderedHtml = ''

  try {
    const basePath = path.dirname(filePath)
    const resolved = resolveIncludes(source, basePath)
    const ast = parse(resolved)
    renderedHtml = renderToHTML(ast, { style: 'sketch' })
  } catch (err) {
    const msg = String(err).replace(/</g, '&lt;')
    renderedHtml = `<html><body style="font-family:sans-serif;padding:1rem;color:red">wiremd error: ${msg}</body></html>`
  }

  return { renderedHtml, nextLine: i }
}

/** Render wiremd HTML as a plain preview iframe (no source panel). */
function buildPreviewHtml(renderedHtml: string): string {
  const scaled = renderedHtml.replace(
    '</head>',
    '<style>html{zoom:0.75}html,body{background:transparent!important;margin:0}</style></head>'
  )
  const srcdoc = scaled
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, '&#10;')

  return `<div class="wiremd-preview-block" v-pre><iframe class="wiremd-preview-iframe" srcdoc="${srcdoc}" scrolling="no" onload="this.style.height=(this.contentDocument.documentElement.scrollHeight+8)+'px'"></iframe></div>`
}

function buildDemoHtml(renderedHtml: string, source: string): string {
  // Make the iframe body transparent so the container's dot grid shows through
  const transparentHtml = renderedHtml.replace(
    '</head>',
    '<style>html{zoom:0.75}html,body{background:transparent!important;margin:0}</style></head>'
  )

  // Escape for srcdoc attribute: browsers HTML-decode entities before using srcdoc
  // content, so encoding < > & " lets us embed a full HTML document safely.
  // Encode newlines as &#10; so the whole output stays on one line — CommonMark
  // terminates HTML blocks on blank lines, so any embedded blank line would cause
  // markdown-it to split the block and produce broken output.
  const srcdoc = transparentHtml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, '&#10;')

  // Same newline encoding for the source code shown inside <pre>.
  // The browser decodes &#10; back to \n, which <pre> renders as a line break.
  const escapedSource = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n/g, '&#10;')

  // Copy button: capture `this` before the async clipboard call so the callback
  // can reference the button even after focus shifts.
  const copyFn = `var b=this,c=this.closest('.wiremd-demo-right').querySelector('code');navigator.clipboard.writeText(c.textContent).then(function(){b.textContent='Copied!';setTimeout(function(){b.textContent='Copy'},2000)})`

  // Single-line output: no blank lines → markdown-it won't prematurely terminate
  // the HTML block. v-pre prevents Vue from interpreting {{ }} inside.
  return `<div class="wiremd-demo-block" v-pre><div class="wiremd-demo-left"><iframe class="wiremd-demo-iframe" srcdoc="${srcdoc}" scrolling="no" onload="this.style.height=(this.contentDocument.documentElement.scrollHeight+24)+'px'"></iframe></div><div class="wiremd-demo-right"><button class="wiremd-demo-copy" onclick="${copyFn}">Copy</button><pre class="wiremd-demo-pre"><code>${escapedSource}</code></pre></div></div>`
}
