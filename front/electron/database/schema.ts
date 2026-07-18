// electron/database/schema.ts

// electron/database/schema.ts
export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    
    -- Текстовое содержимое
    text_content TEXT, 
    
    -- Файловые метаданные (соответствуют Message interface)
    file_name TEXT,
    file_type TEXT,      -- 'image', 'document' и т.д.
    file_size TEXT,      -- храним как строку "48.1 KB" или число байт
    file_url TEXT,       -- локальный путь к файлу
    
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_messages_chat_time 
    ON messages(chat_id, timestamp DESC);
`
