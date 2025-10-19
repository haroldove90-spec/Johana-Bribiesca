import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Use an empty string for envDir to avoid a TypeScript type error with 'process.cwd()'.
  // Vite's 'loadEnv' resolves this to the current working directory.
  const env = loadEnv(mode, '', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
