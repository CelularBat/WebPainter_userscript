import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import { imba } from 'vite-plugin-imba'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),imba()],
})
