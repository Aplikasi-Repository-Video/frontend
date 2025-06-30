import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

const ngrokHost = '4e9e-103-47-133-69.ngrok-free.app'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0', // agar bisa diakses dari IP LAN (misal HP)
    port: 5173,       // opsional, bisa ganti kalau bentrok
    allowedHosts: [ngrokHost], // 🔥 Tambahkan ini!

  }
})
