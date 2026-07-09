<script lang="ts" setup>
import type { Chat } from '@/types/chat'

defineProps<{
  chat: Chat
  isActive: boolean
}>()

const emit = defineEmits<{
  select: [chat: Chat]
}>()
</script>

<template>
  <button
    class="w-full text-left px-3 py-2 rounded hover:bg-frame-600 text-sky-100 transition"
    @click="emit('select', chat)"
    :class="{ 'bg-frame-700': isActive }"
  >
    <div class="font-medium text-sm text-sky-50 truncate">
      {{ chat.title }}
    </div>
  </button>
</template>