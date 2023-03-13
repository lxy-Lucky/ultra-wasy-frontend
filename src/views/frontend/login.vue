<template>
  <div>
    <!-- 页面气泡效果_START -->
    <div @contextmenu.stop="" id="bubble" class="bubble">
      <canvas id="bubble-canvas" class="bubble-canvas"></canvas>
    </div>
    <!-- 页面气泡效果_END -->

    <!-- 登录 -->
    <div class="login">
      <div class="login-box">
        <!-- login_header背景开始 -->
        <div class="head">
          <img src="@/assets/login-header.png" alt=""/>
        </div>
        <!-- login_header背景结束 -->

        <!-- 表单开始 -->
        <div class="form">
          <!-- 头像开始 -->
          <img class="profile-avatar" src="@/assets/avatar.png" alt=""/>
          <!-- 头像结束 -->

          <!-- 表单输入内容开始 -->
          <div class="content">
            <el-form @keyup.enter="onSubmit(formRef)" ref="formRef" :rules="rules" size="large" :model="form">
              <!-- 用户名框开始 -->
              <el-form-item prop="username">
                <el-input
                    ref="usernameRef"
                    type="text"
                    clearable
                    v-model="form.username"
                    :placeholder="'请输入账号'">
                  <template #prefix>
                    <el-icon>
                      <Avatar/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <!-- 用户名框结束 -->

              <!-- 密码框开始 -->
              <el-form-item prop="password">
                <el-input
                    ref="passwordRef"
                    v-model="form.password"
                    type="password"
                    :placeholder="'请输入密码'"
                    show-password>
                  <template #prefix>
                    <el-icon>
                      <Unlock/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <!-- 密码框结束 -->

              <!-- 验证码框开始 -->
              <el-form-item v-if="state.showCaptcha" prop="captcha">
                <el-row class="w100" :gutter="15">
                  <el-col :span="16">
                    <el-input
                        ref="captchaRef"
                        type="text"
                        placeholder="请输入验证码"
                        v-model="form.code"
                        clearable
                        autocomplete="off">
                      <template #prefix>
                        <el-icon>
                          <MoreFilled/>
                        </el-icon>
                      </template>
                    </el-input>
                  </el-col>
                  <el-col :span="8">
                    <img @click="onChangeCaptcha" class="captcha-img" :src="buildCaptchaUrl() + '&id=' + state.captchaId" alt=""/>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 验证码框结束 -->

              <!-- 记住密码开始 -->
              <el-checkbox v-model="form.keep" label="记住密码" size="default"></el-checkbox>
              <!-- 记住密码结束 -->

              <!-- 登录按钮开始 -->
              <el-form-item>
                <el-button
                    :loading="form.loading"
                    @click="onSubmit(formRef)"
                    class="submit-button"
                    round
                    type="primary"
                    size="large">
                  登录
                </el-button>
              </el-form-item>
              <!-- 登录按钮结束 -->
            </el-form>
          </div>
          <!-- 表单输入内容结束 -->
        </div>
        <!-- 表单结束 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, reactive, ref} from "vue"
import {uuid} from '@/utils/random'
import {buildValidatorData} from '@/utils/validate'
import * as pageBubble from '@/utils/pageBubble'
import {login} from "@/api/backend/test/test"
import {useRouter} from "vue-router";
import {ElNotification} from "element-plus";
import {buildCaptchaUrl} from "@/api/common";

const $router = useRouter()

let timer
const state = reactive({
  showCaptcha: true,
  captchaId: uuid(),
})

const formRef = ref()
const usernameRef = ref()
const passwordRef = ref()
const captchaRef = ref()
const form = reactive({
  username: '',
  password: '',
  code: '',
  keep: false,
  loading: false,
  captcha_id: '',
})

// 表单验证规则
const rules = reactive({
  username: [buildValidatorData({name: 'required', message: '请输入账号'}), buildValidatorData({name: 'account'})],
  password: [buildValidatorData({name: 'required', message: '请输入密码'}), buildValidatorData({name: 'password'})],
  code: [buildValidatorData({name: 'required', title: '请输入验证码'}),
    {
      min: 4,
      max: 6,
      message: 'login.The verification code length must be between 4 and 6 bits',
      trigger: 'blur',
    },
  ],
})

onMounted(() => {
  timer = setTimeout(() => {
    pageBubble.init()
  }, 0)

})

onBeforeUnmount(() => {
  clearTimeout(timer)
  pageBubble.removeListeners()
})

const onChangeCaptcha = () => {
  form.captcha = ''
  state.captchaId = uuid()
}

const onSubmit = (formEl) => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      form.loading = true
      form.captcha_id = state.captchaId

      login(form).then(res => {
        form.loading = false
        ElNotification({
          type: 'success',
          message: res.message
        })
        $router.push({name: 'index', query: {obj: '我踏马来辣！'}})
      }).catch(e => {
        form.loading = false
        ElNotification({
          type: 'error',
          message: e.message
        })
      })
    }
  })
}

</script>

<style scoped lang="scss">
.switch-language {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1;
}

.bubble {
  overflow: hidden;
  background: url(@/assets/bg.jpg) repeat;
}

.form-item-icon {
  height: auto;
}

.login {
  position: absolute;
  top: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;

  .login-box {
    overflow: hidden;
    width: 430px;
    padding: 0;
    background: var(--ba-bg-color-overlay);
    margin-bottom: 80px;
  }

  .head {
    background: #ccccff;

    img {
      display: block;
      width: 430px;
      margin: 0 auto;
      user-select: none;
    }
  }

  .form {
    position: relative;

    .profile-avatar {
      display: block;
      position: absolute;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      border: 4px solid var(--ba-bg-color-overlay);
      top: -50px;
      right: calc(50% - 50px);
      z-index: 2;
      user-select: none;
    }

    .content {
      padding: 100px 40px 40px 40px;
    }

    .submit-button {
      width: 100%;
      letter-spacing: 2px;
      font-weight: 300;
      margin-top: 15px;
      --el-button-bg-color: var(--el-color-primary);
    }
  }
}

@media screen and (max-width: 720px) {
  .login {
    display: flex;
    align-items: center;
    justify-content: center;

    .login-box {
      width: 340px;
      margin-top: 0;
    }
  }
}

.chang-lang :deep(.el-dropdown-menu__item) {
  justify-content: center;
}

.content :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
}

.captcha-img {
  width: 100%;
}

// 暗黑样式
@at-root .dark {
  .bubble {
    background: url(@/assets/bg-dark.jpg) repeat;
  }

  .login {
    .login-box {
      background: #161b22;
    }

    .head {
      img {
        filter: brightness(61%);
      }
    }

    .form {
      .submit-button {
        --el-button-bg-color: var(--el-color-primary-light-5);
        --el-button-border-color: rgba(240, 252, 241, 0.1);
      }
    }
  }

  .captcha-img {
    filter: brightness(61%);
  }
}

@media screen and (max-height: 800px) {
  .login .login-box {
    margin-bottom: 0;
  }
}
</style>
