import { defineStore } from 'pinia'
import axios from '@/services/axios'

export function mapVideo(video) {
  return {
    id: video.id,
    title: video.title,
    year: new Date(video.created).getFullYear(),
    thumbnail: video.thumbnail_url,
    videoUrl: video.video_url,
    createdAt: video.created,
  }
}

export const useVideoStore = defineStore('video', {
  state: () => ({
    videoList: [],
    searchQuery: '',
    isLoading: false,
    errorMessage: '',
    page: 1,
    limit: 12,
    hasMore: true,
  }),

  actions: {
    async fetchVideos({ keyword = '', reset = false } = {}) {
      if (this.isLoading) return

      if (reset) {
        this.page = 1
        this.videoList = []
        this.hasMore = true
      }

      this.isLoading = true
      this.errorMessage = ''
      try {
        const res = keyword
          ? await axios.get('/search', {
            params: { keyword },
          })
          : await axios.get('/videos')

        const allVideos = res.data.data.map(mapVideo)

        if (reset) {
          this.videoList = allVideos.slice(0, this.limit)
        } else {
          this.videoList.push(...allVideos.slice((this.page - 1) * this.limit, this.page * this.limit))
        }

        this.hasMore = this.videoList.length < allVideos.length
        this.page++
      } catch (err) {
        this.errorMessage = 'Gagal mengambil video: ' + (err.response?.data?.message || err.message)
      } finally {
        this.isLoading = false
      }
    },

    updateSearchQuery(query) {
      this.searchQuery = query
    },

    resetVideos() {
      this.videoList = []
      this.page = 1
      this.hasMore = true
    }
  }
})
