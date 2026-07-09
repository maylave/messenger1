<script setup lang="ts">
defineProps<{ colors: string[] }>()
const emit = defineEmits<{ copy: [color: string] }>()
</script>

<template>
  <div class="mt-2 flex flex-wrap gap-1.5">
    <div
      v-for="color in colors"
      :key="color"
      @click.stop="emit('copy', color)"
      class="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 rounded-full pl-1 pr-2 py-0.5 cursor-pointer transition-all active:scale-95 border border-white/10"
    >
      <div
        class="w-4 h-4 rounded-full shadow-sm border border-white/20"
        :style="{ backgroundColor: color }"
      ></div>
      <span class="text-[10px] font-mono opacity-90">{{ color }}</span>
    </div>
  </div>
</template>
