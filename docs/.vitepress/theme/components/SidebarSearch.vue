<script setup lang="ts">
function trigger() {
  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'k', metaKey: true, ctrlKey: true, bubbles: true,
  }))
}
</script>

<template>
  <div class="sidebar-search">
    <button @click="trigger" class="sidebar-search-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <span>Search</span>
      <kbd>⌘K</kbd>
    </button>
  </div>
</template>
