import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/main.css'
import { createPinia } from 'pinia'
import { useTheme } from './composables/useTheme'
const { initTheme } = useTheme()
initTheme()
const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .use(Toast, {
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
  })

  .mount('#app')
