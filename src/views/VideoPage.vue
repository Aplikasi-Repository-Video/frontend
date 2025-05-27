<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto p-6">
      <Topbar @search="handleSearch" />

      <div v-if="loading" class="text-white">Loading video...</div>

      <div v-else>
        <div v-if="errorMessage" class="text-red-500 mb-4">
          {{ errorMessage }}
        </div>

        <template v-if="searchQuery">
          <Section :title="'Hasil pencarian untuk : ' + searchQuery" :videos="videoList" />
        </template>
        <template v-else>
          <template v-if="route.query.all === 'latest'">
            <Section title="Semua Video Terbaru" :videos="latestVideoList" :disableLimit="true" />
          </template>

          <template v-else-if="route.query.all === 'popular'">
            <Section title="Semua Video Populer" :videos="popularVideoList" :disableLimit="true" />
          </template>

          <template v-else>
            <Section
              v-if="videoHistory.length > 0"
              title="Lanjutkan Menonton"
              :videos="videoHistory"
              :isHistory="true"
            />
            <Section title="Video Terbaru" :videos="latestVideoList" :isLatest="true" />
            <Section title="Video Populer" :videos="popularVideoList" :isPopular="true" />
          </template>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Topbar from '@/components/TopBar.vue'
import Section from '@/components/VideoSection.vue'
import axios from '@/lib/axios'
import { useRoute } from 'vue-router'
import { getUserFromToken } from '@/util/auth'

const videoHistory = ref([])
const videoList = ref([])
const latestVideoList = ref([])
const popularVideoList = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const route = useRoute()

function mapVideo(video) {
  return {
    id: video.id,
    title: video.title,
    year: new Date(video.created).getFullYear(),
    thumbnail: video.thumbnail_url,
    videoUrl: video.video_url,
    createdAt: video.created,
  }
}

async function fetchVideos(keyword = '') {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = keyword
      ? await axios.get('/search', { params: { keyword } })
      : await axios.get('/videos')

    videoList.value = res.data.data.map(mapVideo)
  } catch (err) {
    errorMessage.value = 'Gagal mengambil video: ' + (err.response?.data?.message || err.message)
    console.error('Gagal ambil video:', err)
  } finally {
    loading.value = false
  }
}

async function fetchInitialData() {
  loading.value = true
  errorMessage.value = ''
  try {
    const user = getUserFromToken()
    const [videosRes, historyRes] = await Promise.all([
      axios.get('/videos'),
      user
        ? axios.get(`/watch-history?user_id=${user.id}`)
        : Promise.resolve({ data: { data: [] } }),
    ])

    // Latest videos sorted by created date desc
    const sortedLatest = [...videosRes.data.data].sort(
      (a, b) => new Date(b.created) - new Date(a.created),
    )
    latestVideoList.value = sortedLatest.map(mapVideo)

    // Popular videos sorted by views desc
    const sortedPopular = [...videosRes.data.data].sort((a, b) => b.views - a.views)
    popularVideoList.value = sortedPopular.map(mapVideo)

    // Video history
    videoHistory.value = historyRes.data.data.slice(0, 100).map((v) => mapVideo(v.Video))
  } catch (error) {
    errorMessage.value =
      'Gagal mengambil data awal: ' + (error.response?.data?.message || error.message)
    console.error('Gagal mengambil data awal:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch(keyword) {
  searchQuery.value = keyword
  fetchVideos(keyword)
}

// Inisialisasi ketika komponen mounted
onMounted(() => {
  searchQuery.value = route.query.q || ''
  if (searchQuery.value) {
    fetchVideos(searchQuery.value)
  } else {
    fetchInitialData()
  }
})

// Watch perubahan query parameter 'q' untuk search otomatis
watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = newQuery || ''
    if (searchQuery.value) {
      fetchVideos(searchQuery.value)
    } else {
      fetchInitialData()
    }
  },
)
</script>
