import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
	threePlatformAdapter(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
