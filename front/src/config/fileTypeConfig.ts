import { markRaw, type Component } from 'vue'
import type { FileKind } from '@/types/message'

import IconImage from '@/components/chat/icons/IconImage.vue'
import IconDocument from '@/components/chat/icons/IconDocument.vue'
import IconVideo from '@/components/chat/icons/IconVideo.vue'
import IconAudio from '@/components/chat/icons/IconAudio.vue'
import IconFile from '@/components/chat/icons/IconFile.vue'

import FileImagePreview from '@/components/chat/files/FileImagePreview.vue'
import FileGenericPreview from '@/components/chat/files/FileGenericPreview.vue'

interface FileTypeDefinition {
  icon: Component
  preview: Component
  label: string
}

// Реестр типов файлов. Чтобы добавить, например, отдельный плеер для видео —
// создай FileVideoPreview.vue и подставь его сюда в поле preview.
// ChatMessage.vue и FileAttachment.vue при этом не меняются.
export const FILE_TYPE_REGISTRY: Record<FileKind, FileTypeDefinition> = {
  image: { icon: markRaw(IconImage), preview: markRaw(FileImagePreview), label: 'Изображение' },
  svg: { icon: markRaw(IconImage), preview: markRaw(FileImagePreview), label: 'SVG' },
  document: {
    icon: markRaw(IconDocument),
    preview: markRaw(FileGenericPreview),
    label: 'Документ',
  },
  video: { icon: markRaw(IconVideo), preview: markRaw(FileGenericPreview), label: 'Видео' },
  audio: { icon: markRaw(IconAudio), preview: markRaw(FileGenericPreview), label: 'Аудио' },
  other: { icon: markRaw(IconFile), preview: markRaw(FileGenericPreview), label: 'Файл' },
}

export function resolveFileType(mimeType: string, fileName: string): FileKind {
  const lowerName = fileName.toLowerCase()
  if (mimeType === 'image/svg+xml' || lowerName.endsWith('.svg')) return 'svg'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
  return 'other'
}

export function getFileTypeDefinition(kind: FileKind): FileTypeDefinition {
  return FILE_TYPE_REGISTRY[kind] ?? FILE_TYPE_REGISTRY.other
}
