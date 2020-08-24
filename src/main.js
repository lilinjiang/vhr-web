import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element ui
import ElementUI from 'element-ui'
// 引入element的css
import 'element-ui/lib/theme-chalk/index.css'
// 引入全局css样式
import './assets/css/index.css'
// 引入自定义封装http请求
import { postKeyValueRequest, postRequest, putRequest, getRequest, deleteRequest } from './utils/api.js'
// 引入初始化菜单路由
import { initMenu } from './utils/menus.js'
// 引入 font-awesome的图标css
import 'font-awesome/css/font-awesome.min.css'
// 引入时间格式化插件
import moment from 'moment'
// 将时间格式化插件设置为中文简体
moment.locale('zh-cn')
// 以下是将请求挂在带vue的原型中 这样子我们就能通this点出方法调用
Vue.prototype.postRequest = postRequest
Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.getRequest = getRequest
// 将时间格式化插件挂在到vue原型中
Vue.prototype.moment = moment
Vue.config.productionTip = false
// 引入注册element组件
Vue.use(ElementUI)

// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 为了防止用户F5刷新导致菜单数据丢失在这里使用路由守卫判断去的页面不是登录页如果不是则都刷新一遍home菜单
  // initMenu初始化菜单方法内做了防止多次查询判断因此不必担心发生过多的无用请求

  if (to.path === '/' || to.path === '/login') {
    next()
  } else {
    if (window.sessionStorage.getItem('user')) {
      initMenu(router, store)
      next()
    } else {
      // 这里要实现如果用户在地址栏输入了一个地址，这个时候因为设置了未登录状态下跳转到登录页面进行登录，当登录完成后自动跳转到用户在地址栏输入的地址
      next('/?redirect=' + to.path)
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
