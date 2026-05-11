<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { parse, renderToHTML } from 'wiremd'

const heroFrame  = ref<HTMLIFrameElement | null>(null)
const cardsFrame = ref<HTMLIFrameElement | null>(null)
const heroSrcdoc  = ref('')
const cardsSrcdoc = ref('')

const HERO_SOURCE = `
::: hero

Idea → **wiremd** → Claude Design → Code

# The missing layer.

Not a design tool. Not a dev tool.
The universal grammar that humans, designers, and AI all speak.

:::
`

const CARDS_SOURCE = `
::: grid-3 card

## VS Code

|Extension|

Live preview as you type. Syntax highlighting and instant rendering, zero config.

## Claude

|AI-first|{.success}

Describe your UI — Claude writes wiremd and renders the mockup instantly.

## CLI / Pipeline

|Export|

Export to HTML, React, JSON. An AST your agents can read and your pipeline can ship.

:::
`

onMounted(() => {
  heroSrcdoc.value  = renderToHTML(parse(HERO_SOURCE),  { style: 'clean' })
  cardsSrcdoc.value = renderToHTML(parse(CARDS_SOURCE), { style: 'clean' })
})

function resize(frame: HTMLIFrameElement | null) {
  if (!frame?.contentDocument?.body) return
  frame.style.height = frame.contentDocument.body.scrollHeight + 16 + 'px'
}
</script>

<template>
  <div>
    <iframe
      ref="heroFrame"
      :srcdoc="heroSrcdoc"
      @load="resize(heroFrame)"
      class="lp-section-frame"
      sandbox="allow-same-origin"
    />

    <!-- hub diagram -->
    <div class="lp-hub-wrap">
      <svg viewBox="0 0 600 370" class="lp-hub-svg" aria-label="wiremd connects your idea, Claude Cowork, and wireframes to Claude Design and production">
        <defs>
          <marker id="ah-main" markerWidth="11" markerHeight="8" refX="10" refY="4" orient="auto">
            <polygon points="0 0, 11 4, 0 8" fill="#222"/>
          </marker>
          <marker id="ah-light" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
            <polygon points="0 0, 9 3.5, 0 7" fill="#ccc"/>
          </marker>
        </defs>

        <!-- light arrows (secondary inputs) -->
        <!-- Claude Cowork → wiremd -->
        <path d="M 178,112 Q 235,150 248,180" stroke="#ccc" stroke-width="1.5" fill="none" marker-end="url(#ah-light)"/>
        <!-- wireframe preview → wiremd -->
        <path d="M 290,88 Q 288,128 284,174" stroke="#ccc" stroke-width="1.5" fill="none" marker-end="url(#ah-light)"/>

        <!-- main arrows -->
        <!-- idea → wiremd -->
        <path d="M 138,195 Q 185,195 246,195" stroke="#222" stroke-width="2.5" fill="none" marker-end="url(#ah-main)"/>
        <!-- wiremd → Claude Design -->
        <path d="M 366,195 Q 408,195 452,195" stroke="#222" stroke-width="2.5" fill="none" marker-end="url(#ah-main)"/>
        <!-- wiremd → production -->
        <path d="M 306,232 Q 306,272 306,302" stroke="#222" stroke-width="2.5" fill="none" marker-end="url(#ah-main)"/>

        <!-- light nodes -->
        <!-- Claude Cowork (ellipse, top-left) -->
        <ellipse cx="108" cy="100" rx="78" ry="30" fill="white" stroke="#ddd" stroke-width="1.5"/>
        <text x="108" y="105" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="12" fill="#bbb">Claude Cowork</text>

        <!-- wireframe preview (rect, top-center, light) -->
        <rect x="228" y="50" width="124" height="38" rx="10" fill="white" stroke="#ddd" stroke-width="1.5"/>
        <text x="290" y="74" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="12" fill="#bbb">wireframe</text>

        <!-- Claude Code (ellipse, bottom-right, light) -->
        <ellipse cx="500" cy="320" rx="68" ry="27" fill="white" stroke="#ddd" stroke-width="1.5"/>
        <text x="500" y="325" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="12" fill="#bbb">Claude Code</text>

        <!-- main nodes -->
        <!-- idea (left) -->
        <rect x="28" y="175" width="110" height="40" rx="10" fill="white" stroke="#444" stroke-width="2"/>
        <text x="83" y="200" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="14" fill="#222">idea</text>

        <!-- Claude Design (right) -->
        <rect x="452" y="175" width="140" height="40" rx="10" fill="white" stroke="#444" stroke-width="2"/>
        <text x="522" y="200" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="13" fill="#222">Claude Design</text>

        <!-- production (bottom) -->
        <rect x="226" y="302" width="160" height="40" rx="10" fill="white" stroke="#444" stroke-width="2"/>
        <text x="306" y="327" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="14" fill="#222">production</text>

        <!-- wiremd CENTER (most prominent) -->
        <rect x="246" y="170" width="120" height="50" rx="12" fill="white" stroke="#111" stroke-width="3"/>
        <text x="306" y="201" text-anchor="middle" font-family="'Comic Sans MS', cursive" font-size="19" font-weight="bold" fill="#111">wiremd</text>
      </svg>
    </div>

    <iframe
      ref="cardsFrame"
      :srcdoc="cardsSrcdoc"
      @load="resize(cardsFrame)"
      class="lp-section-frame"
      sandbox="allow-same-origin"
    />
  </div>
</template>
