import {getUrl} from "@/utils/axios"

// 获取验证码
export function buildCaptchaUrl() {
    return getUrl() + captchaUrl + '?server=1'
}


// 公共
export const captchaUrl = '/verifyCode'