<template>
  <div class="min-h-screen flex">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"></div>
      <div class="absolute inset-0 bg-black bg-opacity-20"></div>

      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400 bg-opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div class="relative z-10 flex flex-col justify-center items-start p-12 text-white">
        <div class="mb-8">
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold mb-4 leading-tight">
            Bergabung dengan Komunitas
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Belajar</span>
          </h1>
          <p class="text-lg text-gray-200 mb-8 leading-relaxed">
            Mulai perjalanan belajar Anda hari ini! Akses ribuan video edukatif berkualitas tinggi dan bergabung dengan komunitas pembelajar yang passionate.
          </p>
        </div>

        <div class="space-y-4 w-full max-w-sm">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-sm text-gray-200">Akses unlimited ke semua video</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-sm text-gray-200">Sertifikat completion</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span class="text-sm text-gray-200">Komunitas support 24/7</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
          <p class="text-gray-600">Mulai perjalanan belajar Anda sekarang</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                v-model="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 bg-white"
                required
              />
            </div>
          </div>

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
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 bg-white"
                required
              />
            </div>
          </div>

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
                placeholder="Minimal 6 karakter"
                :class="[
                  'w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none transition duration-200 bg-white',
                  isPasswordTooShort
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                ]"
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
            <p v-if="isPasswordTooShort" class="text-sm text-red-500 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              Password minimal 6 karakter
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Konfirmasi Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Ulangi password"
                :class="[
                  'w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none transition duration-200 bg-white',
                  isPasswordMismatch
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : isPasswordMatch
                      ? 'border-green-500 focus:ring-2 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                ]"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                <component :is="showConfirmPassword ? EyeOff : Eye" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="isPasswordMismatch" class="text-sm text-red-500 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Password tidak cocok
            </p>
            <p v-else-if="isPasswordMatch" class="text-sm text-green-500 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Password cocok
            </p>
          </div>

          <button
            type="submit"
            :disabled="isFormInvalid"
            :class="[
              'w-full py-3 px-4 font-semibold rounded-xl shadow-lg transform transition-all duration-200',
              isFormInvalid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:shadow-xl hover:scale-[1.02]'
            ]"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mendaftarkan...
            </span>
            <span v-else>Buat Akun</span>
          </button>
        </form>

        <p class="mt-8 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/login" class="font-semibold text-emerald-600 hover:text-emerald-500 transition">
            Sign in
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import api from '@/services/axios'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)

const toast = useToast()
const router = useRouter()

const isPasswordTooShort = computed(() => password.value.length > 0 && password.value.length < 6)
const isPasswordMismatch = computed(
  () => confirmPassword.value.length > 0 && confirmPassword.value !== password.value,
)
const isPasswordMatch = computed(
  () => confirmPassword.value === password.value && password.value.length >= 6,
)

const isFormInvalid = computed(
  () =>
    isSubmitting.value ||
    isPasswordTooShort.value ||
    isPasswordMismatch.value ||
    !name.value.trim() ||
    !email.value.trim() ||
    !password.value ||
    !confirmPassword.value
)

const handleSubmit = async () => {
  if (isFormInvalid.value) return

  const payload = {
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
    confirm_password: confirmPassword.value,
  }

  try {
    isSubmitting.value = true
    await api.post('/register', payload)

    toast.success('🎉 Akun berhasil dibuat! Selamat datang di EduVid')

    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    showPassword.value = false
    showConfirmPassword.value = false

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err) {
    const message = err.response?.data?.error || 'Terjadi kesalahan saat mendaftar'
    toast.error(`Registrasi gagal: ${message}`)
  } finally {
    isSubmitting.value = false
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
