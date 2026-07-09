<script lang="ts" setup>
import { computed } from 'vue'
import ColorPalette from './ColorPalette.vue'
import type { Message } from '@/types/message.ts'

const props = defineProps<{ message: Message }>()

// --- 1. ЦВЕТА ---
const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g

const detectedColors = computed(() => {
  if (!props.message.text) return []
  const matches = [...props.message.text.matchAll(hexColorRegex)]
  return [...new Set(matches.map((m) => m[0]))]
})

// --- 2. ТЕГИ ---
// \w в JS не включает кириллицу, поэтому явно перечисляем допустимые символы слова
const WORD_CHARS = 'a-zA-Zа-яА-ЯёЁ0-9_'
const tagPattern = `[@#]\\s*(важн[${WORD_CHARS}]*|избранн[${WORD_CHARS}]*|fav[${WORD_CHARS}]*|todo|idea[${WORD_CHARS}]*|important[${WORD_CHARS}]*|срочн[${WORD_CHARS}]*|напомин[${WORD_CHARS}]*)(?![${WORD_CHARS}])`
const tagRegex = new RegExp(tagPattern, 'gi')

const detectedTags = computed(() => {
  if (!props.message.text) return []
  const matches = [...props.message.text.matchAll(tagRegex)]
  return matches.map((m) => {
    const raw = (m[1] ?? '').toLowerCase().trim()
    if (raw.startsWith('избранн') || raw.startsWith('fav'))
      return { type: 'favorite', label: 'Избранное', icon: '', priority: 2 }
    if (raw.startsWith('важн') || raw.startsWith('important') || raw.startsWith('срочн'))
      return { type: 'important', label: 'Важно', icon: '', priority: 1 }
    if (raw.startsWith('todo')) return { type: 'todo', label: 'Задача', icon: '', priority: 3 }
    if (raw.startsWith('idea')) return { type: 'idea', label: 'Идея', icon: '', priority: 4 }
    if (raw.startsWith('напомин'))
      return { type: 'reminder', label: 'Напоминание', icon: '', priority: 5 }
    return { type: 'tag', label: raw, icon: '#', priority: 6 }
  })
})

// --- 3. ПРИОРИТЕТНЫЙ ТЕГ ---
const priorityTag = computed(() => {
  if (detectedTags.value.length === 0) return null
  const sorted = [...detectedTags.value].sort((a, b) => a.priority - b.priority)
  return sorted[0]
})

// --- 4. СТИЛИ СООБЩЕНИЯ ---
const getMessageClasses = () => {
  if (!priorityTag.value) return 'bg-sky-600 shadow-lg'

  const classes: Record<string, string> = {
    important:
      'bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-300 shadow-red-500/50 shadow-xl animate-pulse-important',
    favorite:
      'bg-gradient-to-br from-yellow-500 to-yellow-700 border-2 border-yellow-200 shadow-yellow-500/50 shadow-xl',
    todo: 'bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-300 shadow-blue-500/50 shadow-xl',
    idea: 'bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-purple-300 shadow-purple-500/50 shadow-xl',
    reminder:
      'bg-gradient-to-br from-orange-500 to-orange-700 border-2 border-orange-300 shadow-orange-500/50 shadow-xl',
    tag: 'bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-300 shadow-gray-500/50 shadow-xl',
  }

  return classes[priorityTag.value.type] || 'bg-sky-600 shadow-lg'
}

// --- 5. ОЧИСТКА ТЕКСТА ---
const cleanText = computed(() => {
  if (!props.message.text) return ''
  let text = props.message.text
  text = text.replace(tagRegex, '').trim()
  text = text.replace(hexColorRegex, '').trim()
  return text.replace(/\s+/g, ' ')
})

