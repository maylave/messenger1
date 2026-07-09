<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: '100%' })
</script>
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
  >
    <rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
    <path d="M17 9.5l4-2.3v9.6l-4-2.3z" fill="currentColor" />
  </svg>
</template>
