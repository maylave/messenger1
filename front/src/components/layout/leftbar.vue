<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Chat } from '@/types/chat'
import ChatItem from '../chatItem.vue'

const props = withDefaults(
  defineProps<{
    items: Chat[]
    activeChatId?: string | number
    loading?: boolean
    collapsed?: boolean // Управление состоянием сворачивания
  }>(),
  {
    collapsed: false,
  },
)

const emit = defineEmits<{
  select: [chat: Chat]
  create: []
  'update:collapsed': [value: boolean] // Для v-model:collapsed
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
</script>

<template>
  <!-- Обёртка задаёт итоговую ширину в layout и не обрезает кнопку -->
  <div
    class="relative h-screen flex-shrink-0 transition-[width] duration-300 ease-in-out"
    :class="collapsed ? 'w-0' : 'w-60'"
  >
    <!-- Кнопка сворачивания: снаружи overflow-hidden контейнера, поэтому не обрезается при w-0 -->
    <button
      @click="toggleCollapsed"
      class="absolute top-1/2 -right-6 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-sky-700 border border-sky-600/70 shadow-lg flex items-center justify-center text-sky-50/80 hover:text-sky-50 hover:bg-sky-600 hover:scale-110 active:scale-95 transition-all duration-200"
      :title="collapsed ? 'Развернуть' : 'Свернуть'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5 transition-transform duration-300"
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
      class="absolute inset-y-0 left-0 h-screen w-60 bg-sky-800 border-r border-sky-800/50 flex flex-col overflow-hidden transition-opacity duration-200"
      :class="collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    >
      <!-- Заголовок -->
      <div class="p-4 border-b border-sky-800/50 flex items-center min-h-[64px]">
        <h2 class="text-sky-50 font-semibold whitespace-nowrap">Чаты</h2>
      </div>

      <!-- Поиск -->
      <div class="p-2 border-b border-sky-800/50">
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 absolute left-2.5 top-2.5 text-sky-50/50"
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
            placeholder="Поиск..."
            class="w-full bg-sky-800 text-sky-50 placeholder-sky-50/40 text-sm rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500/50 border border-sky-800/50"
          />
        </div>
      </div>

      <!-- Список чатов -->
      <nav class="flex-1 overflow-y-auto p-2 space-y-1">
        <!-- Состояние загрузки -->
        <div v-if="loading" class="space-y-2">
          <div v-for="i in 6" :key="i" class="bg-sky-700/50 rounded-md animate-pulse h-14"></div>
        </div>

        <!-- Пустое состояние -->
        <div
          v-else-if="filteredItems.length === 0"
          class="text-center text-sky-50/50 text-sm mt-8 px-2"
        >
          <p>
            <template v-if="searchQuery">Чаты не найдены</template>
            <template v-else>Нет активных чатов</template>
          </p>
        </div>

        <!-- Элементы списка -->
        <template v-else>
          <ChatItem
            v-for="item in filteredItems"
            :key="item.id"
            :chat="item"
            :is-active="item.id === activeChatId"
            :collapsed="false"
            @select="(chat) => emit('select', chat)"
          />
        </template>
      </nav>

      <!-- Кнопка "Новый чат" -->
      <div class="p-2 border-t border-sky-800/50">
        <button
          @click="emit('create')"
          class="w-full text-sky-50/70 hover:text-sky-50 transition-colors py-2 rounded hover:bg-sky-700/50 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm font-medium">Новый чат</span>
        </button>
      </div>
    </aside>
  </div>
</template>
