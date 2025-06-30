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

  let hasReported = false

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
      if (error.response && error.response.status === 404 || error.response.status === 500) {
        const router = useRouter()

        router.push('/not-found') // Pastikan halaman ini ada
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

  async function reportWatchHistory(videoPlayer) {
    if (!video.value || !videoPlayer || hasReported) return

    const watched = Math.floor(videoPlayer.currentTime || 0)
    const total = Math.floor(videoPlayer.duration || 0)
    const threshold = Math.max(1, total * 0.2)

    if (watched >= threshold && !alreadyWatched(video.value.id)) {
      const user = getUserFromToken()
      const payload = {
        video_id: video.value.id,
        duration_watch: watched,
        ...(user?.id ? { user_id: user.id } : { guest_id: localStorage.getItem('guest_id') || generateGuestId() })
      }

      try {
        await axios.post('/watch-history', payload)
        hasReported = true
        markAsWatched(video.value.id)
        console.log('Watch history berhasil dikirim.')
      } catch (err) {
        console.error('❌ Gagal kirim watch history:', err)
      }
    }
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
  }
}
