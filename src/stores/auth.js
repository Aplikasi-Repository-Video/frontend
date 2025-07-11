// src/stores/auth.js
import { defineStore } from 'pinia'
import { getUserFromToken } from '@/utils/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getUserFromToken() || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    setUser(user) {
      this.user = user
    },
    logout() {
      this.user = null
      localStorage.removeItem('token')
    },
    refreshFromToken() {
      const user = getUserFromToken()
      this.user = user
    },
  },
})
