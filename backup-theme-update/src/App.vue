<template>
  <div>
    <Sidebar v-if="!hideSidebar" />

    <main
      class="relative z-0 transition-all duration-300"
      :class="{
        'ml-10': !hideSidebar,
      }"
    >
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/SideBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
auth.refreshFromToken()

const route = useRoute()
const hideSidebar = computed(() => ['/', '/login', '/register'].includes(route.path))
</script>
