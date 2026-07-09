<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  filesSelected: [files: File[]]
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
let dragCounter = 0

// Глобальные обработчики
const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragCounter++
  if (dragCounter === 1) {
    console.log('📥 Файл начал перетаскиваться')
    isDragging.value = true
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragCounter--
  if (dragCounter <= 0) {
    console.log(' Файл покинул окно')
    isDragging.value = false
    dragCounter = 0
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  console.log(' Drop событие!', e.dataTransfer?.files?.length, 'файлов')
  
  isDragging.value = false
  dragCounter = 0
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    console.log('✅ Отправляем файлы:', Array.from(files).map(f => f.name))
    emit('filesSelected', Array.from(files))
  }
}

const handleClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    emit('filesSelected', Array.from(files))
  }
  input.value = ''
}

onMounted(() => {
  window.addEventListener('dragenter', handleDragEnter)
  window.addEventListener('dragover', handleDragOver)
  window.addEventListener('dragleave', handleDragLeave)
  window.addEventListener('drop', handleDrop)
  console.log('🎣 Слушатели drag&drop подключены')
})

onUnmounted(() => {
  window.removeEventListener('dragenter', handleDragEnter)
  window.removeEventListener('dragover', handleDragOver)
  window.removeEventListener('dragleave', handleDragLeave)
  window.removeEventListener('drop', handleDrop)
  console.log('🔌 Слушатели отключены')
})
</script>

<template>
  <input 
    ref="fileInput"
    type="file" 
    multiple
    @change="handleFileChange"
    class="hidden"
  />

  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isDragging"
        @click="handleClick"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center cursor-pointer"
      >
        <div class="w-[600px] h-[300px] border-[4px] border-dashed border-sky-400 rounded-3xl flex flex-col items-center justify-center gap-4 bg-frame-800/80 shadow-2xl animate-pulse-slow">
          <div class="p-5 rounded-full bg-sky-400/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="text-2xl font-bold text-white">Отпустите файлы здесь</p>
          <p class="text-sm text-gray-400">Или нажмите для выбора</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .8; }
}
</style>