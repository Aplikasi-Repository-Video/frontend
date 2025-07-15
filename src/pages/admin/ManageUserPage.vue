<template>
  <div class="flex h-screen overflow-hidden">
    <main class="flex-1 bg-primary overflow-y-auto px-6 pb-6">
      <Topbar
        :showCategory="false"
        :searchScope="'manage-user'"
        :class="'ml-2'"
        @search="handleSearch"
      />

      <h1 class="text-2xl text-primary font-semibold ml-2 mt-2.5 mb-6">Kelola User</h1>

      <div v-if="userStore.isLoading" class="text-primary">Loading users...</div>

      <div v-else-if="userStore.errorMessage" class="text-red-500">
        {{ userStore.errorMessage }}
      </div>

      <div
        v-else
        class="flex flex-col min-h-[calc(100vh-180px)] justify-between overflow-x-auto ml-2"
      >
        <div>
          <table class="min-w-full text-sm text-left text-primary border border-secondary">
            <thead class="bg-passive text-secondary">
              <tr>
                <th class="px-4 py-3 border-b">No</th>
                <th class="px-4 py-3 border-b">Nama</th>
                <th class="px-4 py-3 border-b">Email</th>
                <th class="px-4 py-3 border-b">Role</th>
                <th class="px-4 py-3 border-b">Dibuat</th>
                <th class="px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in userStore.paginatedUsers"
                :key="user.id"
                class="border-t border-primary hover:bg-passive"
              >
                <td class="px-4 py-3">
                  {{ index + 1 + (userStore.page - 1) * userStore.limit }}
                </td>
                <td class="px-4 py-3">{{ user.name }}</td>
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3">
                  <select
                    v-model="user.role"
                    @change="handleRoleChange(user.id, user.role)"
                    class="bg-secondary text-primary border border-secondary rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                  </select>
                </td>
                <td class="px-4 py-3">{{ new Date(user.created).toLocaleDateString() }}</td>
                <td class="px-4 py-3">
                  <select
                    v-model="user.isActive"
                    @change="handleStatusChange(user.id, user.isActive)"
                    class="bg-secondary text-primary border border-secondary rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option :value="true">Aktif</option>
                    <option :value="false">Tidak Aktif</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-center items-center gap-2 text-primary text-sm sm:text-base">
          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === 1"
            @click="userStore.setPage(1)"
          >
            ⇤ First
          </button>

          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === 1"
            @click="userStore.setPage(userStore.page - 1)"
          >
            ← Sebelumnya
          </button>

          <span>Halaman {{ userStore.page }} dari {{ userStore.totalPages }}</span>

          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
            :disabled="userStore.page === userStore.totalPages"
            @click="userStore.setPage(userStore.page + 1)"
          >
            Selanjutnya →
          </button>

          <button
            class="bg-muted px-3 py-1 rounded disabled:opacity-50"
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
const toast = useToast()

onMounted(() => {
  userStore.fetchUsers()
})

function handleSearch({ query, scope }) {
  if (scope !== 'manage-user') return
  userStore.setSearchQuery(query)
}

async function handleRoleChange(userId, newRole) {
  try {
    const result = await Swal.fire({
      title: 'Konfirmasi Perubahan Role',
      text: `Yakin ingin mengubah role user menjadi ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, ubah!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'bg-blue-600 text-primary px-4 py-2 rounded hover:bg-blue-700',
        cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
      },
    })

    if (result.isConfirmed) {
      const payload = { role: newRole }
      const res = await userStore.updateUser(userId, payload)
      if (res) {
        toast.success('Role user berhasil diubah')
      }
    } else {
      await userStore.fetchUsers()
    }
  } catch (err) {
    console.error(err)
    toast.error('Terjadi kesalahan saat mengubah role')
    await userStore.fetchUsers()
  }
}

async function handleStatusChange(userId, newStatus) {
  try {
    const statusText = newStatus ? 'Aktif' : 'Tidak Aktif'
    const result = await Swal.fire({
      title: 'Konfirmasi Perubahan Status',
      text: `Yakin ingin mengubah status user menjadi ${statusText}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, ubah!',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'bg-blue-600 text-primary px-4 py-2 rounded hover:bg-blue-700',
        cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
      },
    })

    if (result.isConfirmed) {
      const payload = { isActive: newStatus }
      const res = await userStore.updateUser(userId, payload)
      if (res) {
        toast.success('Status user berhasil diubah')
      }
    } else {
      await userStore.fetchUsers()
    }
  } catch (err) {
    console.error(err)
    toast.error('Terjadi kesalahan saat mengubah status')
    await userStore.fetchUsers()
  }
}
</script>
