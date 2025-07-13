<template>
  <div class="sticky top-0 z-50 backdrop-blur-md dark:bg-primary/80 text-primary pr-0 md:px-0 pt-2 border-b border-secondary">
    <!-- Header -->
    <div
      class="flex items-center justify-between gap-x-8 md:grid md:grid-cols-3 md:items-center md:gap-4"
    >
      <div class="hidden md:block">
        <div class="flex items-center gap-2 text-2xl font-bold mt-3 ml-1.5 mb-2">
          <img src="../../assets/logo.png" alt="Logo" class="w-8 h-8" />
          <span>EduVid</span>
        </div>
      </div>

      <div class="flex flex-col gap-2 md:col-span-1 mb-2 md:mb-0">
        <div class="w-full max-w-md mx-auto">
          <SearchInput :searchScope="searchScope" @search="emit('search', $event)" />
        </div>
      </div>

      <div class="flex-shrink-0 flex items-center gap-4 justify-end md:col-span-1">
        <div class="relative">
          <button
            @click="toggleSettingsDropdown"
            class="p-2 rounded-lg transition-colors"
            :class="themeClasses.bgSecondary"
            aria-label="Settings"
          >
            <svg
              class="w-5 h-5"
              :class="themeClasses.textPrimary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <div
            v-if="showSettingsDropdown"
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
            :class="themeClasses.bgCard"
          >
            <div class="py-1" role="menu">
              <button
                @click="handleThemeToggle"
                class="flex items-center w-full px-4 py-2 text-sm transition-colors hover:bg-secondary"
                :class="themeClasses.textPrimary"
                role="menuitem"
              >
                <svg
                  v-if="isDark"
                  class="w-4 h-4 mr-3 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 mr-3 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                {{ isDark ? 'Light Mode' : 'Dark Mode' }}
              </button>

              <div class="border-t my-1" :class="themeClasses.borderPrimary"></div>

              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                role="menuitem"
              >
                <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto no-scrollbar" v-if="showCategory">
      <div class="flex gap-2 mt-2 pb-3">
        <button
          :class="[
            'px-4 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1',
            selectedCategoryId === null
              ? 'bg-passive text-black font-semibold'
              : 'bg-secondary text-secondary border border-primary',
          ]"
          @click="selectCategory(null)"
        >
          Semua
          <span v-if="isLoading && selectedCategoryId === null" class="text-xs animate-spin"
            >⏳</span
          >
        </button>

        <button
          v-for="kategori in kategoriList"
          :key="kategori.id"
          :class="[
            'px-4 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1',
            selectedCategoryId === kategori.id
              ? 'bg-passive text-black font-semibold'
              : 'bg-secondary text-secondary border border-primary',
          ]"
          @click="selectCategory(kategori.id)"
        >
          {{ kategori.name }}
          <span v-if="isLoading && selectedCategoryId === kategori.id" class="text-xs animate-spin"
            >⏳</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, onUnmounted } from 'vue'
import SearchInput from '../SearchInput.vue'
import axios from '@/services/axios'
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme, themeClasses } = useTheme()

const props = defineProps({
  showCategory: {
    type: Boolean,
    default: true,
  },
  searchScope: {
    type: String,
    default: 'dashboard',
  },
})

const isLoading = ref(false)
const showSettingsDropdown = ref(false)

const emit = defineEmits(['search', 'categorySelected'])
const instance = getCurrentInstance()

const kategoriList = ref([])
const selectedCategoryId = ref(null)

function safeEmit(eventName, payload) {
  const listeners = instance?.vnode?.props || {}
  const handlerKey = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`
  const hasListener = typeof listeners[handlerKey] === 'function'

  if (hasListener) {
    emit(eventName, payload)
  } else {
    console.warn(`[Topbar] Event '${eventName}' tidak ditangani oleh parent.`)
  }
}

const toggleSettingsDropdown = () => {
  showSettingsDropdown.value = !showSettingsDropdown.value
}

const handleThemeToggle = () => {
  toggleTheme()
  showSettingsDropdown.value = false
}

const handleLogout = async () => {
  try {
    await axios.post('/logout')

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    window.location.href = '/login'
  } catch (error) {
    console.error('Logout failed:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showSettingsDropdown.value = false
  }
}

onMounted(async () => {
  if (!props.showCategory) return
  try {
    const res = await axios.get('/categories')
    kategoriList.value = res.data.data
    await selectCategory(null)
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const selectCategory = async (id) => {
  selectedCategoryId.value = id
  isLoading.value = true
  try {
    safeEmit('categorySelected', { id })
  } catch (error) {
    console.error('Gagal mengambil video:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hover\:bg-secondary:hover {
  @apply bg-gray-100 dark:bg-gray-700;
}
</style>
