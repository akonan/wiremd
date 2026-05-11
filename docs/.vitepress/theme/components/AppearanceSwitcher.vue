<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

function toggle() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('vitepress-theme-appearance', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="appearance-switcher">
    <button @click="toggle" class="appearance-btn" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
      <span class="appearance-icon">{{ isDark ? '☀️' : '🌙' }}</span>
      <span class="appearance-label">{{ isDark ? 'Light' : 'Dark' }}</span>
    </button>
  </div>
</template>
