// types/message.ts
import type { Component } from 'vue'

export type FileKind = 'image' | 'svg' | 'document' | 'video' | 'audio' | 'other'

export interface Message {
  id: number
  text?: string
  fileName?: string
  fileType?: FileKind // ✅ Используем统一的 тип
  fileSize?: string
  fileUrl?: string
  textContent?: string
  timestamp: Date
}

export type TagType = 'important' | 'favorite' | 'todo' | 'idea' | 'reminder'

export interface TagRule {
  type: TagType
  keywords: string[]
  label: string
  icon: Component
  priority: number
  bubbleClass: string
  badgeClass: string
}

export interface TagMatch extends TagRule {
  raw: string
}
