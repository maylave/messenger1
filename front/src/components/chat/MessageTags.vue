<script setup lang="ts">
import type { TagMatch } from '@/types/message'

defineProps<{
  tags: TagMatch[]
  variant?: 'overlay' | 'inline'
}>()
</script>

<template>
  <div
    class="flex flex-wrap gap-1"
    :class="variant === 'overlay' ? 'absolute top-2 left-2 z-10 pointer-events-none' : 'mb-2'"
  >
    <span
      v-for="tag in tags"
      :key="tag.type"
      class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md border border-white/20"
      :class="variant === 'overlay' ? tag.badgeClass : 'bg-black/20 border-white/10'"
    >
      <span class="w-3 h-3 shrink-0"><component :is="tag.icon" /></span>
      {{ tag.label }}
    </span>
  </div>
</template>
