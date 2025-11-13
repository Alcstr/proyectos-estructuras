import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
=======
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
>>>>>>> 022c6481d8ca54b3677cc95f30c93e7af7868f6b
})
