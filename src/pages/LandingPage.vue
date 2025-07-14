<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 flex justify-between items-center px-6 lg:px-12 py-6">
      <div class="flex items-center space-x-3">
        <img src="../assets/logo.png" alt="Logo" class="w-10 h-10" />
        <span class="text-2xl font-bold text-white bg-clip-text text-transparent"> EduVid </span>
      </div>

      <div class="flex items-center space-x-4">
        <a
          href="/login"
          class="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium hover:bg-white/20 transition"
        >
          Masuk
        </a>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
      <!-- Badge -->
      <div
        class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm mb-8"
      >
        <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        <span class="text-sm font-medium text-purple-300">Mulai Harimu dengan Inspirasi</span>
      </div>

      <!-- Main Heading -->
      <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        Belajar Tanpa
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"
        >
          Batas
        </span>
      </h1>

      <p class="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl leading-relaxed">
        Dapatkan akses ke ribuan video edukatif berkualitas tinggi
      </p>

      <p class="text-lg text-gray-400 mb-12 max-w-2xl">
        Dari pemula hingga ahli, semua materi pembelajaran ada di satu platform. Belajar kapan saja,
        di mana saja dengan cara yang menyenangkan.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mb-16">
        <a
          href="/videos"
          class="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span class="flex items-center">
            Mulai Belajar Sekarang
            <svg
              class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </span>
        </a>
      </div>

      <!-- Video Preview -->
      <div class="relative max-w-4xl mx-auto">
        <div
          class="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
        >
          <img src="../assets/test.jpg" alt="Video Preview" class="w-full h-auto" />

          <!-- Video Overlay -->
          <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
            <button
              class="group w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl"
            >
              <svg
                class="w-8 h-8 text-purple-600 ml-1 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          <!-- Floating Stats -->
          <div
            class="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium">2.5K watching</span>
            </div>
          </div>

          <div
            class="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
              <span class="text-sm font-medium">4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="relative z-10 py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-16">
          Kenapa Memilih
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            EduVid?
          </span>
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div
              class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Pembelajaran Cepat</h3>
            <p class="text-gray-400 leading-relaxed">
              Metode pembelajaran yang efektif dengan video berkualitas tinggi untuk pemahaman yang
              lebih cepat
            </p>
          </div>

          <div
            class="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div
              class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Akses 24/7</h3>
            <p class="text-gray-400 leading-relaxed">
              Belajar kapan saja dan di mana saja dengan akses unlimited ke seluruh library video
            </p>
          </div>

          <div
            class="group p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div
              class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4">Kualitas Terjamin</h3>
            <p class="text-gray-400 leading-relaxed">
              Semua video telah dikurasi oleh expert dan memiliki kualitas HD dengan audio yang
              jernih
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="relative z-10 py-20 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="p-6">
            <div
              class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2"
            >
              50K+
            </div>
            <div class="text-gray-400">Video Tersedia</div>
          </div>
          <div class="p-6">
            <div
              class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
            >
              100K+
            </div>
            <div class="text-gray-400">Pengguna Aktif</div>
          </div>
          <div class="p-6">
            <div
              class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2"
            >
              4.9
            </div>
            <div class="text-gray-400">Rating Rata-rata</div>
          </div>
          <div class="p-6">
            <div
              class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2"
            >
              95%
            </div>
            <div class="text-gray-400">Tingkat Kepuasan</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

//

<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.logo-font {
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  -webkit-text-stroke: 0.5px black;
  color: white;
}

.btn-toggle {
  padding: 10px 30px;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 30px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
}

.btn-toggle:hover {
  background-color: white;
  color: #333;
}

.btn-toggle:nth-child(1) {
  margin-right: 10px;
}
</style>
