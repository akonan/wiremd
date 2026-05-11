<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { parse, renderToHTML } from 'wiremd'

const STYLES = ['sketch', 'clean', 'wireframe', 'material', 'brutal', 'tailwind'] as const
type WiremdStyle = typeof STYLES[number]

const EXAMPLES: { label: string; code: string }[] = [
  {
    label: 'This page',
    code: `[[ wiremd  | :logo: | Docs | Editor ]]

::: row {.center}
*Idea* → **wiremd** → *Claude Design* → *Claude Code*
:::

::: hero
## The missing layer.

The universal grammar that humans, designers, and AI all speak.

| |

[Install in Claude Design] [OpenEditor]*
:::

::: grid-3 card

## For Product
|The Spec Layer|{.success}

Write wireframes in your PRD. Your PM writes it, your LLM reads it, Claude Design consumes it.

## For Design
|The Bridge|

Lo-fi spec → Claude Design → hi-fi output. No translation layer. No lost intent.

## For Engineering
|The Pipeline|{.warning}

Use wiremd directly in your tickets, render in your IDE.

:::`,
  },
  {
    label: 'Dashboard',
    code: `## Dashboard

::: grid-3 card

### 12,480
Users · ↑ 8%

### $48,200
Revenue · ↑ 12%

### 94.2%
Uptime · ↓ 1%

:::

::: grid-2 card

### Revenue

\`\`\`
Jan  ***********           $22k
Feb  *****************     $34k
Mar  **************        $28k
Apr  ********************  $40k
May  **************        $29k
Jun  *****************     $36k
\`\`\`

### Visitors

\`\`\`
     |              *
     |          *       *
     |      *               *
     |  *
     +----+----+----+----+----
      Jan  Feb  Mar  Apr  May
\`\`\`

:::

Search [_________________________]

[New Report]* [Export]  [Settings]`,
  },
  {
    label: 'Settings',
    code: `## Account Settings

::: tabs

::: tab Profile
Full Name
[_______________________]

Email
[_______________________]{type:email}

Bio
[_______________________]{rows:3}

[Save Changes]*

:::

::: tab Notifications

- [x] Email notifications
- [x] Push notifications
- [ ] SMS alerts
- [ ] Weekly digest

[Save Preferences]*

:::

::: tab Security
Current Password
[_______________________]{type:password}

New Password
[_______________________]{type:password}

- [ ] Enable 2FA

[Update Password]*

:::

::: tab Billing

|Pro Plan| |Active|{.success}

$49 / month · Next billing: Jun 1

[Upgrade Plan]* [Cancel]

:::

:::`,
  },
  {
    label: 'Sign In',
    code: `## Sign In

Email
[_____________________________]{type:email}

Password
[_____________________________]{type:password}

- [ ] Remember me

[Sign In]* [Forgot password?]`,
  },
  {
    label: 'Product',
    code: `::: card
## Wireless Headphones

|New| |Sale|

Premium noise-cancelling · 30h battery

**$149.00** ~~$249.00~~

[Add to Cart]* [Save]
:::`,
  },
  {
    label: 'Data Table',
    code: `## Users

[+ Invite]* [Export]

| Name | Role | Status | Joined |
|------|------|--------|--------|
| Alice Martin | Admin | Active | Jan 2024 |
| Bob Chen | Editor | Active | Mar 2024 |
| Carol Wu | Viewer | Pending | Apr 2024 |
| Dave Lee | Editor | Inactive | Feb 2024 |`,
  },
]

const style = ref<WiremdStyle>('sketch')
const selectedIndex = ref(0)
const source = ref(EXAMPLES[0].code)
const activePanel = ref<'preview' | 'editor'>('preview')
const srcdoc = ref('')
const iframeEl = ref<HTMLIFrameElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

function resizeIframe() {
  const frame = iframeEl.value
  if (!frame?.contentDocument?.body) return
  frame.style.height = frame.contentDocument.body.scrollHeight + 32 + 'px'
}

