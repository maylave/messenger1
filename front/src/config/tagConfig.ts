import { markRaw } from 'vue'
import type { TagRule } from '@/types/message'
import IconFire from '@/components/chat/icons/IconFire.vue'
import IconStar from '@/components/chat/icons/IconStar.vue'
import IconCheck from '@/components/chat/icons/IconCheck.vue'
import IconBulb from '@/components/chat/icons/IconBulb.vue'
import IconClock from '@/components/chat/icons/IconClock.vue'

// Единственное место, где описаны правила распознавания тегов.
// Чтобы добавить новый тег — добавь один объект сюда, больше нигде трогать не нужно.
export const TAG_RULES: TagRule[] = [
  {
    type: 'important',
    keywords: ['важн', 'important', 'срочн'],
    label: 'Важно',
    icon: markRaw(IconFire),
    priority: 1,
    bubbleClass:
      'bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-300 shadow-red-500/50 shadow-xl animate-pulse-important',
    badgeClass: 'bg-red-500/90',
  },
  {
    type: 'favorite',
    keywords: ['избранн', 'fav'],
    label: 'Избранное',
    icon: markRaw(IconStar),
    priority: 2,
    bubbleClass:
      'bg-gradient-to-br from-yellow-500 to-yellow-700 border-2 border-yellow-200 shadow-yellow-500/50 shadow-xl',
    badgeClass: 'bg-yellow-500/90',
  },
  {
    type: 'todo',
    keywords: ['todo'],
    label: 'Задача',
    icon: markRaw(IconCheck),
    priority: 3,
    bubbleClass:
      'bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-300 shadow-blue-500/50 shadow-xl',
    badgeClass: 'bg-blue-500/90',
  },
  {
    type: 'idea',
    keywords: ['idea'],
    label: 'Идея',
    icon: markRaw(IconBulb),
    priority: 4,
    bubbleClass:
      'bg-gradient-to-br from-purple-600 to-purple-800 border-2 border-purple-300 shadow-purple-500/50 shadow-xl',
    badgeClass: 'bg-purple-500/90',
  },
  {
    type: 'reminder',
    keywords: ['напомин'],
    label: 'Напоминание',
    icon: markRaw(IconClock),
    priority: 5,
    bubbleClass:
      'bg-gradient-to-br from-orange-500 to-orange-700 border-2 border-orange-300 shadow-orange-500/50 shadow-xl',
    badgeClass: 'bg-orange-500/90',
  },
]

export const DEFAULT_BUBBLE_CLASS = 'bg-sky-600 shadow-lg'
