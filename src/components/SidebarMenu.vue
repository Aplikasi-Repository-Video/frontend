<template>
  <nav class="flex flex-col h-full gap-2">
    <button
      v-for="item in menus"
      :key="item.name"
      @click="handleMenuClick(item.path)"
      :class="[
        'flex items-center py-2 rounded-lg transition-all duration-200 w-full text-left',
        isOpen ? 'flex-row gap-2 px-4 justify-start' : 'flex-col justify-center text-xs',
        isOpen
          ? isActive(item.path)
            ? 'bg-passive text-primary'
            : 'hover:bg-secondary'
          : isActive(item.path)
            ? 'text-purple-400'
            : 'text-primary hover:text-purple-300',
      ]"
    >
      <span class="material-icons" :class="[isOpen ? 'text-xl' : 'text-2xl']">
        {{ item.icon }}
      </span>
      <span v-if="isOpen" class="whitespace-nowrap">{{ item.name }}</span>
      <span v-else class="text-center mt-1">{{ item.name }}</span>
    </button>

    <div>
      <div class="my-2 border-t border-secondary"></div>

      <button
        @click="handleAuthAction"
        class="relative z-10 flex items-center py-2 rounded-lg w-full text-left transition-all duration-200"
        :class="[
          isOpen ? 'gap-2 px-4 justify-start' : 'flex-col justify-center text-xs',
          'hover:hover:text-purple-300',
        ]"
      >
        <span class="material-icons" :class="isOpen ? 'text-xl' : 'text-lg'">
          {{ isLoggedIn ? 'logout' : 'login' }}
        </span>

        <span v-if="isOpen">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </span>
        <span v-else class="text-center mt-1">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import Swal from 'sweetalert2'

defineProps(['menus', 'logoutMenu', 'isOpen', 'isActive'])

const router = useRouter()

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const confirmLogout = async () => {
  const result = await Swal.fire({
    title: 'Konfirmasi Logout',
    text: 'Yakin ingin keluar?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Logout',
    cancelButtonText: 'Batal',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'bg-red-600 text-primary px-4 py-2 rounded hover:bg-red-700',
      cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
    },
  })

  if (result.isConfirmed) {
    localStorage.removeItem('token')
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('watched_')) {
        localStorage.removeItem(key)
      }
    })

    router.push('/login')
  }
}

const handleLoginClick = async () => {
  const result = await Swal.fire({
    title: 'Butuh Login',
    text: 'Kamu belum login. Apakah ingin pergi ke halaman login?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Login',
    cancelButtonText: 'Batal',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'bg-blue-600 text-primary px-4 py-2 rounded hover:bg-blue-700',
      cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
    },
  })

  if (result.isConfirmed) {
    router.push('/login')
  }
}

const handleAuthAction = () => {
  if (isLoggedIn.value) {
    confirmLogout()
  } else {
    handleLoginClick()
  }
}

const publicPaths = ['/', '/history', '/videos']

const handleMenuClick = async (path) => {
  if (!isLoggedIn.value && !publicPaths.includes(path)) {
    const result = await Swal.fire({
      title: 'Butuh Login',
      text: 'Kamu harus login untuk mengakses halaman ini.',
      icon: 'info',
      confirmButtonText: 'Login Sekarang',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-blue-600 text-primary px-4 py-2 rounded hover:bg-blue-700',
        cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
      },
    })

    if (result.isConfirmed) {
      router.push('/login')
    }

    return
  }

  router.push(path)
}
</script>
