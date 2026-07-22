/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',   // 模拟浏览器环境（因为代码里有 DOM 操作）
    globals: true,           // 让 test/expect 等函数全局可用，不用每个文件都 import
  },
})
