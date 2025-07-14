<template>
  <div class="min-h-screen bg-primary text-primary p-6">
    <div class="flex justify-between items-center ml-2 mb-6">
      <h1 class="text-3xl font-bold">Dashboard Admin</h1>

      <div class="relative">
        <button
          @click="toggleSettingsDropdown"
          class="p-2 rounded-lg transition-colors"
          :class="themeClasses.bgSecondary"
          aria-label="Settings"
        >
          <svg
            class="w-5 h-5"
            :class="themeClasses.textPrimary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showSettingsDropdown"
          class="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
          :class="themeClasses.bgCard"
        >
          <div class="py-1" role="menu">
            <!-- Theme Toggle -->
            <button
              @click="handleThemeToggle"
              class="flex items-center w-full px-4 py-2 text-sm transition-colors hover:bg-secondary"
              :class="themeClasses.textPrimary"
              role="menuitem"
            >
              <svg
                v-if="isDark"
                class="w-4 h-4 mr-3 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4 mr-3 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              {{ isDark ? 'Light Mode' : 'Dark Mode' }}
            </button>

            <!-- Divider -->
            <div class="border-t my-1" :class="themeClasses.borderPrimary"></div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              role="menuitem"
            >
              <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clip-rule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-primary ml-2 p-6 rounded-2xl shadow-md mb-10">
      <h2 class="text-xl text-primary font-semibold mb-4">Statistik Data</h2>
      <div class="h-[300px] text-primary">
        <BarChart :chart-data="chartData" />
      </div>
    </div>

    <div class="grid grid-cols-1 ml-2 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-primary p-6 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold mb-2">Total Pengguna</h2>
          <p class="text-3xl font-bold mb-4">{{ userCount }}</p>
        </div>
        <RouterLink
          to="/admin/users"
          class="mt-auto inline-block bg-[#6366f1] hover:bg-[#4f46e5] text-primary text-sm px-4 py-2 rounded-lg transition"
        >
          Kelola Pengguna
        </RouterLink>
      </div>

      <div class="bg-primary p-6 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold mb-2">Total Video</h2>
          <p class="text-3xl font-bold mb-4">{{ videoCount }}</p>
        </div>
        <RouterLink
          to="/admin/videos"
          class="mt-auto inline-block bg-[#10b981] hover:bg-[#059669] text-primary text-sm px-4 py-2 rounded-lg transition"
        >
          Kelola Video
        </RouterLink>
      </div>

      <div class="bg-primary p-6 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold mb-2">Total Komentar</h2>
          <p class="text-3xl font-bold mb-4">{{ commentCount }}</p>
        </div>
        <RouterLink
          to="/admin/comments"
          class="mt-auto inline-block bg-[#f59e0b] hover:bg-[#d97706] text-primary text-sm px-4 py-2 rounded-lg transition"
        >
          Kelola Komentar
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import axios from '@/services/axios'
import BarChart from '@/components/charts/BarChart.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, themeClasses } = useTheme()

const userCount = ref(0)
const videoCount = ref(0)
const commentCount = ref(0)
const showSettingsDropdown = ref(false)

const toggleSettingsDropdown = () => {
  showSettingsDropdown.value = !showSettingsDropdown.value
}

const handleThemeToggle = () => {
  toggleTheme()
  showSettingsDropdown.value = false
}

const handleLogout = async () => {
  try {
    await axios.post('/logout')

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    window.location.href = '/login'
  } catch (error) {
    console.error('Logout failed:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showSettingsDropdown.value = false
  }
}

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

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

<style scoped>
.hover\:bg-secondary:hover {
  @apply bg-gray-100 dark:bg-gray-700;
}
</style>
