import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'
Vue.use(Vuex)

const state = {
  // 用于储存菜单数据
  routes: [],
  sessions: {},
  hrs: [],
  currentHr: JSON.parse(window.sessionStorage.getItem('user')),
  currentSession: -1,
  filterKey: '',
  stomp: null,
  isDot: {}
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
  }
})

store.watch(function (state) {
  return state.sessions
}, function (val) {
  console.log('CHANGE: ', val)
  localStorage.setItem('vue-chat-session', JSON.stringify(val))
}, {
  deep: true/* 这个貌似是开启watch监测的判断,官方说明也比较模糊 */
})

export default store
