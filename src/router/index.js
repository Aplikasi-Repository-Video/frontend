import { createRouter, createWebHistory } from 'vue-router'
import { getUserFromToken } from '@/util/auth'

import LandingPage from '@/views/LandingPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import VideosPage from '@/views/VideoPage.vue'
import VideoDetail from '@/views/VideoDetailPage.vue'
import HistoryPage from '@/views/VideoHistoryPage.vue'
import ManageVideoPage from '@/views/ManageVideoPage.vue'
import VideoFavoritePage from '@/views/VideoFavoritePage.vue'
import ProfilePage from '@/views/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/videos',
    name: 'Videos',
    component: VideosPage,
  },
  {
    path: '/videos/:id',
    name: 'VideoDetail',
    component: VideoDetail,
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryPage,
  },
  {
    path: '/history/watch/:id',
    name: 'WatchVideoHistory',
    component: VideoDetail,
  },
  {
    path: '/search',
    name: 'Search',
    component: VideosPage,
    props: (route) => ({ searchQuery: route.query.q }),
  },
  {
    path: '/manage',
    name: 'Manage',
    component: ManageVideoPage,
    beforeEnter: (to, from, next) => {
      const user = getUserFromToken()
      if (user?.role !== 'ADMIN') {
        next({ name: 'Videos' })
      }
      next()
    },
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: VideoFavoritePage,
  },
  {
    path: '/profile',
    name: { name: 'Profile' },
    component: ProfilePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
