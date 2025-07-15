<template>
  <div class="bg-secondary text-secondary p-4 rounded-lg shadow border border-secondary">
    <div
      ref="descriptionRef"
      :style="{ maxHeight: isExpanded ? contentHeight + 'px' : '160px' }"
      class="transition-all duration-500 overflow-hidden"
    >
      <div
        ref="contentRef"
        v-html="formattedDescription"
        class="text-primary leading-relaxed"
      ></div>
    </div>

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
import { ref, computed, onMounted, nextTick } from 'vue'
import linkifyHtml from 'linkify-html'

const props = defineProps({
  description: String,
})

const isExpanded = ref(false)
const contentHeight = ref(0)

const descriptionRef = ref(null)
const contentRef = ref(null)

const toggleDescription = async () => {
  isExpanded.value = !isExpanded.value
  await nextTick()
  contentHeight.value = contentRef.value?.scrollHeight ?? 0
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

const shouldShowToggle = computed(() => {
  return (props.description?.length ?? 0) > 240
})

onMounted(() => {
  contentHeight.value = contentRef.value?.scrollHeight ?? 0
})
</script>
