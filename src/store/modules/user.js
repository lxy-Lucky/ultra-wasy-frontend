export const userStore = {

    namespaced: true, // 启用命名空间，方便在组件中使用
    state: {
        token: localStorage.getItem('token') || null, // 用户的认证令牌
        userInfo: { name: "Wa-sy" } // 用户信息，初始名字为 "Wa-sy"
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token; // 更新用户的认证令牌
            localStorage.setItem('token', token); // 保存 token 到 localStorage
        },
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo; // 更新用户信息
        },
    },

    actions: {
        setToken({ commit }, token) {
            commit("SET_TOKEN", token); // 提交更改认证令牌的突变

        },
        setUserInfo({ commit }, userInfo) {
            commit("SET_USER_INFO", userInfo); // 提交更改用户信息的突变
        },
    },

    getters: {
        token: (state) => state.token, // 获取用户的认证令牌
        userInfo: (state) => state.userInfo, // 获取用户信息
    }
}
