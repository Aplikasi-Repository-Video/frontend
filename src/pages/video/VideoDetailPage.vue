<template>
  <div class="flex h-screen overflow-hidden bg-primary text-primary ml-4">
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
  setupWatchHistoryReporting,
  setupVisibilityBasedReporting,
  resetReporting,
} = useVideoDetail()

const route = useRoute()
const router = useRouter()
const videoPlayerRef = ref(null)

let cleanupWatchReporting = null
let visibilityObserver = null

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

function setupReporting(player) {
  if (!player) return

  if (cleanupWatchReporting) {
    cleanupWatchReporting()
  }
  if (visibilityObserver) {
    visibilityObserver.disconnect()
  }

  cleanupWatchReporting = setupWatchHistoryReporting(player)

  const visibilitySetup = setupVisibilityBasedReporting(player)
  if (visibilitySetup) {
    visibilityObserver = visibilitySetup.observer
  }

  player.addEventListener('pause', () => {
    console.log('Video paused, reporting watch history...')
    reportWatchHistory(player)
  })

  player.addEventListener('ended', () => {
    console.log('Video ended, reporting watch history...')
    reportWatchHistory(player)
  })

  player.addEventListener('seeked', () => {
    console.log('Video seeked, reporting watch history...')
    reportWatchHistory(player)
  })
}

onMounted(() => {
  if (route.params.id) {
    fetchVideo(route.params.id)
  }

  resetReporting()

  watch(
    () => videoPlayerRef.value,
    (playerComponent) => {
      if (playerComponent) {
        setTimeout(() => {
          const player = playerComponent?.$el?.querySelector('video')
          if (player) {
            console.log('Video player ready, setting up watch history reporting...')
            setupReporting(player)
          }
        }, 100)
      }
    },
    { immediate: true },
  )

  watch(
    () => video.value?.id,
    (newId, oldId) => {
      if (newId && newId !== oldId) {
        console.log('Video changed, resetting watch history reporting...')
        resetReporting()
        const player = videoPlayerRef.value?.$el?.querySelector('video')
        if (player) {
          setupReporting(player)
        }
      }
    },
  )
})

onBeforeUnmount(() => {
  console.log('Component unmounting, final watch history report...')

  const player = videoPlayerRef.value?.$el?.querySelector('video')
  if (player) {
    reportWatchHistory(player)
  }

  if (cleanupWatchReporting) {
    cleanupWatchReporting()
  }
  if (visibilityObserver) {
    visibilityObserver.disconnect()
  }
})

onMounted(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      console.log('Page hidden, reporting watch history...')
      const player = videoPlayerRef.value?.$el?.querySelector('video')
      if (player) {
        reportWatchHistory(player)
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
})
</script>
