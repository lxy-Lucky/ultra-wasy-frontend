/**
 * @description 递归扁平化菜单，方便动态路由
 * @param {Array} menuList - 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList) {
    const newMenuList = JSON.parse(JSON.stringify(menuList));
    return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
}

/**
 * @description 递归过滤出需要渲染的菜单项（剔除 isHide == true 的菜单）
 * @param {Array} menuList - 菜单列表
 * @returns {Array}
 */
export function getShowMenuList(menuList) {
    const newMenuList = JSON.parse(JSON.stringify(menuList));
    return newMenuList.filter(item => {
        item.children = item.children ? getShowMenuList(item.children) : [];
        return !item.meta?.isHide;
    });
}

/**
 * @description 递归构建面包屑导航，存储在 Vuex/Pinia 中
 * @param {Array} menuList - 菜单列表
 * @param {Array} parent - 父级菜单
 * @param {Object} result - 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList, parent = [], result = {}) => {
    for (const item of menuList) {
        result[item.path] = [...parent, item];
        if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
    }
    return result;
};