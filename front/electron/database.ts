import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
const dbPath = path.join(app.getPath('userData'), 'messenger.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

export { db }
