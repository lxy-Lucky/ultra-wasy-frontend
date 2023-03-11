const staticRoutes = [
    {
        // 首页
        path: '/',
        name: 'home',
        component: () => import('@/views/index.vue')
    },

    // 管理员登录页面
    {
        path: '/admin/login',
        name: 'adminLogin',
        component: () => import('@/views/backend/login.vue'),
    },
]

export default staticRoutes
