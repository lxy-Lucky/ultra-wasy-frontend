import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((mode) => {

    const _a = loadEnv(mode, process.cwd()),
        VITE_PORT = _a.VITE_PORT, VITE_OPEN = _a.VITE_OPEN, VITE_BASE_PATH = _a.VITE_BASE_PATH,
        VITE_OUT_DIR = _a.VITE_OUT_DIR, VITE_PROXY_URL = _a.VITE_PROXY_URL;

    const alias = {
        '@': fileURLToPath(new URL('./src', import.meta.url))
    };

    let proxy = {};
    if (VITE_PROXY_URL) {
        proxy = {
            '/doLogin': {
                target: VITE_PROXY_URL,
                changeOrigin: true,
            },
            '/verifyCode': {
                target: VITE_PROXY_URL,
                changeOrigin: true,
            },
        };
    }


    return {
        plugins: [vue()],
        root: process.cwd(),
        base: VITE_BASE_PATH,
        resolve: { alias },
        server: {
            host: '0.0.0.0',
            port: VITE_PORT,
            open: VITE_OPEN,
            proxy: proxy
        },
        build: {
            cssCodeSplit: false,
            sourcemap: false,
            outDir: VITE_OUT_DIR,
            emptyOutDir: true,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        // 分包配置，配置完成自动按需加载
                        vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', 'element-plus'],
                        echarts: ['echarts'],
                    },
                },
            },
        },
    }
})
