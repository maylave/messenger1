// composables/useMessageContent.ts
import { computed, type Ref } from 'vue'
import { HEX_COLOR_REGEX, useMessageColors } from './useMessageColors'
import { TAG_REGEX, useMessageTags } from './useMessageTags'

export function useMessageContent(text: Ref<string | undefined>) {
  const { detectedTags, priorityTag } = useMessageTags(text)
  const { detectedColors } = useMessageColors(text)

  const cleanText = computed(() => {
    if (!text.value) return ''
    let result = text.value
    result = result.replace(new RegExp(TAG_REGEX.source, TAG_REGEX.flags), '')
    result = result.replace(new RegExp(HEX_COLOR_REGEX.source, HEX_COLOR_REGEX.flags), '')
    return result.replace(/\s+/g, ' ').trim()
  })

  return { detectedTags, priorityTag, detectedColors, cleanText }
}

// ✅ Добавляем отдельную функцию для контента файла
export function useFileContent(content: Ref<string | undefined>) {
  const { detectedTags, priorityTag } = useMessageTags(content)
  const { detectedColors } = useMessageColors(content)

  const cleanContent = computed(() => {
    if (!content.value) return ''
    let result = content.value
    result = result.replace(new RegExp(TAG_REGEX.source, TAG_REGEX.flags), '')
    result = result.replace(new RegExp(HEX_COLOR_REGEX.source, HEX_COLOR_REGEX.flags), '')
    return result.replace(/\s+/g, ' ').trim()
  })

  return { detectedTags, priorityTag, detectedColors, cleanContent }
}
