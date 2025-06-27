<template>
  <div v-if="comments?.length" class="space-y-4">
    <div
      v-for="(comment, index) in comments"
      :key="index"
      class="border border-gray-700 rounded-md p-4 bg-[#19132a] hover:bg-[#221a36] transition-colors"
    >
      <p class="text-white font-medium mb-1">{{ comment.User.name }}</p>
      <p class="text-gray-300">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ comments: Array })
</script>
