import axios from 'axios'
import {ElLoading, ElNotification} from "element-plus"


// let tokenRefreshing = false // 是否已经发出刷新请求
// let requests = [] // token过期的api列表
const pendingMap = new Map() // 重复请求
const noHandleResponseUrlList = ['/outer/monitor/list/data', '/outer/monitor/view/data/'] // 需要屏蔽的接口数组
const loadingInstance = {target: null, count: 0} // loadingInstance实例

/*
 * 根据运行环境获取基础请求URL
 */
export const getUrl = function () {
    const value = import.meta.env.VITE_AXIOS_BASE_URL
    return value === 'getCurrentDomain' ? window.location.protocol + '//' + window.location.host : value
}

/*
 * 根据运行环境获取基础请求URL的端口
 */
export const getUrlPort = function () {
    const url = getUrl()
    return new URL(url).port
}

/*
 * 创建Axios
 * 默认开启`reduceDataFormat(简洁响应)`,返回类型为`ApiPromise`
 * 关闭`reduceDataFormat`,返回类型则为`AxiosPromise`
 */

const service = axios.create({
    baseURL: '/test/',
    timeout: 1000 * 10,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        server: true,
    },
    responseType: 'json',
})
// 自定义配置
let options = Object.assign({
    CancelDuplicateRequest: true, // 是否开启取消重复请求, 默认为 true
    loading: false, // 是否开启loading层效果, 默认为false
    reduceDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
    showErrorMessage: true, // 是否开启接口错误信息展示,默认为true
    showCodeMessage: true, // 是否开启code不为1时的信息提示, 默认为true
    showSuccessMessage: false, // 是否开启code为1时的信息提示, 默认为false
    anotherToken: '', // 当前请求使用另外的用户token
})

// 请求拦截
service.interceptors.request.use(
    config => {
        removePending(config) // 每次请求前，先检查请求是否重复了，重复了就取消上一次的请求
        options.CancelDuplicateRequest && addPending(config) // 开启了重复请求，就把请求添加到队列中
        // 创建loading实例
        if (options.loading) {
            loadingInstance.count++
            if (loadingInstance.count === 1) {
                loadingInstance.target = ElLoading.service(options.loading)
            }
        }
        // 自动携带token
        // if (config.headers) {
        //     const token = adminInfo.getToken()
        //     if (token)
        //         config.headers.batoken = token
        //     const userToken = options.anotherToken || userInfo.getToken()
        //     if (userToken)
        //         config.headers['ba-user-token'] = userToken
        // }

        //settingToken(config) // 设置token
        // 白名单处理，有些接口不携带token
        if (!whiteListNoTokenApi(config.url)) {
            delete config.headers.Authorization
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }  // 出错返回一个reject
)

// 响应拦截
service.interceptors.response.use(
    response => {
        removePending(response.config) // 请求完成之后要删除请求map中的请求key
        options.loading && closeLoading(options) // 关闭loading
        const {showCodeMessage, showErrorMessage} = options // 开启对应的功能需求
        // 针对所有失败的请求进行拦截，实际不会执行该段代码，status非200直接进行下面的error
        if (showCodeMessage && response.status !== 200) {
            return Promise.reject(response.data) // status不等于200, 页面具体逻辑就不执行了
        }
        const requestUrl = response.config.url
        let hasPath = false // 请求是成功请求，但是结果不对
        // 屏蔽的某些接口
        noHandleResponseUrlList.forEach(item => {
            if (requestUrl.includes(item)) hasPath = true
        })
        // 针对status为200，但是实际后端code报错
        if (showErrorMessage && response.status === 200 && response.data.code !== '200' && !hasPath) {
            const {code} = response.data
            // 针对token失效情况
            if (code === 401) {
                // crushLoginTips()
            } else {
                ElNotification({type: 'error', message: response.data.message})
            }
            return Promise.reject(response.data) // code不等于200, 直接页面具体逻辑就不执行了
        }
        return options.reduceDataFormat ? response.data : response // 简洁数据结构功能
    },
    error => {
        error.config && removePending(error.config) // 响应完成之后要删除请求map中的请求key
        options.loading && closeLoading(options) // 关闭loading
        options.showErrorMessage && httpErrorStatusHandle(error) // 处理错误状态码
        return Promise.reject(error) // 错误继续返回给到具体页面
    }
)
export default service

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error) {
    // 处理被取消的请求
    if (axios.isCancel(error))
        return console.error('axios.Automatic cancellation due to duplicate request:' + error.message)
    let message = ''
    if (error && error.response) {
        switch (error.response.status) {
            case 302:
                message = 'axios.Interface redirected!'
                break
            case 400:
                message = 'axios.Incorrect parameter!'
                break
            case 401:
                message = 'axios.You do not have permission to operate!'
                break
            case 403:
                message = 'axios.You do not have permission to operate!'
                break
            case 404:
                message = 'axios.Error requesting address:' + error.response.config.url
                break
            case 408:
                message = 'axios.Request timed out!'
                break
            case 409:
                message = 'axios.The same data already exists in the system!'
                break
            case 500:
                message = 'axios.Server internal error!'
                break
            case 501:
                message = 'axios.Service not implemented!'
                break
            case 502:
                message = 'axios.Gateway error!'
                break
            case 503:
                message = 'axios.Service unavailable!'
                break
            case 504:
                message = 'axios.The service is temporarily unavailable Please try again later!'
                break
            case 505:
                message = 'axios.HTTP version is not supported!'
                break
            default:
                message = 'axios.Abnormal problem, please contact the website administrator!'
                break
        }
    }
    if (error.message.includes('timeout'))
        message = 'axios.Network request timeout!'
    if (error.message.includes('Network'))
        message = window.navigator.onLine ? 'axios.Server exception!' : 'axios.You are disconnected!'
    ElNotification({
        type: 'error',
        message: message,
    })
}

