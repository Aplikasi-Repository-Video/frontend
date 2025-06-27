import { getUserFromToken } from '@/utils/auth'

export default function admin(to, from, next) {
  const user = getUserFromToken()
  if (!user || user.role !== 'ADMIN') {
    return next({ name: 'ManageVideo' })
  }
  next()
}
