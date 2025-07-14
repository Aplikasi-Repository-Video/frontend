<template>
  <div class="relative w-full" ref="searchContainer">
    <div
      class="flex items-center gap-4 bg-passive rounded-full px-4 py-2 border border-transparent focus-within:border-white transition-colors"
    >
      <input
        v-model="searchQuery"
        :placeholder="placeholderText"
        @focus="showHistory = true"
        @blur="hideWithDelay"
        @keyup.enter="handleSearch"
        type="text"
        class="rounded-full bg-passive text-primary w-full outline-none"
      />
      <button @mousedown="handleSearch" class="material-icons text-primary z-20 relative">
        search
      </button>
    </div>

    <ul
      v-if="showHistory && searchHistory.length && !searchQuery"
      class="absolute top-full mt-2 w-full bg-passive text-primary rounded shadow z-10"
    >
      <li
        v-for="(item, index) in showAllHistory ? searchHistory : searchHistory.slice(0, 3)"
        :key="item"
        class="flex justify-between items-center px-4 py-2 hover:bg-muted"
      >
        <span
          @click="handleSelectSuggestion(item)"
          class="cursor-pointer flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ item }}
        </span>
        <button
          @mousedown.stop.prevent="removeHistoryItem(index)"
          class="text-muted hover:text-red-500"
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
      class="absolute top-full mt-2 w-full text-center text-muted"
    >
      Tidak ada pencarian sebelumnya
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  searchScope: {
    type: String,
    default: 'dashboard',
  },
})

const emit = defineEmits(['search'])

const {
  searchQuery,
  searchHistory,
  showHistory,
  addToHistory,
  removeHistoryItem,
  clearHistory,
  hideWithDelay,
  loadSearchHistory,
} = useSearch()

const showAllHistory = ref(false)
const searchContainer = ref(null)

function handleSearch() {
  const query = searchQuery.value?.trim()

  if (!query || query.length < 3) {
    toast.error('Pencarian harus minimal 3 karakter')
    return
  }

  addToHistory(query)
  emit('search', {
    query,
    scope: props.searchScope,
  })
  showHistory.value = false
}

function handleSelectSuggestion(item) {
  searchQuery.value = item
  addToHistory(item)
  emit('search', {
    query: item,
    scope: props.searchScope,
  })
  showHistory.value = false
}

const placeholderText = computed(() => {
  switch (props.searchScope) {
    case 'history':
      return 'Cari di histori...'
    case 'favorite':
      return 'Cari video favorit...'
    case 'dashboard':
    default:
      return 'Cari video...'
  }
})

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

<style scoped>
/* Optional styling */
</style>
