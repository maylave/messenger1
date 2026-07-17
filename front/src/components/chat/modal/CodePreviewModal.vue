<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import type { Component } from 'vue'

import CodePreview from '@/components/chat/CodePreview.vue'
import IconCopy from '@/components/chat/icons/IconCopy.vue'

const props = defineProps<{
  fileName: string
  fileSize?: string
  fileUrl?: string
  textContent?: string
  icon?: Component
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

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

const resolvedLanguage = computed(() => {
  if (!props.fileName) return 'plaintext'
  const ext = props.fileName.split('.').pop()?.toLowerCase() ?? ''
  return extensionToLanguage[ext] ?? 'plaintext'
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    console.error(e)
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      window.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <!-- Внешняя градиентная рамка -->
        <div class="modal-border relative w-full max-w-6xl h-[90vh]">
          <!-- Внутренний контент с glassmorphism -->
          <div class="modal-content relative w-full h-full flex flex-col overflow-hidden">
            <!-- Шапка -->
            <div
              class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-9 h-9 flex items-center justify-center bg-sky-500/10 rounded-lg border border-sky-400/20"
                >
                  <component v-if="icon" :is="icon" class="w-5 h-5 text-sky-300 flex-shrink-0" />
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-semibold text-white block truncate">{{
                    fileName
                  }}</span>
                  <span class="text-xs text-slate-400">
                    {{ fileSize }} • {{ textContent?.length || 0 }} символов
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  @click.stop="copyToClipboard(textContent || '')"
                  class="px-4 py-2 text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/20 rounded-lg transition-all flex items-center gap-2 hover:scale-105"
                >
                  <IconCopy size="16" />
                  Копировать всё
                </button>
                <button
                  @click.stop="handleClose"
                  class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Закрыть (Esc)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Тело с кодом -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0">
              <CodePreview
                v-if="textContent"
                :code="textContent"
                :language="resolvedLanguage"
                :size="true"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Градиентная рамка с эффектом свечения */
.modal-border {
  position: relative;
  border-radius: 1.25rem;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(78, 168, 255, 0.5) 0%,
    rgba(78, 168, 255, 0.2) 30%,
    rgba(188, 198, 224, 0.08) 60%,
    rgba(188, 198, 224, 0.25) 100%
  );
  box-shadow:
    0 20px 60px rgba(78, 168, 255, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Внутренний контент с glassmorphism */
.modal-content {
  border-radius: calc(1.25rem - 1px);
  background: linear-gradient(135deg, rgba(18, 33, 49, 0.85) 0%, rgba(28, 43, 60, 0.9) 100%);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
}

/* Кастомный скроллбар */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(78, 168, 255, 0.3);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(78, 168, 255, 0.5);
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* Стили для кода внутри модалки */
:deep(pre) {
  color: #d4e4fa !important;
  font-size: 0.875rem !important;
  line-height: 1.6 !important;
  letter-spacing: -0.01em;
}

:deep(code) {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
}
</style>
