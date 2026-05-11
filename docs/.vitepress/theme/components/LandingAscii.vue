<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { parse, renderToHTML } from 'wiremd'

const frame  = ref<HTMLIFrameElement | null>(null)
const srcdoc = ref('')

const SOURCE = `# The missing layer.

Idea → **wiremd** → Claude Design → Code

Not a design tool. Not a dev tool.
The universal grammar that humans, designers, and AI all speak.

\`\`\`
  ***********                          ****************
  * idea    * ─┐   ***********    ┌─▶  * claude design * ─▶  design
  ***********  ├─▶  *  wiremd  * ──┤   ****************
  ***********  │   * wireframe *   └─▶  ****************
  * cowork  * ─┘   ***********         * claude code  * ─▶  production
  ***********                          ****************
\`\`\`
`

onMounted(() => {
  srcdoc.value = renderToHTML(parse(SOURCE), { style: 'sketch' })
})

function onLoad() {
  const f = frame.value
  if (!f?.contentDocument?.body) return
  f.style.height = f.contentDocument.body.scrollHeight + 16 + 'px'
}
</script>

<template>
  <iframe
    ref="frame"
    :srcdoc="srcdoc"
    @load="onLoad"
    class="lp-ascii-frame"
    sandbox="allow-same-origin"
  />
</template>
