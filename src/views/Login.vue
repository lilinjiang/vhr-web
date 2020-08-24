<template>
  <div>
    <!-- 登录表单 -->
    <el-form
      v-loading="loading"
      element-loading-text="正在登陆..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :rules="rules" :model="loginForm" ref="loginForm" class="login-container">
      <h3 class="login-title">系统登录</h3>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" @keydown.enter.native="submitLogin('loginForm')"></el-input>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button type="primary" style="width:100%" @click="submitLogin('loginForm')">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 表单的值
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        // 表单验证的条件
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    submitLogin (formName) {
      // 效验表单的值是否正确
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
            if (resp) {
              console.log(resp)
              this.$store.commit('INIT_CURRENTHR', resp.obj)
              // 存到浏览器
              window.sessionStorage.setItem('user', JSON.stringify(resp.obj))
              // 获取用户在地址栏输入的地址
              let path = this.$route.query.redirect
              // 登录城后：如果path不为空则跳转到用户在地址栏输入的地址，如果为空则按照正常流程跳转到home主页
              this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .login-container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 360px;
    padding: 15px 35px 25px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .login-title{
      margin: 15px auto 20px auto;
      text-align: center;
      color: #505458;
    }
  }
</style>
