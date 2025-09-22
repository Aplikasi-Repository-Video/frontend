import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadVideoStore } from '@/stores/uploadVideo'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'
import axios from '@/services/axios'
import axiosRaw from 'axios'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME

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

  const videoProgress = ref(0)
  const thumbProgress = ref(0)

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
      return router.push('/login')
    }

    if (
      !form.value.title ||
      !form.value.description ||
      !form.value.category_id ||
      (mode === 'create' && (!form.value.video || !form.value.thumbnail))
    ) {
      await showError('Mohon isi semua field.')
      return Promise.reject('Validation error')
    }

    if (form.value.video?.size > 100 * 1024 * 1024) {
      await showError('Ukuran video tidak boleh lebih dari 100MB.')
      return Promise.reject('Video terlalu besar')
    }

    isLoading.value = true
    uploadProgress.value = 0;
    videoProgress.value = 0;
    thumbProgress.value = 0;
    isProcessing.value = true;

    try {
      const thumbSigResponse = await axios.post('/cloudinary/generate-upload-signature', { type: 'image' });
      const thumbUrl = await uploadWithSignature(
        form.value.thumbnail,
        'image',
        thumbSigResponse.data.signature, // Kirim seluruh objek data
        (p) => {
          thumbProgress.value = p;
          uploadProgress.value = Math.round((videoProgress.value + thumbProgress.value) / 2);
        }
      );

      const videoSigResponse = await axios.post('/cloudinary/generate-upload-signature', {
        type: 'video',
        title: form.value.title,
        description: form.value.description,
        category_id: form.value.category_id,
        user_id: authStore.user.id,
        thumbnail_url: thumbUrl,
      });

      await uploadWithSignature(
        form.value.video,
        'video',
        videoSigResponse.data.signature, // << PERBAIKAN DI SINI
        (p) => {
          videoProgress.value = p;
          uploadProgress.value = Math.round((videoProgress.value + thumbProgress.value) / 2);
        }
      );

      toast.success('Upload berhasil! Video Anda sedang diproses.');
      return router.push('/admin/videos');

    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat mengupload video')
      return Promise.reject(err)
    } finally {
      isLoading.value = false
      isProcessing.value = false
    }
  }

  const uploadWithSignature = async (file, type, signatureData, onProgress) => {
    const { signature, timestamp, params, api_key } = signatureData;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`;

    const res = await axiosRaw.post(endpoint, formData, {
      onUploadProgress(e) {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      },
    });

    if (res.data.secure_url) return res.data.secure_url;
    throw new Error(`Upload ${type} ke Cloudinary gagal`);
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
