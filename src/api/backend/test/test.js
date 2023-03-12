import request from '@/utils/axios'

const moduleControllerUrl = '/api'

export function getTestData(params = {}) {
    return request({
        url: moduleControllerUrl + '/sql',
        method: 'get',
        data: params
    })
}