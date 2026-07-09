<script lang="ts" setup>
import type { Chat } from '@/types/chat'
import ChatItem from '../chatItem.vue'

const props = defineProps<{
  items: Chat[]
  activeChatId?: string | number
}>()

const emit = defineEmits<{
  select: [chat: Chat]
}>()
</script>

<template>
  <aside class="w-60 h-screen bg-frame-900 border-r border-frame-900/50 flex flex-col">
    <div class="p-4 border-b border-frame-900/50">
      <h2 class="text-sky-50 font-semibold">Чаты</h2>
    </div>

    <nav class="flex-1 overflow-y-auto p-2 space-y-1">
      <ChatItem
        v-for="item in items"
        :key="item.id"
        :chat="item"
        :is-active="item.id === activeChatId"
        @select="(chat) => emit('select', chat)"
      />
    </nav>
  </aside>
</template>