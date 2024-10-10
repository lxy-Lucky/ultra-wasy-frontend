<template>
  <div class="login-box">
    <div class="login-wrapper">
      <div class="header">橙子都是橘子味的</div>
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="请输入用户名" class="input-item"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="密码" class="input-item"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="btn" @click="login">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {loginApi} from "@/api/systemMenuApi/login";
import {loadDynamicRoutes} from "@/router/modules/dynamicRouter";
import {HOME_URL} from "@/config";

export default {
  name: "login-page",
  data() {
    return {
      loginForm: {
        userName: 'admin',  // 用户名
        password: '123456',  // 密码
        captcha: ''    // 验证码
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login() {
      const params = {...this.loginForm}
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          loginApi(params).then(async res => {
            await this.$store.dispatch('user/setToken', res.data.accessToken);
            await loadDynamicRoutes();
            await this.$router.push(HOME_URL);
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login-box {
  height: 100%;
  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);

  .login-wrapper {
    background-color: #fff;
    width: 358px;
    height: 458px;
    border-radius: 15px;
    padding: 0 50px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .header {
      font-size: 26px;
      font-weight: bold;
      text-align: center;
      line-height: 110px;
    }

    .input-item {
      margin-bottom: 20px;
      padding: 10px;
      border-bottom: 1px solid rgb(128, 125, 125);
      font-size: 15px;
    }

    .btn {
      text-align: center;
      padding: 10px;
      width: 100%;
      margin-top: 40px;
      background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
      color: #fff;
    }

  }
}

::v-deep .el-input__inner {
  border: initial;
}
</style>