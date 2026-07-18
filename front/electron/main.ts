// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { repositories } from './database/index'

function createWindow() {
  const win = new BrowserWindow({
    width: 1900,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Путь к собранному preload скрипту
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/renderer/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC: Создание сообщения
ipcMain.handle('message:create', async (_, data) => {
  try {
    const message = repositories.messages.create(data)
    return { success: true, data: message }
  } catch (error) {
    console.error('Error creating message:', error)
    return { success: false, error: String(error) }
  }
})

// IPC: Получение сообщений (для полноты картины)
ipcMain.handle('message:get', async (_, chatId: string) => {
  try {
    const messages = repositories.messages.getByChatId(chatId)
    return { success: true, data: messages }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return { success: false, error: String(error) }
  }
})
