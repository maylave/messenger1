<script setup lang="ts">
import MessageColorSwatches from '@/components/chat/MessageColorSwatches.vue'
import MessageTags from '@/components/chat/MessageTags.vue'
import type { Component } from 'vue'
import { computed, ref } from 'vue'
import type { TagMatch } from '@/types/message'

const props = defineProps<{
  fileName: string
  fileSize?: string
  fileUrl?: string
  icon: Component
  textContent?: string
  fileTags?: TagMatch[]
  fileColors?: string[]
}>()

// Состояние развернутости всего блока
const isCollapsed = ref(false)
// Состояние развернутости текста
const isTextExpanded = ref(false)

const tags = computed(() => props.fileTags || [])
const colors = computed(() => props.fileColors || [])

const displayText = computed(() => {
  if (!props.textContent) return ''
  const limit = 350
  if (isTextExpanded.value || props.textContent.length <= limit) {
    return props.textContent
  }
  return props.textContent.slice(0, limit) + '...'
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleTextExpand = () => {
  isTextExpanded.value = !isTextExpanded.value
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
  <div class="mt-3">
    <!-- Шапка файла (всегда видна) -->
    <div class="flex items-center gap-3 cursor-pointer select-none" @click="toggleCollapse">
      <!-- Иконка файла -->
      <div class="relative">
        <div
          class="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-sky-500/30 to-sky-600/20 text-sky-300 rounded-xl border border-sky-400/30 shadow-lg shadow-sky-500/10"
        >
          <component :is="icon" class="w-6 h-6" />
        </div>
        <div
          class="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center border-2 border-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3 h-3 text-white transition-transform duration-300"
            :class="{ 'rotate-180': !isCollapsed }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Информация о файле -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate leading-tight mb-0.5">{{ fileName }}</p>
        <p v-if="fileSize" class="text-xs text-sky-200/60 font-medium">{{ fileSize }}</p>
      </div>

      <!-- Кнопка скачивания (в шапке) -->
      <a
        v-if="fileUrl"
        :href="fileUrl"
        :download="fileName"
        @click.stop
        class="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-sky-200 border border-sky-400/30 transition-all duration-200 hover:scale-105"
        title="Скачать файл"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </a>
    </div>

    <!-- Разворачиваемый контент -->
    <div
      class="transition-all duration-300 ease-in-out overflow-hidden"
      :class="isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'"
    >
      <div class="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
        <!-- Теги -->
        <MessageTags
          v-if="tags.length > 0"
          :tags="tags"
          variant="inline"
          class="flex flex-wrap gap-1.5"
        />

        <!-- Текстовое содержимое -->
        <div v-if="textContent" class="relative">
          <div
            class="text-xs text-sky-100/90 whitespace-pre-wrap break-all bg-black/40 p-3 rounded-xl font-mono border border-white/10 shadow-inner"
            :class="isTextExpanded ? '' : 'max-h-24 overflow-hidden relative'"
          >
            {{ displayText }}

            <!-- Градиент затемнения -->
            <div
              v-if="!isTextExpanded && textContent.length > 350"
              class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none rounded-b-xl"
            ></div>
          </div>

          <!-- Кнопка расширения текста -->
          <button
            v-if="textContent.length > 350"
            @click="toggleTextExpand"
            class="mt-2 text-[10px] font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 group/btn"
          >
            <span>{{ isTextExpanded ? 'Свернуть' : 'Показать полностью' }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 transition-transform duration-300 group-hover/btn:scale-110"
              :class="{ 'rotate-180': isTextExpanded }"
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
        </div>

        <!-- Цветовые свотчи -->
        <MessageColorSwatches v-if="colors.length > 0" :colors="colors" @copy="copyToClipboard" />

        <!-- Кнопка скачивания (внизу, если нет в шапке) -->
      </div>
    </div>
  </div>
</template>
