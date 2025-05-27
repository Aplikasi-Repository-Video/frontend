<template>
  <div class="flex h-screen overflow-hidden bg-[#121212]">
    <main class="flex-1 bg-[#0f0b1d] overflow-y-auto p-6">
      <Topbar />
      <button @click="$router.back()" class="mb-4 text-sm text-blue-400 hover:text-blue-500">
        ← Kembali
      </button>

      <div v-if="!video" class="text-white">Loading video...</div>
      <div v-else class="max-w-4xl mx-auto">
        <div class="relative pb-[56.25%]">
          <video
            ref="videoPlayer"
            v-if="video?.videoUrl"
            :src="video?.videoUrl"
            autoplay
            controls
            controlsList="nodownload"
            class="absolute top-0 left-0 w-full h-full"
            @loadedmetadata="onLoadedMetadata"
          />
        </div>

        <div class="mt-4">
          <h1 class="text-3xl font-semibold text-white">{{ video?.title }}</h1>
          <p class="mt-1 text-sm text-gray-500 mb-2">{{ timeAgo(video?.createdAt) }} yang lalu</p>

          <div
            :class="{ 'max-h-40': !isExpanded, 'max-h-full': isExpanded }"
            class="text-gray-300 bg-[#20142c] p-4 rounded-lg shadow-md transition-all duration-300 overflow-hidden mb-4"
          >
            <p v-html="isExpanded ? video?.description : truncatedDescription" />

            <button
              v-if="shouldShowToggle"
              @click="toggleDescription"
              class="mt-2 text-blue-400 text-sm"
            >
              {{ isExpanded ? 'Tutup' : 'Lihat Selengkapnya' }}
            </button>
          </div>

          <div class="flex space-x-4 mb-4">
            <div class="flex items-center space-x-1 text-white">
              <span class="text-xl">👍</span>
              <span>{{ video?.likeCount }} Likes</span>
            </div>
            <div class="flex items-center space-x-1 text-white">
              <span class="text-xl">💬</span>
              <span>{{ video?.commentCount }} Comments</span>
            </div>
          </div>

          <div v-for="(comment, index) in video?.comments" :key="index" class="flex mb-4">
            <div
              class="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm mr-4"
            >
              {{ comment.user_id }}
            </div>
            <div class="flex-1">
              <p class="font-semibold text-white">User ID: {{ comment.user_id }}</p>
              <p class="text-gray-300">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/lib/axios'
import Topbar from '@/components/TopBar.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const route = useRoute()
const video = ref(null)
const isExpanded = ref(false)
const videoPlayer = ref(null)

const timeAgo = (timestamp) => dayjs(timestamp).fromNow()
const toggleDescription = () => {
  isExpanded.value = !isExpanded.value
}
const shouldShowToggle = computed(() => video.value?.description?.length > 240)
const truncatedDescription = computed(() => video.value?.description?.substring(0, 240) + '...')

function onLoadedMetadata() {
  const startTime = Number(route.query.start)
  if (isNaN(startTime) || startTime < 0) {
    return
  }
  console.log('startTime:', startTime)
  if (!isNaN(startTime) && videoPlayer.value) {
    setTimeout(() => {
      videoPlayer.value.currentTime = startTime
      videoPlayer.value.play()
    }, 10)
  }
}

async function fetchVideo(id) {
  try {
    const res = await axios.get(`/videos/${id}`)
    const data = res.data.data

    video.value = {
      id: data.id,
      title: data.title,
      year: new Date(data.created).getFullYear(),
      description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quia.', // bisa diganti sesuai data sebenarnya
      videoUrl: data.video_url,
      likes: data.Like,
      likeCount: data.Like.length,
      commentCount: data.Comment.length,
      comments: data.Comment,
      createdAt: data.created,
    }
  } catch (error) {
    console.error('Gagal mengambil detail video:', error)
  }
}

onMounted(() => {
  if (route.params.id) {
    fetchVideo(route.params.id)
  }
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchVideo(newId)
    }
  },
)
</script>

<style scoped>
video {
  border-radius: 8px;
}

button:hover {
  text-decoration: underline;
}

button {
  transition: color 0.3s;
}

button:hover {
  color: #1d9bf0;
}
</style>
