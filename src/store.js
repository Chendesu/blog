import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
    username: '',
    power: '',
    isShow: false
  },
  mutations: {
    saveusername (state, username) {
      // 变更状态
      state.username = username
    },
    savepower (state, power) {
      state.power = power
    },
    saveisShow (state, isShow) {
      state.isShow = isShow
    }
  },
  actions: {
    saveusername (context) {
      context.commit('saveusername')
    },
    savepower (context) {
      context.commit('savepower')
    },
    saveisShow (context) {
      context.commit('saveisShow')
    }
  }
})
