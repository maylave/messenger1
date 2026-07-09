<script lang="ts" setup>
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/UI/ChatInput.vue'
import type { Chat } from '@/types/chat'
import { nextTick, ref } from 'vue'
import InputLoadFile from '../UI/InputLoadFile.vue'

interface Message {
  id: number
  text?: string
  fileName?: string
  fileType?: 'image' | 'document' | 'video' | 'audio' | 'other'
  fileSize?: string
  fileUrl?: string
  timestamp: Date
}

const props = defineProps<{
  chat?: Chat
}>()

const messages = ref<Message[]>([
  {
    id: 1,
    text: 'Не забыть купить молоко и хлеб',
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 2,
    fileName: 'important_document.pdf',
    fileType: 'document',
    fileSize: '2.4 MB',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 3,
    text: 'Идея для проекта: сделать автоматизацию отчетов',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 4,
    fileName: 'screenshot.png',
    fileType: 'image',
    fileSize: '1.8 MB',
    fileUrl: '/path/to/image.png',
    timestamp: new Date(Date.now() - 1800000),
  },
])

const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// --- ЕДИНАЯ ЛОГИКА ОБРАБОТКИ ФАЙЛОВ ---
const processFiles = async (files: FileList | File[]) => {
  if (!files || files.length === 0) return

  for (const file of Array.from(files)) {
    let fileType: Message['fileType'] = 'other'
    if (file.type.startsWith('image/')) fileType = 'image'
    else if (file.type.startsWith('video/')) fileType = 'video'
    else if (file.type.startsWith('audio/')) fileType = 'audio'
    else if (file.type.includes('pdf') || file.type.includes('document')) fileType = 'document'

    const fileSize = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    messages.value.push({
      id: Date.now() + Math.random(),
      fileName: file.name,
      fileType,
      fileSize,
      timestamp: new Date(),
    })
  }
  
  await nextTick()
  scrollToBottom()
}

const handleFilesSelected = (files: File[]) => {
  console.log('Файлы получены через DnD:', files.map(f => f.name))
  processFiles(files)
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    processFiles(input.files)
    input.value = ''
  }
}

const sendMessage = async () => {
  const text = newMessage.value.trim()
  if (!text) return

  messages.value.push({
    id: Date.now(),
    text,
    timestamp: new Date(),
  })

  newMessage.value = ''
  await nextTick()
  scrollToBottom()
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

setTimeout(() => {
  scrollToBottom()
}, 100)
</script>

<template>
  <div class="h-full w-full bg-frame-800 flex flex-col">
    <!-- Заголовок -->
    <div class="px-4 py-3 border-b border-frame-700/50 bg-frame-800">
      <div class="flex items-center gap-2">
        <span class="text-xl">📦</span>
        <h3 class="text-sky-50 font-semibold text-lg">
          {{ chat?.title || 'Выберите чат' }}
        </h3>
      </div>
    </div>

    <!-- Область сообщений -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-3"
    >
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :message="message"
      />

      <!-- Пустое состояние -->
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center text-sky-50/40">
          <p class="text-4xl mb-2">📦</p>
          <p class="text-sm">Здесь будут ваши заметки и файлы</p>
        </div>
      </div>
    </div>

    <!-- Поле ввода -->
    <div class="p-4 border-t border-frame-700/50 bg-frame-800">
      <div class="flex gap-2 items-end">
        <!-- Кнопка прикрепления файла -->
        <button
          @click="triggerFileUpload"
          class="p-2 text-sky-50 hover:bg-frame-700 rounded-lg transition shrink-0"
          title="Прикрепить файл"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        
        <!-- Скрытый input для файлов -->
        <input
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileUpload"
          class="hidden"
        />
        
        <!-- Глобальная зона загрузки -->
        <InputLoadFile @files-selected="handleFilesSelected" />
        
        <!-- НОВЫЙ КОМПОНЕНТ ВВОДА С T9 -->
        <ChatInput 
          v-model="newMessage"
          placeholder="Введите сообщение..."
          @send="sendMessage"
        />
        
        <!-- Кнопка отправки -->
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="px-6 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-frame-700 disabled:cursor-not-allowed text-white rounded-lg transition font-medium shrink-0"
        >
          Отправить
        </button>
      </div>
    </div>
  </div>
</template>