/**
 * 关闭Loading层实例
 */
function closeLoading(options) {
    if (options.loading && loadingInstance.count > 0)
        loadingInstance.count--
    if (loadingInstance.count === 0) {
        loadingInstance.target.close()
        loadingInstance.target = null
    }
}

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 */
function addPending(config) {
    const pendingKey = getPendingKey(config)
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken(function (cancel) {
            if (!pendingMap.has(pendingKey)) {
                pendingMap.set(pendingKey, cancel)
            }
        })
}

/**
 * 删除重复的请求
 */
function removePending(config) {
    const pendingKey = getPendingKey(config)
    if (pendingMap.has(pendingKey)) {
        const cancelToken = pendingMap.get(pendingKey)
        cancelToken(pendingKey)
        pendingMap.delete(pendingKey)
    }
}

/**
 * 生成每个请求的唯一key
 */
function getPendingKey(config) {
    let data = config.data
    const url = config.url, method = config.method, params = config.params, headers = config.headers
    if (typeof data === 'string')
        data = JSON.parse(data) // response里面返回的config.data是个字符串对象
    return [
        url,
        method,
        headers && headers.batoken ? headers.batoken : '',
        headers && headers['ba-user-token'] ? headers['ba-user-token'] : '',
        JSON.stringify(params),
        JSON.stringify(data),
    ].join('&')
}

/**
 * 根据请求方法组装请求数据/参数
 */
function requestPayload(method, data) {
    if (method === 'GET') {
        return {
            params: data,
        }
    } else if (method === 'POST') {
        return {
            data: data,
        }
    }
}

/**
 * 设置token
 */
function settingToken(config) {
    const token = storage.token || storage.visitor || ''
    if (token && typeof window !== 'undefined') {
        config.headers.Authorization = `bearer ${token}`
    }
}

/**
 * 不需要携带token的api
 */
const whiteListNoTokenApi = function (url) {
    const list = ['/api/captchaImage', '/api/login']
    return !list.includes(url)
}
