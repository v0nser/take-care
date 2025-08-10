import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Multi-instance Vite Config for testing different user roles
// This config allows running multiple instances of the same app
export default defineConfig(({ command, mode }) => {
  // Get instance ID from command line args or environment
  const instanceId = process.env.INSTANCE_ID || 'default'
  const port = process.env.PORT || 5173
  
  console.log(`🚀 Starting TakeCare instance: ${instanceId} on port ${port}`)
  
  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseInt(port),
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    define: {
      global: 'globalThis',
      // Make instance ID available to the app
      __INSTANCE_ID__: JSON.stringify(instanceId),
      __PORT__: JSON.stringify(port),
    },
    // Add instance-specific build output
    build: {
      outDir: `dist-${instanceId}`,
      rollupOptions: {
        output: {
          entryFileNames: `[name]-${instanceId}.js`,
          chunkFileNames: `[name]-${instanceId}.js`,
          assetFileNames: `[name]-${instanceId}.[ext]`
        }
      }
    }
  }
}) 