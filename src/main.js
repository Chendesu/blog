// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import axios from 'axios'
import store from './store'
import iView from 'iview'
// import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

// import VueWechatTitle from 'vue-wechat-title'

// router.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   if (to.path === '/Login') {
//     next()
//   } else if (to.path === '/') {
//     next()
//   } else {
//     next({path: '/'})
//   }
// })

// router.beforeEach((to, from, next) => {
//   if (to.matched.length === 0) { // 如果未匹配到路由
//     from.path ? next({ path: from.path }) : next('/') // 如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
//   } else {
//     next() // 如果匹配到正确跳转
//   }
// })

// Vue.use(VueWechatTitle)

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(iView)
// Vue.use(ViewUI)

Vue.prototype.$axios = axios

// The routing configuration
// const RouterConfig = {
//   routes: Routers
// }
// const router = new VueRouter(RouterConfig)

// 路由跳转
Vue.prototype.$goRoute = function (index) {
  this.$router.push(index)
}
// 重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
