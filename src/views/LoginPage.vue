<template>
  <div class="min-h-screen flex">
    <div class="hidden md:block md:w-[30%] relative">
      <img
        src="@/assets/hero.jpg"
        alt="Preview"
        class="w-full h-full object-cover object-[30%_100%]"
      />
      <div class="absolute inset-0 bg-black opacity-30"></div>
      <div class="absolute bottom-10 left-10 text-white max-w-sm">
        <p class="font-bold">"Belajar Jadi Lebih Mudah."</p>
        <p class="text-sm mb-3 leading-relaxed">
          Temukan materi edukatif dari pemula hingga mahir, semua dalam satu platform.
        </p>
      </div>
    </div>

    <div
      class="w-full md:w-[70%] flex items-center justify-center bg-no-repeat bg-cover bg-center p-6"
      :style="`background-image: url('${bgUrl}')`"
    >
      <div class="w-full max-w-md">
        <p class="text-sm text-cyan-400 font-semibold text-center mb-1">Mulai Harimu</p>
        <h1 class="text-3xl font-bold text-white text-center mb-6">Nonton Video Baru</h1>

        <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-2xl shadow-2xl space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Alamat Email</label>
            <input
              v-model="email"
              required
              type="email"
              placeholder="Alamat email"
              class="mt-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Kata Sandi"
              class="mt-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              <span v-if="showPassword" class="material-icons">visibility_off</span>
              <span v-else class="material-icons">visibility</span>
            </button>
          </div>

          <button
            type="submit"
            class="w-full py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Lanjutkan
          </button>

          <p class="text-center text-sm text-gray-700">
            Belum punya akun?
            <a href="/register" class="font-semibold text-indigo-600">Daftar</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const bgUrl = new URL('@/assets/background.png', import.meta.url).href

const email = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()
const showPassword = ref(false)

const handleLogin = async (e) => {
  e.preventDefault()

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
      email: email.value,
      password: password.value,
    })

    const { token, user } = res.data

    localStorage.setItem('token', token)

    toast.success(`Selamat datang`)

    if (user.role === 'ADMIN') {
      router.push('/manage')
    } else {
      router.push('/videos')
    }
  } catch (err) {
    toast.error(`Login gagal: ${err.response.data.message}`)
  }
}
</script>
