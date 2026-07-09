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
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6" />
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
    <path
      d="M3 16l5-5 4 4 3-3 6 6"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
