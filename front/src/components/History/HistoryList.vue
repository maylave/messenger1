<script lang="ts" setup>
import { ref, computed } from 'vue'
import HistoryItem from './HistoryItem.vue'
import type { HistoryItem as HistoryItemType } from '@/types/history'

const props = defineProps<{
  items: HistoryItemType[]
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [item: HistoryItemType]
}>()

// Состояние свернутых секций
const collapsedSections = ref<Set<string>>(new Set())

// Фильтры
const searchQuery = ref('')
const selectedTypes = ref<string[]>([])
const showFilters = ref(false)

// Доступные типы
const availableTypes = [
  { key: 'text', label: 'Текст', icon: '' },
  { key: 'color', label: 'Цвета', icon: '🎨' },
  { key: 'code', label: 'Код', icon: '</>' },
  { key: 'image', label: 'Изображения', icon: '🖼️' },
  { key: 'audio', label: 'Аудио', icon: '🎵' },
  { key: 'video', label: 'Видео', icon: '🎬' },
  { key: 'pdf', label: 'PDF', icon: '📄' },
  { key: 'archive', label: 'Архивы', icon: '📦' },
]

// Форматирование даты
const formatDate = (date: Date): string => {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayStr = now.toDateString()
  const yesterdayStr = yesterday.toDateString()
  const itemDateStr = date.toDateString()

  if (itemDateStr === todayStr) {
    return 'Сегодня'
  } else if (itemDateStr === yesterdayStr) {
    return 'Вчера'
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }
}

// Получение ключа даты для группировки
const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Фильтрация элементов
const filteredItems = computed(() => {
  let result = [...props.items]

  // Поиск по названию и описанию
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)),
    )
  }

  // Фильтр по типам
  if (selectedTypes.value.length > 0) {
    result = result.filter((item) => selectedTypes.value.includes(item.type))
  }

  // Сортировка по убыванию даты
  result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return result
})

// Группировка по дням
const groupedItems = computed(() => {
  const groups: Map<string, { date: Date; label: string; items: HistoryItemType[] }> = new Map()

  filteredItems.value.forEach((item) => {
    const dateKey = getDateKey(item.timestamp)
    const date = item.timestamp

    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        date,
        label: formatDate(date),
        items: [],
      })
    }

    groups.get(dateKey)!.items.push(item)
  })

  // Преобразование в массив и сортировка по дате (новые сверху)
  return Array.from(groups.values()).sort((a, b) => b.date.getTime() - a.date.getTime())
})

// Переключение сворачивания секции
const toggleSection = (dateKey: string) => {
  if (collapsedSections.value.has(dateKey)) {
    collapsedSections.value.delete(dateKey)
  } else {
    collapsedSections.value.add(dateKey)
  }
}

// Свернуть все секции
const collapseAll = () => {
  groupedItems.value.forEach((group) => {
    collapsedSections.value.add(getDateKey(group.date))
  })
}

// Развернуть все секции
const expandAll = () => {
  collapsedSections.value.clear()
}

// Переключение типа фильтра
const toggleTypeFilter = (typeKey: string) => {
  const index = selectedTypes.value.indexOf(typeKey)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(typeKey)
  }
}

// Очистить фильтры
const clearFilters = () => {
  searchQuery.value = ''
  selectedTypes.value = []
}

// Проверка, свернута ли секция
const isSectionCollapsed = (dateKey: string) => {
  return collapsedSections.value.has(dateKey)
}

// Обработка выбора элемента
const handleSelect = (item: HistoryItemType) => {
  emit('select', item)
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <!-- Заголовок с поиском -->
    <div class="mb-3 space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sky-50 font-semibold text-sm tracking-wide">Краткая история</h3>
        <div class="flex items-center gap-1">
          <button
            @click="showFilters = !showFilters"
            class="p-1.5 text-sky-300/70 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-all"
            :class="{ 'bg-sky-500/20 text-sky-300': showFilters }"
            aria-label="Фильтры"
            title="Фильтры"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
          <button
            @click="showFilters = !showFilters"
            class="p-1.5 text-sky-300/70 hover:text-sky-300 hover:bg-sky-500/10 rounded-lg transition-all"
            aria-label="Поиск"
            title="Поиск"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Панель фильтров -->
      <div
        v-if="showFilters"
        class="space-y-3 p-3 bg-surface-container-high/60 backdrop-blur-xl border border-white/10 rounded-xl"
      >
        <!-- Поиск -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск..."
            class="w-full px-3 py-2 pl-9 text-sm bg-surface/60 border border-white/10 rounded-lg text-sky-50 placeholder-sky-300/30 focus:outline-none focus:border-sky-500/50 transition-colors"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Фильтры по типам -->
        <div v-if="availableTypes.length > 0">
          <div class="text-xs text-sky-300/50 mb-2">Типы файлов:</div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="type in availableTypes"
              :key="type.key"
              @click="toggleTypeFilter(type.key)"
              class="px-2.5 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1.5"
              :class="
                selectedTypes.includes(type.key)
                  ? 'bg-sky-500/30 border-sky-500/50 text-sky-200'
                  : 'bg-surface/40 border-white/10 text-sky-300/70 hover:border-sky-500/30 hover:text-sky-300'
              "
            >
              <span>{{ type.icon }}</span>
              <span>{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Кнопки управления -->
        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            @click="clearFilters"
            class="text-xs text-sky-300/70 hover:text-sky-200 transition-colors"
          >
            Сбросить фильтры
          </button>
          <div class="flex gap-1">
            <button
              @click="expandAll"
              class="px-2 py-1 text-xs text-sky-300/70 hover:text-sky-200 hover:bg-sky-500/10 rounded transition-colors"
            >
              Развернуть все
            </button>
            <button
              @click="collapseAll"
              class="px-2 py-1 text-xs text-sky-300/70 hover:text-sky-200 hover:bg-sky-500/10 rounded transition-colors"
            >
              Свернуть все
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Контейнер списка -->
    <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
      <div
        v-if="filteredItems.length === 0"
        class="flex flex-col items-center justify-center py-12 text-sky-300/50"
      >
        <svg
          class="w-12 h-12 mb-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-sm">Ничего не найдено</p>
      </div>

      <div
        v-for="group in groupedItems"
        :key="getDateKey(group.date)"
        class="bg-surface-container/40 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden"
      >
        <!-- Заголовок секции (кликабельный) -->
        <button
          @click="toggleSection(getDateKey(group.date))"
          class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
        >
          <div class="flex items-center gap-3">
            <span
              class="text-xs font-medium uppercase tracking-wider text-sky-300/70 group-hover:text-sky-200 transition-colors"
            >
              {{ group.label }}
            </span>
            <span
              class="px-2 py-0.5 text-[10px] font-medium bg-sky-500/20 text-sky-300 rounded-full"
            >
              {{ group.items.length }}
            </span>
          </div>
          <svg
            class="w-4 h-4 text-sky-300/50 transition-transform duration-200"
            :class="{ 'rotate-180': !isSectionCollapsed(getDateKey(group.date)) }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Элементы секции -->
        <div
          v-show="!isSectionCollapsed(getDateKey(group.date))"
          class="divide-y divide-white/5 border-t border-white/5"
        >
          <HistoryItem
            v-for="item in group.items"
            :key="item.id"
            :item="item"
            @select="handleSelect"
          />
        </div>
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
  background: rgba(192, 198, 218, 0.15);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(192, 198, 218, 0.25);
}
</style>
