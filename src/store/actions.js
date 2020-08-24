import { getRequest } from '../utils/api'
import { Notification } from 'element-ui'
import SockJS from 'sockjs-client'
import Vue from 'vue'
import Stomp from 'stompjs'
// import router from '../router'
const actions = {

  // websoket的连接
  connect (context) {
    console.log(new SockJS('/ws/ep'))
    context.state.stomp = Stomp.over(new SockJS('/ws/ep'))
    console.log(context.state.stom)
    context.state.stomp.connect({}, success => {
      // 监听消息
      context.state.stomp.subscribe('/user/queue/chat', msg => {
        let receiveMsg = JSON.parse(msg.body)
        if (!context.state.currentSession || receiveMsg.from !== context.state.currentSession.username) {
          Notification.info({
            title: '【' + receiveMsg.fromNickname + '】发来一条消息',
            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
            position: 'bottom-right'
            // onClick: () => {
            //   router.push('/chat')
            // }
          })
          Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true)
        }
        receiveMsg.notSelf = true
        // 这是别跟发给自己的消息那么说 to就是to自己
        receiveMsg.to = receiveMsg.from
        context.commit('addMessage', receiveMsg)
        console.log('消息来了')
        console.log(msg)
      })
    })
  },
  // 初始化聊天数据
  initData (context) {
    context.commit('INIT_DATA')
    // 初始化聊天数据的时候初始化hr
    getRequest('/chat/hrs').then(resp => {
      if (resp) {
        context.commit('INIT_HR', resp)
      }
    })
  }
}
export default actions
