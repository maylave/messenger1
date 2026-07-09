<script lang="ts" setup>
import { computed, toRef } from 'vue'
import ColorPalette from '@/components/chat/ColorPalette.vue'
import MessageTags from '@/components/chat/MessageTags.vue'
import MessageColorSwatches from '@/components/chat/MessageColorSwatches.vue'
import FileAttachment from '@/components/chat/files/FileAttachment.vue'
import { useMessageContent } from '@/composables/useMessageContent'
import { DEFAULT_BUBBLE_CLASS } from '@/config/tagConfig'
import type { Message } from '@/types/message'

const props = defineProps<{ message: Message }>()

const textRef = toRef(props.message, 'text')
const { detectedTags, priorityTag, detectedColors, cleanText } = useMessageContent(textRef)

const bubbleClass = computed(() => priorityTag.value?.bubbleClass ?? DEFAULT_BUBBLE_CLASS)

const isColorPaletteOnly = computed(
  () => detectedColors.value.length > 0 && !props.message.fileName && cleanText.value.length === 0,
)

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
  <div class="flex justify-end">
    <!-- ВАРИАНТ 1: ЧИСТАЯ ПАЛИТРА -->
    <div
      v-if="isColorPaletteOnly"
      :key="'palette-' + message.id"
      class="relative w-[280px] rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-[1.02]"
      :class="bubbleClass"
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
      class="max-w-[70%] px-4 py-2 rounded-lg rounded-br-none relative transition-all duration-300 text-white"
      :class="bubbleClass"
    >
      <MessageTags v-if="detectedTags.length > 0" :tags="detectedTags" variant="inline" />

      <div v-if="cleanText" class="text-sm whitespace-pre-wrap break-words">
        {{ cleanText }}
      </div>

      <MessageColorSwatches
        v-if="detectedColors.length > 0"
        :colors="detectedColors"
        @copy="copyToClipboard"
      />

      <FileAttachment
        v-if="message.fileName"
        :file-name="message.fileName"
        :file-type="message.fileType ?? 'other'"
        :file-size="message.fileSize"
        :file-url="message.fileUrl"
      />

      <p class="text-xs mt-2 opacity-60 text-right select-none">
        {{ formatTime(message.timestamp) }}
      </p>
    </div>
  </div>
</template>

<style>
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
