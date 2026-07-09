<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  fileName: string
  fileSize?: string
  fileUrl?: string
  icon: Component
}>()
</script>

<template>
  <div class="flex items-center gap-3 mt-2">
    <span class="w-8 h-8 shrink-0 text-white/90">
      <component :is="icon" />
    </span>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">{{ fileName }}</p>
      <p v-if="fileSize" class="text-xs opacity-70">{{ fileSize }}</p>
    </div>
  </div>
</template>
