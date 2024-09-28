import request from '@/utils/request'

/**
 * 登录模块
 * @param data
 */
export function loginApi(data) {
    return request({
        url: "/login",
        data: data,
        method: "POST",
    })
}

/**
 * 获取菜单列表
 * @returns {*}
 */
export function getAuthMenuListApi() {
    return request({
        url: "/json/authMenuList.json",
        method: "GET",
    })
}

/**
 * 获取按钮权限
 * @returns {*}
 */
export function getAuthButtonListApi() {
    return request({
        url: "/json/authButtonList.json",
        method: "GET",
    })
}

/**
 * 退出登录
 * @returns {*}
 */
export function logoutApi() {
    return request({
        url: "/logout",
        method: "POST",
    })
}