<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-primary px-6 pb-6">
      <Topbar :showCategory="false" :searchScope="'manage'" @search="handleSearch" />

      <div v-if="store.isLoading" class="text-primary">Memuat data video...</div>

      <div v-else>
        <div class="flex justify-between items-center ml-2 mb-6">
          <h1 class="text-2xl text-primary font-semibold">Kelola Video</h1>
          <RouterLink
            to="/admin/upload"
            class="bg-green-600 hover:bg-green-700 text-primary px-4 py-2 rounded text-sm mt-4"
          >
            + Upload Video
          </RouterLink>
        </div>
        <div v-if="store.filteredVideos.length === 0" class="text-primary">
          Tidak ada video yang ditemukan.
        </div>

        <div
          v-else
          class="flex flex-col overflow-x-auto min-h-[calc(100vh-180px)] justify-between ml-2"
        >
          <div>
            <table class="min-w-full text-sm text-left text-primary border border-secondary">
              <thead class="bg-passive text-secondary">
                <tr>
                  <th class="px-4 py-3 border-b border-secondary">No</th>
                  <th class="px-4 py-3 border-b border-secondary">Thumbnail</th>
                  <th class="px-4 py-3 border-b border-secondary">Judul</th>
                  <th class="px-4 py-3 border-b border-secondary">Tahun</th>
                  <th class="px-4 py-3 border-b border-secondary">Disukai</th>
                  <th class="px-4 py-3 border-b border-secondary">Komentar</th>
                  <th class="px-4 py-3 border-b border-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(video, index) in store.paginatedVideos"
                  :key="video.id"
                  class="border-t border-primary hover:bg-passive"
                >
                  <td class="px-4 py-3">
                    {{ index + 1 + (store.page - 1) * store.limit }}
                  </td>
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
                        class="bg-blue-600 hover:bg-blue-700 text-primary px-3 py-1 rounded text-xs"
                        @click="goToEdit(video.id)"
                      >
                        Edit
                      </button>
                      <button
                        class="bg-red-600 hover:bg-red-700 text-primary px-3 py-1 rounded text-xs"
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
          <div
            class="mt-6 flex justify-center items-center gap-2 text-primary text-sm sm:text-base"
          >
            <button
              class="bg-muted px-3 py-1 rounded disabled:opacity-50"
              :disabled="store.page === 1"
              @click="store.setPage(1)"
            >
              ⇤ First
            </button>

            <button
              class="bg-muted px-3 py-1 rounded disabled:opacity-50"
              :disabled="store.page === 1"
              @click="store.setPage(store.page - 1)"
            >
              ← Sebelumnya
            </button>

            <span>Halaman {{ store.page }} dari {{ store.totalPages }}</span>

            <button
              class="bg-muted px-3 py-1 rounded disabled:opacity-50"
              :disabled="store.page === store.totalPages"
              @click="store.setPage(store.page + 1)"
            >
              Selanjutnya →
            </button>

            <button
              class="bg-muted px-3 py-1 rounded disabled:opacity-50"
              :disabled="store.page === store.totalPages"
              @click="store.setPage(store.totalPages)"
            >
              Last ⇥
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
import Swal from 'sweetalert2'

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
  try {
    const confirmed = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: 'Video akan dihapus secara permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
        cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
      },
    })

    if (!confirmed.isConfirmed) return

    await store.deleteVideo(id)

    toast.success('Video berhasil dihapus', {
      timeout: 3000,
    })
  } catch (err) {
    console.error('Error saat menghapus video:', err)
    toast.error(`Terjadi kesalahan saat menghapus video: ${err.message}`)
  }
}

function goToEdit(id) {
  router.push(`/admin/videos/${id}/edit`)
}
</script>
