import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import home from '@/components/home'
import User from '@/components/User'
import Dairy from '@/components/Dairy'
import Photo from '@/components/Photo'
import Label from '@/components/Label'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录页面'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/User',
          name: 'User',
          component: User,
          meta: {
            title: '用户管理页面'
          }
        },
        {
          path: '/Dairy',
          name: 'Dairy',
          component: Dairy,
          meta: {
            title: '日志管理页面'
          }
        },
        {
          path: '/Photo',
          name: 'Photo',
          component: Photo,
          meta: {
            title: '相册管理页面'
          }
        },
        {
          path: '/Label',
          name: 'Label',
          component: Label,
          meta: {
            title: '标签管理页面'
          }
        }
      ]
    }

  ]
})
