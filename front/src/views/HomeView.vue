<script lang="ts" setup>
import Leftbar from '@/components/layout/leftbar.vue'
import Main from '@/components/layout/main.vue'
import HistoryList from '@/components/History/HistoryList.vue'
import type { Chat } from '@/types/message'
import type { HistoryItem as HistoryItemType } from '@/types/history'
import { ref, computed, onUnmounted } from 'vue'

// Данные чатов (используем ref для реактивности, чтобы можно было добавлять новые)
const chats = ref<Chat[]>([
  { id: 1, title: 'Общий чат', lastMessage: 'Привет! Как дела?' },
  { id: 2, title: 'Работа', lastMessage: 'Отправил файлы проекта' },
])

// Состояние активного чата
const activeChatId = ref<string | number>(1) // По умолчанию выбран первый чат
const activeChat = computed(() => chats.value.find((c) => c.id === activeChatId.value))

// Состояние сворачивания сайдбаров
const isLeftbarCollapsed = ref(false)
const isHistoryCollapsed = ref(false)

// Ширина панели истории
const historyWidth = ref(350)
const MIN_HISTORY_WIDTH = 280
const MAX_HISTORY_WIDTH = 600
const COLLAPSED_HISTORY_WIDTH = 8

// Переменные для логики ресайза
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

// === ОБРАБОТЧИКИ СОБЫТИЙ ЧАТА ===
const handleChatSelect = (chat: Chat) => {
  activeChatId.value = chat.id
}

const handleCreateChat = () => {
  const newId = Date.now()
  const newChat: Chat = {
    id: newId,
    title: `Новый чат`,
    lastMessage: 'Начните общение...',
  }
  chats.value.push(newChat)
  activeChatId.value = newId // Сразу переключаемся на новый чат
}

// === ЛОГИКА РЕСАЙЗА ===
const startResize = (e: MouseEvent) => {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = historyWidth.value

  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopResize)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isResizing.value) return

  const diff = e.clientX - startX.value
  const newWidth = startWidth.value + diff

  if (newWidth >= MIN_HISTORY_WIDTH && newWidth <= MAX_HISTORY_WIDTH) {
    historyWidth.value = newWidth
    if (isHistoryCollapsed.value) {
      isHistoryCollapsed.value = false
    }
  }
}

const stopResize = () => {
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''

  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopResize)
}

const expandHistory = () => {
  historyWidth.value = MIN_HISTORY_WIDTH
  isHistoryCollapsed.value = false
}

const collapseHistory = () => {
  historyWidth.value = COLLAPSED_HISTORY_WIDTH
  isHistoryCollapsed.value = true
}

// Моковые данные для истории
const historyItems: HistoryItemType[] = [
  {
    id: 'h1',
    title: 'Не забыть купить...',
    description: 'Текстовая заметка',
    type: 'text',
    timestamp: new Date(),
    group: 'today',
  },
  {
    id: 'h2',
    title: 'Палитра Ocean Blue',
    colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'],
    type: 'color',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    group: 'today',
  },
]

const handleHistorySelect = (item: HistoryItemType) => {
  console.log('Выбран элемент истории:', item.title)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-surface">
    <!-- Левый крайний сайдбар (Leftbar) -->
    <div
      class="relative flex-shrink-0 h-full transition-[width] duration-300 ease-in-out"
      :style="{ width: isLeftbarCollapsed ? '10px' : '280px' }"
    >
      <!-- 🔥 Передаем activeChatId и слушаем события select и create 🔥 -->
      <Leftbar
        :items="chats"
        :active-chat-id="activeChatId"
        v-model:collapsed="isLeftbarCollapsed"
        @select="handleChatSelect"
        @create="handleCreateChat"
      />

      <!-- Divider для Leftbar -->
      <div
        class="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-30 group"
        @dblclick="isLeftbarCollapsed = !isLeftbarCollapsed"
      >
        <div
          class="absolute inset-y-0 w-px bg-sky-500/0 group-hover:bg-sky-500/50 transition-colors"
        ></div>
      </div>
    </div>

    <!-- Панель истории (HistoryList) слева на всю высоту -->
    <div
      class="relative flex-shrink-0 h-full flex flex-col"
      :style="{ width: `${historyWidth}px` }"
    >
      <!-- Развернутая панель с историей -->
      <div
        v-show="!isHistoryCollapsed"
        class="flex-1 overflow-hidden bg-surface-container/40 backdrop-blur-xl border-r border-white/5 flex flex-col"
      >
        <HistoryList :items="historyItems" @select="handleHistorySelect" />
      </div>

      <!-- Кнопка сворачивания (сверху, выступает вправо на 20px) -->
      <div v-show="!isHistoryCollapsed" class="absolute top-20 -right-5 z-30">
        <button
          @click="collapseHistory"
          class="w-10 h-10 flex items-center justify-center bg-surface-container/90 backdrop-blur-xl border border-white/10 rounded-lg text-sky-300/70 hover:text-sky-300 hover:bg-sky-500/20 transition-all group shadow-lg"
          title="Свернуть историю"
        >
          <svg
            class="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Свернутая полоска с кнопкой разворачивания (сверху, выступает вправо на 20px) -->
      <div v-show="isHistoryCollapsed" class="absolute top-20 -right-5 z-30">
        <button
          @click="expandHistory"
          class="w-10 h-10 flex items-center justify-center bg-surface-container/90 backdrop-blur-xl border border-sky-500/30 rounded-lg text-sky-300 hover:text-sky-200 hover:border-sky-500/60 hover:bg-sky-500/20 transition-all shadow-lg group"
          title="Развернуть историю"
        >
          <svg
            class="w-5 h-5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Divider для изменения размера (показывается когда развернуто) -->
      <div
        v-show="!isHistoryCollapsed"
        class="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-30 flex items-center justify-center group"
        @mousedown="startResize"
        title="Потяните для изменения размера"
      >
        <div
          class="absolute inset-y-0 w-px bg-sky-500/0 group-hover:bg-sky-500/50 transition-colors duration-200"
        ></div>
        <div
          class="w-1 h-8 rounded-full bg-sky-500/20 opacity-0 group-hover:opacity-100 group-active:bg-sky-500/60 transition-all duration-200"
        ></div>
      </div>
    </div>

    <!-- Основная область контента -->
    <!-- min-w-0 критически важен для предотвращения переполнения flex-контейнера -->
    <div class="relative flex-1 flex flex-col overflow-hidden min-w-0">
      <div class="absolute inset-0 z-0">
        <!-- 🔥 Передаем активный чат в компонент Main 🔥 -->
        <Main :chat="activeChat" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Кастомный скроллбар */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(192, 198, 218, 0.1);
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(192, 198, 218, 0.2);
}

/* Плавное появление */
@keyframes content-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.relative.z-10 {
  animation: content-fade-in 0.4s ease-out forwards;
}
</style>
