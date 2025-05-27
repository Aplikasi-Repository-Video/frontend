import { ref } from 'vue'
import { useRouter } from 'vue-router'

const MAX_HISTORY_ITEMS = 5

export function useSearch() {
  const searchQuery = ref('')
  const searchHistory = ref([])
  const showHistory = ref(false)
  const router = useRouter()

  const handleSearch = () => {
    const query = searchQuery.value.trim()
    if (query) {
      addToHistory(query)
      router.push({ path: '/search', query: { q: query } })
      showHistory.value = false
    }
  }

  const addToHistory = (query) => {
    const existingIndex = searchHistory.value.indexOf(query)

    if (existingIndex !== -1) {
      searchHistory.value.splice(existingIndex, 1)
    }

    searchHistory.value.unshift(query)

    if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
      searchHistory.value.length = MAX_HISTORY_ITEMS
    }

    saveHistory()
  }

  const selectSuggestion = (item) => {
    searchQuery.value = item
    handleSearch()
  }

  const removeHistoryItem = (index) => {
    searchHistory.value.splice(index, 1)
    saveHistory()
  }

  const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }

  const hideWithDelay = () => {
    setTimeout(() => {
      showHistory.value = false
    }, 150)
  }

  const saveHistory = () => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }

  const loadSearchHistory = () => {
    const stored = localStorage.getItem('searchHistory')
    if (stored) {
      try {
        searchHistory.value = JSON.parse(stored)
      } catch (e) {
        searchHistory.value = []
        localStorage.removeItem('searchHistory')
        console.error(e)
      }
    }
  }

  return {
    searchQuery,
    searchHistory,
    showHistory,
    handleSearch,
    selectSuggestion,
    removeHistoryItem,
    clearHistory,
    hideWithDelay,
    loadSearchHistory,
  }
}
