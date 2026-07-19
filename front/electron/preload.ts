// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  sendMessage: (data: any) => ipcRenderer.invoke('message:create', data),
  getMessages: (chatId: string) => ipcRenderer.invoke('message:get', chatId),
  saveFile: (payload: { chatId: string; fileName: string; buffer: ArrayBuffer }) =>
    ipcRenderer.invoke('file:save', payload),
})
