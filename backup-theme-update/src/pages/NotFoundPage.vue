<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4">
    <h1 class="text-6xl font-bold mb-4 animate-pulse">404</h1>
    <p class="text-xl mb-6 text-center max-w-md">
      Oops! The page you're looking for doesn't exist or has been moved.
    </p>
    <RouterLink
      to="/videos"
      class="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition rounded-full text-white font-semibold shadow-lg"
    >
      ← Back to Home
    </RouterLink>
  </div>
</template>

<script setup>
// Tidak perlu script jika hanya statis
</script>
