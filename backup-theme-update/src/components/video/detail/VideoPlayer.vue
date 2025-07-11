<template>
  <div class="relative pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
    <video
      v-if="video?.videoUrl"
      :src="video.videoUrl"
      autoplay
      controls
      controlsList="nodownload"
      class="absolute top-0 left-0 w-full h-full"
      @loadedmetadata="$emit('loaded')"
    />
  </div>
</template>

<script setup>
defineProps({ video: Object })
</script>
