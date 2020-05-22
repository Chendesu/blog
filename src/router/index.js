import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/admin/Login'
import home from '@/components/admin/home'
import User from '@/components/admin/User'
import Diary from '@/components/admin/Diary'
import Photo from '@/components/admin/Photo'
import Label from '@/components/admin/Label'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/Login',
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
          path: '/Diary',
          name: 'Diary',
          component: Diary,
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
