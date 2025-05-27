<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto p-6">
      <Topbar />

      <div v-if="loading" class="text-white">Loading video...</div>
      <div v-else>
        <Section title="Lanjutkan Menonton" :videos="videoList" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import Topbar from '@/components/TopBar.vue'
import Section from '@/components/VideoSection.vue'

const videoList = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/watch-history?user_id=1')
    videoList.value = res.data.data.slice(0, 5).map((video) => ({
      id: video.Video.id,
      title: video.Video.title,
      year: new Date(video.Video.created).getFullYear(),
      thumbnail: video.Video.thumbnail_url,
      videoUrl: video.Video.video_url,
      createdAt: video.Video.created,
    }))
  } catch (error) {
    console.error('Gagal mengambil riwayat video:', error)
  } finally {
    loading.value = false
  }
})
</script>
