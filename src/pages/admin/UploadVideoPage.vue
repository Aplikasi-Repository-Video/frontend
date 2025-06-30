<template>
  <div class="min-h-screen bg-[#0f0b1d] text-white p-6">
    <h1 class="text-2xl font-bold mb-6">Upload Video Baru</h1>

    <form @submit.prevent="handleSubmit" class="max-w-xl space-y-4" enctype="multipart/form-data">
      <input
        v-model="form.title"
        type="text"
        placeholder="Judul Video"
        class="w-full p-2 bg-[#2a1f4d] rounded"
        required
      />

      <textarea
        v-model="form.description"
        placeholder="Deskripsi Video"
        class="w-full p-2 bg-[#2a1f4d] rounded"
        rows="4"
        required
      ></textarea>

      <select
        v-model="form.category_id"
        class="w-full p-2 bg-[#2a1f4d] rounded"
        required
      >
        <option disabled value="">Pilih Kategori</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <!-- Input Video -->
      <div>
        <label class="block text-sm mb-1">Video</label>
        <input
          type="file"
          @change="handleVideoChange"
          accept="video/*"
          class="w-full p-2 bg-[#2a1f4d] rounded"
          required
        />
        <p v-if="form.video" class="text-xs text-gray-400 mt-1">{{ form.video.name }}</p>
      </div>
      <div v-if="videoPreview" class="mt-2">
        <video :src="videoPreview" controls class="w-full max-h-64 rounded" />
      </div>

      <!-- Input Thumbnail -->
      <div>
        <label class="block text-sm mb-1">Thumbnail</label>
        <input
          type="file"
          @change="handleThumbChange"
          accept="image/*"
          class="w-full p-2 bg-[#2a1f4d] rounded"
          required
        />
        <p v-if="form.thumbnail" class="text-xs text-gray-400 mt-1">{{ form.thumbnail.name }}</p>
      </div>
      <div v-if="thumbPreview" class="mt-2">
        <img :src="thumbPreview" alt="Thumbnail Preview" class="w-48 rounded" />
      </div>

      <!-- Progress Bar -->
      <div v-if="isLoading" class="mt-4">
        <p class="text-sm mb-1">Mengupload: {{ uploadProgress }}%</p>
        <div class="w-full h-2 bg-gray-700 rounded">
          <div
            class="h-2 bg-green-500 rounded transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>

<p v-if="isProcessing && !isLoading" class="text-sm text-yellow-400 mt-2">
  Menyimpan data di server...
</p>

      <div class="flex gap-2 justify-end mt-4">
        <RouterLink to="/admin/videos" class="bg-gray-600 px-4 py-2 rounded">Batal</RouterLink>
        <button
          type="submit"
          :disabled="isLoading"
          class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {{ isLoading ? 'Mengupload...' : 'Upload' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from '@/services/axios'
import axiosRaw from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadVideoStore } from '@/stores/uploadVideo'
import { useAuthStore } from '@/stores/auth'
import { getVideoDuration } from '@/utils/getVideoDuration'

const router = useRouter()
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

onMounted(async () => {
  try {
    await uploadStore.fetchCategories()
    categories.value = uploadStore.categories
  } catch (err) {
    alert('Gagal memuat kategori', err)
  }
})

function handleVideoChange(e) {
  const file = e.target.files[0]
  form.value.video = file
  videoPreview.value = URL.createObjectURL(file)
}

function handleThumbChange(e) {
  const file = e.target.files[0]
  form.value.thumbnail = file
  thumbPreview.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  if (!authStore.user?.id) {
    alert('User tidak valid')
    return router.push('/login')
  }

  isLoading.value = true
  uploadProgress.value = 0
  isProcessing.value = true

  try {
    if (form.value.video.size > 100 * 1024 * 1024) {
      alert('Ukuran video maksimal 100MB')
      return
    }

    const duration = await getVideoDuration(form.value.video)
    let videoProgress = 0
    let thumbProgress = 0

    const updateOverallProgress = () => {
      uploadProgress.value = Math.round((videoProgress + thumbProgress) / 2)
    }

    const videoUrl = await uploadToCloudinary(
      form.value.video,
      'upload_preset_video',
      'video',
      'video',
      (p) => {
        videoProgress = p
        updateOverallProgress()
      }
    )

    const thumbUrl = await uploadToCloudinary(
      form.value.thumbnail,
      'upload_preset_thumbnail',
      'thumbnail',
      'image',
      (p) => {
        thumbProgress = p
        updateOverallProgress()
      }
    )

    const postRes = await axios.post('/videos', {
      title: form.value.title,
      description: form.value.description,
      category_id: form.value.category_id,
      user_id: authStore.user.id,
      video_url: videoUrl,
      thumbnail_url: thumbUrl,
      duration: duration
    })

    console.log(postRes)

    alert('Video berhasil diupload!')
    router.push('/admin/videos')
  } catch (err) {
    console.error(err)
    alert('Gagal upload: ' + err.message)
  } finally {
    isLoading.value = false
    isProcessing.value = false
  }
}

async function uploadToCloudinary(file, preset, folder, type = 'image', onProgress) {
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
</script>


