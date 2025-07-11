import { ref } from 'vue'
import axios from '@/services/axios'
import { getUserFromToken } from '@/utils/auth'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

export function useVideoDetail() {
  const video = ref(null)
  const liked = ref(false)
  const likeCount = ref(0)
  const commentContent = ref('')
  const isPosting = ref(false)

  async function fetchVideo(id) {
    try {
      const res = await axios.get(`/videos/${id}`)
      const data = res.data.data
      const user = getUserFromToken()

      video.value = {
        id: data.id,
        title: data.title,
        year: new Date(data.created).getFullYear(),
        description: data.description,
        videoUrl: data.video_url,
        likes: data.Like,
        likeCount: data.Like.length,
        commentCount: data.Comment.length,
        comments: data.Comment,
        createdAt: data.created,
      }

      likeCount.value = data.Like.length
      liked.value = data.Like.some((like) => like.user_id === user?.id)
    } catch (error) {
      if ((error.response && error.response.status === 404) || error.response.status === 500) {
        const router = useRouter()
        router.push('/not-found')
      } else {
        console.error('❌ Gagal mengambil detail video:', error)
      }
    }
  }

  async function toggleLike() {
    const user = getUserFromToken()
    if (!user?.id || !video.value?.id) {
      await Swal.fire({
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk menyukai video ini.',
        icon: 'info',
        confirmButtonText: 'Login Sekarang',
        showCancelButton: true,
        cancelButtonText: 'Nanti Saja',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
          cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login'
        }
      })
      return
    }

    const payload = {
      user_id: user.id,
      video_id: video.value.id,
    }

    try {
      await axios.post('/likes', payload)
      liked.value = !liked.value
      likeCount.value += liked.value ? 1 : -1
    } catch (err) {
      console.error('❌ Gagal toggle like:', err)
    }
  }

  async function postComment() {
    const content = commentContent.value.trim()
    const user = getUserFromToken()
    if (!content || !user?.id) {
      const result = await Swal.fire({
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk mengirim komentar.',
        icon: 'info',
        confirmButtonText: 'Login Sekarang',
        showCancelButton: true,
        cancelButtonText: 'Nanti Saja',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
          cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
        },
      })

      if (result.isConfirmed) {
        window.location.href = '/login'
      }
      return
    }

    const payload = {
      content,
      user_id: user.id,
      video_id: video.value.id,
    }

    try {
      isPosting.value = true
      const res = await axios.post('/comments', payload)
      video.value.comments.unshift(res.data.data)
      video.value.commentCount++
      commentContent.value = ''
    } catch (error) {
      console.error('❌ Gagal mengirim komentar:', error)
    } finally {
      isPosting.value = false
    }
  }

  function generateGuestId() {
    const id = 'guest_' + Math.random().toString(36).substring(2, 10)
    localStorage.setItem('guest_id', id)
    return id
  }

  function markAsWatched(videoId) {
    localStorage.setItem(`watched_${videoId}`, '1')
  }

  function alreadyWatched(videoId) {
    return localStorage.getItem(`watched_${videoId}`) === '1'
  }

  let hasReported = false
  let reportingInProgress = false
  let lastReportedVideoId = null
  let reportTimer = null

  function resetReporting() {
    hasReported = false
    reportingInProgress = false
    lastReportedVideoId = null
    if (reportTimer) {
      clearTimeout(reportTimer)
      reportTimer = null
    }
    console.log('🔄 Reporting state reset')
  }

  async function reportWatchHistory(videoPlayer, forceReport = false) {
    console.log('🎯 reportWatchHistory called', {
      hasVideo: !!video.value,
      hasPlayer: !!videoPlayer,
      isReporting: reportingInProgress,
      forceReport
    })

    if (!video.value || !videoPlayer) {
      console.log('❌ Report skipped: missing video or player')
      return
    }

    if (reportingInProgress && !forceReport) {
      console.log('❌ Report skipped: already reporting')
      return
    }

    if (lastReportedVideoId !== video.value.id) {
      console.log('📹 Video changed, resetting report state')
      hasReported = false
      lastReportedVideoId = video.value.id
    }

    if (hasReported && !forceReport) {
      console.log('❌ Already reported for this video')
      return
    }

    const currentTime = videoPlayer.currentTime || 0
    const duration = videoPlayer.duration || 0

    console.log('⏱️ Time check:', { currentTime, duration })

    if (duration <= 0 || isNaN(duration)) {
      console.log('❌ Invalid duration:', duration)
      return
    }

    if (currentTime <= 0 || isNaN(currentTime)) {
      console.log('❌ Invalid current time:', currentTime)
      return
    }

    const watched = Math.floor(currentTime)
    const total = Math.floor(duration)
    const threshold = Math.max(1, Math.floor(total * 0.01))

    console.log('📊 Watch progress:', { watched, total, threshold })

    const shouldReport = watched >= threshold && !alreadyWatched(video.value.id)

    console.log('🤔 Should report?', {
      shouldReport,
      watchedEnough: watched >= threshold,
      notAlreadyWatched: !alreadyWatched(video.value.id),
      forceReport
    })

    if (shouldReport || forceReport) {
      reportingInProgress = true

      try {
        const user = getUserFromToken()
        let guestId = null

        if (!user?.id) {
          guestId = localStorage.getItem('guest_id')
          if (!guestId) {
            guestId = generateGuestId()
          }
        }

        const payload = {
          video_id: video.value.id.toString(),
          duration_watch: watched.toString(),
          ...(user?.id
            ? { user_id: user.id.toString() }
            : { guest_id: guestId }),
        }

        console.log('📤 Sending watch history:', payload)

        const response = await axios.post('/watch-history', payload, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 200 || response.status === 201) {
          hasReported = true
          markAsWatched(video.value.id)
          console.log('✅ Watch history berhasil dikirim:', response.data)
        } else {
          console.warn('⚠️ Unexpected response status:', response.status)
        }
      } catch (err) {
        console.error('❌ Gagal kirim watch history:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          videoId: video.value.id,
          watched,
          total,
          payload: {
            video_id: video.value.id.toString(),
            duration_watch: watched.toString(),
          }
        })

        if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
          console.log('🔄 Network error, retrying in 5 seconds...')
          setTimeout(() => {
            reportingInProgress = false
            reportWatchHistory(videoPlayer, true)
          }, 5000)
          return
        }
      } finally {
        reportingInProgress = false
      }
    } else {
      console.log('⏭️ Not reporting - conditions not met')
    }
  }

  function setupWatchHistoryReporting(videoPlayer) {
    if (!videoPlayer) {
      console.log('❌ No video player provided for setup')
      return
    }

    console.log('🔧 Setting up watch history reporting')

    let localReportTimer = null
    let lastVideoId = null

    const resetLocalReporting = () => {
      if (localReportTimer) {
        clearTimeout(localReportTimer)
        localReportTimer = null
      }
    }

    const checkVideoChange = () => {
      if (video.value?.id !== lastVideoId) {
        lastVideoId = video.value?.id
        resetLocalReporting()
        console.log('📹 Local: Video changed detected')
      }
    }

    const scheduleReport = () => {
      if (localReportTimer) clearTimeout(localReportTimer)

      localReportTimer = setTimeout(() => {
        console.log('⏰ Scheduled report triggered')
        reportWatchHistory(videoPlayer)
      }, 2000)
    }

    const handleLoadedMetadata = () => {
      console.log('📹 Video metadata loaded')
      checkVideoChange()
    }

    const handleTimeUpdate = () => {
      if (video.value && videoPlayer.currentTime > 0) {
        scheduleReport()
      }
    }

    const handleEnded = () => {
      console.log('🏁 Video ended - forcing report')
      if (localReportTimer) clearTimeout(localReportTimer)
      reportWatchHistory(videoPlayer, true)
    }

    const handlePause = () => {
      console.log('⏸️ Video paused - reporting watch history')
      if (localReportTimer) clearTimeout(localReportTimer)
      reportWatchHistory(videoPlayer)
    }

    videoPlayer.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoPlayer.addEventListener('timeupdate', handleTimeUpdate)
    videoPlayer.addEventListener('ended', handleEnded)
    videoPlayer.addEventListener('pause', handlePause)

    return () => {
      console.log('🧹 Cleaning up watch history reporting')
      if (localReportTimer) clearTimeout(localReportTimer)
      videoPlayer.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoPlayer.removeEventListener('timeupdate', handleTimeUpdate)
      videoPlayer.removeEventListener('ended', handleEnded)
      videoPlayer.removeEventListener('pause', handlePause)
    }
  }

  function setupVisibilityBasedReporting(videoPlayer) {
    if (!videoPlayer) return null

    let isVisible = false
    let watchStartTime = null
    let totalWatchTime = 0

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true
          watchStartTime = Date.now()
          console.log('👁️ Video became visible')
        } else {
          isVisible = false
          if (watchStartTime) {
            totalWatchTime += Date.now() - watchStartTime
            watchStartTime = null
            console.log('👁️ Video hidden, total watch time:', totalWatchTime)
          }
        }
      })
    }, { threshold: 0.5 })

    observer.observe(videoPlayer)

    return { observer, isVisible: () => isVisible, totalWatchTime: () => totalWatchTime }
  }

  return {
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
  }
}
