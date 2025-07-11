import { defineStore } from 'pinia'
import axios from '@/services/axios'

export const useUploadVideoStore = defineStore('uploadVideo', {
  state: () => ({
    categories: [],
    isUploading: false,
  }),

  actions: {
    async fetchCategories() {
      try {
        const res = await axios.get('/categories')
        this.categories = res.data.data
        return res.data.data
      } catch (err) {
        console.error('Gagal mengambil kategori:', err)
        this.categories = []
        throw err
      }
    },

    async uploadVideo(formData, options = {}) {
      try {
        this.isUploading = true
        const res = await axios.post('/videos', formData, {
          headers: {}, // <- jangan set 'Content-Type' secara manual
          onUploadProgress: options.onUploadProgress,
        })
        return res.data
      } catch (err) {
        console.error('Gagal upload video:', err)
        throw err
      } finally {
        this.isUploading = false
      }
    },
  },
})
