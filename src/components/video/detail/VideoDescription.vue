<template>
  <div
    :class="{ 'max-h-40': !isExpanded, 'max-h-full': isExpanded }"
    class="bg-secondary text-secondary p-4 rounded-lg shadow transition-all duration-300 overflow-hidden"
  >
    <p v-html="isExpanded ? description : truncatedDescription" />
    <button
      v-if="shouldShowToggle"
      @click="toggleDescription"
      class="mt-2 text-blue-400 text-sm hover:underline"
    >
      {{ isExpanded ? 'Tutup' : 'Lihat Selengkapnya' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  description: String,
  createdAt: String,
})

const isExpanded = ref(false)
const toggleDescription = () => {
  isExpanded.value = !isExpanded.value
}

const shouldShowToggle = computed(() => props.description?.length > 240)
const truncatedDescription = computed(() => props.description?.substring(0, 240) + '...')
</script>
