import { getUserFromToken } from '@/utils/auth'

export default function guest(to, from, next) {
  const user = getUserFromToken()
  if (user) {
    return next({ name: 'Videos' })
  }
  next()
}
