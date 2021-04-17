import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入elementui，打包时注释掉使用cdn加载
// import './plugins/element.js'


//导入axios
import axios from 'axios'
// 倒入全局样式表
import './assets/css/global.css'

import _ from 'lodash'

import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//导入iconfont
import './assets/fonts/iconfont.css'
//将富文本编辑器注册为全剧组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
//设置axios的默认配置
axios.defaults.baseURL='http://127.0.0.1:5050/api/private/v1/';

//利用axios拦截并添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config=>{

  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})
//将axios放到Vue的原型对象中
Vue.prototype.axios=axios;

Vue.component("tree-table", TreeTable)

Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal);

  const y=dt.getFullYear();
  const m=(dt.getMonth()+1+'').padStart(2,'0');
  const d=(dt.getDate()+'').padStart(2,'0');
  const hh=(dt.getHours()+'').padStart(2,'0');
  const mm=(dt.getMinutes()+'').padStart(2,'0');
  const ss=(dt.getSeconds()+'').padStart(2,'0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
