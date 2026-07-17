import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],

  // Важно для Electron: базовый путь должен быть относительным
  base: './',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Настройки сборки для Electron
  build: {
    outDir: 'dist/renderer', // Рендерер собирается в отдельную папку
    emptyOutDir: true,
  },

  // Оптимизация зависимостей
  optimizeDeps: {
    exclude: ['lucide-vue-next'],
  },
})
