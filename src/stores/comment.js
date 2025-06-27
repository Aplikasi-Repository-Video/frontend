import { defineStore } from 'pinia'
import axios from '@/services/axios'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    allComments: [],
    searchQuery: '',
    page: 1,
    limit: 15,
    isLoading: false,
    errorMessage: '',
  }),

  getters: {
    filteredComments(state) {
      const q = state.searchQuery.toLowerCase()
      return state.allComments.filter((c) =>
        c.content.toLowerCase().includes(q) ||
        c.user.name.toLowerCase().includes(q) ||
        c.video.title.toLowerCase().includes(q)
      )
    },
    paginatedComments(state) {
      const start = (state.page - 1) * state.limit
      const end = state.page * state.limit
      return this.filteredComments.slice(start, end)
    },
    totalPages(state) {
      return Math.ceil(this.filteredComments.length / state.limit)
    }
  },

  actions: {
    async fetchComments() {
      if (this.allComments.length > 0) return
      this.isLoading = true
      try {
        const res = await axios.get('/comments')
        this.allComments = res.data.data.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.created,
          user: {
            id: c.User.id,
            name: c.User.name,
            email: c.User.email,
          },
          video: {
            id: c.Video.id,
            title: c.Video.title,
          },
        }))
      } catch (err) {
        this.errorMessage = `Gagal mengambil komentar: ${err.message}`
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

    async deleteComment(id) {
      try {
        await axios.delete(`/comments/${id}`)
        this.allComments = this.allComments.filter((c) => c.id !== id)
      } catch (err) {
        console.error(err)
      }
    },
  }
})
