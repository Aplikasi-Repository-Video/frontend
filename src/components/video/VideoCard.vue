<template>
  <div
    class="block w-64 bg-primary rounded-xl overflow-hidden shadow-md text-primary hover:scale-105 transition cursor-pointer"
    @mouseenter="startHover"
    @mouseleave="endHover"
  >
    <div class="h-35 w-full overflow-hidden">
      <video
        v-if="shouldShowVideo"
        :src="videoUrl"
        class="w-full h-full object-cover"
        muted
        autoplay
        loop
        playsinline
      ></video>
      <img v-else :src="thumbnail" alt="thumbnail" class="w-full h-full object-cover" />
    </div>
    <div class="p-3">
      <p class="font-semibold text-sm line-clamp-2 h-10">{{ title }}</p>
      <p class="text-xs text-muted">{{ timeAgo(createdAt) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('id')

const timeAgo = (timestamp) => {
  return dayjs(timestamp).fromNow()
}

defineProps({
  id: [String, Number],
  title: String,
  year: Number,
  thumbnail: String,
  videoUrl: String,
  createdAt: String,
})

const isHovering = ref(false)
const shouldShowVideo = ref(false)
let timer = null

function startHover() {
  isHovering.value = true
  timer = setTimeout(() => {
    if (isHovering.value) {
      shouldShowVideo.value = true
    }
  }, 600)
}

function endHover() {
  isHovering.value = false
  shouldShowVideo.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}
</script>
