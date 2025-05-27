<template>
  <nav class="flex flex-col h-full gap-2">
    <router-link
      v-for="item in menus"
      :key="item.name"
      :to="item.path"
      :class="[
        'flex items-center py-2 rounded-lg transition-all duration-200',
        isOpen ? 'flex-row gap-2 px-4 justify-start' : 'flex-col justify-center w-full text-xs',
        isOpen
          ? isActive(item.path)
            ? 'bg-[#5D4B9C] text-white'
            : 'hover:bg-[#3f365e]'
          : isActive(item.path)
            ? 'text-purple-400'
            : 'text-white hover:text-purple-300',
      ]"
    >
      <span class="material-icons" :class="[isOpen ? 'text-xl' : 'text-2xl']">
        {{ item.icon }}
      </span>
      <span v-if="isOpen" class="whitespace-nowrap">{{ item.name }}</span>
      <span v-else class="text-center mt-1">{{ item.name }}</span>
    </router-link>

    <div>
      <div class="my-2 border-t border-gray-600"></div>
      <button
        v-if="isLoggedIn"
        @click="confirmLogout"
        class="relative z-10 flex items-center py-2 rounded-lg w-full text-left transition-all duration-200"
        :class="[
          isOpen ? 'gap-2 px-4 justify-start' : 'justify-center w-full',
          'hover:bg-[#3f365e]',
        ]"
      >
        <span class="material-icons" :class="isOpen ? 'text-xl' : 'text-lg'">logout</span>
        <span v-if="isOpen">Logout</span>
      </button>

      <router-link
        v-else
        to="/login"
        class="flex items-center py-2 rounded-lg w-full text-left transition-all duration-200"
        :class="[
          isOpen ? 'gap-2 px-4 justify-start' : 'justify-center w-full',
          'hover:bg-[#3f365e]',
        ]"
      >
        <span class="material-icons" :class="isOpen ? 'text-xl' : 'text-lg'">login</span>
        <span v-if="isOpen">Login</span>
      </router-link>
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
      confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
      cancelButton: 'bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ml-2',
    },
  })

  if (result.isConfirmed) {
    localStorage.removeItem('token', 'role')
    router.push('/login')
  }
}
</script>
