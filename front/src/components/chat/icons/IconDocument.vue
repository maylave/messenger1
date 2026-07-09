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
    <path
      d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
    <path d="M14 3v4h4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
    <path d="M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
</template>
