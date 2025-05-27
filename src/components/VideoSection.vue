<template>
  <div class="mb-6">
    <h2 class="text-white font-bold mb-2">{{ title }}</h2>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <router-link
        v-for="video in limitedVideos"
        :key="video.id"
        :to="{
          path: isHistory ? `/history/watch/${video.id}` : `/videos/${video.id}`,
          query: isHistory && video.lastTime !== undefined ? { start: video.lastTime } : {},
        }"
        class="w-full block"
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

    <div
      v-if="
        !disableLimit &&
        videos.length > 4 &&
        !(title && title.toLowerCase().includes('hasil pencarian'))
      "
      class="mt-4 text-center"
    >
      <router-link
        :to="{
          path: isHistory ? '/history' : '/videos',
          query: isLatest ? { all: 'latest' } : isPopular ? { all: 'popular' } : {},
        }"
        class="inline-block px-6 py-2 text-gray-700 border-b-2 border-gray-700 hover:border-blue-500 transition-all duration-300 focus:outline-none"
      >
        Lihat Semua
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VideoCard from './VideoCard.vue'

const props = defineProps({
  title: String,
  videos: {
    type: Array,
    default: () => [],
  },
  disableLimit: {
    type: Boolean,
    default: false,
  },
  isHistory: {
    type: Boolean,
    default: false,
  },
  isLatest: {
    type: Boolean,
    default: false,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
})

const limitedVideos = computed(() => {
  if (
    props.disableLimit ||
    (props.title && props.title.toLowerCase().includes('hasil pencarian'))
  ) {
    return props.videos
  }
  return props.videos.slice(0, 4)
})
</script>
