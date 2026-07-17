<script lang="ts" setup>
import Leftbar from '@/components/layout/leftbar.vue'
import Main from '@/components/layout/main.vue'
import type { Chat } from '@/types/chat'
import { ref } from 'vue'

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

// Состояние сворачивания сайдбара — без этого кнопка в Leftbar не будет ничего делать
const isSidebarCollapsed = ref(false)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-sky-100">
    <!-- Передаём items и подключаем v-model:collapsed -->
    <Leftbar :items="chats" v-model:collapsed="isSidebarCollapsed" />

    <div class="flex-1 flex flex-col min-w-0">
      <Main />
    </div>
  </div>
</template>
