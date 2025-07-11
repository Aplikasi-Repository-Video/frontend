<template>
  <div class="min-h-screen flex">
    <div class="hidden md:block md:w-[30%] relative">
      <img
        src="@/assets/hero.jpg"
        alt="Preview"
        class="w-full h-full object-cover object-[30%_100%]"
      />
      <div class="absolute inset-0 bg-primary opacity-30"></div>
      <div class="absolute bottom-10 left-10 text-primary max-w-sm">
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
        <h1 class="text-3xl font-bold text-primary text-center mb-6">Nonton Video Baru</h1>

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
            <label class="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Kata Sandi"
              class="mt-1 w-full px-4 py-2 pr-24 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <!-- Tombol teks ditaruh DI DALAM input (absolutely positioned) -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-6 top-[35px] text-muted hover:text-gray-700"
            >
              <component
                :is="showPassword ? EyeOff : Eye"
                class="w-5 h-5"
              />
            </button>
          </div>


          <button
            type="submit"
            class="w-full py-2 rounded-full bg-indigo-600 text-primary font-semibold hover:bg-indigo-700 transition"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/services/axios'
import { jwtDecode } from 'jwt-decode'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff } from 'lucide-vue-next'


const email = ref('')
const password = ref('')
const showPassword = ref(false)

const bgUrl = new URL('@/assets/background.png', import.meta.url).href

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const handleLogin = async () => {
  try {
    const res = await axios.post('/login', {
      email: email.value,
      password: password.value,
    })

    const { token } = res.data

    // Simpan token dan decode user
    localStorage.setItem('token', token)

    const decoded = jwtDecode(token)
    auth.setUser(decoded)

    toast.success(`Selamat datang`)

    if (decoded.role === 'ADMIN') {
      router.push('/admin/videos')
    } else {
      router.push('/videos')
    }
  } catch (err) {
    const message = err.response?.data?.message || 'Terjadi kesalahan saat login'
    toast.error(`Login gagal: ${message}`)
  }
}
</script>

