import { defineStore } from 'pinia'
import axios from '@/services/axios'

function mapFavorite(video) {
  return {
    id: video.Video.id,
    title: video.Video.title,
    year: new Date(video.Video.created).getFullYear(),
    thumbnail: video.Video.thumbnail_url,
    videoUrl: video.Video.video_url,
    createdAt: video.Video.created,
  }
}

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    allVideoList: [],
    favoriteList: [],
    isLoading: false,
    errorMessage: '',
    page: 1,
    limit: 12,
    hasMore: true,
    searchQuery: ''
  }),

  actions: {
    async fetchFavorites({ reset = false } = {}) {
      if (this.isLoading) return
      if (!this.hasMore && !reset) return

      if (reset) {
        this.page = 1
        this.favoriteList = []
        this.allVideoList = []
        this.hasMore = true
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        const res = await axios.get('/likes/user')
        const videos = res.data.data
          .filter(item => item.Video)
          .map(mapFavorite)

        if (reset) {
          this.allVideoList = videos
        }

        const start = (this.page - 1) * this.limit
        const end = this.page * this.limit
        const nextBatch = this.allVideoList.slice(start, end)

        this.favoriteList.push(...nextBatch)
        this.hasMore = this.favoriteList.length < this.allVideoList.length
        this.page++
      } catch (error) {
        if (error.response?.status === 401) {
          this.errorMessage = 'Anda belum login. Silakan login terlebih dahulu.'
        } else {
          this.errorMessage = 'Gagal mengambil video favorit.'
        }
        console.error('Gagal mengambil video favorit:', error)
      } finally {
        this.isLoading = false
      }
    },

    filterFavorites(query) {
      this.searchQuery = query.trim()
      if (!this.searchQuery) {
        const end = this.page * this.limit
        this.favoriteList = this.allVideoList.slice(0, end)
        this.hasMore = this.favoriteList.length < this.allVideoList.length
        return
      }

      const filtered = this.allVideoList.filter(v =>
        v.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      this.favoriteList = filtered
      this.hasMore = false
    },

    resetFavorites() {
      this.page = 1
      this.favoriteList = []
      this.allVideoList = []
      this.searchQuery = ''
      this.hasMore = true
    }
  }
})
