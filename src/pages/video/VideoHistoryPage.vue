<template>
  <div class="flex h-screen overflow-hidden">
    <main
      ref="scrollRef"
      class="flex-1 bg-primary overflow-y-auto no-scrollbar px-6 pb-6"
      @scroll.passive="handleScroll"
    >
      <Topbar :showCategory="false" :searchScope="'history'" @search="handleSearch" />

      <div
        v-if="historyStore.isLoading && historyStore.videoList.length === 0"
        class="text-primary"
      >
        Loading video...
      </div>

      <div v-else>
        <Section
          v-if="historyStore.videoList.length > 0"
          title="Lanjutkan Menonton"
          :videos="historyStore.videoList"
          :disableLimit="true"
          :isHistory="true"
          @delete-history="handleDeleteHistory"
        />

        <div
          v-if="historyStore.isLoading && historyStore.videoList.length > 0"
          class="text-center text-primary mt-4"
        >
          Memuat lebih banyak...
        </div>

        <p v-else-if="historyStore.videoList.length === 0" class="text-primary text-lg mt-4">
          Belum ada video yang ditonton.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Swal from 'sweetalert2'
import { useHistoryStore } from '@/stores/history'
import Topbar from '@/components/layout/TopBar.vue'
import Section from '@/components/video/VideoSection.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const historyStore = useHistoryStore()
const scrollRef = ref(null)

const videoToDelete = ref(null)

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

function handleDeleteHistory(video) {
  videoToDelete.value = video

  Swal.fire({
    title: 'Hapus dari Riwayat?',
    text: 'Apakah Anda yakin ingin menghapus video ini dari riwayat tontonan?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
      confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
      cancelButton: 'px-4 py-2 text-gray-600 hover:text-gray-900',
    },
    buttonsStyling: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await historyStore.deleteWatchHistory(video.historyId)
        toast.success('Video berhasil dihapus dari riwayat')
      } catch (error) {
        console.error('❌ Gagal menghapus riwayat:', error)
        toast.error('Gagal menghapus riwayat')
      }
    }
  })
}

onMounted(() => {
  if (!historyStore.isInitialized || historyStore.needsRefresh) {
    historyStore.fetchWatchHistory({ reset: true })
    historyStore.needsRefresh = false
  }
})

onBeforeUnmount(() => {})
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