// --- 6. ЛОГИКА ОТОБРАЖЕНИЯ ---
const isColorPaletteOnly = computed(() => {
  const hasColors = detectedColors.value.length > 0
  const hasFiles = !!props.message.fileName
  const hasText = cleanText.value.length > 0
  return hasColors && !hasFiles && !hasText
})

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return 'Вчера'
  if (days < 7)
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getFileIcon = (type?: string) => {
  const icons: Record<string, string> = { image: '🖼️', document: '📄', video: '🎥', audio: '🎵' }
  return icons[type || 'other'] || '📎'
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="flex justify-end">
    <!-- ВАРИАНТ 1: ЧИСТАЯ ПАЛИТРА -->
    <div
      v-if="isColorPaletteOnly"
      :key="'palette-' + message.id"
      class="group relative w-[280px] rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-[1.02]"
      :class="getMessageClasses()"
    >
      <div
        v-if="detectedTags.length > 0"
        class="absolute top-2 left-2 z-10 flex flex-wrap gap-1 pointer-events-none"
      >
        <span
          v-for="tag in detectedTags"
          :key="tag.type"
          class="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md backdrop-blur-sm border border-white/20"
          :class="{
            'bg-red-500/90': tag.type === 'important',
            'bg-yellow-500/90': tag.type === 'favorite',
            'bg-blue-500/90': tag.type === 'todo',
            'bg-purple-500/90': tag.type === 'idea',
            'bg-orange-500/90': tag.type === 'reminder',
            'bg-gray-500/90': tag.type === 'tag',
          }"
        >
          {{ tag.icon }} {{ tag.label }}
        </span>
      </div>

      <ColorPalette :colors="detectedColors" @copy="copyToClipboard">
        <template #time>
          <div
            class="absolute bottom-2 right-3 text-xs text-white/70 font-medium drop-shadow-md pointer-events-none"
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </template>
      </ColorPalette>
    </div>

    <!-- ВАРИАНТ 2: ОБЫЧНОЕ СООБЩЕНИЕ -->
    <div
      v-else
      :key="'message-' + message.id"
      class="max-w-[70%] px-4 py-2 rounded-lg rounded-br-none relative group transition-all duration-300 text-white"
      :class="getMessageClasses()"
    >
      <!-- Метки внутри сообщения -->
      <div v-if="detectedTags.length > 0" class="flex flex-wrap gap-1 mb-2">
        <span
          v-for="tag in detectedTags"
          :key="tag.type"
          class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/20 border border-white/10"
        >
          {{ tag.icon }} {{ tag.label }}
        </span>
      </div>

      <!-- Очищенный текст -->
      <div v-if="cleanText" class="text-sm whitespace-pre-wrap break-words">
        {{ cleanText }}
      </div>

      <!-- Мини-палитра внутри текста -->
      <div v-if="detectedColors.length > 0" class="mt-2 flex flex-wrap gap-1.5">
        <div
          v-for="color in detectedColors"
          :key="color"
          @click.stop="copyToClipboard(color)"
          class="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 rounded-full pl-1 pr-2 py-0.5 cursor-pointer transition-all active:scale-95 border border-white/10"
        >
          <div
            class="w-4 h-4 rounded-full shadow-sm border border-white/20"
            :style="{ backgroundColor: color }"
          ></div>
          <span class="text-[10px] font-mono opacity-90">{{ color }}</span>
        </div>
      </div>

      <!-- Файл -->
      <div v-if="message.fileName" class="flex items-center gap-3 mt-2">
        <span class="text-2xl">{{ getFileIcon(message.fileType) }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ message.fileName }}</p>
          <p class="text-xs opacity-70">{{ message.fileSize }}</p>
        </div>
      </div>

      <p class="text-xs mt-2 opacity-60 text-right select-none">
        {{ formatTime(message.timestamp) }}
      </p>
    </div>
  </div>
</template>

<style>
.animate-pulse-important {
  animation: pulse-important 2s ease-in-out infinite;
}

@keyframes pulse-important {
  0%,
  100% {
    filter: brightness(1);
    transform: scale(1);
  }
  50% {
    filter: brightness(1.1);
    transform: scale(1.02);
  }
}
</style>
