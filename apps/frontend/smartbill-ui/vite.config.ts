import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    // basicSsl(),
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module' // <--- Penting buat Vite versi baru
      },
      manifest: {
        name: 'SmartBill',
        short_name: 'SmartBill',
        description: 'Aplikasi AI Split Bill',
        theme_color: '#ffffff',
        background_color: '#ffffff', // <--- Wajib ada
        display: 'standalone',       // <--- INI KUNCI BIAR JADI APLIKASI
        start_url: '/',              // <--- Wajib ngasih tau mulai dari mana
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  preview: {
    allowedHosts: [
      'mounted-pulling-scenic-specials.trycloudflare.com'
    ]
  },
  server: {
    allowedHosts: [
      'setup-olympics-barcelona-consultants.trycloudflare.com'
    ]
  }
})