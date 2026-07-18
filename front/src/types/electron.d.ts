// src/types/electron.d.ts
export interface ElectronAPI {
  sendMessage: (data: {
    chatId: string
    senderId: string
    text?: string
    fileName?: string
    fileType?: string
    fileSize?: string
    fileUrl?: string
  }) => Promise<{ success: boolean; data?: import('./message').Message; error?: string }>
  getMessages: (chatId: string) => Promise<{
    success: boolean
    data?: Message[]
    error?: string
  }>
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
