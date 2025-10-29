import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 👈 importante para que las rutas funcionen bien en producción (Vercel o Netlify)
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173, // puedes cambiar el puerto si lo deseas
  },
})
