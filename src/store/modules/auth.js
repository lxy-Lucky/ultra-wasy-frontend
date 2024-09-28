import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/systemMenuApi/login"
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils"

export const authStore = {
    namespaced: true,
    state: {
        // 按钮权限列表
        authButtonList: {},
        // 菜单权限列表
        authMenuList: [],
        // 当前页面的 router name，用来做按钮权限筛选
        routeName: ""
    },

    getters: {
        // 按钮权限列表
        authButtonListGet: state => state.authButtonList,
        // 菜单权限列表 ==> 这里的菜单没有经过任何处理
        authMenuListGet: state => state.authMenuList,
        // 菜单权限列表 ==> 左侧菜单栏渲染，需要删除 isHide == true
        showMenuListGet: state => getShowMenuList(state.authMenuList),
        // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
        flatMenuListGet: state => getFlatMenuList(state.authMenuList),
        // 递归处理后的所有面包屑导航列表
        breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
    },

    actions: {
        // Get AuthButtonList
        async getAuthButtonList({ commit }) {
            const { data } = await getAuthButtonListApi();
            commit('SET_AUTH_BUTTON_LIST', data);
        },
        // Get AuthMenuList
        async getAuthMenuList({ commit }) {
            const { data } = await getAuthMenuListApi();
            commit('SET_AUTH_MENU_LIST', data);
        },
        // Set RouteName
        setRouteName({ commit }, name) {
            commit('SET_ROUTE_NAME', name);
        }
    },

    mutations: {
        // 设置按钮权限列表
        SET_AUTH_BUTTON_LIST(state, authButtonList) {
            state.authButtonList = authButtonList;
        },
        // 设置菜单权限列表
        SET_AUTH_MENU_LIST(state, authMenuList) {
            state.authMenuList = authMenuList;
        },
        // 设置当前页面路由名称
        SET_ROUTE_NAME(state, routeName) {
            state.routeName = routeName;
        }
    }
};
