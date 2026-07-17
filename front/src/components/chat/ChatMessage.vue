<script lang="ts" setup>
import ColorPalette from '@/components/chat/ColorPalette.vue'
import MessageColorSwatches from '@/components/chat/MessageColorSwatches.vue'
import MessageTags from '@/components/chat/MessageTags.vue'
import FileAttachment from '@/components/chat/files/FileAttachment.vue'
import ImagePreviewModal from '@/components/chat/modal/ImagePreviewModal.vue'
import { useFileContent, useMessageContent } from '@/composables/useMessageContent'
import { DEFAULT_BUBBLE_CLASS } from '@/config/tagConfig'
import type { Message } from '@/types/message'
import { computed, ref, toRef } from 'vue'

const props = defineProps<{ message: Message }>()

const textRef = toRef(props.message, 'text')
const { detectedTags, priorityTag, detectedColors, cleanText } = useMessageContent(textRef)

const fileContentRef = toRef(props.message, 'textContent')
const {
  detectedTags: fileTags,
  priorityTag: filePriorityTag,
  detectedColors: fileColors,
  cleanContent,
} = useFileContent(fileContentRef)

const bubbleClass = computed(() => {
  return (
    priorityTag.value?.bubbleClass ?? filePriorityTag.value?.bubbleClass ?? DEFAULT_BUBBLE_CLASS
  )
})

const isColorPaletteOnly = computed(
  () => detectedColors.value.length > 0 && !props.message.fileName && cleanText.value.length === 0,
)

const isImageAttachment = computed(
  () => props.message.fileType === 'image' && !!props.message.fileUrl,
)

const isPreviewOpen = ref(false)

const previewImages = computed(() => {
  if (!isImageAttachment.value) return []
  return [
    {
      url: props.message.fileUrl as string,
      name: props.message.fileName ?? 'image',
      meta: props.message.fileSize,
    },
  ]
})

const openImagePreview = () => {
  if (isImageAttachment.value) {
    isPreviewOpen.value = true
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return 'Вчера'
  if (days < 7)
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
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
  <div class="flex justify-start px-20">
    <!-- ВАРИАНТ 1: ЦВЕТОВАЯ ПАЛИТРА -->
    <div
      v-if="isColorPaletteOnly"
      :key="'palette-' + message.id"
      class="message-bubble relative w-[280px] rounded-xl overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
    >
      <MessageTags v-if="detectedTags.length > 0" :tags="detectedTags" variant="overlay" />
      <ColorPalette :colors="detectedColors" @copy="copyToClipboard">
        <template #time>
          <div
            class="absolute bottom-2 right-3 text-xs text-white/70 font-medium drop-shadow-md pointer-events-none"
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </template>
      </ColorPalette>
    </div>

    <!-- ВАРИАНТ 2: ОБЫЧНОЕ СООБЩЕНИЕ -->
    <div
      v-else
      :key="'message-' + message.id"
      class="message-bubble relative max-w-[85%] transition-all duration-300"
    >
      <!-- Градиентная рамка (внешний слой) -->
      <div class="message-border">
        <!-- Основной контент -->
        <div class="message-content ">
          <!-- Теги -->
          <MessageTags v-if="detectedTags.length > 0" :tags="detectedTags" variant="inline" />

          <!-- Текст -->
          <div v-if="cleanText" class="message-text whitespace-pre-wrap break-words p-4">
            {{ cleanText }}
          </div>

          <!-- Цвета -->
          <MessageColorSwatches
            v-if="detectedColors.length > 0"
            :colors="detectedColors"
            @copy="copyToClipboard"
          />

          <!-- Файл -->
          <FileAttachment
            v-if="message.fileName"
            :file-name="message.fileName"
            :file-type="message.fileType ?? 'other'"
            :file-size="message.fileSize"
            :file-url="message.fileUrl"
            :text-content="message.textContent"
            :file-tags="fileTags"
            :file-colors="fileColors"
            :class="{ 'cursor-pointer': isImageAttachment }"
            @click="openImagePreview"
          />

          <!-- Время -->
          <div class="message-time  ">
            <span class="time-text">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Просмотр изображения -->
    <ImagePreviewModal v-if="isImageAttachment" v-model="isPreviewOpen" :images="previewImages" />
  </div>
</template>

<style scoped>


.message-bubble {
  position: relative;
  animation: message-appear 0.3s ease-out;
}

@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Градиентная рамка с эффектом свечения */
.message-border {
  position: relative;
  border-radius: 1.25rem 1.25rem 1.25rem 0.25rem;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(78, 168, 255, 0.4) 0%,
    rgba(78, 168, 255, 0.1) 30%,
    rgba(188, 198, 224, 0.05) 60%,
    rgba(188, 198, 224, 0.2) 100%
  );
  box-shadow:
    0 8px 32px rgba(78, 168, 255, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-border:hover {
  background: linear-gradient(
    135deg,
    rgba(78, 168, 255, 0.6) 0%,
    rgba(78, 168, 255, 0.2) 30%,
    rgba(188, 198, 224, 0.1) 60%,
    rgba(188, 198, 224, 0.3) 100%
  );
  box-shadow:
    0 12px 40px rgba(78, 168, 255, 0.25),
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* Внутренний контент с glassmorphism */
.message-content {
  position: relative;
  border-radius: 1.2rem 1.2rem 1.2rem 0.2rem;
  background: linear-gradient(135deg, rgba(18, 33, 49, 0.55) 0%, rgba(28, 43, 60, 0.6) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Текст сообщения */
.message-text {
  color: #d4e4fa;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* Время сообщения */
.message-time {
  margin-top: 0.25rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 95%;
  gap: 0.5rem;
  bottom: 4px;
  position: absolute;
}

.time-text {
  font-size: 0.75rem;
  color: rgba(198, 198, 204, 0.6);
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.message-border:hover .time-text {
  color: rgba(78, 168, 255, 0.8);
}

/* Анимация пульсации */
.animate-pulse-important {
  animation: pulse-important 2s ease-in-out infinite;
}

@keyframes pulse-important {
  0%,
  100% {
    filter: brightness(1);
    transform: scale(1);
  }
  50% {
    filter: brightness(1.1);
    transform: scale(1.02);
  }
}
</style>
