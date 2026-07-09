import { computed, type Ref } from 'vue'
import { useMessageTags, TAG_REGEX } from './useMessageTags'
import { useMessageColors, HEX_COLOR_REGEX } from './useMessageColors'

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
