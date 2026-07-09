<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: '100%' })
</script>
<template>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
    <path d="M7 12.5l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>