<template>
  <div class="bg-[#0f0b1d] text-white mb-4 pl-6 pr-0 md:px-0">
    <div
      class="flex items-center justify-between gap-x-8 md:grid md:grid-cols-3 md:items-center md:gap-4"
    >
      <div class="hidden md:block">
        <h1 class="text-2xl font-bold">Belajar Sekarang</h1>
        <p class="text-sm text-gray-400">
          Video edukasi yang kami pilih untuk mendukung pembelajaran Anda
        </p>
      </div>

      <div class="flex-grow md:flex md:justify-center md:col-span-1">
        <div class="w-full max-w-md">
          <SearchInput />
        </div>
      </div>

      <div class="flex-shrink-0 flex justify-end md:col-span-1">
        <a href="/profile">
          <button type="button" aria-label="Profile" class="material-icons text-white text-5xl">
            account_circle
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchInput from './SearchInput.vue'
</script>
