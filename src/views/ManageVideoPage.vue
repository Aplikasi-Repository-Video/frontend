<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto p-6">
      <Topbar @search="handleSearch" />

      <div v-if="loading" class="text-white">Memuat data video...</div>

      <div v-else>
        <h1 class="text-2xl text-white font-semibold mb-6">Kelola Video</h1>

        <div v-if="filteredVideos.length === 0" class="text-white">
          Tidak ada video yang ditemukan.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm text-left text-white border border-gray-600">
            <thead class="bg-[#1a1333] text-gray-300">
              <tr>
                <th class="px-4 py-3 border-b border-gray-600">Thumbnail</th>
                <th class="px-4 py-3 border-b border-gray-600">Judul</th>
                <th class="px-4 py-3 border-b border-gray-600">Tahun</th>
                <th class="px-4 py-3 border-b border-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="video in filteredVideos"
                :key="video.id"
                class="border-t border-gray-700 hover:bg-[#2a1f4d]"
              >
                <td class="px-4 py-3">
                  <img
                    :src="video.thumbnail"
                    alt="Thumbnail"
                    class="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td class="px-4 py-3 font-medium">{{ video.title }}</td>
                <td class="px-4 py-3">{{ video.year }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      @click="deleteVideo(video.id)"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Topbar from '@/components/TopBar.vue'
import axios from '@/lib/axios'

const videoList = ref([])
const loading = ref(true)
const searchQuery = ref('')

async function fetchMyVideos() {
  loading.value = true
  try {
    const res = await axios.get('/videos')
    videoList.value = res.data.data.map((video) => ({
      id: video.id,
      title: video.title,
      year: new Date(video.created).getFullYear(),
      thumbnail: video.thumbnail_url,
      videoUrl: video.video_url,
      createdAt: video.created,
    }))
  } catch (err) {
    console.error('Gagal mengambil video:', err)
  } finally {
    loading.value = false
  }
}

function handleSearch(keyword) {
  searchQuery.value = keyword
}

const filteredVideos = computed(() => {
  if (!searchQuery.value) return videoList.value
  return videoList.value.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

async function deleteVideo(id) {
  if (confirm('Yakin ingin menghapus video ini?')) {
    try {
      await axios.delete(`/videos/${id}`)
      videoList.value = videoList.value.filter((v) => v.id !== id)
    } catch (err) {
      console.error('Gagal menghapus video:', err)
    }
  }
}

onMounted(() => {
  fetchMyVideos()
})
</script>
