<template>
  <div class="mb-6 ml-4 mt-2">
    <h2 class="text-primary font-bold mb-2">{{ title }}</h2>

    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="video in visibleVideos" :key="video.id" class="relative group w-full">
        <button
          v-if="isHistory"
          @click="$emit('delete-history', video)"
          class="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded transition"
        >
          Hapus
        </button>

        <router-link
          :to="{
            path: isHistory
              ? `/history/watch/${video.id}`
              : isFavorite
                ? `/favorites/watch/${video.id}`
                : `/videos/watch/${video.id}`,
            query:
              (isHistory || isFavorite) && video.lastTime !== undefined
                ? { start: video.lastTime }
                : {},
          }"
          class="block"
        >
          <VideoCard
            :id="video.id"
            :title="video.title"
            :year="video.year"
            :thumbnail="video.thumbnail"
            :videoUrl="video.videoUrl"
            :createdAt="video.createdAt"
            class="w-full"
          />
        </router-link>
      </div>
    </div>

    <div v-if="isLoadingMore" class="text-center text-primary mt-4">Memuat lebih banyak...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import VideoCard from '../video/VideoCard.vue'

const props = defineProps({
  title: String,
  videos: {
    type: Array,
    default: () => [],
  },
  disableLimit: {
    type: Boolean,
    default: true,
  },
  isHistory: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const page = ref(1)
const perPage = 8
const isLoadingMore = ref(false)

const visibleVideos = computed(() => {
  if (
    props.disableLimit ||
    (props.title && props.title.toLowerCase().includes('hasil pencarian'))
  ) {
    return props.videos
  }
  return props.videos.slice(0, page.value * perPage)
})

function handleScroll() {
  if (props.disableLimit) return

  const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  if (bottomReached && visibleVideos.value.length < props.videos.length) {
    isLoadingMore.value = true
    setTimeout(() => {
      page.value += 1
      isLoadingMore.value = false
    }, 300)
  }
}

watch(
  () => props.videos,
  () => {
    page.value = 1
  },
)

onMounted(() => {
  if (!props.disableLimit) {
    window.addEventListener('scroll', handleScroll)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
