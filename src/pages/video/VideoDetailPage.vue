<template>
  <div class="flex h-screen overflow-hidden bg-primary text-primary">
    <main class="flex-1 bg-primary overflow-y-auto px-6 pb-10">
      <Topbar :showCategory="false" :searchScope="'dashboard'" @search="handleSearch" />

      <div v-if="!video" class="text-primary">Loading video...</div>

      <div v-else class="max-w-4xl mx-auto space-y-6">
        <VideoPlayer :video="video" ref="videoPlayerRef" @loaded="onLoadedMetadata" />
        <VideoHeader :video="video" />
        <VideoDescription :description="video.description" :createdAt="video.createdAt" />
        <VideoStats
          :liked="liked"
          :likeCount="likeCount"
          :commentCount="video.commentCount"
          @toggle-like="toggleLike"
        />
        <CommentForm v-model="commentContent" :isPosting="isPosting" @post="postComment" />
        <h6 class="text-primary text-lg font-semibold mb-2">Komentar</h6>
        <VideoComments :comments="video.comments" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Topbar from '@/components/layout/TopBar.vue'
import VideoPlayer from '@/components/video/detail/VideoPlayer.vue'
import VideoHeader from '@/components/video/detail/VideoHeader.vue'
import VideoDescription from '@/components/video/detail/VideoDescription.vue'
import VideoStats from '@/components/video/detail/VideoStats.vue'
import VideoComments from '@/components/video/detail/VideoComments.vue'
import CommentForm from '@/components/video/detail/CommentForm.vue'

import { useVideoDetail } from '@/composables/useVideoDetail'

const {
  video,
  liked,
  likeCount,
  commentContent,
  isPosting,
  fetchVideo,
  toggleLike,
  postComment,
  reportWatchHistory,
} = useVideoDetail()

const route = useRoute()
const router = useRouter()
const videoPlayerRef = ref(null)

function handleSearch({ query }) {
  if (!query?.trim()) return
  router.push({ path: '/search', query: { q: query } })
}

function onLoadedMetadata() {
  const start = Number(route.query.start)
  if (!isNaN(start) && start >= 0) {
    setTimeout(() => {
      const player = videoPlayerRef.value?.$el?.querySelector('video')
      if (player) {
        player.currentTime = start
        player.play()
      }
    }, 10)
  }
}

onMounted(() => {
  if (route.params.id) {
    fetchVideo(route.params.id)
  }

  watch(
    () => videoPlayerRef.value,
    (playerComponent) => {
      const player = playerComponent?.$el?.querySelector('video')
      if (player) {
        player.addEventListener('pause', () => reportWatchHistory(player))
        player.addEventListener('ended', () => reportWatchHistory(player))
      }
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  const player = videoPlayerRef.value?.$el?.querySelector('video')
  if (player) reportWatchHistory(player)
})
</script>
