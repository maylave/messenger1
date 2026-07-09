import { computed, type Ref } from 'vue'

export const HEX_COLOR_REGEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g

export function useMessageColors(text: Ref<string | undefined>) {
  const detectedColors = computed<string[]>(() => {
    if (!text.value) return []
    const re = new RegExp(HEX_COLOR_REGEX.source, HEX_COLOR_REGEX.flags)
    const matches = [...text.value.matchAll(re)]
    return [...new Set(matches.map((m) => m[0]))]
  })

  return { detectedColors }
}
