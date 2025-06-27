<template>
  <div class="flex items-center space-x-6 text-white text-sm">
    <div
      class="flex items-center space-x-1 cursor-pointer select-none hover:text-blue-400"
      @click="$emit('toggle-like')"
    >
      <span class="material-icons text-lg">
        {{ liked ? 'thumb_up' : 'thumb_up_off_alt' }}
      </span>
      <span>{{ likeCount }} Likes</span>
    </div>

    <div class="flex items-center space-x-1">
      <span class="material-icons text-lg">chat_bubble_outline</span>
      <span>{{ commentCount }} Comments</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  liked: Boolean,
  likeCount: Number,
  commentCount: Number,
})
</script>
