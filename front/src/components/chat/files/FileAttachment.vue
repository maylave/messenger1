<script setup lang="ts">
import { getFileTypeDefinition } from '@/config/fileTypeConfig'
import type { FileKind, TagMatch } from '@/types/message'
import { computed } from 'vue'

const props = defineProps<{
  fileName: string
  fileType: FileKind
  fileSize?: string
  fileUrl?: string
  textContent?: string      // Текст для превью
  fileTags?: TagMatch[]     // Теги из текста
  fileColors?: string[]     // Цвета из текста
}>()

const definition = computed(() => getFileTypeDefinition(props.fileType))
</script>

<template>
  <!-- Динамически рендерим нужный компонент превью -->
  <component
    :is="definition.preview"
    :file-name="fileName"
    :file-size="fileSize"
    :file-url="fileUrl"
    :icon="definition.icon"
    :text-content="textContent"
    :file-tags="fileTags"
    :file-colors="fileColors"
  />
</template>