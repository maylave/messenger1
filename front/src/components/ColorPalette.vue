<script lang="ts" setup>
// ✅ ИСПРАВЛЕНИЕ: Явно присваиваем результат defineProps переменной props
const props = defineProps<{
  colors: string[]
}>()

const emit = defineEmits<{
  copy: [color: string]
}>()

// Динамический расчет высоты
const getHeight = () => {
  const baseHeight = 280
  // Теперь props.colors доступен и типизирован
  const extraColors = Math.max(0, props.colors.length - 4)
  return `${baseHeight + (extraColors * 60)}px`
}

const handleCopy = (color: string) => {
  navigator.clipboard.writeText(color)
  emit('copy', color)
}
</script>

<template>
  <div 
    class="group relative w-[280px] rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform hover:scale-[1.02]"
    :style="{ height: getHeight() }"
  >
    <div class="flex flex-col w-full h-full">
      <div 
        v-for="color in colors" 
        :key="color"
        class="flex-1 w-full relative flex items-center justify-center group/color transition-all duration-300"
        :style="{ backgroundColor: color }"
        @click.stop="handleCopy(color)"
      >
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
          <span class="text-white font-mono font-bold text-lg drop-shadow-md select-none">
            {{ color.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
    
    <slot name="time"></slot>
  </div>
</template>