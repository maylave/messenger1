// src/types/global.d.ts
export {}

declare global {
  interface Window {
    api: {
      sendMessage: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>
      getMessages: (chatId: string) => Promise<{ success: boolean; data?: any; error?: string }>
      saveFile: (payload: {
        chatId: string
        fileName: string
        buffer: ArrayBuffer
        fileType?: string
        fileSize?: string
        textContent?: string
      }) => Promise<{ success: boolean; data?: any; error?: string }>
    }
  }
}
