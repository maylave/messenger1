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
      d="M12 2c1 3-3 4-3 7a3 3 0 006 0c0-1-.5-2-1-2.5.5 2 3 3 3 6a5 5 0 01-10 0c0-4 2-5 3-7 .5-1 1.5-2.5 2-3.5z"
      fill="currentColor"
    />
  </svg>
</template>
