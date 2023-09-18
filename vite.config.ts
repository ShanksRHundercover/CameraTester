import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), preact()],
})
