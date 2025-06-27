<template>
  <div class="sticky top-0 z-50 backdrop-blur-md bg-[#0f0b1d]/80 text-white pr-0 md:px-0 pt-2">
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

      <div class="flex-shrink-0 flex justify-end md:col-span-1">
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
            'px-4 py-1 rounded-full text-sm whitespace-nowrap',
            selectedCategoryId === null
              ? 'bg-white text-black font-semibold'
              : 'bg-[#1e1b2e] text-white border border-gray-600',
          ]"
          @click="selectCategory(null)"
        >
          Semua
        </button>

        <button
          v-for="kategori in kategoriList"
          :key="kategori.id"
          :class="[
            'px-4 py-1 rounded-full text-sm whitespace-nowrap',
            selectedCategoryId === kategori.id
              ? 'bg-white text-black font-semibold'
              : 'bg-[#1e1b2e] text-white border border-gray-600',
          ]"
          @click="selectCategory(kategori.id)"
        >
          {{ kategori.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import SearchInput from '../SearchInput.vue'
import axios from '@/services/axios'

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
  } catch (error) {
    console.error('Gagal mengambil kategori:', error)
  }
})

const selectCategory = async (id) => {
  selectedCategoryId.value = id
  try {
    const url = id ? `/videos/category/${id}` : '/videos'
    const res = await axios.get(url)

    safeEmit('categorySelected', {
      id,
      videos: res.data.data,
    })
  } catch (error) {
    console.error('Gagal mengambil video:', error)
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
