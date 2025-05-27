<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-[#0f0b1d] text-white p-4 transition-all duration-300 z-50',
      isOpen ? 'w-64' : 'w-16',
    ]"
    style="box-sizing: border-box"
  >
    <SideBarLogo :isOpen="isOpen" :toggleSidebar="toggleSidebar" />
    <SideBarMenu :menus="menus" :logoutMenu="logoutMenu" :isOpen="isOpen" :isActive="isActive" />
  </aside>

  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="toggleSidebar"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBarLogo from './SidebarLogo.vue'
import SideBarMenu from './SidebarMenu.vue'

const route = useRoute()
const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const token = localStorage.getItem('token') || ''
let role = null

if (token) {
  const decodedToken = JSON.parse(atob(token.split('.')[1]))
  role = decodedToken.role
}

const allMenus = [
  { name: 'Watch', icon: 'tv', path: '/videos' },
  { name: 'History', icon: 'history', path: '/history' },
  { name: 'Manage', icon: 'dashboard', path: '/manage', role: 'ADMIN' },
  { name: 'Favorite', icon: 'favorite', path: '/favorite' },
]

const menus = allMenus.filter((menu) => {
  if (!menu.role) return true
  return menu.role === role
})

const logoutMenu = { name: 'Logout', icon: 'logout', path: '/videos' }

const isActive = (path) => {
  if (path === '/videos') {
    return route.path.startsWith('/videos') || route.path.startsWith('/search')
  } else if (path === '/history') {
    return route.path.startsWith('/history')
  }
  return route.path === path
}

watch(
  () => route.path,
  () => {
    isOpen.value = false
  },
)
</script>
