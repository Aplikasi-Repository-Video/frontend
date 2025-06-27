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

      <div v-else>
        <table class="min-w-full text-sm text-left text-white border border-gray-600">
          <thead class="bg-[#1a1333] text-gray-300">
            <tr>
              <th class="px-4 py-3 border-b">Nama</th>
              <th class="px-4 py-3 border-b">Email</th>
              <th class="px-4 py-3 border-b">Role</th>
              <th class="px-4 py-3 border-b">Dibuat</th>
              <th class="px-4 py-3 border-b">Status</th>
              <th class="px-4 py-3 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in userStore.paginatedUsers"
              :key="user.id"
              class="border-t border-gray-700 hover:bg-[#2a1f4d]"
            >
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

        <div class="mt-6 flex flex-wrap justify-center items-center gap-2 text-white text-sm sm:text-base">
          <button
            @click="userStore.setPage(userStore.page - 1)"
            :disabled="userStore.page === 1"
            class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
          >
            ← Sebelumnya
          </button>

          <span>Halaman {{ userStore.page }} dari {{ userStore.totalPages }}</span>

          <button
            @click="userStore.setPage(userStore.page + 1)"
            :disabled="userStore.page >= userStore.totalPages"
            class="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
          >
            Selanjutnya →
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

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUsers()
})

function handleSearch({ query, scope }) {
  if (scope !== 'manage-user') return
  userStore.setSearchQuery(query)
}

async function handleDelete(userId) {
  if (confirm('Yakin ingin menghapus user ini?')) {
    try {
      await userStore.deleteUser(userId)
    } catch (err) {
      alert('Gagal menghapus user.', err)
    }
  }
}
</script>
