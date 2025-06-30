<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto px-6 pb-6">
      <Topbar
        :showCategory="false"
        :searchScope="'manage'"
        @search="handleSearch"
      />

      <div v-if="store.isLoading" class="text-white">Memuat data video...</div>

      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl text-white font-semibold">Kelola Video</h1>
          <RouterLink
            to="/admin/upload"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            + Upload Video
          </RouterLink>
        </div>
        <div v-if="store.filteredVideos.length === 0" class="text-white">
          Tidak ada video yang ditemukan.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm text-left text-white border border-gray-600">
            <thead class="bg-[#1a1333] text-gray-300">
              <tr>
                <th class="px-4 py-3 border-b border-gray-600">Thumbnail</th>
                <th class="px-4 py-3 border-b border-gray-600">Judul</th>
                <th class="px-4 py-3 border-b border-gray-600">Tahun</th>
                <th class="px-4 py-3 border-b border-gray-600">Disukai</th>
                <th class="px-4 py-3 border-b border-gray-600">Komentar</th>
                <th class="px-4 py-3 border-b border-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="video in store.paginatedVideos"
                :key="video.id"
                class="border-t border-gray-700 hover:bg-[#2a1f4d]"
              >
                <td class="px-43 py-3">
                  <img
                    :src="video.thumbnail"
                    alt="Thumbnail"
                    class="w-15 h-10 object-cover rounded"
                  />
                </td>
                <td class="px-4 py-3 font-medium">{{ video.title }}</td>
                <td class="px-4 py-3">{{ new Date(video.year).toLocaleDateString() }}</td>
                <td class="px-4 py-3">{{ video.like }}</td>
                <td class="px-4 py-3">{{ video.comment }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        @click="goToEdit(video.id)"
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

        <div class="mt-6 flex flex-wrap justify-center items-center gap-2 text-white text-sm sm:text-base">
            <button
              @click="store.setPage(store.page - 1)"
              :disabled="store.page <= 1"
              class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
            >
              ← Sebelumnya
            </button>

            <span>Halaman {{ store.page }} dari {{ store.totalPages }}</span>

            <button
              @click="store.setPage(store.page + 1)"
              :disabled="store.page >= store.totalPages"
              class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import Topbar from '@/components/layout/TopBar.vue'
import { useManageVideoStore } from '@/stores/manageVideo'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const store = useManageVideoStore()
const router = useRouter()


onMounted(() => {
  store.fetchMyVideos()
})

function handleSearch({ query, scope }) {
  if (scope !== 'manage') return
  store.updateSearchQuery(query)
}

async function deleteVideo(id) {
  if (confirm('Yakin ingin menghapus video ini?')) {
    try {
      const res = await store.deleteVideo(id)
      if (res) {
        toast.success('Video berhasil dihapus')
      }

    } catch (err) {
      toast.error('Terjadi kesalahan saat menghapus video', err.message)
    }
  }
}

function goToEdit(id) {
  router.push(`/admin/videos/${id}/edit`)
}
</script>
