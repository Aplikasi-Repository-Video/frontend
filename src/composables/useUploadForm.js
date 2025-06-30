import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadVideoStore } from '@/stores/uploadVideo'
import { useAuthStore } from '@/stores/auth'
import { getVideoDuration } from '@/utils/getVideoDuration'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import axios from '@/services/axios'
import axiosRaw from 'axios'

export function useUploadForm({ mode = 'create', initialForm = null, videoId = null } = {}) {
  const router = useRouter()
  const toast = useToast()
  const uploadStore = useUploadVideoStore()
  const authStore = useAuthStore()

  const form = ref({
    title: '',
    description: '',
    category_id: '',
    video: null,
    thumbnail: null,
  })

  const categories = ref([])
  const videoPreview = ref(null)
  const thumbPreview = ref(null)
  const isLoading = ref(false)
  const uploadProgress = ref(0)
  const isProcessing = ref(false)

  if (initialForm) {
    form.value = {
      title: initialForm.title || '',
      description: initialForm.description || '',
      category_id: initialForm.category_id || '',
      video: null,
      thumbnail: null,
    }

    videoPreview.value = initialForm.video_url || null
    thumbPreview.value = initialForm.thumbnail_url || null
  }

  onMounted(async () => {
    try {
      await uploadStore.fetchCategories()
      categories.value = uploadStore.categories
    } catch (err) {
      console.error('Gagal mengambil kategori:', err)
    }
  })

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    form.value.video = file
    videoPreview.value = URL.createObjectURL(file)
  }

  const handleThumbChange = (e) => {
    const file = e.target.files[0]
    form.value.thumbnail = file
    thumbPreview.value = URL.createObjectURL(file)
  }

  const handleVideoDrop = (e) => {
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      form.value.video = file
      videoPreview.value = URL.createObjectURL(file)
    } else {
      showError('Mohon upload video.')
    }
  }

  const handleThumbDrop = (e) => {
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      form.value.thumbnail = file
      thumbPreview.value = URL.createObjectURL(file)
    } else {
      showError('Mohon upload gambar.')
    }
  }

  const handleSubmit = async () => {
    if (!authStore.user?.id) {
      await showInfo('Login Diperlukan', 'Silakan login terlebih dahulu untuk mengupload video.')
      return router.push('/login') // ⛔ tidak return Promise, menyebabkan `.then()` tidak terpanggil
    }

    if (
      !form.value.title ||
      !form.value.description ||
      !form.value.category_id ||
      (mode === 'create' && (!form.value.video || !form.value.thumbnail))
    ) {
      await showError('Mohon isi semua field.')
      return Promise.reject('Validation error') // ✅ supaya .catch() bisa nangkep
    }

    if (form.value.video?.size > 100 * 1024 * 1024) {
      await showError('Ukuran video tidak boleh lebih dari 100MB.')
      return Promise.reject('Video terlalu besar')
    }

    isLoading.value = true
    uploadProgress.value = 0
    isProcessing.value = true

    try {
      const duration = form.value.video
        ? await getVideoDuration(form.value.video)
        : initialForm?.duration
      let videoProgress = 0
      let thumbProgress = 0

      const updateOverallProgress = () => {
        uploadProgress.value = Math.round((videoProgress + thumbProgress) / 2)
      }

      const videoUrl = form.value.video
        ? await uploadToCloudinary(form.value.video, 'upload_preset_video', 'video', 'video', (p) => {
          videoProgress = p
          updateOverallProgress()
        })
        : initialForm?.video_url

      const thumbUrl = form.value.thumbnail
        ? await uploadToCloudinary(form.value.thumbnail, 'upload_preset_thumbnail', 'thumbnail', 'image', (p) => {
          thumbProgress = p
          updateOverallProgress()
        })
        : initialForm?.thumbnail_url

      const payload = {
        title: form.value.title,
        description: form.value.description,
        category_id: form.value.category_id,
        user_id: authStore.user.id,
        video_url: videoUrl,
        thumbnail_url: thumbUrl,
        duration,
      }

      if (mode === 'edit' && videoId) {
        await axios.put(`/videos/${videoId}`, {
          ...payload,
          user_id: undefined,
        })
      } else {
        await axios.post('/videos', payload)
      }

      toast.success('Video berhasil diupload')
      return router.push('/admin/videos') // ✅ return biar .then() bisa jalan
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat mengupload video')
      return Promise.reject(err) // ✅ agar .catch() menangkapnya
    } finally {
      isLoading.value = false
      isProcessing.value = false
    }
  }


  const uploadToCloudinary = async (file, preset, folder, type = 'image', onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)
    formData.append('folder', folder)

    const endpoint = `https://api.cloudinary.com/v1_1/dr2nxslaq/${type}/upload`

    const res = await axiosRaw.post(endpoint, formData, {
      onUploadProgress(e) {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      }
    })

    if (res.data.secure_url) return res.data.secure_url
    throw new Error('Upload ke Cloudinary gagal')
  }

  const showError = (text) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text,
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
      },
    })
  }

  const showInfo = (title, text) => {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
      },
    })
  }

  return {
    form,
    categories,
    videoPreview,
    thumbPreview,
    isLoading,
    uploadProgress,
    isProcessing,
    handleVideoChange,
    handleThumbChange,
    handleVideoDrop,
    handleThumbDrop,
    handleSubmit,
    mode,
    videoId,
  }
}

