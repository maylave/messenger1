<script lang="ts" setup>
import type { Chat } from '@/types/chat'
import { ref } from 'vue'

const props = defineProps<{
  chat: Chat
  isActive: boolean
}>()

const emit = defineEmits<{
  select: [chat: Chat]
  delete: [id: string | number]
}>()

const isDeleting = ref(false)
const isHovered = ref(false)

const handleDelete = async () => {
  if (isDeleting.value) return
  isDeleting.value = true

  setTimeout(() => {
    emit('delete', props.chat.id)
  }, 400)
}
</script>

<template>
  <Transition name="slide-fade" mode="out-in">
    <div
      v-if="!isDeleting"
      ref="itemRef"
      class="group relative w-full mb-1"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Градиентная рамка для активного элемента -->
      <div
        class="absolute inset-0 rounded-xl transition-all duration-300"
        :class="isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
        :style="{
          background: isActive
            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(56, 189, 248, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)',
        }"
      ></div>

      <!-- Основной контент -->
      <div
        class="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
        :class="[
          isActive
            ? 'bg-sky-500/10 border border-sky-400/20 shadow-lg shadow-sky-500/10'
            : 'bg-frame-800/30 border border-transparent hover:bg-frame-700/50 hover:border-white/5',
        ]"
        @click="emit('select', chat)"
      >
        <!-- Иконка чата с градиентом -->
        <div
          class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
          :class="
            isActive
              ? 'bg-gradient-to-br from-sky-500/30 to-sky-600/20 text-sky-300 border border-sky-400/30 shadow-lg shadow-sky-500/20'
              : 'bg-frame-700/50 text-sky-400/70 border border-white/5 group-hover:bg-sky-500/10 group-hover:text-sky-300'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4.5 w-4.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path
              d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
            />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm text-sky-50 truncate">
            {{ chat.title }}
          </div>
          <div
            class="text-xs truncate mt-0.5 transition-colors duration-200"
            :class="isActive ? 'text-sky-300/70' : 'text-slate-400/60 group-hover:text-sky-300/50'"
          >
            {{ chat.lastMessage || 'Нет сообщений' }}
          </div>
        </div>

        <!-- Индикатор новых сообщений -->
        <div v-if="chat.unreadCount" class="flex-shrink-0">
          <span
            class="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30"
          >
            {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
          </span>
        </div>
      </div>

      <!-- Кнопка удаления с анимацией -->
      <Transition name="fade-scale">
        <button
          v-if="isHovered"
          @click.stop="handleDelete"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all duration-200 hover:scale-110 active:scale-95"
          title="Удалить чат"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </Transition>

      <!-- Индикатор активного состояния (светящаяся полоска слева) -->
      <div
        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300"
        :class="isActive ? 'bg-sky-400 shadow-lg shadow-sky-400/50 opacity-100' : 'opacity-0'"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
/* Анимация появления/исчезновения элемента */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
  filter: blur(4px);
}

/* Анимация появления кнопки удаления */
.fade-scale-enter-active {
  transition: all 0.2s ease-out;
}

.fade-scale-leave-active {
  transition: all 0.15s ease-in;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.1);
}

/* Glow эффект для активных элементов */
@keyframes glow {
  0%,
  100% {
    box-shadow:
      0 0 5px rgba(56, 189, 248, 0.2),
      0 0 10px rgba(56, 189, 248, 0.1);
  }
  50% {
    box-shadow:
      0 0 10px rgba(56, 189, 248, 0.3),
      0 0 20px rgba(56, 189, 248, 0.2);
  }
}

/* Пульсация для непрочитанных */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}
</style>
