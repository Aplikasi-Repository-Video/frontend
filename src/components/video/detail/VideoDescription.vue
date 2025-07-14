<template>
  <div
    :class="{ 'max-h-40': !isExpanded, 'max-h-full': isExpanded }"
    class="bg-secondary text-secondary p-4 rounded-lg shadow transition-all duration-300 overflow-hidden"
  >
    <p
      v-html="isExpanded ? formattedDescription : truncatedDescription"
      class="text-primary leading-relaxed"
    />

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
import linkifyHtml from 'linkify-html'

const props = defineProps({
  description: String,
  createdAt: String,
})

const isExpanded = ref(false)
const toggleDescription = () => {
  isExpanded.value = !isExpanded.value
}

const formatDescription = (text) => {
  if (!text) return ''
  const linked = linkifyHtml(text.trim(), {
    target: '_blank',
    className: 'text-blue-400 underline',
  })
  return linked.replace(/\n/g, '<br>')
}

const formattedDescription = computed(() => formatDescription(props.description))
const truncatedDescription = computed(() => {
  const shortText = props.description?.substring(0, 240) ?? ''
  return formatDescription(shortText) + '...'
})

const shouldShowToggle = computed(() => props.description?.length > 240)
</script>
