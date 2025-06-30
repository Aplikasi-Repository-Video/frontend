<template>
  <div class="flex flex-col md:flex-row gap-8">
    <!-- Form -->
    <form @submit.prevent="onSubmit" class="md:w-1/2 space-y-4 ml-2" enctype="multipart/form-data">
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

      <!-- Video Upload -->
      <div>
        <label class="block text-sm mb-1">Video</label>
        <div
          class="w-full bg-[#2a1f4d] p-4 rounded border-2 border-dashed border-gray-400 text-center cursor-pointer hover:border-purple-400 transition"
          @dragover.prevent
          @drop.prevent="handleVideoDrop"
          @click="$refs.videoInput.click()"
        >
          <p class="text-sm">Drop video here or click to select</p>
          <input
            ref="videoInput"
            type="file"
            accept="video/*"
            class="hidden"
            @change="handleVideoChange"
          />
          <p v-if="form.video" class="text-xs text-gray-400 mt-1">{{ form.video.name }}</p>
        </div>
      </div>

      <!-- Thumbnail Upload -->
      <div>
        <label class="block text-sm mb-1">Thumbnail</label>
        <div
          class="w-full bg-[#2a1f4d] p-4 rounded border-2 border-dashed border-gray-400 text-center cursor-pointer hover:border-purple-400 transition"
          @dragover.prevent
          @drop.prevent="handleThumbDrop"
          @click="$refs.thumbInput.click()"
        >
          <p class="text-sm">Drop image here or click to select</p>
          <input
            ref="thumbInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleThumbChange"
          />
          <p v-if="form.thumbnail" class="text-xs text-gray-400 mt-1">{{ form.thumbnail.name }}</p>
        </div>
      </div>

      <!-- Upload Progress -->
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
        <slot name="actions">
          <!-- Default Actions -->
          <RouterLink to="/admin/videos" class="bg-gray-600 px-4 py-2 rounded">Batal</RouterLink>
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {{ isLoading ? 'Mengupload...' : 'Upload' }}
          </button>
        </slot>
      </div>
    </form>

    <!-- Preview Section -->
    <div class="md:w-1/2 space-y-4">
      <div v-if="videoPreview">
        <label class="block text-sm mb-1">Preview Video</label>
        <div class="relative w-full pt-[56.25%] rounded overflow-hidden">
          <video :src="videoPreview" controls class="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
      </div>

      <div v-if="thumbPreview">
        <label class="block text-sm mb-1">Preview Thumbnail</label>
        <div class="relative w-full pt-[56.25%] rounded overflow-hidden">
          <img :src="thumbPreview" class="absolute top-0 left-0 w-full h-full object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUploadForm } from '@/composables/useUploadForm'

const props = defineProps({
  initialForm: Object,
  mode: {
    type: String,
    default: 'create',
  },
  videoId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['submit'])

const {
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
  handleSubmit: internalSubmit,
} = useUploadForm({
  mode: props.mode,
  initialForm: props.initialForm,
  videoId: props.videoId,
})

function onSubmit() {
  return internalSubmit()
    .then(() => emit('submit'))
    .catch((e) => console.error('Submit gagal:', e))
}
</script>

