<script lang="ts" setup>
import { ref } from 'vue'
import type { Component } from 'vue'

import IconCopy from '@/components/chat/icons/IconCopy.vue'
const props = defineProps<{
  fileName: string
  fileSize?: string
  fileUrl?: string
  textContent?: string
  icon?: Component
  modelValue: boolean // Управление через v-model
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Здесь можно вызвать вашу систему уведомлений (toast), если она есть
    console.log('Код успешно скопирован в буфер обмена')
  } catch (e) {
    console.error('Ошибка при копировании:', e)
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md"
        @click.self="handleClose"
      >
        <div
          class="relative w-full max-w-6xl h-[85vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <!-- Шапка модального окна -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl"
          >
            <div class="flex items-center gap-3 min-w-0">
              <component v-if="icon" :is="icon" class="w-5 h-5 text-sky-400 flex-shrink-0" />
              <div class="min-w-0">
                <span class="text-sm font-semibold text-white block truncate">{{ fileName }}</span>
                <span class="text-xs text-slate-400">
                  {{ fileSize }} • {{ textContent?.length || 0 }} символов
                </span>
              </div>
            </div>

            <div class="flex items-center gap-3 flex-shrink-0">
              <button
                @click="copyToClipboard(textContent || '')"
                class="px-4 py-2 text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-lg transition-all flex items-center gap-2"
              >
                <IconCopy />
                Копировать всё
              </button>
              <button
                @click="handleClose"
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

          <!-- Тело модального окна (Скроллируемый код) -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/40">
            <pre
              class="text-sm text-sky-100/90 font-mono whitespace-pre-wrap break-all leading-relaxed"
              >{{ textContent }}</pre
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Кастомный скроллбар для блока кода */
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
  border: 2px solid transparent;
  background-clip: padding-box;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* Анимация для модального окна */
@keyframes fade-in-zoom {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: fade-in-zoom 0.2s ease-out forwards;
}
</style>
