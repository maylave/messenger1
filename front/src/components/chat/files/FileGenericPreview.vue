<script setup lang="ts">
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
}>()

const isExpanded = ref(false)
const isFullscreen = ref(false)

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
  <div class="w-full">
    <div v-if="textContent" class="relative">
      <div>
        <pre
          class="text-xs text-slate-300 font-mono whitespace-pre-wrap break-all leading-relaxed opacity-80"
        ><code>{{ previewLines.join('\n') }}</code></pre>
      </div>
    </div>

    <div
      class="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-frame-800/20 rounded-t-xl"
    >
      <div class="flex items-center gap-3">
        <div class="p-3 w-10 bg-frame-800 rounded-3xl text-white">
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-semibold text-white">{{ fileName }}</p>
          <p v-if="fileSize" class="text-xs text-slate-400">{{ fileSize }}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <div
          class="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-sky-500/20 to-sky-600/10 text-sky-300 rounded-xl border border-sky-400/20"
        >
          <button
            v-if="hasMoreContent"
            @click="isExpanded = !isExpanded"
            class="flex items-center justify-center w-full h-full hover:bg-white/5 rounded-xl transition-colors"
          >
            <svg
              class="w-3 h-3 transition-transform duration-300"
              :class="{ 'rotate-180': isExpanded }"
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
        <!-- Полноэкранный режим -->
        <button
          @click.stop="isFullscreen = true"
          class="flex items-center justify-center w-9 h-9 rounded-full bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-400/20 transition-all hover:scale-105"
          title="На весь экран"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>

        <!-- Копировать -->
        <button
          v-if="textContent"
          @click.stop="copyToClipboard(textContent)"
          class="flex items-center justify-center w-9 h-9 rounded-full bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-400/20 transition-all hover:scale-105"
          title="Копировать"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>

        <!-- Скачать -->
        <a
          v-if="fileUrl"
          :href="fileUrl"
          :download="fileName"
          @click.stop
          class="flex items-center justify-center w-9 h-9 rounded-full bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-400/20 transition-all hover:scale-105"
          title="Скачать файл"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- Цветовая палитра (без изменений) -->
    <div v-if="fileColors && fileColors.length > 0">
      <MessageColorSwatches :colors="fileColors" @copy="copyToClipboard" />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.fullscreen-enter-active,
.fullscreen-leave-active {
  transition: opacity 0.3s ease;
}

.fullscreen-enter-from,
.fullscreen-leave-to {
  opacity: 0;
}
</style>
