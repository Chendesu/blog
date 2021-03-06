import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/admin/Login'
import home from '@/components/admin/home'
import User from '@/components/admin/User'
import Diary from '@/components/admin/Diary'
import Photo from '@/components/admin/Photo'
import Label from '@/components/admin/Label'
import Index from '@/components/Index'
import DiaryWeb from '@/components/DiaryWeb'
import PhotoWeb from '@/components/PhotoWeb'
import DiaryWebDetail from '@/components/DiaryWebDetail'
import my from '@/components/my'
import Error from '@/components/error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  // base: '/myblog/',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        title: '阿久的个人博客'
      },
      children: [
        {
          path: '/',
          name: 'DiaryWeb',
          component: DiaryWeb
        },
        {
          path: '/DiaryWebDetail',
          name: 'DiaryWebDetail',
          component: DiaryWebDetail
        },
        {
          path: '/PhotoWeb',
          name: 'PhotoWeb',
          component: PhotoWeb,
          meta: {
            title: '相册'
          }
        },
        {
          path: '/my',
          name: 'my',
          component: my,
          meta: {
            title: '关于我'
          }
        }
      ]
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
          path: '/home',
          name: 'User',
          component: User,
          meta: {
            title: '用户管理页面'
          }
        },
        {
          path: '/home/Diary',
          name: 'Diary',
          component: Diary,
          meta: {
            title: '日志管理页面'
          }
        },
        {
          path: '/home/Photo',
          name: 'Photo',
          component: Photo,
          meta: {
            title: '相册管理页面'
          }
        },
        {
          path: '/home/Label',
          name: 'Label',
          component: Label,
          meta: {
            title: '标签管理页面'
          }
        }
      ]
    },
    {
      path: '*',
      component: Error
    }

  ]
})
