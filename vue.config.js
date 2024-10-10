const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    proxy: {
        [process.env.VITE_API_URL]: {
            target: 'https://mock.mengxuegu.com/mock/670776cfa852137b3c4a2ff3/ultra',
            changeOrigin: true,
            pathRewrite: {
                ['^' + process.env.VITE_API_URL]: ''
            }
        }
    }
  }
})
