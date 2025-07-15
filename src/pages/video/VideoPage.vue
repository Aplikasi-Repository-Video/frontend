<template>
  <div class="flex h-screen overflow-hidden">
    <main
      ref="scrollAreaRef"
      class="flex-1 bg-primary overflow-y-auto no-scrollbar px-6 pb-6"
      @scroll.passive="handleScroll"
    >
      <Topbar
        :showCategory="true"
        :searchScope="'dashboard'"
        :class="'ml-2'"
        @search="handleSearch"
        @categorySelected="handleCategorySelected"
      />

      <!-- Loading awal saat belum ada video -->
      <div v-if="videoStore.isLoading && videoStore.videoList.length === 0" class="text-primary">
        Loading video...
      </div>

      <div v-else>
        <div v-if="videoStore.errorMessage" class="text-red-500 mb-4">
          {{ videoStore.errorMessage }}
        </div>

        <div
          v-if="videoStore.videoList.length === 0 && !videoStore.searchQuery"
          class="text-primary text-lg mt-4"
        >
          Belum ada video.
        </div>

        <template v-if="videoStore.searchQuery || videoStore.videoList.length > 0">
          <template v-if="videoStore.videoList.length > 0">
            <Section
              :title="
                videoStore.searchQuery ? 'Hasil pencarian untuk : ' + videoStore.searchQuery : ''
              "
              :videos="videoStore.videoList"
            />

            <div v-if="videoStore.isLoading" class="text-primary text-center mt-4">
              Memuat lebih banyak...
            </div>
          </template>

          <template v-else-if="!videoStore.isLoading">
            <div class="text-primary text-center mt-2">
              Tidak ada video ditemukan
              <span v-if="videoStore.searchQuery">
                untuk pencarian "{{ videoStore.searchQuery }}"
              </span>
            </div>
          </template>
        </template>

        <template v-else>
          <Section :videos="videoStore.latestVideoList" />
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import Topbar from '@/components/layout/TopBar.vue'
import Section from '@/components/video/VideoSection.vue'

const videoStore = useVideoStore()
const route = useRoute()
const router = useRouter()

const scrollAreaRef = ref(null)

watch(
  () => route.query.q,
  (newQuery) => {
    if (!newQuery || !newQuery.trim()) return

    if (videoStore.searchQuery === newQuery) return

    videoStore.updateSearchQuery(newQuery)
    videoStore.fetchVideos({ keyword: newQuery, reset: true })
  },
)

function handleScroll() {
  const el = scrollAreaRef.value
  if (!el || videoStore.isLoading || !videoStore.hasMore) return

  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100
  if (nearBottom) {
    videoStore.fetchVideos()
  }
}

function handleSearch(payload) {
  const { query, scope } = payload

  if (scope !== 'dashboard') return
  if (!query || !query.trim()) return

  router.push({ path: '/videos/search', query: { q: query.trim() } })
}

function handleCategorySelected({ id }) {
  videoStore.updateSearchQuery('')
  videoStore.categoryId = id

  videoStore.fetchVideos({ reset: true, categoryId: id })
}

onMounted(() => {
  const keyword = route.query.q || ''

  if (videoStore.videoList.length > 0 && videoStore.searchQuery === keyword) {
    return
  }

  if (keyword.trim()) {
    videoStore.updateSearchQuery(keyword)
    videoStore.fetchVideos({ keyword, reset: true })
  }
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
