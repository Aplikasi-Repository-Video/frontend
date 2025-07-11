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
        <p class="text-sm text-cyan-400 font-semibold text-center mb-1">Gabung Sekarang</p>
        <h1 class="text-3xl font-bold text-primary text-center mb-6">Lihat Koleksi Video</h1>

        <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-2xl shadow-2xl space-y-4">
          <!-- Nama -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama</label>
            <input
              v-model="name"
              required
              type="text"
              placeholder="Nama Lengkap"
              class="mt-1 w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <!-- Email -->
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

          <!-- Password -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Kata Sandi"
              class="mt-1 w-full px-4 py-2 pr-12 border rounded-full focus:outline-none"
              :class="
                isPasswordTooShort
                  ? 'border-red-500 ring-red-300 ring-2'
                  : 'focus:ring-2 focus:ring-blue-400'
              "
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-[35px] text-muted hover:text-gray-700"
            >
              <component :is="showPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
            <p v-if="isPasswordTooShort" class="text-sm text-red-500 mt-1">Minimal 6 karakter</p>
          </div>

          <!-- Konfirmasi Password -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Konfirmasi Kata Sandi"
              class="mt-1 w-full px-4 py-2 pr-12 border rounded-full focus:outline-none"
              :class="
                isPasswordMismatch
                  ? 'border-red-500 ring-red-300 ring-2'
                  : isPasswordMatch
                    ? 'border-green-500 ring-green-300 ring-2'
                    : 'focus:ring-2 focus:ring-blue-400'
              "
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-[35px] text-muted hover:text-gray-700"
            >
              <component :is="showConfirmPassword ? EyeOff : Eye" class="w-5 h-5" />
            </button>
            <p v-if="isPasswordMismatch" class="text-sm text-red-500 mt-1">
              Kata Sandi tidak cocok
            </p>
            <p v-else-if="isPasswordMatch" class="text-sm text-green-500 mt-1">Kata Sandi cocok</p>
          </div>

          <!-- Tombol Submit -->
          <button
            type="submit"
            :disabled="isFormInvalid"
            class="w-full py-2 rounded-full bg-indigo-600 text-primary font-semibold transition"
            :class="{
              'opacity-60 cursor-not-allowed': isFormInvalid,
              'hover:bg-indigo-700': !isFormInvalid,
            }"
          >
            {{ isSubmitting ? 'Mendaftarkan...' : 'Lanjutkan' }}
          </button>

          <p class="text-sm text-muted text-center">
            Sudah punya akun?
            <a href="/login" class="text-indigo-600 font-semibold">Masuk</a>
          </p>
        </form>
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

const bgUrl = new URL('@/assets/background.png', import.meta.url).href

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
    !email.value.trim(),
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
    toast.success('Registrasi berhasil! 🎉')

    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    showPassword.value = false
    showConfirmPassword.value = false

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (err) {
    const message = err.response?.data?.message || 'Registrasi gagal.'
    toast.error(message)
  } finally {
    isSubmitting.value = false
  }
}
</script>
