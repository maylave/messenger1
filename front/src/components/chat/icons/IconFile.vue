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
      d="M14 2H6a1 1 0 00-1 1v18a1 1 0 001 1h12a1 1 0 001-1V8l-5-6z"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
    <path d="M14 2v6h5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
  </svg>
</template>
