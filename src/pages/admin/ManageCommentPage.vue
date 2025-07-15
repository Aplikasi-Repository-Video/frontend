<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-primary overflow-y-auto px-6 pb-6">
      <Topbar
        :showCategory="false"
        :searchScope="'manage-comment'"
        :class="'ml-2'"
        @search="handleSearch"
      />

      <h1 class="text-2xl text-primary font-semibold ml-2 mt-2.5 mb-6">Kelola Komentar</h1>

      <div v-if="commentStore.isLoading" class="text-primary">Memuat komentar...</div>

      <div v-else-if="commentStore.errorMessage" class="text-red-500">
        {{ commentStore.errorMessage }}
      </div>

      <div v-else class="flex flex-col flex-grow min-h-[calc(100vh-150px)] justify-between ml-2">
        <div class="overflow-x-auto flex-1">
          <table class="min-w-full text-sm text-left text-primary border border-secondary">
            <thead class="bg-passive text-secondary">
              <tr>
                <th class="px-4 py-3 border-b">No</th>
                <th class="px-4 py-3 border-b">Komentar</th>
                <th class="px-4 py-3 border-b">User</th>
                <th class="px-4 py-3 border-b">Video</th>
                <th class="px-4 py-3 border-b">Tanggal</th>
                <th class="px-4 py-3 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(comment, index) in commentStore.paginatedComments"
                :key="comment.id"
                class="border-t border-primary hover:bg-passive"
              >
                <td class="px-4 py-3">
                  {{ index + 1 + (commentStore.page - 1) * commentStore.limit }}
                </td>
                <td class="px-4 py-3 max-w-sm break-words">{{ comment.content }}</td>
                <td class="px-4 py-3">{{ comment.user.name }}</td>
                <td class="px-4 py-3">{{ comment.video.title }}</td>
                <td class="px-4 py-3">{{ new Date(comment.createdAt).toLocaleString() }}</td>
                <td class="px-4 py-3">
                  <button
                    class="bg-red-600 hover:bg-red-700 text-primary px-3 py-1 rounded text-xs"
                    @click="handleDelete(comment.id)"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-center items-center gap-2 text-primary text-sm sm:text-base">
          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="commentStore.page === 1"
            @click="commentStore.setPage(1)"
          >
            ⇤ First
          </button>

          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="commentStore.page === 1"
            @click="commentStore.setPage(commentStore.page - 1)"
          >
            ← Sebelumnya
          </button>

          <span>Halaman {{ commentStore.page }} dari {{ commentStore.totalPages }}</span>

          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="commentStore.page === commentStore.totalPages"
            @click="commentStore.setPage(commentStore.page + 1)"
          >
            Selanjutnya →
          </button>

          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="commentStore.page === commentStore.totalPages"
            @click="commentStore.setPage(commentStore.totalPages)"
          >
            Last ⇥
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCommentStore } from '@/stores/comment'
import Topbar from '@/components/layout/TopBar.vue'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

const toast = useToast()

const commentStore = useCommentStore()

onMounted(() => {
  commentStore.fetchComments()
})

function handleSearch({ query, scope }) {
  if (scope !== 'manage-comment') return
  commentStore.setSearchQuery(query)
}

function handleDelete(id) {
  Swal.fire({
    title: 'Apakah Anda yakin ingin menghapus komentar ini?',
    icon: 'warning',
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    customClass: {
      confirmButton: 'bg-blue-600 text-primary px-4 py-2 rounded hover:bg-blue-700',
      cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const res = commentStore.deleteComment(id)
      if (res) {
        toast.success('Komentar berhasil dihapus')
      } else {
        toast.error('Gagal menghapus komentar')
      }
    }
  })
}
</script>
