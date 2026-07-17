<script setup lang="ts">
import CodePreview from '@/components/chat/CodePreview.vue'
import MessageColorSwatches from '@/components/chat/MessageColorSwatches.vue'
import type { Component } from 'vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  fileName: string
  fileSize?: string
  fileUrl?: string
  icon: Component
  textContent?: string
  fileColors?: string[]
  language?: string 
}>()

const isExpanded = ref(false)
const isFullscreen = ref(false)

const extensionToLanguage: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  vue: 'vue',
  py: 'python',
  json: 'json',
  html: 'html',
  css: 'css',
  scss: 'scss',
  md: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  sh: 'bash',
  bash: 'bash',
  sql: 'sql',
  php: 'php',
  go: 'go',
  rs: 'rust',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  lua: 'lua',
  xml: 'xml',
  txt: 'plaintext',
}
const getLanguageFromFileName = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  return extensionToLanguage[ext] ?? 'plaintext'
}

// Если язык не передан явно пропом — определяем по расширению fileName
const resolvedLanguage = computed(() => {
  return props.language ?? getLanguageFromFileName(props.fileName)
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    console.error(e)
  }
}


const previewLines = computed(() => {
  if (!props.textContent) return []
  const lines = props.textContent.split('\n')
  return isExpanded.value ? lines : lines.slice(0, 5)
})

const hasMoreContent = computed(() => {
  if (!props.textContent) return false
  return props.textContent.split('\n').length > 5
})
</script>

<template>
  <div class="w-full relative  overflow-hidden   ">
    
    <!-- Верхняя часть: Текст и цвета (без фона) -->
    <div v-if="textContent" class="p-4 pb-2 relative z-10">
      <CodePreview 
        :code="textContent" 
        :language="resolvedLanguage" 
      />
    </div>

    <div v-if="fileColors && fileColors.length > 0" class="px-4 pb-2 relative z-10 bg-frame-800/20">
      <MessageColorSwatches :colors="fileColors" @copy="copyToClipboard" />
    </div>

    <!-- Нижняя панель: Фон + Контент -->
    <!-- h-16 ограничивает высоту фона только областью кнопок -->
    <div class="relative h-16 flex items-center justify-between px-4 mt-auto">
      
      <!-- Абсолютный фон ТОЛЬКО для нижней панели -->
      <div class="absolute inset-0 bg-frame-800/40 rounded-br-2xl pointer-events-none w-full"></div>

      <!-- Информация о файле -->
      <div class="flex items-center gap-3 relative z-10">
        <div class="p-2.5 w-10 h-10 flex items-center justify-center bg-frame-700/50 rounded-xl text-white border border-white/5">
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-semibold text-white">{{ fileName }}</p>
          <p v-if="fileSize" class="text-xs text-slate-400">{{ fileSize }}</p>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="flex items-center gap-2 relative z-10">
        <!-- Развернуть/Свернуть -->
        <button
          v-if="hasMoreContent"
          @click="isExpanded = !isExpanded"
          class="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Полноэкранный режим -->
        <button
          @click.stop="isFullscreen = true"
          class="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
          title="На весь экран"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        <!-- Копировать -->
        <button
          v-if="textContent"
          @click.stop="copyToClipboard(textContent)"
          class="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
          title="Копировать"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        <!-- Скачать -->
        <a
          v-if="fileUrl"
          :href="fileUrl"
          :download="fileName"
          @click.stop
          class="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
          title="Скачать файл"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}
</style>