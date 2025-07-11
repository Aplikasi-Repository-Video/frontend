<template>
  <div class="sticky top-0 z-50 backdrop-blur-md dark:bg-[#0f0b1d]/80 text-white pr-0 md:px-0 pt-2">
    <!-- Header -->
    <div class="flex items-center justify-between gap-x-8 md:grid md:grid-cols-3 md:items-center md:gap-4">
      <div class="hidden md:block">
        <div class="flex items-center gap-2 text-2xl font-bold mt-0">
          <img src="../../assets/logo.png" alt="Logo" class="w-8 h-8" />
          <span>EduVid</span>
        </div>
      </div>

      <div class="flex flex-col gap-2 md:col-span-1">
        <div class="w-full max-w-md mx-auto">
          <SearchInput
            :searchScope="searchScope"
            @search="emit('search', $event)"
          />
        </div>
      </div>

      <div class="flex-shrink-0 flex items-center gap-4 justify-end md:col-span-1">
  <!-- Tombol Toggle Dark/Light Mode -->
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg transition-colors"
    :class="themeClasses.bgSecondary"
  >
    <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
    </svg>
    <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
    </svg>
  </button>

  <!-- Tombol Profile -->
  <a href="/profile">
    <button type="button" aria-label="Profile" class="material-icons text-white text-5xl">
      account_circle
    </button>
  </a>
</div>

    </div>

    <!-- Kategori -->
    <div class="overflow-x-auto no-scrollbar" v-if="showCategory">
      <div class="flex gap-2 mt-2 pb-3">
        <button
          :class="[
            'px-4 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1',
            selectedCategoryId === null
              ? 'bg-white text-black font-semibold'
              : 'bg-[#1e1b2e] text-white border border-gray-600',
          ]"
          @click="selectCategory(null)"
        >
          Semua
          <span v-if="isLoading && selectedCategoryId === null" class="text-xs animate-spin">⏳</span>
        </button>

        <button
          v-for="kategori in kategoriList"
          :key="kategori.id"
          :class="[
            'px-4 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1',
            selectedCategoryId === kategori.id
              ? 'bg-white text-black font-semibold'
              : 'bg-[#1e1b2e] text-white border border-gray-600',
          ]"
          @click="selectCategory(kategori.id)"
        >
          {{ kategori.name }}
          <span v-if="isLoading && selectedCategoryId === kategori.id" class="text-xs animate-spin">⏳</span>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
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

onMounted(async () => {
  if (!props.showCategory) return
  try {
    const res = await axios.get('/categories')
    kategoriList.value = res.data.data
    await selectCategory(null)
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
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
</style>
