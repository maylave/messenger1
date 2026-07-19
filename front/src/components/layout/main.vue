<script lang="ts" setup>
import ChatMessage from '@/components/chat/ChatMessage.vue'
import type { Chat } from '@/types/message'
import InputLoadFile from '../UI/InputLoadFile.vue'
import Header from '../chat/Header.vue'
import { useChat } from '@/composables/useChat'
// Импортируем конфиг фонов для использования в v-for цикла меню
import { availableBackgrounds } from '@/config/chatBackgrounds'

const props = defineProps<{
  chat?: Chat
}>()

// Инициализируем логику чата
// Явно указываем тип для chatLogic
type ChatLogic = ReturnType<typeof useChat>
const chatLogic: ChatLogic = useChat(props)
</script>

<template>
  <div class="h-full w-full flex flex-col relative min-h-0">
    <!-- Фон чата -->
    <div
      class="absolute inset-0 transition-all duration-500"
      :class="chatLogic.currentBackground.type === 'solid' ? chatLogic.currentBackground.value : ''"
      :style="chatLogic.getBackgroundStyle()"
    >
      <!-- Overlay для улучшения читаемости сообщений -->
      <div
        v-if="chatLogic.currentBackground.type === 'image'"
        class="absolute inset-0 bg-black/30"
      ></div>
    </div>

    <!-- Header с динамическим заголовком -->
    <div class="absolute inset-x-0 top-0 flex justify-center pt-4 z-20 pointer-events-none">
      <Header
        :title="props.chat?.title || 'Выберите чат'"
        class="w-full max-w-[min(64rem,calc(100%-2rem))] rounded-4xl pointer-events-auto"
      />
    </div>

    <!-- Кнопка смены фона -->
    <div class="absolute top-20 right-4 z-30">
      <button
        @click="chatLogic.isBgMenuOpen = !chatLogic.isBgMenuOpen"
        class="p-3 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:bg-slate-800/80 transition-all duration-200 group shadow-lg"
        title="Сменить фон"
      >
        <svg
          class="w-5 h-5 text-slate-300 group-hover:text-sky-400 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      <!-- Меню выбора фона -->
      <div
        v-if="chatLogic.isBgMenuOpen"
        class="absolute top-14 right-0 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3"
      >
        <h3 class="text-sm font-semibold text-slate-200 mb-3">Выберите фон</h3>

        <!-- Предустановленные фоны -->
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="bg in availableBackgrounds"
            :key="bg.id"
            @click="chatLogic.selectBackground(bg)"
            class="relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105"
            :class="
              chatLogic.currentBackground.id === bg.id
                ? 'border-sky-400 shadow-lg shadow-sky-400/20'
                : 'border-white/10 hover:border-white/30'
            "
            :style="
              bg.preview
                ? { background: bg.preview }
                : bg.type === 'solid'
                  ? { background: '#122131' }
                  : {}
            "
            :title="bg.name"
          >
            <div
              class="absolute inset-0 flex items-end justify-center pb-1 bg-gradient-to-t from-black/60 to-transparent"
            >
              <span class="text-[10px] text-white font-medium">{{ bg.name }}</span>
            </div>
          </button>
        </div>

        <!-- Загрузка своего изображения -->
        <div class="pt-3 border-t border-white/10">
          <button
            @click="chatLogic.triggerBgUpload"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 hover:border-sky-400/50 rounded-xl text-sky-300 text-sm font-medium transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Загрузить своё фото
          </button>
          <input
            ref="bgInput"
            type="file"
            accept="image/*"
            @change="chatLogic.handleBgUpload"
            class="hidden"
          />
        </div>

        <!-- Текущий фон -->
        <div class="pt-3 border-t border-white/10">
          <p class="text-xs text-slate-400">
            Текущий:
            <span class="text-slate-200 font-medium">{{ chatLogic.currentBackground.name }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Контейнер сообщений -->
    <!-- Контейнер сообщений -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto relative z-10 min-h-0 px-20 pb-32 pt-24"
    >
      <!-- Обертка для сообщений: mt-auto прижимает всё к низу, когда контента мало -->
      <div class="flex flex-col gap-3 w-full max-w-5xl mx-auto mt-auto">
        <ChatMessage v-for="message in chatLogic.messages" :key="message.id" :message="message" />

        <!-- Пустое состояние -->
        <div
          v-if="chatLogic.messages.length === 0"
          class="flex items-center justify-center py-10 opacity-50"
        >
          <div class="text-center text-sky-50/40">
            <p class="text-sm">Здесь будут ваши заметки и файлы</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Поле ввода -->
    <div class="p-4 bg-transparent absolute bottom-0 left-0 w-full z-20">
      <InputLoadFile @files-selected="chatLogic.handleFilesSelected" />

      <input
        ref="fileInput"
        type="file"
        multiple
        @change="chatLogic.handleFileUpload"
        class="hidden"
      />
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        multiple
        @change="chatLogic.handleImageUpload"
        class="hidden"
      />

      <!-- Контейнер со стеклянной рамкой -->
      <div class="relative w-full max-w-5xl mx-auto">
        <!-- Внешняя стеклянная рамка -->
        <div
          class="absolute -inset-1 rounded-[2rem] transition-all duration-500"
          :class="chatLogic.isFocused ? 'opacity-35' : 'opacity-20'"
          style="
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.02),
              rgba(255, 255, 255, 0.05)
            );
            filter: blur(20px);
            backdrop-filter: blur(20px) saturate(140%);
            -webkit-backdrop-filter: blur(20px) saturate(140%);
          "
        ></div>

        <!-- Средняя рамка с градиентом -->
        <div
          v-if="chatLogic.isFocused"
          class="absolute -inset-0.5 rounded-[2rem] opacity-40 blur-md animate-pulse"
          style="
            background: linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.15),
              rgba(255, 255, 255, 0.1),
              rgba(148, 163, 184, 0.15)
            );
            backdrop-filter: blur(10px) saturate(140%);
            -webkit-backdrop-filter: blur(10px) saturate(140%);
          "
        ></div>

        <!-- Внутренняя стеклянная граница -->
        <div
          class="absolute inset-0 rounded-[2rem] border border-white/10"
          style="
            backdrop-filter: blur(14px) saturate(160%);
            -webkit-backdrop-filter: blur(14px) saturate(160%);
            box-shadow:
              inset 0 1px 1px rgba(255, 255, 255, 0.06),
              0 4px 16px rgba(0, 0, 0, 0.25);
          "
        ></div>

        <!-- Основной контейнер ввода -->
        <div
          class="relative flex items-center gap-1.5 px-4 py-4 rounded-[1.8rem] border border-white/10 bg-slate-900/70 backdrop-blur-2xl shadow-xl transition-all duration-300"
          :class="{ 'shadow-sky-500/5': chatLogic.isFocused }"
          style="
            backdrop-filter: blur(22px) saturate(160%);
            -webkit-backdrop-filter: blur(22px) saturate(160%);
          "
        >
          <button
            @click="chatLogic.triggerFileUpload"
            class="flex-shrink-0 p-2 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-full transition-all duration-200 group"
            title="Прикрепить файл"
          >
            <svg
              class="w-5 h-5 transform group-hover:rotate-12 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          <div class="flex-1 relative">
            <input
              v-model="chatLogic.newMessage"
              type="text"
              @keydown.enter="chatLogic.sendMessage"
              @focus="chatLogic.handleFocus"
              @blur="chatLogic.handleBlur"
              placeholder="Напишите сообщение..."
              class="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm leading-relaxed"
            />
          </div>

          <button
            @click="chatLogic.triggerImageUpload"
            class="flex-shrink-0 p-2 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-full transition-all duration-200 group"
            title="Добавить изображение"
          >
            <svg
              class="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            @click="chatLogic.toggleVoiceRecording"
            class="flex-shrink-0 p-2 rounded-full transition-all duration-200"
            :class="
              chatLogic.isRecording
                ? 'text-red-400 bg-red-400/10 animate-pulse'
                : 'text-slate-400 hover:text-sky-400 hover:bg-white/5'
            "
            title="Голосовое сообщение"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3.75 3.75 0 01-3.75-3.75V4.5a3.75 3.75 0 117.5 0v7.5A3.75 3.75 0 0112 15.75z"
              />
            </svg>
          </button>

          <button
            @click="chatLogic.sendMessage"
            :disabled="!chatLogic.newMessage.trim()"
            class="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white disabled:text-slate-500 rounded-xl transition-all duration-200 group shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-105 active:scale-95"
            title="Отправить"
          >
            <svg
              class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes gradient-rotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(172, 172, 172, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(141, 158, 165, 0.2);
  }
}
</style>

<style scoped>
input::placeholder {
  opacity: 0.7;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
