export interface HistoryItem {
  id: string
  title: string
  description?: string
  type:
    | 'text'
    | 'color'
    | 'code'
    | 'image'
    | 'audio'
    | 'pdf'
    | 'font'
    | 'spreadsheet'
    | 'video'
    | 'archive'
  timestamp: Date
  group?: 'today' | 'yesterday' | 'older'
  colors?: string[]
  fileSize?: string
  duration?: string
  thumbnail?: string
  lastMessage?: string // Добавьте эту строку
}
