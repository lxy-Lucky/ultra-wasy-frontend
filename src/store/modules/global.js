import {DEFAULT_PRIMARY} from "@/config";

export const globalStore = {
    namespaced: true, // 启用命名空间，方便在组件中使用
    state: {
        // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
        layout: "classic",
        // element 组件大小
        assemblySize: "default",
        // 当前系统语言
        language: null,
        // 当前页面是否全屏
        maximize: false,
        // 主题颜色
        primary: DEFAULT_PRIMARY,
        // 深色模式
        isDark: false,
        // 灰色模式
        isGrey: false,
        // 色弱模式
        isWeak: false,
        // 侧边栏反转
        asideInverted: false,
        // 头部反转
        headerInverted: false,
        // 折叠菜单
        isCollapse: false,
        // 菜单手风琴
        accordion: true,
        // 页面水印
        watermark: false,
        // 面包屑导航
        breadcrumb: true,
        // 面包屑导航图标
        breadcrumbIcon: true,
        // 标签页
        tabs: true,
        // 标签页图标
        tabsIcon: true,
        // 页脚
        footer: true,
    },

    mutations: {
        setGlobalState(state, {key, value}) {
            state[key] = value;
        },
    },

    actions: {
        updateGlobalState({commit}, payload) {
            commit('setGlobalState', payload);
        },
    },

    getters: {
        getLayout: state => state.layout,
        getAssemblySize: state => state.assemblySize,
        getLanguage: state => state.language,
        isMaximized: state => state.maximize,
        getPrimaryColor: state => state.primary,
        isDarkMode: state => state.isDark,
        isGreyMode: state => state.isGrey,
        isWeakMode: state => state.isWeak,
        isAsideInverted: state => state.asideInverted,
        isHeaderInverted: state => state.headerInverted,
        isCollapse: state => state.isCollapse,
        isAccordion: state => state.accordion,
        hasWatermark: state => state.watermark,
        hasBreadcrumb: state => state.breadcrumb,
        hasBreadcrumbIcon: state => state.breadcrumbIcon,
        hasTabs: state => state.tabs,
        hasTabsIcon: state => state.tabsIcon,
        hasFooter: state => state.footer
    }
}
