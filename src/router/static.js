const staticRoutes = [
    {
        // 用户登录页面
        path: '/',
        name: 'userLogin',
        component: () => import('@/views/frontend/login.vue')
    },

    // 管理员登录页面
    {
        path: '/admin/login',
        name: 'adminLogin',
        component: () => import('@/views/backend/login.vue'),
    },
    {
        // 首页
        path: '/index',
        name: 'index',
        component: () => import('@/views/index.vue')
    },
]

export default staticRoutes
