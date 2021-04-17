import Vue from 'vue'
import VueRouter from 'vue-router'
// 使用路由懒加载优化路由
const Login = () => import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Welcome.vue')
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'

const Users = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/Users.vue')
const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/Rights.vue')
const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/Roles.vue')
// import Users from '../components/Users.vue'
// import Rights from '../components/Rights.vue'
// import Roles from '../components/Roles.vue'

const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '../components/Cate.vue')
const Params = () => import(/* webpackChunkName:"Users_Params" */ '../components/Params.vue')
// import Cate from '../components/Cate.vue'
// import Params from '../components/Params.vue'

const GoodsList = () => import(/* webpackChunkName:"GoodsList_Add" */ '../components/List.vue')
const Add = () => import(/* webpackChunkName:"GoodsList_Add" */ '../components/Add.vue')
// import GoodsList from '../components/List.vue'
// import Add from '../components/Add.vue'

const Orders = () => import(/* webpackChunkName:"Orders_Report" */ '../components/Orders.vue')
const Report = () => import(/* webpackChunkName:"Orders_Report" */ '../components/Report.vue')
// import Orders from '../components/Orders.vue'
// import Report from '../components/Report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    component: Home,
    redirect:'/users',
    children:[{path:'/welcome',component:Welcome},
              {path:'/users',component:Users},
              {path:'/rights',component:Rights},
              {path:'/roles',component:Roles},
              {path:'/categories',component:Cate},
              {path:'/params',component:Params},
              {path:'/goods',component:GoodsList},
              {path:'/goods/add',component:Add},
              {path:'/orders',component:Orders},
              {path:'/reports',component:Report}
            ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }
  // {
  //   path: '/',
  //   name: '',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to表示要访问的路径
  //from表示从哪个路径跳转而来
  //next是放行函数，next()表示放行，next('/login')表示强制跳转
 //如果访问登录页面直接放行
  if(to.path==='/login') return next();
  //如果访问有权限的页面，要先判断是否有token,才能放行
  //提前获取token
  const tokenStr=window.sessionStorage.getItem('token');
  //如果没有token强制跳转到登录界面
  if(!tokenStr) return next('/login');
  //如果存在token就放行
  next();
})
export default router
