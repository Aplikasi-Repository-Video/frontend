<template>
  <div class="flex h-screen overflow-hidden">
    <main
      ref="scrollRef"
      class="flex-1 bg-primary overflow-y-auto no-scrollbar px-6 pb-6"
      @scroll.passive="handleScroll"
    >
      <Topbar :showCategory="false" :searchScope="'favorite'" @search="handleSearch" />

      <div
        v-if="favoriteStore.isLoading && favoriteStore.favoriteList.length === 0"
        class="text-primary"
      >
        Loading video...
      </div>

      <div v-else>
        <div v-if="favoriteStore.errorMessage" class="text-red-500 mb-4">
          {{ favoriteStore.errorMessage }}
        </div>

        <div v-if="favoriteStore.favoriteList.length === 0" class="text-primary">
          Tidak ada video ditemukan.
        </div>

        <Section
          title="Video Favorit"
          :videos="favoriteStore.favoriteList"
          :disableLimit="true"
          :isFavorite="true"
        />

        <div
          v-if="favoriteStore.isLoading && favoriteStore.favoriteList.length > 0"
          class="text-center text-primary mt-4"
        >
          Memuat lebih banyak...
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useFavoriteStore } from '@/stores/favorite'
import Topbar from '@/components/layout/TopBar.vue'
import Section from '@/components/video/VideoSection.vue'

const favoriteStore = useFavoriteStore()
const scrollRef = ref(null)

function handleSearch({ query, scope }) {
  if (scope !== 'favorite') return
  favoriteStore.filterFavorites(query)
}

function handleScroll() {
  const el = scrollRef.value
  if (!el || favoriteStore.isLoading || !favoriteStore.hasMore || favoriteStore.searchQuery) return

  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (nearBottom) {
    favoriteStore.fetchFavorites()
  }
}

onMounted(() => {
  if (favoriteStore.allVideoList.length === 0) {
    favoriteStore.fetchFavorites({ reset: true })
  }
})
onBeforeUnmount(() => {
  scrollRef.value?.removeEventListener('scroll', handleScroll)
})
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
