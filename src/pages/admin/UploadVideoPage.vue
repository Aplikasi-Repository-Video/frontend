<template>
  <div class="min-h-screen bg-primary text-primary ml-2 p-6">
    <h1 class="text-2xl font-bold mb-6">Upload Video Baru</h1>
    <VideoForm @submit="onSuccess" />
  </div>
</template>

<script setup>
import VideoForm from '@/components/video/VideoForm.vue'

function onSuccess() {}
</script>
