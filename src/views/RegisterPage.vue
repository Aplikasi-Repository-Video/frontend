<template>
  <div class="min-h-screen flex">
    <!-- Kiri -->
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

    <!-- Kanan -->
    <div
      class="w-full md:w-[70%] flex items-center justify-center bg-no-repeat bg-cover bg-center p-6"
      :style="`background-image: url('${bgUrl}')`"
    >
      <div class="w-full max-w-md">
        <p class="text-sm text-cyan-400 font-semibold text-center mb-1">Gabung Sekarang</p>
        <h1 class="text-3xl font-bold text-white text-center mb-6">Lihat Koleksi Video</h1>

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
          <div>
            <label class="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <input
              v-model="password"
              required
              type="password"
              placeholder="Kata Sandi"
              :class="[
                'mt-1 w-full px-4 py-2 border rounded-full focus:outline-none',
                isPasswordTooShort
                  ? 'border-red-500 ring-red-300 ring-2'
                  : 'focus:ring-2 focus:ring-blue-400',
              ]"
            />
            <p v-if="isPasswordTooShort" class="text-sm text-red-500 mt-1">Minimal 6 karakter</p>
          </div>

          <!-- Konfirmasi Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
            <input
              v-model="confirmPassword"
              required
              type="password"
              placeholder="Konfirmasi Kata Sandi"
              :class="[
                'mt-1 w-full px-4 py-2 border rounded-full focus:outline-none',
                isPasswordMismatch
                  ? 'border-red-500 ring-red-300 ring-2'
                  : isPasswordMatch
                    ? 'border-green-500 ring-green-300 ring-2'
                    : 'focus:ring-2 focus:ring-blue-400',
              ]"
            />
            <p v-if="isPasswordMismatch" class="text-sm text-red-500 mt-1">Password tidak cocok</p>
            <p v-else-if="isPasswordMatch" class="text-sm text-green-500 mt-1">Password cocok</p>
          </div>

          <!-- Tombol -->
          <button
            type="submit"
            class="w-full py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Lanjutkan
          </button>

          <p class="text-sm text-gray-500 text-center">
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
import api from '@/lib/axios'

const bgUrl = new URL('@/assets/background.png', import.meta.url).href

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const toast = useToast()
const router = useRouter()

// Validasi reactive
const isPasswordTooShort = computed(() => password.value.length > 0 && password.value.length < 6)
const isPasswordMismatch = computed(
  () => confirmPassword.value.length > 0 && confirmPassword.value !== password.value,
)
const isPasswordMatch = computed(
  () =>
    confirmPassword.value.length > 0 &&
    confirmPassword.value === password.value &&
    password.value.length >= 6,
)

const handleSubmit = async () => {
  if (isPasswordTooShort.value) {
    toast.error('Password minimal 6 karakter')
    return
  }

  if (isPasswordMismatch.value) {
    toast.error('Konfirmasi password tidak cocok.')
    return
  }

  const payload = {
    name: name.value,
    email: email.value,
    password: password.value,
    confirm_password: confirmPassword.value,
  }

  try {
    await api.post('/register', payload)
    toast.success('Registrasi berhasil! 🎉', { timeout: 4000 })
    setTimeout(() => router.push('/login'), 1000)

    // Reset form
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registrasi gagal.', { timeout: 4000 })
  }
}
</script>
