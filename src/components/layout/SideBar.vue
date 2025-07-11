<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-primary text-primary p-4 transition-all duration-300 z-50',
      isOpen ? 'w-64' : 'w-16',
    ]"
    style="box-sizing: border-box"
  >
    <SideBarLogo :isOpen="isOpen" :toggleSidebar="toggleSidebar" />
    <SideBarMenu :menus="menus" :logoutMenu="logoutMenu" :isOpen="isOpen" :isActive="isActive" />
  </aside>

  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="toggleSidebar"
  ></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBarLogo from '../SidebarLogo.vue'
import SideBarMenu from '../SidebarMenu.vue'

const route = useRoute()
const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const token = localStorage.getItem('token') || ''
let role = null

if (token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]))
    role = decodedToken.role
  } catch (e) {
    console.warn('Token tidak valid', e)
  }
}

const allMenus = [
  { name: 'Watch', icon: 'tv', path: '/videos', role: 'USER' },
  { name: 'History', icon: 'history', path: '/history', role: 'USER' },
  { name: 'Favorite', icon: 'favorite', path: '/favorite', role: 'USER' },
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', role: 'ADMIN' },
  { name: 'Video', icon: 'tv', path: '/admin/videos', role: 'ADMIN' },
  { name: 'User', icon: 'person', path: '/admin/users', role: 'ADMIN' },
  { name: 'Comment', icon: 'comment', path: '/admin/comments', role: 'ADMIN' },
]

const menus = allMenus.filter((menu) => {
  if (role === 'ADMIN') {
    return menu.role === 'ADMIN'
  } else {
    return !menu.role || menu.role === 'USER'
  }
})

const logoutMenu = { name: 'Logout', icon: 'logout', path: '/videos' }

const routePrefixes = {
  '/videos': ['/videos', '/search'],
  '/history': ['/history'],
  '/favorite': ['/favorite'],
  '/admin/dashboard': ['/admin/dashboard'],
  '/admin/videos': ['/admin/videos'],
  '/admin/users': ['/admin/users'],
  '/admin/comments': ['/admin/comments'],
}

const isActive = (path) => {
  const prefixes = routePrefixes[path]
  return prefixes ? prefixes.some((prefix) => route.path.startsWith(prefix)) : route.path === path
}

watch(
  () => route.path,
  () => {
    isOpen.value = false
  }
)
</script>
