// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // Отправка сообщения
  sendMessage: (data: any) => ipcRenderer.invoke('message:create', data),

  // Получение сообщений чата
  getMessages: (chatId: string) => ipcRenderer.invoke('message:get', chatId),
})
