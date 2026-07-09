import { computed, type Ref } from 'vue'
import { TAG_RULES } from '@/config/tagConfig'
import type { TagMatch } from '@/types/message'

// \w в JS не включает кириллицу, поэтому явно перечисляем допустимые символы слова
const WORD_CHARS = 'a-zA-Zа-яА-ЯёЁ0-9_'

function buildTagRegex(): RegExp {
  const alternation = TAG_RULES.flatMap((rule) =>
    rule.keywords.map((keyword) => `${keyword}[${WORD_CHARS}]*`),
  ).join('|')
  return new RegExp(`[@#]\\s*(${alternation})(?![${WORD_CHARS}])`, 'gi')
}

export const TAG_REGEX = buildTagRegex()

function resolveRule(raw: string) {
  return TAG_RULES.find((rule) => rule.keywords.some((k) => raw.startsWith(k)))
}

export function useMessageTags(text: Ref<string | undefined>) {
  const detectedTags = computed<TagMatch[]>(() => {
    if (!text.value) return []
    const re = new RegExp(TAG_REGEX.source, TAG_REGEX.flags)
    const matches = [...text.value.matchAll(re)]
    const seen = new Set<string>()
    const result: TagMatch[] = []

    for (const match of matches) {
      const raw = (match[1] ?? '').toLowerCase().trim()
      const rule = resolveRule(raw)
      if (rule && !seen.has(rule.type)) {
        seen.add(rule.type)
        result.push({ ...rule, raw })
      }
    }
    return result
  })

  const priorityTag = computed(() => {
    if (detectedTags.value.length === 0) return null
    return [...detectedTags.value].sort((a, b) => a.priority - b.priority)[0]
  })

  return { detectedTags, priorityTag }
}
