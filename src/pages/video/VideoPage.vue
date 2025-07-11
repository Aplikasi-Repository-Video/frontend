<template>
  <div class="flex h-screen overflow-hidden">
<main
  ref="scrollAreaRef"
  class="flex-1 bg-[#0f0b1d] overflow-y-auto no-scrollbar px-6 pb-6"
  @scroll.passive="handleScroll"
>      <Topbar
        :showCategory="true"
        :searchScope="'dashboard'"
        @search="handleSearch"
        @categorySelected="handleCategorySelected"
      />

      <div v-if="videoStore.isLoading && videoStore.videoList.length === 0" class="text-white">
        Loading video...
      </div>

      <div v-else>
        <div v-if="videoStore.errorMessage" class="text-red-500 mb-4">
          {{ videoStore.errorMessage }}
        </div>

        <template v-if="videoStore.searchQuery || videoStore.videoList.length > 0">
          <Section
            :title="videoStore.searchQuery ? 'Hasil pencarian untuk : ' + videoStore.searchQuery : ''"
            :videos="videoStore.videoList"
          />

          <div v-if="videoStore.isLoading" class="text-white text-center mt-2">Loading...</div>
        </template>

        <template v-else>
          <Section :videos="videoStore.latestVideoList" />
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch  } from 'vue'
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
  }
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

  router.push({ path: '/search', query: { q: query.trim() } })
}

function handleCategorySelected({ id }) {
  videoStore.updateSearchQuery('')
  videoStore.categoryId = id

  videoStore.fetchVideos({ reset: true })
}

onMounted(() => {
  const keyword = route.query.q || ''

  if (
    videoStore.videoList.length > 0 &&
    videoStore.searchQuery === keyword
  ) {
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
