<script setup lang="ts">
import { computed } from 'vue'
import { getFileTypeDefinition } from '@/config/fileTypeConfig'
import type { FileKind } from '@/types/message'

const props = defineProps<{
  fileName: string
  fileType: FileKind
  fileSize?: string
  fileUrl?: string
}>()

const definition = computed(() => getFileTypeDefinition(props.fileType))
</script>

<template>
  <component
    :is="definition.preview"
    :file-name="fileName"
    :file-size="fileSize"
    :file-url="fileUrl"
    :icon="definition.icon"
  />
</template>