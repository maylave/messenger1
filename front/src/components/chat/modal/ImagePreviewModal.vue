<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface ImageItem {
  url: string
  name: string
  meta?: string
}

interface Props {
  modelValue: boolean
  images: ImageItem[]
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  share: [image: ImageItem]
  download: [image: ImageItem]
}>()

const currentIndex = ref(props.initialIndex)
const zoom = ref(100)

// Шапка: показывается либо при наведении на верхнюю зону, либо когда "закреплена" двойным кликом
const isPinned = ref(false)
const isHovering = ref(false)
const headerVisible = computed(() => isPinned.value || isHovering.value)

const currentImage = computed(() => props.images[currentIndex.value])

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      currentIndex.value = props.initialIndex
      zoom.value = 100
      isPinned.value = false
      isHovering.value = false
    }
  },
)

const close = () => {
  emit('update:modelValue', false)
}

const togglePinned = () => {
  isPinned.value = !isPinned.value
}

const selectThumbnail = (index: number) => {
  currentIndex.value = index
  zoom.value = 100
}

const zoomIn = () => {
  zoom.value = Math.min(400, zoom.value + 15)
}

const zoomOut = () => {
  zoom.value = Math.max(25, zoom.value - 15)
}

const toggleFullscreen = () => {
  const el = document.documentElement
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

const handleShare = () => {
  if (currentImage.value) emit('share', currentImage.value)
}

const handleDownload = () => {
  if (currentImage.value) emit('download', currentImage.value)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
        @click.self="close"
      >
        <Transition name="modal">
          <div
            v-if="modelValue && currentImage"
            class="relative w-full overflow-hidden flex flex-col h-screen"
          >
            <!-- Изображение + всплывающая шапка поверх него -->
            <div class="relative flex-1 flex items-center justify-center px-8 py-10">
              <!-- Зона наведения для шапки: ловит mouseenter/leave независимо от того, показан хедер или нет -->
              <div
                class="absolute top-0 left-0 right-0 z-10"
                @mouseenter="isHovering = true"
                @mouseleave="isHovering = false"
              >
                <!-- Невидимая полоска-триггер, когда шапка скрыта -->
                <div v-if="!headerVisible" class="h-10 w-full"></div>

                <Transition name="header-slide">
                  <div
                    v-if="headerVisible"
                    class="flex items-center justify-between px-5 py-4 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div
                        class="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M9 9a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-100 truncate drop-shadow">
                          {{ currentImage.name }}
                        </p>
                        <p v-if="currentImage.meta" class="text-xs text-slate-300/80 truncate">
                          {{ currentImage.meta }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button
                        @click.stop="handleShare"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-sky-400 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M8.684 13.342a3 3 0 100-2.684m0 2.684a3 3 0 100 2.684m0-2.684l6.632 3.316m0-6l-6.632 3.316m6.632-3.316a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 6a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        Share
                      </button>
                      <button
                        @click.stop="handleDownload"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-sky-400 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                          />
                        </svg>
                        Download
                      </button>
                      <div class="w-px h-4 bg-white/20 mx-1"></div>
                      <button
                        @click.stop="close"
                        class="p-1.5 text-slate-300 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Фото: двойной клик закрепляет/открепляет шапку -->
              <img
                :src="currentImage.url"
                :alt="currentImage.name"
                class="max-h-[50vh] rounded-xl shadow-2xl transition-transform duration-200 select-none cursor-pointer"
                :style="{ transform: `scale(${zoom / 100})` }"
                draggable="false"
                @dblclick="togglePinned"
              />

              <!-- Бар зума -->
              <div
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-3 py-2 rounded-full border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-xl"
              >
                <button
                  @click="zoomOut"
                  class="p-1 text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0zM8 11h6"
                    />
                  </svg>
                </button>
                <span class="text-xs font-medium text-slate-300 w-9 text-center tabular-nums">
                  {{ zoom }}%
                </span>
                <button
                  @click="zoomIn"
                  class="p-1 text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0zM11 8v6M8 11h6"
                    />
                  </svg>
                </button>
                <div class="w-px h-4 bg-white/10"></div>
                <button
                  @click="toggleFullscreen"
                  class="p-1 text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Миниатюры -->
            <div
              v-if="images.length > 1"
              class="flex items-center justify-center gap-2 px-5 py-4 border-t border-white/5"
            >
              <button
                v-for="(img, index) in images"
                :key="img.url"
                @click="selectThumbnail(index)"
                class="w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-150 flex-shrink-0"
                :class="
                  index === currentIndex
                    ? 'border-sky-400 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                "
              >
                <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.modal-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.header-slide-enter-active,
.header-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.header-slide-enter-from,
.header-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
