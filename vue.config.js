const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    // proxy: {
    //     '/api': {
    //         target: '',
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/api': ''
    //         }
    //     }
    // }
  }
})
