<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-vue-next'

const username = ref('')
const password = ref('')

const isLoading = ref(false)
const showPassword = ref(false)

const login = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  console.log('Login:', { username: username.value, password: password.value })
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md">
      <!-- Логотип -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16  rounded-lg flex items-center justify-center shadow-lg">
          <User :size="40" class="text-white" />
        </div>
      </div>

      <h1 class="text-2xl font-semibold mb-2 text-center text-white">
        Вход в систему
      </h1>
      

      <form @submit.prevent="login" class="space-y-5">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300 mb-1.5">
            Имя пользователя
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User :size="20" class="text-gray-500" />
            </div>
            <input
              v-model="username"
              type="text"
              id="username"
              class="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none text-sm"
              placeholder="username"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">
            Пароль
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock :size="20" class="text-gray-500" />
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="w-full pl-10 pr-10 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none text-sm"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <component
                :is="showPassword ? EyeOff : Eye"
                :size="20"
                class="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              />
            </button>
          </div>
        </div>

        <!-- Remember me -->
        
        <!-- Submit button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600  text-white py-2.5 px-4 rounded-md font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <span v-if="!isLoading" class="flex items-center justify-center">
            Войти
            <ArrowRight :size="16" class="ml-2" />
          </span>
          <span v-else class="flex items-center justify-center">
            <Loader2 :size="16" class="mr-2 animate-spin" />
            Вход...
          </span>
        </button>
      </form>

      <!-- Register link -->
      
    </div>
  </div>
</template>