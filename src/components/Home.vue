<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div class="header-left">
          <img style="width:9%;border:1px solid black;border-radius:50%" src="../assets/houtai.jpg" alt="" />
          <span>电商后台管理系统</span>
        </div>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#373d41" text-color="#fff" active-text-color="#409eff" 
        :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true"
        :default-active="activePath">
          <!--一级菜单  index的变量要改成字符串类型的-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!--一级菜单模板区域  -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+list.path" v-for="list in item.children" :key="list.id"
            @click="saveNavState('/'+list.path)">
              <!-- 二级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{list.authName}}</span>
            </template>              
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data(){
    return {
      //左侧菜单的数据
      menulist:[],
      icons:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      //默认不折叠
      isCollapse:false,
      //被激活的连接地址
      activePath:''
    }
  },
  mounted(){
  this.axios.get("/menus").then(res=>{
    if(res.data.meta.status!==200) return this.$message.error(res.data.meta.msg);
    // console.log(res.data.data);
    this.menulist=res.data.data;
    this.activePath=window.sessionStorage.getItem('activePath');
  })
},
  methods: {
    //保存连接的激活状态
    saveNavState(activePath){
      //将激活的连接地址保存到session中，使得页面切换时能保持激活状态
      window.sessionStorage.setItem('activePath',activePath);
      //将激活的连接地址保存到activePath中，防止异步session保存晚于页面切换操作
      this.activePath=activePath;
    },
    //点击按钮切换菜单的折叠和展开
    toggleCollapse(){
      this.isCollapse=!this.isCollapse;
    },
    logout() {
      //退出时清除token
      window.sessionStorage.clear();
      //返回登录界面，实现退出
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: white;
  font-size: 20px;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
}
.header-left > span {
  margin-left: 10px;
}
.el-aside {
  background-color: #333744;
}
.el-menu{border-right:0px;}
.el-main {
  background-color: #eaedf1;
}
.iconfont{margin-right:10px;}
.toggle-button{background-color:#4a5064;
font-size:10px;line-height:24px;color:white;
text-align: center;letter-spacing: 0.2rem;
cursor:pointer;
}
</style>