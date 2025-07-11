<template>
  <div class="min-h-screen bg-[#0f0b1d] text-white p-6">
    <h1 class="text-3xl font-bold mb-6">Dashboard Admin</h1>

            <!-- Chart Visualisasi -->
            <div class="bg-[#1e1b2e] p-6 rounded-2xl shadow-md mb-10">
              <h2 class="text-xl font-semibold mb-4">Statistik Data</h2>
              <div class="h-[300px]">
                <BarChart :chart-data="chartData" />
              </div>
            </div>

            <!-- Kartu Ringkasan -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div class="bg-[#1e1b2e] p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-semibold mb-2">Total Pengguna</h2>
                  <p class="text-3xl font-bold mb-4">{{ userCount }}</p>
                </div>
                <RouterLink
                  to="/admin/users"
                  class="mt-auto inline-block bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Kelola Pengguna
                </RouterLink>
              </div>

              <div class="bg-[#1e1b2e] p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-semibold mb-2">Total Video</h2>
                  <p class="text-3xl font-bold mb-4">{{ videoCount }}</p>
                </div>
                <RouterLink
                  to="/admin/videos"
                  class="mt-auto inline-block bg-[#10b981] hover:bg-[#059669] text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Kelola Video
                </RouterLink>
              </div>

              <div class="bg-[#1e1b2e] p-6 rounded-2xl shadow-md flex flex-col justify-between">
                <div>
                  <h2 class="text-lg font-semibold mb-2">Total Komentar</h2>
                  <p class="text-3xl font-bold mb-4">{{ commentCount }}</p>
                </div>
                <RouterLink
                  to="/admin/comments"
                  class="mt-auto inline-block bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Kelola Komentar
                </RouterLink>
              </div>
            </div>


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/services/axios'
import BarChart from '@/components/charts/BarChart.vue'

const userCount = ref(0)
const videoCount = ref(0)
const commentCount = ref(0)

onMounted(async () => {
  try {
    const [userRes, videoRes, commentRes] = await Promise.all([
      axios.get('/users'),
      axios.get('/videos'),
      axios.get('/comments'),
    ])

    userCount.value = userRes.data.data.length || 0
    videoCount.value = videoRes.data.data.length || 0
    commentCount.value = commentRes.data.data.length || 0
  } catch (error) {
    console.error('Gagal mengambil data dashboard:', error)
  }
})

const chartData = computed(() => ({
  labels: ['Pengguna', 'Video', 'Komentar'],
  datasets: [
    {
      label: 'Total',
      data: [userCount.value, videoCount.value, commentCount.value],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
    },
  ],
}))
</script>
