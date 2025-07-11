<template>
  <div class="flex h-screen overflow-hidden">
    <main
      ref="scrollRef"
      class="flex-1 bg-[#0f0b1d] overflow-y-auto no-scrollbar px-6 pb-6"
      @scroll.passive="handleScroll"
    >
      <Topbar
        :showCategory="false"
        :searchScope="'history'"
        @search="handleSearch"
      />

      <div v-if="historyStore.isLoading && historyStore.videoList.length === 0" class="text-white">
        Loading video...
      </div>

      <div v-else>
        <Section
          v-if="historyStore.videoList.length > 0"
          title="Lanjutkan Menonton"
          :videos="historyStore.videoList"
          :disableLimit="true"
          :isHistory="true"
        />

        <div v-if="historyStore.isLoading && historyStore.videoList.length > 0" class="text-center text-white mt-4">
          Memuat lebih banyak...
        </div>

        <p v-else-if="historyStore.videoList.length === 0" class="text-white text-lg mt-4">
          Belum ada video yang ditonton.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useHistoryStore } from '@/stores/history'
import Topbar from '@/components/layout/TopBar.vue'
import Section from '@/components/video/VideoSection.vue'

const historyStore = useHistoryStore()
const scrollRef = ref(null)

function handleSearch({ query, scope }) {
  if (scope !== 'history') return
  historyStore.filterBySearch(query)
}

function handleScroll() {
  const el = scrollRef.value
  if (!el || historyStore.isLoading || !historyStore.hasMore || historyStore.searchQuery) return

  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (nearBottom) {
    historyStore.fetchWatchHistory()
  }
}

onMounted(() => {
  if (!historyStore.isInitialized) {
    historyStore.fetchWatchHistory({ reset: true })
  }
})

onBeforeUnmount(() => {
  // Tidak perlu removeEventListener karena pakai @scroll
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
