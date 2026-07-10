<script setup lang="ts">
import MessageColorSwatches from '@/components/chat/MessageColorSwatches.vue'
import MessageTags from '@/components/chat/MessageTags.vue'
import type { Component } from 'vue'
import { computed, ref } from 'vue'
// useFileContent здесь не обязателен, так как мы получаем уже готовые теги/цвета от родителя,
// но можно оставить для страховки, если родитель не передал данные.
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

// Состояние развернутости текста
const isExpanded = ref(false)

// Используем переданные данные или пустые массивы
const tags = computed(() => props.fileTags || [])
const colors = computed(() => props.fileColors || [])

// Логика обрезки текста (300 символов)
const displayText = computed(() => {
  if (!props.textContent) return ''
  const limit = 350
  if (isExpanded.value || props.textContent.length <= limit) {
    return props.textContent
  }
  return props.textContent.slice(0, limit) + '...'
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
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
  <div class="mt-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition group">
    
    <!-- 1. Шапка файла (Иконка + Название) -->
    <div class="flex items-center gap-3 mb-3">
      <span class="w-10 h-10 shrink-0 flex items-center justify-center bg-sky-500/20 text-sky-400 rounded-lg">
        <component :is="icon" class="w-6 h-6" />
      </span>
      
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate leading-tight">{{ fileName }}</p>
        <p v-if="fileSize" class="text-xs text-sky-200/60 mt-0.5">{{ fileSize }}</p>
      </div>
    </div>

    <!-- 2. Теги (если нашлись в тексте) -->
    <MessageTags v-if="tags.length > 0" :tags="tags" variant="inline" class="mb-2" />

    <!-- 3. Содержимое текста (Сворачиваемое) -->
    <div v-if="textContent" class="mb-3 relative">
      <div 
        class="text-xs text-sky-100/80 whitespace-pre-wrap break-all bg-black/30 p-2.5 rounded-lg font-mono border border-white/5 overflow-hidden transition-all duration-300 ease-in-out"
        :class="isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-16 opacity-90'"
      >
        {{ displayText }}
        
        <!-- Градиент затемнения внизу, когда свернуто -->
        <div 
          v-if="!isExpanded && textContent.length > 350" 
          class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-lg"
        ></div>
      </div>
      
      <!-- Кнопка переключения -->
      <button 
        v-if="textContent.length > 350"
        @click="toggleExpand"
        class="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 transition flex items-center gap-1.5"
      >
        <span>{{ isExpanded ? 'Свернуть' : 'Просмотр содержимого' }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-3 w-3 transition-transform duration-300" 
          :class="{ 'rotate-180': isExpanded }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- 4. Цветовые свотчи (если есть) -->
    <MessageColorSwatches
      v-if="colors.length > 0"
      :colors="colors"
      @copy="copyToClipboard"
      class="mb-3"
    />

    <!-- 5. Кнопка скачивания -->
    <a 
      v-if="fileUrl" 
      :href="fileUrl" 
      :download="fileName"
      class="flex items-center justify-center gap-2 w-full py-2 mt-1 text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 rounded-lg transition border border-sky-500/20 group-hover:border-sky-500/40"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Скачать файл
    </a>
  </div>
</template>