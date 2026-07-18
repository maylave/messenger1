// electron/database/index.ts
import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { MessageRepository } from './messages'
import { SCHEMA_SQL } from './schema'
// import { ChatRepository } from './chats'

const dbPath = path.join(app.getPath('userData'), 'messenger.db')
const db = new Database(dbPath)

// Настройки производительности
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Применяем схему при каждом запуске (безопасно благодаря IF NOT EXISTS)
db.exec(SCHEMA_SQL)

// Создаем и экспортируем репозитории
export const repositories = {
  messages: new MessageRepository(db),
  // chats: new ChatRepository(db),
}

// Экспортируем сам инстанс БД для миграций или прямых запросов
export { db }
