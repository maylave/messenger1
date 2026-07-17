<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Chat } from '@/types/chat'
import ChatItem from '@/components/chatItem.vue'

const props = withDefaults(
  defineProps<{
    items: Chat[]
    activeChatId?: string | number
    loading?: boolean
    collapsed?: boolean
  }>(),
  {
    collapsed: false,
  },
)

const emit = defineEmits<{
  select: [chat: Chat]
  create: []
  delete: [id: string | number] // Новое событие для удаления
  'update:collapsed': [value: boolean]
}>()

const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items

  const query = searchQuery.value.toLowerCase()
  return props.items.filter((chat) => {
    const title = (chat as any).title || (chat as any).name || ''
    return title.toLowerCase().includes(query)
  })
})

const toggleCollapsed = () => {
  emit('update:collapsed', !props.collapsed)
}

const handleCreateChat = () => {
  emit('create')
  // Очищаем поиск после создания, чтобы увидеть новый чат
  searchQuery.value = ''
}

const handleDeleteChat = (id: string | number) => {
  emit('delete', id)
}
</script>

<template>
  <div
    class="relative h-screen flex-shrink-0 transition-[width] duration-300 ease-in-out"
    :class="collapsed ? 'w-0' : 'w-64'"
  >
    <!-- Кнопка сворачивания -->
    <button
      @click="toggleCollapsed"
      class="absolute top-1/2 -right-5 -translate-y-1/2 z-30 w-10 h-10 rounded-xl bg-sky-800 border border-sky-600/50 shadow-lg flex items-center justify-center text-sky-400 hover:text-sky-200 hover:bg-sky-700 hover:border-sky-500 transition-all duration-200 group"
      :title="collapsed ? 'Развернуть' : 'Свернуть'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 transition-transform duration-300"
        :class="{ 'rotate-180': collapsed }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <aside
      class="absolute inset-y-0 left-0 h-screen w-64 bg-frame-900/20 border-r border-white/5 flex flex-col overflow-hidden transition-opacity duration-300"
      :class="collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    >
      <!-- Заголовок -->
      <div class="p-4 border-b border-white/5 flex items-center justify-between min-h-[64px]">
        <h2 class="text-sky-50 font-semibold tracking-wide">Чаты</h2>
        <span class="text-xs text-sky-400/60 font-mono">{{ filteredItems.length }}</span>
      </div>

      <!-- Поиск -->
      <div class="p-3 border-b border-white/5">
        <div class="relative group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 absolute left-3 top-2.5 text-sky-400/40 group-focus-within:text-sky-400 transition-colors"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск чатов..."
            class="w-full bg-frame-800/50 text-sky-100 placeholder-sky-400/30 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:bg-frame-800 border border-transparent focus:border-sky-500/20 transition-all"
          />
        </div>
      </div>

      <!-- Список чатов с анимацией -->
      <nav class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <!-- Состояние загрузки -->
        <div v-if="loading" class="space-y-2 px-1">
          <div v-for="i in 5" :key="i" class="bg-frame-800/50 rounded-lg animate-pulse h-16"></div>
        </div>

        <!-- Пустое состояние -->
        <div
          v-else-if="filteredItems.length === 0"
          class="flex flex-col items-center justify-center h-40 text-sky-400/40 text-sm px-4 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p v-if="searchQuery">Ничего не найдено</p>
          <p v-else>Список чатов пуст</p>
        </div>

        <!-- Элементы списка -->
        <TransitionGroup name="list" tag="div" class="space-y-1">
          <ChatItem
            v-for="item in filteredItems"
            :key="item.id"
            :chat="item"
            :is-active="item.id === activeChatId"
            @select="(chat) => emit('select', chat)"
            @delete="handleDeleteChat"
          />
        </TransitionGroup>
      </nav>

      <!-- Кнопка "Новый чат" -->
      <div class="p-3 border-t border-white/5 bg-frame-900/5">
        <button
          @click="handleCreateChat"
          class="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-900/20 hover:shadow-sky-500/20 transition-all active:scale-[0.98]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Новый чат</span>
        </button>
      </div>
    </aside>
  </div>
</template>
<style scoped>
/* Анимация для TransitionGroup (список) */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
  position: absolute;
  width: 100%;
}

.list-leave-active {
  position: absolute;
}

/* Градиентная рамка для сайдбара */
aside {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.9) 90%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Скроллбар в стиле модалки */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.4) 0%, rgba(56, 189, 248, 0.2) 100%);
  border-radius: 8px;
  border: 1px solid transparent;
  background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.6) 0%, rgba(56, 189, 248, 0.4) 100%);
}

/* Анимация пульсации для загрузки */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-pulse {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    90deg,
    rgba(30, 41, 59, 0.4) 0%,
    rgba(56, 189, 248, 0.1) 50%,
    rgba(30, 41, 59, 0.4) 100%
  );
  background-size: 1000px 100%;
}

/* Плавное появление пустого состояния */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стили для input */
input::placeholder {
  transition: opacity 0.2s ease;
}

input:focus::placeholder {
  opacity: 0.5;
}

/* Glow эффект для активной кнопки */
button:active {
  transform: scale(0.98);
}
</style>
