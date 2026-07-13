<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  isOpen?: boolean
}>()

const emit = defineEmits<{
  search: [query: string]
  toggle: []
}>()

const searchQuery = ref('')
const isSearchFocused = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const isExpanded = () => isSearchFocused.value || searchQuery.value.length > 0

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
  searchInput.value?.focus()
}

const activateSearch = () => {
  searchInput.value?.focus()
}
</script>
<template>
  <div class="px-4 py-5">
    <div class="flex items-center gap-3">
      <h3
        class="liquid-glass relative text-on-surface font-medium text-headline-md tracking-tight pl-8 py-3 rounded-xl text-mg w-full transition-all duration-300 ease-out overflow-hidden"
      >
        {{ props.title || ' чат' }}
      </h3>
      <div class="relative flex-1 flex justify-end pr-10 gap-4">
        <div
          @click="activateSearch"
          class="liquid-glass flex items-center gap-2 h-10 px-2.5 rounded-full border backdrop-blur-xl overflow-hidden transition-all duration-300 ease-out cursor-text"
          :class="[
            isExpanded() ? 'w-100 pr-3' : 'w-25',
            isSearchFocused
              ? 'border-accent/40 bg-surface-container-high/70 shadow-lg shadow-accent/10'
              : 'border-white/10 bg-surface-container-high/40 shadow-md shadow-black/10',
          ]"
        >
          <svg
            class="w-5 h-5 flex-shrink-0 transition-colors duration-200"
            :class="isSearchFocused ? 'text-accent' : 'text-outline'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref="searchInput"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            type="text"
            placeholder="Search project..."
            class="min-w-0 bg-transparent text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-sm transition-opacity duration-200"
            :class="
              isExpanded() ? 'flex-1 opacity-100 delay-100' : 'w-0 opacity-0 pointer-events-none'
            "
          />

          <button
            v-if="searchQuery"
            @click.stop="clearSearch"
            class="flex-shrink-0 p-1 hover:bg-on-surface/10 rounded-full transition-colors"
          >
            <svg class="w-4 h-4 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="border border-white/10 bg-surface-container-high/40 backdrop-blur-xl shadow-md shadow-black/10 w-10 relative rounded-3xl"
        >
          <button
            @click="emit('toggle')"
            class="w-10 h-10 flex items-center justify-center rounded-3xl transition-all duration-200 group liquid-glass"
            :class="
              isOpen
                ? 'text-accent bg-accent/10'
                : 'text-outline hover:text-accent hover:bg-on-surface/5'
            "
            title="Открыть панель"
          >
            <svg
              class="w-5 h-5 transition-transform duration-200"
              :class="isOpen ? 'scale-95' : 'group-hover:scale-105'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="3" y="4" width="18" height="16" rx="3" stroke-width="1.8" />
              <line
                x1="15.5"
                y1="4"
                x2="15.5"
                y2="20"
                stroke-width="1.8"
                :class="isOpen ? 'stroke-current opacity-100' : 'opacity-50'"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.liquid-glass {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(39, 54, 71, 0.6) 0%,
    rgba(39, 54, 71, 0.3) 50%,
    rgba(39, 54, 71, 0.5) 100%
  );
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.08),
    inset 0 -1px 2px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    125deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) 40%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 60%,
    transparent 100%
  );
  transform: skewX(-20deg);
  pointer-events: none;
  opacity: 0.5;
}

.liquid-glass {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.liquid-glass:hover {
  background: linear-gradient(
    135deg,
    rgba(39, 54, 71, 0.7) 0%,
    rgba(39, 54, 71, 0.4) 50%,
    rgba(39, 54, 71, 0.6) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
