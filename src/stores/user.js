import { defineStore } from 'pinia'
import axios from '@/services/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [],
    selectedUser: null,
    isLoading: false,
    errorMessage: '',
    searchQuery: '',
    page: 1,
    limit: 10,
  }),

  getters: {
    filteredUsers(state) {
      if (!state.searchQuery) return state.userList
      const q = state.searchQuery.toLowerCase()
      return state.userList.filter((u) =>
        u.email.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q)
      )
    },

    paginatedUsers(state) {
      const start = (state.page - 1) * state.limit
      const end = state.page * state.limit
      return this.filteredUsers.slice(start, end)
    },

    totalPages(state) {
      return Math.ceil(this.filteredUsers.length / state.limit)
    }
  },

  actions: {
    async fetchUsers() {
      if (this.userList.length > 0) return

      this.isLoading = true
      this.errorMessage = ''

      try {
        const res = await axios.get('/users')
        this.userList = res.data.data
      } catch (err) {
        console.error('Gagal ambil user:', err)
        this.errorMessage = 'Gagal mengambil daftar user.'
      } finally {
        this.isLoading = false
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.page = 1
    },

    setPage(page) {
      this.page = page
    },

    setSelectedUser(user) {
      this.selectedUser = user
    },

    async deleteUser(id) {
      try {
        await axios.delete(`/users/${id}`)
        this.userList = this.userList.filter((u) => u.id !== id)
      } catch (err) {
        console.error('Gagal hapus user:', err)
        throw err
      }
    },

    async addUser(userData) {
      try {
        const res = await axios.post('/users', userData)
        this.userList.push(res.data.data)
      } catch (err) {
        console.error('Gagal tambah user:', err)
        throw err
      }
    },

    async updateUser(id, updatedData) {
      try {
        const res = await axios.put(`/users/${id}`, updatedData)
        const idx = this.userList.findIndex((u) => u.id === id)
        if (idx !== -1) this.userList[idx] = res.data.data
      } catch (err) {
        console.error('Gagal update user:', err)
        throw err
      }
    }
  }
})
