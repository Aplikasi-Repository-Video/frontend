<template>
  <div class="mt-6">
    <h3 class="text-primary text-lg font-semibold mb-2">Tinggalkan Komentar</h3>
    <textarea
      v-model="inputValue"
      placeholder="Tulis komentar..."
      rows="3"
      class="w-full p-3 rounded bg-secondary text-primary border border-secondary shadow focus:outline-none resize-none"
    />
    <button
      @click="$emit('post')"
      :disabled="isPosting || !inputValue.trim()"
      class="mt-3 px-5 py-2 bg-gray-300 hover:bg-gray-400 border border-black-100 text-black rounded disabled:opacity-50 transition"
    >
      {{ isPosting ? 'Mengirim...' : 'Kirim Komentar' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  isPosting: Boolean,
  modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'post'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>
