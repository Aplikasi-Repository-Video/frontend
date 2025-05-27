<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto p-6">
      <Topbar />
      <div v-if="loading" class="text-white">Loading video...</div>
      <div v-else>
        <Section
          v-if="videoList.length > 0"
          title="Lanjutkan Menonton"
          :videos="videoList"
          :disableLimit="true"
          :isHistory="true"
        />

        <p v-else class="text-white text-lg mt-4">Belum ada video yang ditonton.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/lib/axios'
import Topbar from '@/components/TopBar.vue'
import Section from '@/components/VideoSection.vue'
import { getUserFromToken } from '@/util/auth'

const videoList = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const user = getUserFromToken()
    if (!user || !user.id) {
      console.error('User tidak valid atau token tidak ditemukan.')
      loading.value = false
      return
    }
    const res = await axios.get(`/watch-history?user_id=${user.id}`)
    videoList.value = res.data.data
      .sort((a, b) => new Date(b.updated) - new Date(a.updated))
      .map((video) => ({
        id: video.Video.id,
        title: video.Video.title,
        year: new Date(video.Video.created).getFullYear(),
        thumbnail: video.Video.thumbnail_url,
        videoUrl: video.Video.video_url,
        createdAt: video.Video.created,
        lastTime: video.duration_watch || 0,
        description: video.Video.description,
      }))
  } catch (error) {
    console.error('Gagal mengambil riwayat video:', error)
  } finally {
    loading.value = false
  }
})
</script>
