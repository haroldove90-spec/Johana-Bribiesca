import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use a type assertion to bypass a TypeScript error with `process.cwd()`.
  // The previous `import 'process'` was causing an issue by loading a browser polyfill
  // in a Node.js context, which prevented environment variables from loading correctly.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
