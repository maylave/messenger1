// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
// Импортируем ваш основной конфиг
import viteConfig from './vite.config'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.ts'),
        },
      },
    },
  },

  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts'),
        },
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
  },

  // Явно наследуем настройки из vite.config.ts
  renderer: {
    ...viteConfig,
    root: '.', // Указываем корень проекта
    build: {
      // Переопределяем outDir, чтобы electron-vite собирал в свою папку
      outDir: 'dist/renderer',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
  },
})
