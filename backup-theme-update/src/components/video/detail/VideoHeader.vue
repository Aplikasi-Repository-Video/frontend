<template>
  <div>
    <h1 class="text-3xl font-semibold text-white">{{ video?.title }}</h1>
    <p class="text-sm text-gray-500 mt-1">{{ timeAgo(video?.createdAt) }}</p>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'

dayjs.extend(relativeTime)
dayjs.locale('id')
defineProps({ video: Object })


const timeAgo = (timestamp) => dayjs(timestamp).fromNow()
</script>
