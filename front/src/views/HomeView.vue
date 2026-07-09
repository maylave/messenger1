<script lang="ts" setup>
import Leftbar from '@/components/layout/leftbar.vue'
import Main from '@/components/layout/main.vue'
import type { Chat } from '@/types/chat'

// Объявляем данные
const chats: Chat[] = [
  {
    id: 1,
    title: 'Общий чат',
  },
  {
    id: 2,
    title: 'Работа',
  },
]
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-sky-100">
    <!-- Передаём items -->
    <Leftbar :items="chats" />

    <div class="flex-1 flex flex-col min-w-0">
      
      <Main />
    </div>
  </div>
</template>
