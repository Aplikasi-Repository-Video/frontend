<script setup>
import { computed } from 'vue'
const props = defineProps({
  isPosting: Boolean,
  modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'post'])

// computed getter-setter untuk v-model
const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="mt-6">
    <h3 class="text-white text-lg font-semibold mb-2">Tinggalkan Komentar</h3>
    <textarea
      v-model="inputValue"
      placeholder="Tulis komentar..."
      rows="3"
      class="w-full p-3 rounded bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none resize-none"
    />
    <button
      @click="$emit('post')"
      :disabled="isPosting || !inputValue.trim()"
      class="mt-3 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 transition"
    >
      {{ isPosting ? 'Mengirim...' : 'Kirim Komentar' }}
    </button>
  </div>
</template>
