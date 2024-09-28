import axios from 'axios'

// 创建一个 Axios 实例，配置基础 URL、超时时间和默认请求头
const service = axios.create({
    // 基础 API 地址，从环境变量中读取，若未定义则使用默认的 '/api'
    // baseURL: process.env.VUE_APP_BASE_API || '/api',
    // 请求超时时间设置为 5000 毫秒
    timeout: 5000,
    headers: {
        // 设置默认的内容类型为 JSON，使用 UTF-8 编码
        'Content-Type': 'application/json;charset=UTF-8',
    }
})

// 请求拦截器，用于在请求发送前对请求进行处理
service.interceptors.request.use(
    config => {
        // 禁用缓存，确保每次请求都是最新的
        config.headers['Cache-Control'] = 'no-cache'
        // 标识该请求是通过 XMLHttpRequest 发起的
        config.headers['X-Requested-With'] = 'XMLHttpRequest'

        // 从本地存储中获取 token
        const token = localStorage.getItem('token')
        if (token) {
            // 如果存在 token，则在请求头中添加 Authorization 字段
            config.headers['Authorization'] = `Bearer ${token}`
        }

        // 如果请求方法是 GET，则添加一个时间戳参数，防止缓存
        if (config.method === 'GET') {
            config.params = config.params || {}
            config.params.t = new Date().getTime()
        }

        // 返回配置好的请求
        return config
    },
    error => {
        // 如果请求出错，直接拒绝 Promise，并返回错误
        return Promise.reject(error)
    }
)

// 响应拦截器，用于在响应到达前对响应进行处理
service.interceptors.response.use(
    response => {
        // 获取响应数据
        const res = response.data
        // 根据业务逻辑判断响应是否成功
        if (res.code === 'success' || res.code === '200' || res.code !== '0') {
            // 如果成功，返回响应数据
            return response.data
        } else {
            // 如果失败，拒绝 Promise，并返回错误信息
            return Promise.reject(res.statusText || 'Error!')
        }
    },
    error => {
        let data = {}
        // 根据 HTTP 状态码处理不同的错误情况
        if (error.response.status === 401 || error.response.status === 504) {
            // 如果未授权或网关超时，重定向到登录页面，并附加随机数防止缓存
            location.href = "#/login" + Math.floor(Math.random() * 1000)
            return Promise.reject(data)
        } else if (error.response.status === 400 || error.response.status === 500) {
            // 如果请求错误或服务器内部错误，拒绝 Promise 并返回错误数据
            return Promise.reject(error.response.data)
        } else {
            // 其他错误，直接拒绝 Promise 并返回整个错误对象
            return Promise.reject(error)
        }
    }
)

/**
 * 下载文件的通用函数
 * @param {Function} requestFunction - 发起请求的函数，通过 Axios 实例调用
 * @param {Object} params - 请求参数
 * @param {String} tempName - 下载文件的临时名称
 * @param {String} fileType - 文件类型或扩展名
 * @returns {Promise} - 返回一个 Promise，表示下载操作的完成状态
 */
export function downloadFile(requestFunction, params, tempName, fileType) {
    return new Promise((resolve, reject) => {
        // 调用请求函数，并传入参数
        requestFunction(params)
            .then(response => {
                // 创建一个 Blob 对象，包含响应的数据
                const blob = new Blob([response.data],
                    {type: response.headers['content-type'] || 'application/octet-stream'}); // 确保设置正确的 MIME 类型

                // 生成一个下载链接的 URL
                const downloadUrl = window.URL.createObjectURL(blob);

                // 创建一个隐藏的 <a> 元素，用于触发下载
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = downloadUrl;

                // 设置下载文件的名称，包含文件类型后缀
                link.setAttribute('download', `${tempName}.${fileType}`);
                document.body.appendChild(link);

                // 触发点击事件，开始下载
                link.click();

                // 下载完成后，移除 <a> 元素
                document.body.removeChild(link);

                // 释放创建的 URL 对象，释放内存
                window.URL.revokeObjectURL(downloadUrl);

                // 解析 Promise，表示下载成功
                resolve();
            })
            .catch(error => {
                // 如果下载过程中出错，输出错误信息到控制台
                console.error('下载文件时出错:', error);
                // 拒绝 Promise，并返回错误
                reject(error);
            });
    });
}

export default service // 导出 Axios 实例
