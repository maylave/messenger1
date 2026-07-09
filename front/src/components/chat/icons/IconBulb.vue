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
      d="M9 18h6M10 21h4M12 3a6 6 0 00-3 11.2c.6.4 1 1.1 1 1.8h4c0-.7.4-1.4 1-1.8A6 6 0 0012 3z"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="currentColor"
      fill-opacity="0.15"
    />
  </svg>
</template>
