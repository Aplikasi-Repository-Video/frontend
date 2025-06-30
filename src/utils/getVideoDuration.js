export function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(Math.floor(video.duration))
    }

    video.onerror = (e) => {
      reject(new Error('Gagal membaca durasi video', e))
    }

    video.src = URL.createObjectURL(file)
  })
}

