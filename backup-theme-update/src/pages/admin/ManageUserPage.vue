<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto px-6 pb-6">
      <Topbar
        :showCategory="false"
        :searchScope="'manage-user'"
        @search="handleSearch"
      />

      <h1 class="text-2xl text-white font-semibold mb-6">Kelola User</h1>

      <div v-if="userStore.isLoading" class="text-white">Loading users...</div>

      <div v-else-if="userStore.errorMessage" class="text-red-500">
        {{ userStore.errorMessage }}
      </div>

      <div v-else class="flex flex-col min-h-[calc(100vh-180px)] justify-between overflow-x-auto">
        <div>
          <table class="min-w-full text-sm text-left text-white border border-gray-600">
            <thead class="bg-[#1a1333] text-gray-300">
              <tr>
                <th class="px-4 py-3 border-b">No</th>
                <th class="px-4 py-3 border-b">Nama</th>
                <th class="px-4 py-3 border-b">Email</th>
                <th class="px-4 py-3 border-b">Role</th>
                <th class="px-4 py-3 border-b">Dibuat</th>
                <th class="px-4 py-3 border-b">Status</th>
                <th class="px-4 py-3 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in userStore.paginatedUsers"
              :key="user.id"
              class="border-t border-gray-700 hover:bg-[#2a1f4d]"
              >
                <td class="px-4 py-3">
                  {{ index + 1 + (userStore.page - 1) * userStore.limit }}
                </td>
                <td class="px-4 py-3">{{ user.name }}</td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3">{{ user.role }}</td>
                <td class="px-4 py-3">{{ new Date(user.created).toLocaleDateString() }}</td>
                <td class="px-4 py-3">{{ user.isActive ? 'Aktif' : 'Tidak Aktif' }}</td>
                <td class="px-4 py-3">
                  <button
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    @click="handleDelete(user.id)"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-center items-center gap-2 text-white text-sm sm:text-base">
          <!-- First Page -->
          <button
            class="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === 1"
            @click="userStore.setPage(1)"
          >
            ⇤ First
          </button>

          <!-- Previous Page -->
          <button
            class="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === 1"
            @click="userStore.setPage(userStore.page - 1)"
          >
            ← Sebelumnya
          </button>

          <!-- Page Info -->
          <span>Halaman {{ userStore.page }} dari {{ userStore.totalPages }}</span>

          <!-- Next Page -->
          <button
            class="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === userStore.totalPages"
            @click="userStore.setPage(userStore.page + 1)"
          >
            Selanjutnya →
          </button>

          <!-- Last Page -->
          <button
            class="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === userStore.totalPages"
            @click="userStore.setPage(userStore.totalPages)"
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
import { useUserStore } from '@/stores/user'
import Topbar from '@/components/layout/TopBar.vue'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers()
})

function handleSearch({ query, scope }) {
  if (scope !== 'manage-user') return
  userStore.setSearchQuery(query)
}

async function handleDelete(userId) {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus user ini?',
    text: 'Tindakan ini tidak bisa dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
          cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
        },
  })

  if (result.isConfirmed) {
    try {
      const res = await userStore.deleteUser(userId)
      if (res) {
        const toast = useToast()
        toast.success('User berhasil dihapus')
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>
