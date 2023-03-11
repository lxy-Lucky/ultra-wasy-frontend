/**
 * 手机号码验证
 */
export function validatorMobile(rule, mobile, callback) {
    // 允许空值，若需必填请添加多验证规则
    if (!mobile) {
        return callback()
    }
    if (!/^(1[3-9])\d{9}$/.test(mobile.toString())) {
        return callback(new Error('validate.Please enter the correct mobile number'))
    }
    return callback()
}

/**
 * 账户名验证
 */
export function validatorAccount(rule, val, callback) {
    if (!val) {
        return callback()
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(val)) {
        return callback(new Error('validate.Please enter the correct account'))
    }
    return callback()
}

/**
 * 密码验证
 */
export function regularPassword(val) {
    return /^(?!.*[&<>"'\n\r]).{6,32}$/.test(val)
}

export function validatorPassword(rule, val, callback) {
    if (!val) {
        return callback()
    }
    if (!regularPassword(val)) {
        return callback(new Error('validate.Please enter the correct password'))
    }
    return callback()
}

/**
 * 变量名验证
 */
export function regularVarName(val) {
    return /^([^\x00-\xff]|[a-zA-Z_$])([^\x00-\xff]|[a-zA-Z0-9_$])*$/.test(val)
}

export function validatorVarName(rule, val, callback) {
    if (!val) {
        return callback()
    }
    if (!regularVarName(val)) {
        return callback(new Error('validate.Please enter the correct name'))
    }
    return callback()
}

export function validatorEditorRequired(rule, val, callback) {
    if (!val || val === '<p><br></p>') {
        return callback(new Error('validate.Content cannot be empty'))
    }
    return callback()
}

/**
 * 构建表单验证规则
 * @param _a paramsObj 参数对象
 */
export function buildValidatorData(_a) {
    let name = _a.name, message = _a.message, title = _a.title, _b = _a.trigger, trigger = _b === void 0 ? 'blur' : _b
    // 必填
    if (name === 'required') {
        return {
            required: true,
            message: message ? message : 'Please input field',
            trigger: trigger,
        }
    }
    // 常见类型
    let validatorType = ['number', 'integer', 'float', 'date', 'url', 'email']
    if (validatorType.includes(name)) {
        return {
            type: name,
            message: message ? message : 'Please enter the correct field',
            trigger: trigger,
        }
    }
    // 自定义验证方法
    let validatorCustomFun = {
        mobile: validatorMobile,
        account: validatorAccount,
        password: validatorPassword,
        varName: validatorVarName,
        editorRequired: validatorEditorRequired,
    }
    if (validatorCustomFun[name]) {
        return {
            required: name === 'editorRequired',
            validator: validatorCustomFun[name],
            trigger: trigger,
            message: message,
        }
    }
    return {}
}