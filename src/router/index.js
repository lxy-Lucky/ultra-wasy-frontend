import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"
import {staticRouter, errorRouter} from '@/router/modules/staticRouter'
import {loadDynamicRoutes} from "@/router/modules/dynamicRouter"
import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config"
import NProgress from "@/config/nprogress"

// 解决重复点击路由时产生的错误
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location) {
    return originalPush.call(this, location).catch(() => {
    })
}

Vue.use(VueRouter)

const routes = [
    ...staticRouter,
    ...errorRouter
]

const router = new VueRouter({
    routes
})

router.beforeEach(async (to, from, next) => {

    // NProgress 开始
    NProgress.start()

    // 动态设置标题
    const title = process.env.VUE_APP_TITLE
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

    // 判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
    if (to.path.toLocaleLowerCase() === LOGIN_URL) {
        if (store.getters['user/token']) return next(from.fullPath)
        resetRouter()
        return next()
    }

    // 判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (ROUTER_WHITE_LIST.includes(to.path)) return next()

    // 判断是否有 Token，没有重定向到 login 页面
    // if (!store.getters['user/token']) return next({ path: LOGIN_URL, replace: true })

    // 检查是否已经加载了动态路由
    if (!store.getters['auth/authMenuListGet'].length) {
        await loadDynamicRoutes() // 加载动态路由
        next({...to, replace: true}) // 重新跳转当前页面
    }

    // 存储 routerName 做按钮权限筛选
    await store.dispatch('auth/setRouteName', to.name)

    next() // 正常跳转

})

// 重置路由
export const resetRouter = () => {
    store.getters['auth/flatMenuListGet'].forEach(route => {
        const { name } = route
        if (name && router.getRoutes().some(route => route.name === name)) {
            router.removeRoute(name)
        }
    })
}


// 路由跳转完成
router.afterEach(() => {
    NProgress.done()
})

// 处理路由错误
router.onError(error => {
    NProgress.done()
    console.warn("路由错误", error.message)
})

export default router
