import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

// 🧩 Import semua middleware dari src/middleware
import auth from '@/middleware/auth'
import admin from '@/middleware/admin'
import guest from '@/middleware/guest'

// 🗺️ Mapping nama middleware ke fungsi
const middlewareMap = {
  auth,
  admin,
  guest,
}

// 🚦 Global middleware handler
const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const middlewares = to.meta.middleware
  if (!middlewares) return next()

  const stack = Array.isArray(middlewares) ? middlewares : [middlewares]

  const run = (i) => {
    const name = stack[i]
    const middlewareFn = middlewareMap[name]

    if (!middlewareFn) return run(i + 1) // skip jika tidak ada

    middlewareFn(to, from, (result) => {
      if (result !== undefined) return next(result)
      if (i + 1 < stack.length) run(i + 1)
      else next()
    })
  }

  run(0)
})

export default router
