<template>
  <div class="flex items-center mb-6 gap-4">
    <button
      @click="toggleSidebar"
      :class="['text-white hover:text-purple-300', { 'ml-2': isOpen }]"
    >
      <span class="material-icons text-3xl">
        {{ isOpen ? 'close' : 'menu' }}
      </span>
    </button>

    <div class="flex items-center gap-2 text-2xl font-bold" v-if="isOpen">
      <img src="../assets/logo.png" alt="Logo" class="w-8 h-8" />
      <span>EduVid</span>
    </div>
  </div>
</template>

<script setup>
defineProps(['isOpen', 'toggleSidebar'])
</script>
