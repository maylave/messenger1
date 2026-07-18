// electron/database/messages.ts
import Database from 'better-sqlite3'
import type { Message } from '../../src/types/message'

interface RawMessage {
  id: number
  text_content: string | null
  file_name: string | null
  file_type: string | null
  file_size: string | null
  file_url: string | null
  timestamp: string
}

export class MessageRepository {
  constructor(private db: Database.Database) {}

  // 👇 ДОБАВЬТЕ ЭТОТ МЕТОД
  getByChatId(chatId: string, limit = 50): Message[] {
    const stmt = this.db.prepare(`
      SELECT * FROM messages 
      WHERE chat_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `)

    const rawMessages = stmt.all(chatId, limit) as RawMessage[]

    return rawMessages.map((msg) => ({
      id: msg.id,
      text: msg.text_content || undefined,
      fileName: msg.file_name || undefined,
      fileType: msg.file_type as any,
      fileSize: msg.file_size || undefined,
      fileUrl: msg.file_url || undefined,
      textContent: msg.text_content || undefined,
      timestamp: new Date(msg.timestamp),
    }))
  }

  create(data: {
    chatId: string
    senderId: string
    text?: string
    fileName?: string
    fileType?: string
    fileSize?: string
    fileUrl?: string
  }): Message {
    // ... ваш существующий код create
    const stmt = this.db.prepare(`
      INSERT INTO messages (chat_id, sender_id, text_content, file_name, file_type, file_size, file_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const info = stmt.run(
      data.chatId,
      data.senderId,
      data.text || null,
      data.fileName || null,
      data.fileType || null,
      data.fileSize || null,
      data.fileUrl || null,
    )

    const created = this.db
      .prepare('SELECT * FROM messages WHERE id = ?')
      .get(info.lastInsertRowid) as RawMessage

    return {
      id: created.id,
      text: created.text_content || undefined,
      fileName: created.file_name || undefined,
      fileType: created.file_type as any,
      fileSize: created.file_size || undefined,
      fileUrl: created.file_url || undefined,
      textContent: created.text_content || undefined,
      timestamp: new Date(created.timestamp),
    }
  }
}
