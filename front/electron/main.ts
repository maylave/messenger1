// electron/main.ts
import { app, BrowserWindow, ipcMain, protocol, net } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import { pathToFileURL } from 'url'
import { repositories } from './database/index'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app-file',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
])

function createWindow() {
  const win = new BrowserWindow({
    width: 1900,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // app-file:///<абсолютный путь> -> отдаём содержимое файла
  protocol.handle('app-file', (request) => {
    const url = new URL(request.url)
    // host — это буква диска (например "c"), pathname — остальной путь после диска
    const driveLetter = url.hostname
    const rest = decodeURIComponent(url.pathname) // начинается с "/"
    const filePath = `${driveLetter.toUpperCase()}:${rest}`
    return net.fetch(pathToFileURL(filePath).toString())
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC: Создание текстового сообщения
ipcMain.handle('message:create', async (_, data) => {
  try {
    const message = repositories.messages.create(data)
    return { success: true, data: message }
  } catch (error) {
    console.error('Error creating message:', error)
    return { success: false, error: String(error) }
  }
})

// IPC: Получение сообщений
// electron/main.ts (фрагмент)
ipcMain.handle('message:get', async (_, chatId: string) => {
  try {
    const messages = repositories.messages.getByChatId(chatId)

    // Подтягиваем содержимое html/текстовых файлов, если оно не сохранено в БД
    const enriched = await Promise.all(
      messages.map(async (msg: any) => {
        if (!msg.fileUrl || msg.textContent) return msg

        const isTextLike = /\.(html?|txt|md|json|csv|log|xml|css|js|ts|vue)$/i.test(
          msg.fileName ?? '',
        )
        if (!isTextLike) return msg

        try {
          // fileUrl хранится как app-file:///C:/... — превращаем обратно в путь ОС
          const rawPath = msg.fileUrl.replace('app-file:///', '')
          const filePath = decodeURIComponent(rawPath).replace(/\//g, path.sep)
          const content = await fs.readFile(filePath, 'utf-8')
          return { ...msg, textContent: content }
        } catch (e) {
          console.error('Не удалось прочитать файл для превью:', e)
          return msg
        }
      }),
    )

    return { success: true, data: enriched }
  } catch (error) {
    console.error('Error fetching messages:', error)
    return { success: false, error: String(error) }
  }
})

// IPC: Сохранение файла на диск + запись сообщения с fileUrl
ipcMain.handle(
  'file:save',
  async (
    _,
    payload: {
      chatId: string
      fileName: string
      buffer: ArrayBuffer
      senderId?: string
      fileType?: string
      fileSize?: string
      textContent?: string
    },
  ) => {
    try {
      const uploadsDir = path.join(app.getPath('userData'), 'uploads', String(payload.chatId))
      await fs.mkdir(uploadsDir, { recursive: true })

      // избегаем коллизий имён
      const safeName = `${Date.now()}_${payload.fileName}`
      const filePath = path.join(uploadsDir, safeName)

      await fs.writeFile(filePath, Buffer.from(payload.buffer))

      // сохраняем сообщение в БД с постоянным путём к файлу (не blob!)
      const message = repositories.messages.create({
        chatId: payload.chatId,
        senderId: payload.senderId ?? 'current-user-id',
        fileName: payload.fileName,
        fileType: payload.fileType,
        fileSize: payload.fileSize,
        fileUrl: `app-file:///${filePath.replace(/\\/g, '/')}`,
        textContent: payload.textContent,
      })

      return { success: true, data: message }
    } catch (error) {
      console.error('Error saving file:', error)
      return { success: false, error: String(error) }
    }
  },
)
