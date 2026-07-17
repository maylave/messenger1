<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  colors: string[]
}>()

const emit = defineEmits<{ copy: [color: string] }>()

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <!-- 
    ИЗМЕНЕНИЯ ЗДЕСЬ:
    1. max-w-full: не дает контейнеру уйти за пределы родителя
    2. overflow-x-auto: включает горизонтальный скролл ВНУТРИ этого блока
    3. scrollbar-hide (опционально): можно добавить кастомный класс для скрытия полосы прокрутки, если нужно
  -->
  <div
    class="mt-2 flex items-center pl-1 select-none group justify-start w-fit max-w-full overflow-x-auto pb-2 custom-scrollbar"
  >
    <div class="flex items-center h-9 pr-4">
      <!-- pr-4 дает отступ справа для кнопки -->
      <div
        v-for="(color, index) in colors"
        :key="color"
        @click.stop="emit('copy', color)"
        class="relative flex items-center cursor-pointer rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink-0"
        :style="{
          zIndex: colors.length - index,
          marginLeft: index === 0 ? '0px' : isExpanded ? '8px' : '-12px',
          width: isExpanded ? 'auto' : '28px',
          paddingRight: isExpanded ? '12px' : '0px',
          backgroundColor: isExpanded ? 'rgba(0,0,0,0.4)' : 'transparent',
        }"
      >
        <!-- Кружок цвета -->
        <div
          class="w-7 h-7 rounded-full shadow-md border-2 border-white/20 flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:border-white/50 hover:shadow-xl"
          :style="{ backgroundColor: color }"
        ></div>

        <!-- Свечение -->
        <div
          class="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          :style="{
            boxShadow: `0 0 0 3px ${color}, 0 0 10px ${color}80`,
          }"
        ></div>

        <!-- Название цвета -->
        <span
          class="text-[10px] font-mono text-white whitespace-nowrap ml-2 select-none origin-left"
          :style="{
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.4s ease-out 0.1s',
            pointerEvents: isExpanded ? 'auto' : 'none',
          }"
        >
          {{ color }}
        </span>
      </div>

      <!-- Кнопка -->
      <button
        @click.stop="toggleExpand"
        class="relative z-[60] flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-white/10 border-2 border-white/30 cursor-pointer transition-all duration-300 active:scale-95 flex-shrink-0 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 -ml-3 mr-2"
        :class="{ 'border-blue-400/50 bg-blue-500/20 rotate-180': isExpanded }"
        title="Развернуть цвета"
      >
        <svg
          class="w-4 h-4 text-white/90 transition-transform duration-500 ease-out"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>
