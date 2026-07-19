import { app, protocol, net, ipcMain, BrowserWindow } from "electron";
import path from "path";
import fs from "fs/promises";
import { pathToFileURL } from "url";
import Database from "better-sqlite3";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
class MessageRepository {
  constructor(db2) {
    this.db = db2;
  }
  // 👇 ДОБАВЬТЕ ЭТОТ МЕТОД
  getByChatId(chatId, limit = 50) {
    const stmt = this.db.prepare(`
      SELECT * FROM messages 
      WHERE chat_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    const rawMessages = stmt.all(chatId, limit);
    return rawMessages.map((msg) => ({
      id: msg.id,
      text: msg.text_content || void 0,
      fileName: msg.file_name || void 0,
      fileType: msg.file_type,
      fileSize: msg.file_size || void 0,
      fileUrl: msg.file_url || void 0,
      textContent: msg.text_content || void 0,
      timestamp: new Date(msg.timestamp)
    }));
  }
  create(data) {
    const stmt = this.db.prepare(`
      INSERT INTO messages (chat_id, sender_id, text_content, file_name, file_type, file_size, file_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.chatId,
      data.senderId,
      data.text || null,
      data.fileName || null,
      data.fileType || null,
      data.fileSize || null,
      data.fileUrl || null
    );
    const created = this.db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid);
    return {
      id: created.id,
      text: created.text_content || void 0,
      fileName: created.file_name || void 0,
      fileType: created.file_type,
      fileSize: created.file_size || void 0,
      fileUrl: created.file_url || void 0,
      textContent: created.text_content || void 0,
      timestamp: new Date(created.timestamp)
    };
  }
}
const SCHEMA_SQL = `
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
`;
const dbPath = path.join(app.getPath("userData"), "messenger.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);
const repositories = {
  messages: new MessageRepository(db)
  // chats: new ChatRepository(db),
};
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app-file",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true
    }
  }
]);
function createWindow() {
  const win = new BrowserWindow({
    width: 1900,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/index.js")
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/renderer/index.html"));
  }
}
app.whenReady().then(() => {
  protocol.handle("app-file", (request) => {
    const url = new URL(request.url);
    const driveLetter = url.hostname;
    const rest = decodeURIComponent(url.pathname);
    const filePath = `${driveLetter.toUpperCase()}:${rest}`;
    return net.fetch(pathToFileURL(filePath).toString());
  });
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.handle("message:create", async (_, data) => {
  try {
    const message = repositories.messages.create(data);
    return { success: true, data: message };
  } catch (error) {
    console.error("Error creating message:", error);
    return { success: false, error: String(error) };
  }
});
ipcMain.handle("message:get", async (_, chatId) => {
  try {
    const messages = repositories.messages.getByChatId(chatId);
    const enriched = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.fileUrl || msg.textContent) return msg;
        const isTextLike = /\.(html?|txt|md|json|csv|log|xml|css|js|ts|vue)$/i.test(
          msg.fileName ?? ""
        );
        if (!isTextLike) return msg;
        try {
          const rawPath = msg.fileUrl.replace("app-file:///", "");
          const filePath = decodeURIComponent(rawPath).replace(/\//g, path.sep);
          const content = await fs.readFile(filePath, "utf-8");
          return { ...msg, textContent: content };
        } catch (e) {
          console.error("Не удалось прочитать файл для превью:", e);
          return msg;
        }
      })
    );
    return { success: true, data: enriched };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, error: String(error) };
  }
});
ipcMain.handle(
  "file:save",
  async (_, payload) => {
    try {
      const uploadsDir = path.join(app.getPath("userData"), "uploads", String(payload.chatId));
      await fs.mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now()}_${payload.fileName}`;
      const filePath = path.join(uploadsDir, safeName);
      await fs.writeFile(filePath, Buffer.from(payload.buffer));
      const message = repositories.messages.create({
        chatId: payload.chatId,
        senderId: payload.senderId ?? "current-user-id",
        fileName: payload.fileName,
        fileType: payload.fileType,
        fileSize: payload.fileSize,
        fileUrl: `app-file:///${filePath.replace(/\\/g, "/")}`,
        textContent: payload.textContent
      });
      return { success: true, data: message };
    } catch (error) {
      console.error("Error saving file:", error);
      return { success: false, error: String(error) };
    }
  }
);
