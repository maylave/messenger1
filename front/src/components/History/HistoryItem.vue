<script lang="ts" setup>
import type { HistoryItem as HistoryItemType } from '@/types/history'
import { computed } from 'vue'

const props = defineProps<{
  item: HistoryItemType
}>()

const emit = defineEmits<{
  select: [item: HistoryItemType]
}>()

// Вынесено за пределы компонента: строки SVG больше не пересобираются
// на каждый ре-рендер / реактивный триггер, а создаются один раз на модуль.
//
// Важно: намеренно НЕ типизируем как Record<string, IconConfig> — при таком
// индексном типе TS (при noUncheckedIndexedAccess) считает ICONS[key] как
// `IconConfig | undefined`, и это же касается ICONS.text, так что
// `ICONS[type] ?? ICONS.text` всё равно даёт `IconConfig | undefined` —
// именно это Volar и подсвечивал. Через `satisfies` ключи остаются
// литеральными, и обращение по одному из известных ключей типизируется
// как гарантированно определённое значение.
const ICONS = {
  text: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    `,
    color: 'text-sky-300',
    bg: 'bg-sky-500/10',
  },
  color: {
    component: 'palette',
    color: 'text-sky-300',
    bg: 'bg-sky-500/10',
  },
  code: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    `,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  image: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    `,
    // было emerald — совпадало по цвету с spreadsheet, из-за чего
    // на глаз путались "изображение" и "таблица". Сделал отдельный оттенок.
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  audio: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    `,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  pdf: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    `,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  font: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    `,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  spreadsheet: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    `,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  video: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    `,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  archive: {
    component: `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    `,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
} satisfies Record<string, { component: string; color: string; bg: string }>

type IconKey = keyof typeof ICONS

// `type in ICONS` — рантайм-проверка одновременно служит type guard'ом:
// внутри тернарника TS сужает `type` до IconKey, поэтому ICONS[type]
// возвращает гарантированно определённое значение, без `| undefined`.
const iconComponent = computed(() => {
  const type = props.item.type
  return type in ICONS ? ICONS[type as IconKey] : ICONS.text
})

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Детерминированный псевдо-рандом на основе id элемента —
// высоты полосок waveform больше не "прыгают" при каждом ре-рендере.
const waveformBars = computed(() => {
  const seed = props.item.id
    .toString()
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)

  return Array.from({ length: 20 }, (_, i) => {
    const pseudo = Math.sin(seed + i * 12.9898) * 43758.5453
    const frac = pseudo - Math.floor(pseudo)
    return {
      height: 20 + frac * 80, // 20%–100%
      opacity: 0.5 + frac * 0.5,
    }
  })
})
</script>

<template>
  <button
    @click="emit('select', item)"
    class="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high/60 transition-all duration-200 group relative overflow-hidden"
  >
    <!-- Hover градиент -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>

    <!-- Иконка -->
    <div
      class="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg transition-transform duration-200 group-hover:scale-105"
      :class="[iconComponent.bg, iconComponent.color]"
    >
      <!-- Специальная обработка для палитры -->
      <template v-if="item.type === 'color'">
        <div class="flex gap-0.5">
          <div
            v-for="(color, i) in item.colors?.slice(0, 4)"
            :key="i"
            class="w-1.5 h-4 rounded-sm"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </template>

      <!-- SVG иконки -->
      <template v-else>
        <div v-html="iconComponent.component"></div>
      </template>
    </div>

    <!-- Контент -->
    <div class="flex-1 min-w-0 text-left relative z-10">
      <div class="flex items-center justify-between gap-2">
        <h4 class="text-sky-50 font-medium text-sm truncate">
          {{ item.title }}
        </h4>
        <span class="text-xs text-sky-300/50 font-mono shrink-0">
          {{ formatTime(item.timestamp) }}
        </span>
      </div>

      <p v-if="item.description" class="text-xs text-sky-300/60 truncate mt-0.5">
        {{ item.description }}
      </p>

      <!-- Метаданные для аудио -->
      <div v-if="item.type === 'audio' && item.duration" class="flex items-center gap-2 mt-1">
        <span class="text-[10px] text-sky-300/40">{{ item.duration }}</span>
        <div class="flex-1 h-6 flex items-center gap-0.5">
          <div
            v-for="(bar, i) in waveformBars"
            :key="i"
            class="w-0.5 bg-sky-400/40 rounded-full"
            :style="{ height: `${bar.height}%`, opacity: bar.opacity }"
          ></div>
        </div>
      </div>

      <!-- Метаданные для файлов -->
      <p v-if="item.fileSize" class="text-[11px] text-sky-300/40 mt-0.5">
        {{ item.fileSize }}
      </p>
    </div>

    <!-- Индикатор активности (появляется при hover) -->
    <div
      class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-400 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-sky-400/50"
    ></div>
  </button>
</template>