function render() {
  try {
    let html = renderToHTML(parse(source.value), { style: style.value })
    // Scale down for the narrow preview pane and prevent the 768px media query
    // from collapsing grid columns (the iframe is narrower than the breakpoint).
    html = html.replace('</head>', [
      '<style>',
      'html{zoom:0.65}html,body{margin:0}',
      // Override responsive collapses — later !important wins in the cascade
      '.wmd-grid{grid-template-columns:repeat(var(--grid-columns,3),1fr)!important}',
      '.wmd-grid-2{grid-template-columns:repeat(2,1fr)!important}',
      '.wmd-grid-3{grid-template-columns:repeat(3,1fr)!important}',
      '.wmd-grid-4{grid-template-columns:repeat(4,1fr)!important}',
      '.wmd-nav-content{flex-direction:row!important;align-items:center!important;flex-wrap:nowrap!important}',
      '.wmd-brand{margin-right:auto!important}',
      '</style></head>',
    ].join(''))
    html = html.replace('</body>',
      `<script>document.addEventListener('click',function(e){` +
      `var el=e.target.closest('a,button');if(!el)return;` +
      `var t=el.textContent.trim().toLowerCase().replace(/\\s+/g,'');` +
      `if(t==='docs'){e.preventDefault();window.parent.postMessage({wiremdNav:'docs'},'*');}` +
      `else if(t==='editor'||t==='openeditor'){e.preventDefault();window.parent.postMessage({wiremdNav:'editor'},'*');}` +
      `});<` + `/script></body>`)
    srcdoc.value = html
  } catch {
    // keep previous output on error
  }
}

function onMessage(e: MessageEvent) {
  if (!e.data?.wiremdNav) return
  if (e.data.wiremdNav === 'docs') window.location.href = '/wiremd/guide/overview.html'
  else if (e.data.wiremdNav === 'editor') window.open('/wiremd/editor/', '_blank')
}

function onInput() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(render, 150)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const ta = e.target as HTMLTextAreaElement
  const start = ta.selectionStart
  const end = ta.selectionEnd
  source.value = source.value.slice(0, start) + '  ' + source.value.slice(end)
  nextTick(() => { ta.selectionStart = ta.selectionEnd = start + 2 })
}

function onExampleChange() {
  source.value = EXAMPLES[selectedIndex.value].code
  render()
}

watch(style, render)
onMounted(() => { render(); window.addEventListener('message', onMessage) })
onUnmounted(() => { window.removeEventListener('message', onMessage) })

let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
  activePanel.value = dx < 0 ? 'editor' : 'preview'
}
</script>

<template>
  <div class="mini-editor">
    <div class="mini-editor__toggle">
      <button :class="['mini-editor__toggle-btn', { 'is-active': activePanel === 'preview' }]" @click="activePanel = 'preview'" title="Preview">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      <button :class="['mini-editor__toggle-btn', { 'is-active': activePanel === 'editor' }]" @click="activePanel = 'editor'" title="Editor">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </button>
    </div>
    <div :class="['mini-editor__body', `mini-editor__body--${activePanel}`]" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <iframe
        ref="iframeEl"
        :srcdoc="srcdoc"
        @load="resizeIframe"
        class="mini-editor__iframe"
        sandbox="allow-same-origin allow-scripts"
      />
      <div class="mini-editor__divider" />
      <div class="mini-editor__editor-pane">
        <div class="mini-editor__editor-header">
          <span class="mini-editor__dot" style="background:#ff5f57"></span>
          <span class="mini-editor__dot" style="background:#febc2e"></span>
          <span class="mini-editor__dot" style="background:#28c840"></span>
          <span class="mini-editor__editor-fname">wireframe.md</span>
          <div class="mini-editor__header-controls">
            <select v-model="selectedIndex" @change="onExampleChange" class="mini-editor__select mini-editor__select--dark">
              <option v-for="(ex, i) in EXAMPLES" :key="i" :value="i">{{ ex.label }}</option>
            </select>
            <select v-model="style" class="mini-editor__select mini-editor__select--dark">
              <option v-for="s in STYLES" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>
        <textarea
          v-model="source"
          @input="onInput"
          @keydown="onKeydown"
          class="mini-editor__textarea"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
        />
      </div>
    </div>
  </div>
</template>
