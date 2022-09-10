<template>
  <div class="login_content">
    <div class="login_box">
      <!-- 图标 -->
      <div class="avatar_boc">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form label-width="0" :model="loginForm" :rules="loginFormRules" ref="loginForm" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginForm.resetFields()
    },
    login () {
      this.$refs.loginForm.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const {data: res} = await this.axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        // 将登录成功之后的token信息保存到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login_content{
  background-color: #2b4b6b;
  height:100%;
}
.login_box{
  width:450px;
  height:300px;
  background-color: #fff;
  border-radius: 3px;
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  .avatar_boc{
    height:130px;
    width:130px;
    border:1px solid #eee;
    border-radius:50%;
    box-shadow: 0 0 10px #ddd;
    padding:10px;
    position:absolute;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width:100%;
      height:100%;
      border-radius:50%;
      background-color: #eee;
    }
  }
}
.login_form{
    position:absolute;
    bottom:0;
    width:100%;
    padding:0 15px;
    box-sizing: border-box;
  }
.btn{
  display:flex;
  justify-content: flex-end;
}
</style>
