<template>
  <div v-if="comments?.length" class="space-y-4">
    <div
      v-for="(comment, index) in comments"
      :key="index"
      class="border border-primary rounded-md p-4 bg-secondary hover:bg-passive transition-colors"
    >
      <p class="text-primary font-medium mb-1">{{ comment.User.name }}</p>
      <p class="text-secondary">{{ comment.content }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ comments: Array })
</script>
