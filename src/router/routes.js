import LandingPage from '@/pages/LandingPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import VideosPage from '@/pages/video/VideoPage.vue'
import VideoDetail from '@/pages/video/VideoDetailPage.vue'
import HistoryPage from '@/pages/video/VideoHistoryPage.vue'
import ManageVideoPage from '@/pages/admin/ManageVideoPage.vue'
import VideoFavoritePage from '@/pages/video/VideoFavoritePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import ManageUserPage from '@/pages/admin/ManageUserPage.vue'
import ManageCommentPage from '@/pages/admin/ManageCommentPage.vue'
import UploadVideoPage from '@/pages/admin/UploadVideoPage.vue'
import EditVideoPage from '@/pages/admin/EditVideoPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { middleware: 'guest' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { middleware: 'guest' },
  },
  {
    path: '/videos',
    name: 'Videos',
    component: VideosPage,
  },
  {
    path: '/videos/watch/:id',
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
    path: '/favorites/watch/:id',
    name: 'FavoriteWatch',
    component: VideoDetail,
  },
  {
    path: '/videos/search',
    name: 'Search',
    component: VideosPage,
    props: (route) => ({ searchQuery: route.query.q }),
  },
  {
    path: '/admin/videos',
    name: 'ManageVideo',
    component: ManageVideoPage,
    meta: { middleware: ['auth', 'admin'] },
  },
  {
    path: '/favorite',
    name: 'Favorite',
    component: VideoFavoritePage,
    meta: { middleware: 'auth' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { middleware: 'auth' },
  },
  {
    path: '/admin/users',
    name: 'ManageUser',
    component: ManageUserPage,
    meta: { middleware: ['auth', 'admin'] },
  },
  {
    path: '/admin/comments',
    name: 'ManageComment',
    component: ManageCommentPage,
    meta: { middleware: ['auth', 'admin'] },
  },
  {
    path: '/admin/videos/upload',
    name: 'UploadVideo',
    component: UploadVideoPage,
    meta: { middleware: ['auth', 'admin'] },
  },
  {
    path: '/admin/videos/:id/edit',
    name: 'EditVideo',
    component: EditVideoPage,
    meta: { middleware: ['auth', 'admin'] },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { middleware: ['auth', 'admin'] },
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: NotFoundPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
]
