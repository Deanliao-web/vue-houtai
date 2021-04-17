<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avater_box">
        <img src="../assets/houtai.jpg" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名区域 -->
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="loginForm.password"
          >
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods:{
    //重置登录表单
    resetloginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    //点击登录功能实现
    login(){
      //先对表单进行校验，校验成功后通过接口访问服务器
      this.$refs.loginFormRef.validate((valid)=>{
        if(!valid) return;
        this.axios.post('/login',this.loginForm).then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('登陆失败');
          this.$message.success('登陆成功');
          //1.将登陆成功后的token保存到客户端的seddionstorage中
          //1.1项目中除了登录之外的API接口，必须在登录之后才能访问
          //1.2token应该在当前网页打开期间生效，所以将token保存在sessionstorage中
          console.log(res.data);
          window.sessionStorage.setItem('token',res.data.data.token);
          //2.通过路由航跳转到后台主页，路由地址是/home
          this.$router.push('/home')
        })
      })    
    }
  }
};
</script>
<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avater_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%); /*位移此divchi尺寸的50% */
  background-color: white;
}
.avater_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0px 30px;
  box-sizing: border-box;
}
</style>