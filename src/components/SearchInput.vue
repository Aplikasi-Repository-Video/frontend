<template>
  <div class="relative w-full" ref="searchContainer">
    <div
      class="flex items-center gap-4 bg-gray-800 rounded-full px-4 py-2 border border-transparent focus-within:border-white transition-colors"
    >
      <input
        v-model="searchQuery"
        @focus="showHistory = true"
        @blur="hideWithDelay"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="Cari video..."
        class="rounded-full bg-gray-800 text-white w-full outline-none"
      />
      <button @click="handleSearch" class="material-icons text-white z-20 relative">search</button>
    </div>

    <ul
      v-if="showHistory && searchHistory.length && !searchQuery"
      class="absolute top-full mt-2 w-full bg-gray-900 text-white rounded shadow z-10"
    >
      <li
        v-for="(item, index) in showAllHistory ? searchHistory : searchHistory.slice(0, 3)"
        :key="item"
        class="flex justify-between items-center px-4 py-2 hover:bg-gray-700"
      >
        <span
          @click="selectSuggestion(item)"
          class="cursor-pointer flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ item }}
        </span>
        <button
          @mousedown.stop.prevent="removeHistoryItem(index)"
          class="text-gray-500 hover:text-red-500"
        >
          &times;
        </button>
      </li>

      <li v-if="searchHistory.length > 3" class="text-right px-4 py-2 border-t">
        <button
          @mousedown.prevent="showAllHistory = !showAllHistory"
          class="text-blue-500 text-sm hover:underline"
        >
          {{ showAllHistory ? 'Sembunyikan' : 'Lihat semua' }}
        </button>
      </li>

      <li class="text-right px-4 py-2 border-t">
        <button @click="clearHistory" class="text-red-500 text-sm hover:underline">
          Hapus semua
        </button>
      </li>
    </ul>

    <p
      v-else-if="showHistory && !searchHistory.length && !searchQuery"
      class="absolute top-full mt-2 w-full text-center text-gray-500"
    >
      Tidak ada pencarian sebelumnya
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSearch } from '@/util/useSearch'

const {
  searchQuery,
  searchHistory,
  showHistory,
  handleSearch,
  selectSuggestion,
  removeHistoryItem,
  clearHistory,
  hideWithDelay,
  loadSearchHistory,
} = useSearch()

const showAllHistory = ref(false)
const searchContainer = ref(null)

function onClickOutside(event) {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showHistory.value = false
  }
}

onMounted(() => {
  loadSearchHistory()
  window.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', onClickOutside)
})
</script>

<style scoped></style>
