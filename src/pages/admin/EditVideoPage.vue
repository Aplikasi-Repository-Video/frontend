<template>
  <div class="min-h-screen bg-primary text-primary ml-2 p-6">
    <h1 class="text-2xl font-bold mb-6">Edit Video</h1>

    <div v-if="loading">
      <p>Memuat data video...</p>
    </div>

    <div v-else-if="error">
      <p class="text-red-500">Gagal memuat video.</p>
    </div>

    <VideoForm v-else :initialForm="video" :mode="'edit'" :videoId="video.id" @submit="onSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/services/axios'
import VideoForm from '@/components/video/VideoForm.vue'

const route = useRoute()
const router = useRouter()

const video = ref(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const res = await axios.get(`/videos/${route.params.id}`)
    video.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat video:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})

function onSuccess() {
  router.push('/admin/videos')
}
</script>
