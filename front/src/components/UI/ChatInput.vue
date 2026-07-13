<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
}>()

// Локальное состояние
const text = ref(props.modelValue)
const showSuggestions = ref(false)
const suggestionIndex = ref(0)

// Базовый словарь команд и фраз
const baseDictionary = [
  '@Сабочка',
  '@важно',
  '@избранное',
  '@fav',
  '@todo',
  '@idea',
  '@напоминание',
  '#важно',
  '#избранное',
  '#fav',
  '#todo',
  '#idea',
  '#напоминание',
  '#232112',
  '#235521',
  '#FF5733',
  '#C70039',
  '#900C3F',
  'Привет',
  'Как дела?',
  'Спасибо',
  'Ок',
  'Договорились',
  'Файл',
  'Документ',
  'Изображение',
  'Отчет',
  'Проект',
]

// Интерфейс для элемента подсказки
interface SuggestionItem {
  value: string
  color?: string // HEX код цвета, если это цветовая подсказка
}

// Динамическая генерация подсказок
const suggestions = computed<SuggestionItem[]>(() => {
  if (!text.value || !showSuggestions.value) return []

  const words = text.value.trim().split(/\s+/)
  const currentWord = words[words.length - 1] || ''

  if (currentWord.length < 1) return []

  // 1. Если пользователь вводит цвет (начинается с #)
  if (currentWord.startsWith('#')) {
    const results: SuggestionItem[] = []

    // Добавляем совпадения из базового словаря
    baseDictionary
      .filter((item) => item.toLowerCase().startsWith(currentWord.toLowerCase()))
      .forEach((item) => {
        results.push({ value: item, color: item })
      })

    // Динамически добавляем сам введенный хеш как валидную подсказку
    // Проверка на валидность HEX (3, 6 или 8 символов после #)
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/
    if (hexPattern.test(currentWord)) {
      // Проверяем, нет ли уже такого цвета в результатах
      if (!results.some((r) => r.value === currentWord)) {
        results.unshift({ value: currentWord, color: currentWord })
      }
    }

    return results.slice(0, 5)
  }

  // 2. Обычные подсказки (для @ и слов)
  return baseDictionary
    .filter((item) => item.toLowerCase().startsWith(currentWord.toLowerCase()))
    .map((item) => ({ value: item }))
    .slice(0, 5)
})

// Обработка ввода
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  text.value = target.value
  emit('update:modelValue', text.value)

  const words = text.value.trim().split(/\s+/)
  const lastWord = words[words.length - 1] || ''

  showSuggestions.value = lastWord.startsWith('@') || lastWord.startsWith('#')
  suggestionIndex.value = 0
}

// Выбор подсказки
const selectSuggestion = (item: SuggestionItem) => {
  const words = text.value.trim().split(/\s+/)
  words[words.length - 1] = item.value
  text.value = words.join(' ') + ' '
  emit('update:modelValue', text.value)
  showSuggestions.value = false

  nextTick(() => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    textarea?.focus()
    textarea.setSelectionRange(textarea.value.length, textarea.value.length)
  })
}

// Навигация клавишами
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    if (showSuggestions.value && suggestions.value.length > 0) {
      event.preventDefault()
      const selected = suggestions.value[suggestionIndex.value]
      if (selected) selectSuggestion(selected)
      return
    }
    event.preventDefault()
    emit('send')
    return
  }

  if (!showSuggestions.value || suggestions.value.length === 0) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    suggestionIndex.value = (suggestionIndex.value + 1) % suggestions.value.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    suggestionIndex.value =
      (suggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length
  } else if (event.key === 'Tab') {
    event.preventDefault()
    const selected = suggestions.value[suggestionIndex.value]
    if (selected) selectSuggestion(selected)
  } else if (event.key === 'Escape') {
    showSuggestions.value = false
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    text.value = newVal
    if (!newVal) showSuggestions.value = false
  },
)
</script>

<template>
  <div class="relative flex-1">
    <textarea
      :value="text"
      @input="handleInput"
      @keydown="handleKeydown"
      :placeholder="placeholder || 'Введите сообщение...'"
      rows="1"
      class="w-full px-4 py-2 bg-frame-900/20 text-sky-50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-sky-50/50"
      style="min-height: 44px; max-height: 120px"
    />

    <!-- Панель подсказок T9 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute bottom-full left-0 right-0 mb-2 bg-frame-700 border border-frame-600 rounded-lg shadow-xl overflow-hidden z-50"
      >
        <button
          v-for="(item, index) in suggestions"
          :key="item.value"
          @click="selectSuggestion(item)"
          :class="[
            'w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3',
            index === suggestionIndex ? 'bg-sky-600 text-white' : 'text-sky-50 hover:bg-frame-600',
          ]"
        >
          <!-- Квадратик цвета (показывается только если есть свойство color) -->
          <div
            v-if="item.color"
            class="w-4 h-4 rounded-sm border border-white/20 shrink-0 shadow-sm"
            :style="{ backgroundColor: item.color }"
          ></div>

          <!-- Текст подсказки -->
          <span>{{ item.value }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>
