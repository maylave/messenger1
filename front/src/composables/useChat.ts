// composables/useChat.ts
import { availableBackgrounds } from '@/config/chatBackgrounds'
import type { Chat, ChatBackground, FileKind, Message } from '@/types/message'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

export function useChat(props: { chat?: Chat }) {
  // --- Состояние ---
  const messages = ref<Message[]>([])
  const newMessage = ref('')
  const messagesContainer = ref<HTMLElement | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const imageInput = ref<HTMLInputElement | null>(null)
  const bgInput = ref<HTMLInputElement | null>(null)
  const isRecording = ref(false)
  const isFocused = ref(false)
  const isBgMenuOpen = ref(false)
  const currentBackground = ref<ChatBackground>(
    availableBackgrounds[0] ?? {
      id: 'default',
      name: 'По умолчанию',
      type: 'solid',
      value: '#0f172a',
    },
  )
  const customImageBackground = ref<string | null>(null)

  // --- Утилиты ---
  const scrollToBottom = () => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file, 'UTF-8')
    })
  }

  // --- Логика файлов ---
  const processFiles = async (files: FileList | File[]) => {
    // Безопасная проверка чата
    if (!files || files.length === 0 || !props.chat?.id) return

    for (const file of Array.from(files)) {
      let fileType: FileKind = 'other'
      if (file.type.startsWith('image/')) fileType = 'image'
      else if (file.type.startsWith('video/')) fileType = 'video'
      else if (file.type.startsWith('audio/')) fileType = 'audio'
      else if (file.type.includes('pdf') || file.type.includes('document')) fileType = 'document'

      const fileSize =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

      // Временный локальный URL — используется, пока файл не сохранён на диск
      const fileUrl = URL.createObjectURL(file)

      let content: string | undefined
      const isTextFile =
        file.type.startsWith('text/') ||
        file.name.match(/\.(txt|md|json|csv|log|xml|html|css|js|ts|vue)$/i)

      if (isTextFile && file.size < 1024 * 1024) {
        try {
          content = await readTextFile(file)
        } catch (e) {
          console.error('Ошибка чтения файла:', e)
        }
      }

      // Явное приведение типа для временного сообщения
      const tempMessage: Message = {
        id: Date.now() + Math.random(),
        fileName: file.name,
        fileType,
        fileSize,
        fileUrl,
        textContent: content,
        timestamp: new Date(),
      } as Message

      // Добавляем в конец — новые сообщения снизу
      messages.value.push(tempMessage)

      // Сохранение файла на диск + запись сообщения в БД (только если API доступен)
      if (typeof window !== 'undefined' && window.api) {
        try {
          const arrayBuffer = await file.arrayBuffer()

          const result = await window.api.saveFile({
            chatId: String(props.chat.id),
            fileName: file.name,
            buffer: arrayBuffer,
            fileType,
            fileSize,
            textContent: content,
          })

          if (result.success && result.data) {
            // Заменяем временное сообщение (с blob: url) на реальное из БД
            // (с постоянным путём к файлу на диске)
            const idx = messages.value.findIndex((m) => m.id === tempMessage.id)
            if (idx !== -1) {
              URL.revokeObjectURL(fileUrl)
              messages.value[idx] = result.data
            }
          } else {
            console.error('Ошибка сохранения файла:', result.error)
          }
        } catch (error) {
          console.error('Ошибка сохранения файла:', error)
        }
      }
    }

    await nextTick()
    scrollToBottom()
  }

  // --- Обработчики событий ---
  const handleFilesSelected = (files: File[]) => processFiles(files)

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      processFiles(input.files)
      input.value = ''
    }
  }

  const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      processFiles(input.files)
      input.value = ''
    }
  }

  // --- Отправка сообщений ---
  const sendMessage = async () => {
    const text = newMessage.value.trim()
    if (!text || !props.chat?.id) return

    newMessage.value = ''

    // Проверка наличия Electron API
    if (typeof window !== 'undefined' && window.api) {
      try {
        const result = await window.api.sendMessage({
          chatId: String(props.chat.id),
          senderId: 'current-user-id',
          text: text,
        })

        if (result.success && result.data) {
          // Добавляем в конец — новое сообщение снизу
          messages.value.push(result.data)
          await nextTick()
          scrollToBottom()
        } else {
          console.error('Ошибка сохранения сообщения:', result.error)
        }
      } catch (error) {
        console.error('IPC ошибка при отправке:', error)
      }
    } else {
      // Фолбэк для веб-режима или тестов
      messages.value.push({
        id: Date.now(),
        text,
        timestamp: new Date(),
      } as Message)
      await nextTick()
      scrollToBottom()
    }
  }

  // --- Управление фоном ---
  const selectBackground = (bg: ChatBackground) => {
    currentBackground.value = bg
    localStorage.setItem('chat-background-id', bg.id)
    if (bg.type !== 'image') {
      customImageBackground.value = null
      localStorage.removeItem('chat-custom-image')
    }
    isBgMenuOpen.value = false
  }

  const triggerBgUpload = () => {
    if (bgInput.value) bgInput.value.click()
  }

  const handleBgUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        customImageBackground.value = imageUrl
        currentBackground.value = {
          id: 'custom-image',
          name: 'Моё фото',
          type: 'image',
          value: imageUrl,
        }
        localStorage.setItem('chat-background-id', 'custom-image')
        localStorage.setItem('chat-custom-image', imageUrl)
      }
      reader.readAsDataURL(file)
      input.value = ''
    }
  }

  const getBackgroundStyle = () => {
    const bg = currentBackground.value
    if (bg.type === 'solid') return {}
    if (bg.type === 'gradient') return { background: bg.value }
    if (bg.type === 'pattern') {
      return {
        background: `#051424`,
        backgroundImage: bg.value,
        backgroundSize: bg.id === 'pattern-dots' ? '20px 20px' : '40px 40px',
      }
    }
    if (bg.type === 'image') {
      return {
        backgroundImage: `url(${bg.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }
    return {}
  }

  // --- Watchers и Lifecycle ---
  watch(
    () => props.chat?.id,
    async (newChatId) => {
      if (newChatId && typeof window !== 'undefined' && window.api) {
        try {
          const result = await window.api.getMessages(String(newChatId))
          if (result.success && result.data) {
            // Важно: getMessages должен возвращать сообщения в хронологическом
            // порядке (от старых к новым) — иначе список будет перевёрнут
            messages.value = result.data
            await nextTick()
            scrollToBottom()
          }
        } catch (error) {
          console.error('Ошибка загрузки сообщений:', error)
          messages.value = [
            {
              id: Date.now(),
              text: `Вы открыли чат "${props.chat?.title}". Начните общение!`,
              timestamp: new Date(),
            } as Message,
          ]
        }
      } else {
        messages.value = []
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    const savedBgId = localStorage.getItem('chat-background-id')
    if (savedBgId) {
      const savedBg = availableBackgrounds.find((bg) => bg.id === savedBgId)
      if (savedBg) currentBackground.value = savedBg
    }

    const savedImage = localStorage.getItem('chat-custom-image')
    if (savedImage) {
      customImageBackground.value = savedImage
      currentBackground.value = {
        id: 'custom-image',
        name: 'Моё фото',
        type: 'image',
        value: savedImage,
      }
    }
  })

  onBeforeUnmount(() => {
    messages.value.forEach((msg) => {
      if (msg.fileUrl && msg.fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(msg.fileUrl)
      }
    })
  })

  // --- Возвращаем реактивное состояние ---
  return reactive({
    messages,
    newMessage,
    messagesContainer,
    fileInput,
    imageInput,
    bgInput,
    isRecording,
    isFocused,
    isBgMenuOpen,
    currentBackground,
    customImageBackground,
    availableBackgrounds,
    handleFilesSelected,
    handleFileUpload,
    handleImageUpload,
    sendMessage,
    triggerFileUpload: () => {
      if (fileInput.value) fileInput.value.click()
    },
    triggerImageUpload: () => {
      if (imageInput.value) imageInput.value.click()
    },
    toggleVoiceRecording: () => {
      isRecording.value = !isRecording.value
    },
    handleFocus: () => {
      isFocused.value = true
    },
    handleBlur: () => {
      isFocused.value = false
    },
    selectBackground,
    triggerBgUpload,
    handleBgUpload,
    getBackgroundStyle,
  })
}
