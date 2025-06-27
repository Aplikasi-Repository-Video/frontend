<template>
  <div
    class="bg-[url('../assets/background.png')] bg-cover bg-center min-h-screen text-white flex flex-col items-center justify-center p-6"
  >
    <div class="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6">
      <div class="flex items-center space-x-2 text-2xl font-bold text-white">
        <img src="../assets/logo.png" alt="Logo" class="w-10 h-10" />
        <span class="logo-font">EduVid</span>
      </div>
      <div class="flex space-x-4">
        <button class="btn-toggle">
          <a href="/login">Masuk</a>
        </button>
      </div>
    </div>

    <div class="text-center mt-16">
      <p class="text-sm text-blue-400 font-semibold">MULAI HARIMU</p>
      <h1 class="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">
        Dapatkan Inspirasi Lebih <br />
        Belajar dari Video Edukasi Terbaik
      </h1>
      <p class="mt-4 text-gray-300 max-w-md mx-auto text-sm">
        Semua yang kamu butuhkan untuk memperluas pengetahuan dan belajar dari mana saja, kapan
        saja.
      </p>
      <button
        class="mt-6 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white font-semibold"
      >
        <a href="/videos">Mulai Sekarang</a>
      </button>
    </div>

    <div class="mt-12 relative rounded-3xl overflow-hidden shadow-2xl">
      <img src="../assets/test.jpg" alt="Preview" class="w-full max-w-4xl rounded-3xl" />
      <div class="absolute inset-0 flex items-center justify-center">
        <button
          class="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-indigo-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

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
