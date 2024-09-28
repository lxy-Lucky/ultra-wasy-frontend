import router from '@/router'
import store from "@/store"
import {Notification} from 'element-ui'

// 获取后台路由数据并注册
export async function loadDynamicRoutes() {
    try {
        // 调用 Vuex 动作获取权限菜单列表和按钮列表
        await store.dispatch('auth/getAuthMenuList')
        await store.dispatch('auth/getAuthButtonList')

        // 如果没有获取到任何菜单权限，提示用户并重定向
        if (!store.getters['auth/authMenuListGet'].length) {
            Notification({
                title: "无权限访问", // 通知标题
                message: "当前账号无任何菜单权限，请联系系统管理员！", // 通知内容
                type: "warning", // 通知类型
                duration: 3000 // 通知持续时间
            });
            // 清空用户令牌
            await store.dispatch('user/setToken', '')
            // 重定向到登录页
            await router.replace('/login')
            // 返回拒绝的 Promise
            return Promise.reject("No permission")
        }

        // 动态注册路由
        store.getters['auth/flatMenuListGet'].forEach(item => {
            // 删除子路由
            item.children && delete item.children
            // 如果组件是字符串类型，则动态导入该组件
            if (item.component && typeof item.component == "string") {
                // 生成动态导入的函数
                item.component = loadView(item.component)
            }
            // 根据 meta.isFull 的值添加路由
            if (item.meta.isFull) {
                // 动态添加路由
                router.addRoute(item)
            } else {
                // 将路由添加到 Layout 组件下
                router.addRoute('Layout', item)
            }
        });
    } catch (error) {
        // 捕获错误，清空用户令牌并重定向到登录页
        await store.dispatch('user/setToken', '')
        // 重定向到登录页
        await router.replace('/login')
        // 返回拒绝的 Promise
        return Promise.reject(error);
    }
}

// 路由懒加载
const loadView = (view) => {
    return () => import(`@/views${ view }.vue`)
}

