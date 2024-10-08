import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 动态导入 modules 文件夹下的所有 .js 文件
const modulesFiles = require.context('./modules', true, /\.js$/)

// 使用 reduce 方法构建 modules 对象
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // 获取模块名称（文件名去掉扩展名）
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    // 获取模块的内容
    const value = modulesFiles(modulePath)
    // 将模块内容存储到 modules 对象中，使用模块名称作为键
    modules[moduleName] = value[moduleName + 'Store'];
    // 返回累积的 modules 对象
    return modules;

}, {})

// 创建并导出 Vuex Store 实例
export default new Vuex.Store({
    modules // 将动态加载的模块传入 Store
})
