<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Hero Section -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700"></div>
      <div class="absolute inset-0 bg-black bg-opacity-20"></div>

      <!-- Animated Background Elements -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 bg-opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div class="relative z-10 flex flex-col justify-center items-start p-12 text-white">
        <div class="mb-8">
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold mb-4 leading-tight">
            Selamat Datang Kembali di
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">EduVid</span>
          </h1>
          <p class="text-lg text-gray-200 mb-8 leading-relaxed">
            Lanjutkan perjalanan belajar Anda dengan ribuan video edukatif berkualitas tinggi. Dari pemula hingga mahir, semua ada di sini.
          </p>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-2 gap-6 w-full max-w-sm">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400">50K+</div>
            <div class="text-sm text-gray-300">Video Tersedia</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400">100K+</div>
            <div class="text-sm text-gray-300">Siswa Aktif</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-100 to-slate-100 p-8">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun</h2>
          <p class="text-gray-600">Mulai pembelajaran Anda hari ini</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="name@example.com"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-white"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-white"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              Forgot password?
            </a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition duration-200"
          >
            Sign In
          </button>
        </form>

        <!-- Sign Up Link -->
        <p class="mt-8 text-center text-sm text-gray-600">
          Don't have an account?
          <a href="/register" class="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            Sign up for free
          </a>
        </p>
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

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
