import request from '@/utils/axios'

const moduleControllerUrl = '/sql'
export function getTestData(params={}) {
    return request({
        url: moduleControllerUrl,
        method: 'get',
        data: params
    })
}