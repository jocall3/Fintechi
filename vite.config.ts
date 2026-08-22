import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from the system.
  // This allows Hugging Face Spaces secrets (exposed as environment variables)
  // to be available during the build process.
  // The third parameter `''` loads all environment variables, not just those prefixed with `VITE_`.
  // FIX: Replaced `process.cwd()` with `'.'` to resolve a TypeScript type error where `cwd` was not found on the `process` object.
  // The `loadEnv` function resolves this relative path from the current working directory, maintaining the original behavior.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // The `define` option allows us to replace global variables at compile time.
    // This makes the `API_KEY` environment variable available in the client-side
    // code via `process.env.API_KEY`, as required by the coding guidelines.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})