import Vue from 'vue'
const mutations = {
  // 初始化当前登录hr
  INIT_CURRENTHR (state, hr) {
    state.currentHr = hr
  },
  // 初始化routes
  initRoutes (state, data) {
    state.routes = data
  },
  changeCurrentSession (state, currentSession) {
    Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false)
    state.currentSession = currentSession
  },
  addMessage (state, msg) {
    let mss = state.sessions[`${state.currentHr.username}#${msg.to}`]
    // 如果消息历史记录为空null
    if (!mss) {
      // 那么就让记录为[]空数组
      // state.sessions[`${state.currentHr.username}#${msg.to}`] = []
      Vue.set(state.sessions, state.currentHr.username + '#' + msg.to, [])
    }
    state.sessions[`${state.currentHr.username}#${msg.to}`].push({
      content: msg.content,
      date: new Date(),
      self: !msg.notSelf
    })
  },
  // 初始化聊天数据
  INIT_DATA (state) {
    let data = localStorage.getItem('vue-chat-session')
    if (data) {
      state.sessions = JSON.parse(data)
    }
  },
  INIT_HR (state, data) {
    state.hrs = data
  }
}
export default mutations
