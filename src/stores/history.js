import { defineStore } from 'pinia'
import axios from '@/services/axios'
import { getUserFromToken } from '@/utils/auth'

function mapHistory(item) {
  return {
    historyId: item.id,
    id: item.Video.id,
    title: item.Video.title,
    year: new Date(item.Video.created).getFullYear(),
    thumbnail: item.Video.thumbnail_url,
    videoUrl: item.Video.video_url,
    createdAt: item.Video.created,
    lastTime: item.duration_watch || 0,
    description: item.Video.description,
  }
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    allVideoList: [],
    videoList: [],
    isLoading: false,
    errorMessage: '',
    page: 1,
    limit: 12,
    hasMore: true,
    searchQuery: '',
    isInitialized: false,
  }),

  actions: {
    async fetchWatchHistory({ reset = false } = {}) {
      if (this.isLoading) return
      if (!this.hasMore && !reset) return

      if (reset) {
        this.page = 1
        this.videoList = []
        this.allVideoList = []
        this.hasMore = true
        this.isInitialized = false
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        let query = 'user_id'
        let user = getUserFromToken()
        let queryValue = user?.id

        if (!user || !user.id) {
          query = 'guest_id'
          queryValue = localStorage.getItem('guest_id')
          if (!queryValue) {
            this.videoList = []
            this.allVideoList = []
            this.hasMore = false
            this.isLoading = false
            return
          }
        }

        const res = await axios.get(`/watch-history?${query}=${queryValue}`)
        const mapped = res.data.data
          .filter((item) => item.Video)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .map(mapHistory)

        console.log('📜 Riwayat video:', mapped)

        if (reset) {
          this.allVideoList = mapped
        }

        const start = (this.page - 1) * this.limit
        const end = this.page * this.limit
        const nextVideos = this.allVideoList.slice(start, end)

        this.videoList.push(...nextVideos)
        this.hasMore = this.videoList.length < this.allVideoList.length
        this.page++
        this.isInitialized = true
      } catch (error) {
        console.error('❌ Gagal mengambil riwayat video:', error)
        this.errorMessage = 'Gagal mengambil riwayat video'
      } finally {
        this.isLoading = false
      }
    },

    filterBySearch(query) {
      this.searchQuery = query.trim()

      if (!this.searchQuery) {
        const end = this.page * this.limit
        this.videoList = this.allVideoList.slice(0, end)
        this.hasMore = this.videoList.length < this.allVideoList.length
        return
      }

      const filtered = this.allVideoList.filter((video) =>
        video.title.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )

      this.videoList = filtered
      this.hasMore = false
    },

    resetHistory() {
      this.page = 1
      this.videoList = []
      this.allVideoList = []
      this.searchQuery = ''
      this.hasMore = true
      this.isInitialized = false
    },

    async deleteWatchHistory(historyId) {
      try {
        await axios.delete(`/watch-history/${historyId}`)

        this.videoList = this.videoList.filter((v) => v.historyId !== historyId)
        this.allVideoList = this.allVideoList.filter((v) => v.historyId !== historyId)

        if (this.videoList.length === 0 && this.page > 1) {
          this.page--
          await this.fetchWatchHistory()
        }
      } catch (error) {
        console.error('❌ Gagal menghapus riwayat video:', error)
      }
    },
  },
})
