import request from '@/utils/axios'

const moduleControllerUrl = '/'

export function login(params = {}) {
    return request({
        url: moduleControllerUrl + 'doLogin',
        method: 'post',
        data: params
    })
}