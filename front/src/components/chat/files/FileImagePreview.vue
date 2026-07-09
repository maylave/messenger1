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
  <div class="mt-2">
    <div v-if="fileUrl" class="rounded-lg overflow-hidden max-w-[240px] border border-white/10">
      <img :src="fileUrl" :alt="fileName" class="w-full h-auto block" />
    </div>
    <div v-else class="flex items-center gap-3">
      <span class="w-8 h-8 shrink-0 text-white/90">
        <component :is="icon" />
      </span>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{{ fileName }}</p>
      </div>
    </div>
    <p v-if="fileSize" class="text-xs opacity-60 mt-1">{{ fileSize }}</p>
  </div>
</template>
