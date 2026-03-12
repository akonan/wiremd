import { describe, expect, it } from 'vitest';
import { render, renderToVue } from '../src/index.js';
import { createFrameworkRendererAst, createVueStateAst } from './fixtures/render-fixtures.js';

describe('Vue Renderer', () => {
  it('renders a typed Composition API single-file component by default', () => {
    const output = renderToVue(createFrameworkRendererAst(), {
      componentName: 'ProfileForm',
    });

    expect(output).toContain('<template>');
    expect(output).toContain('<script setup lang="ts">');
    expect(output).toContain("const componentName = 'ProfileForm'");
    expect(output).toContain('const props = defineProps<{');
    expect(output).toContain('const emit = defineEmits<{');
    expect(output).toContain('const formState = reactive({');
    expect(output).toContain("email: ''");
    expect(output).toContain("message: 'Hello from wiremd'");
    expect(output).toContain("topic: 'support'");
    expect(output).toContain('acceptTerms: true');
    expect(output).toContain("contactMethod: 'email'");
    expect(output).toContain('<form class="wmd-form" @submit.prevent="handleSubmit">');
    expect(output).toContain('v-model="formState.email"');
    expect(output).toContain('v-model="formState.message"');
    expect(output).toContain('v-model="formState.topic"');
    expect(output).toContain('v-model="formState.acceptTerms"');
    expect(output).toContain('v-model="formState.contactMethod"');
    expect(output).toContain(`@click="handleButtonClick('Cancel')"`);
    expect(output).toContain('<nav class="wmd-nav">');
    expect(output).toContain('style="--grid-columns: 2"');
    expect(output).toContain('<table class="wmd-table">');
    expect(output).toContain('<style scoped>');
  });

  it('supports Options API, plain JavaScript, and unscoped styles through the universal renderer', () => {
    const output = render(createFrameworkRendererAst(), {
      format: 'vue',
      rendererOptions: {
        componentName: 'SettingsPanel',
        compositionApi: false,
        typescript: false,
        scopedStyles: false,
      },
    });

    expect(output).toContain('<script>');
    expect(output).not.toContain('<script setup');
    expect(output).not.toContain('lang="ts"');
    expect(output).toContain('export default defineComponent({');
    expect(output).toContain("name: 'SettingsPanel'");
    expect(output).toContain("this.$emit('submit'");
    expect(output).toContain("this.$emit('button-click', label)");
    expect(output).toContain('<style>');
    expect(output).not.toContain('<style scoped>');
  });

  it('renders Vue-specific state blocks for empty and error states', () => {
    const output = renderToVue(createVueStateAst());

    expect(output).toContain('class="wmd-state-block"');
    expect(output).toContain('data-icon="search"');
    expect(output).toContain('No records');
    expect(output).toContain('Try another filter');
    expect(output).toContain('data-icon="error"');
    expect(output).toContain('Load failed');
    expect(output).toContain('Refresh the page and retry');
  });
});
