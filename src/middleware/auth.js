import { useAuthStore } from '@/stores/auth'

export default function auth(to, from, next) {
  const store = useAuthStore()
  if (!store.isLoggedIn) {
    return next({ name: 'Login' })
  }
  next()
}
