import { defineStore } from 'pinia'
import axios from '@/services/axios'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

export const useManageVideoStore = defineStore('manageVideo', {
  state: () => ({
    videoList: [],
    isLoading: false,
    errorMessage: '',
    searchQuery: '',
    page: 1,
    limit: 10,
  }),

  getters: {
    filteredVideos(state) {
      if (!state.searchQuery) return state.videoList
      return state.videoList.filter((v) =>
        v.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    },

    paginatedVideos(state) {
      const start = (state.page - 1) * state.limit
      const end = state.page * state.limit
      return this.filteredVideos.slice(start, end)
    },

    totalPages(state) {
      return Math.ceil(this.filteredVideos.length / state.limit)
    }
  },

  actions: {
    async fetchMyVideos() {
      if (this.videoList.length > 0) return

      this.isLoading = true
      try {
        const res = await axios.get('/videos')
        this.videoList = res.data.data.map((video) => {
          const count = video._count || { Like: 0, Comment: 0 }
          return {
            id: video.id,
            title: video.title,
            year: new Date(video.created).getFullYear(),
            thumbnail: video.thumbnail_url,
            videoUrl: video.video_url,
            createdAt: video.created,
            like: count.Like ?? 0,
            comment: count.Comment ?? 0,
          }
        })
      } catch (err) {
        console.error('Gagal mengambil video:', err)
        this.errorMessage = 'Gagal mengambil video'
      } finally {
        this.isLoading = false
      }
    },

    updateSearchQuery(query) {
      this.searchQuery = query
      this.page = 1
    },

    setPage(page) {
      this.page = page
    },

    async deleteVideo(id) {
      const toast = useToast()
      try {
        const result = await Swal.fire({
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

        if (!result.isConfirmed) return

        // ⛔️ Jangan munculkan toast dulu, tunggu penghapusan berhasil
        await axios.delete(`/videos/${id}`)
        this.videoList = this.videoList.filter((v) => v.id !== id)

        // ✅ Baru munculkan toast setelah berhasil
        toast.success('Video berhasil dihapus', {
          timeout: 3000,
        })
      } catch (err) {
        console.error('Gagal menghapus video:', err)
        toast.error('Gagal menghapus video')
        throw err
      }
    }

  }
})
