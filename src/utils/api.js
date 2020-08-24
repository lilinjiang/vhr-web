import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router/index.js'
// 响应拦截器
axios.interceptors.response.use(success => {
  // 如果http状态码状态码存在 并且 http状态码为200 并且 服务器自定义状态码为500则代表该请求失败！
  if (success.status && success.status === 200 && success.data.status === 500) {
    // 直接提示服务器返回的错误消息
    Message.error({ message: success.data.msg })
    // 返回空数据
    return
  }
  // 代码走到这里代表响应式成功的 展示服务器返回的消息
  if (success.data.msg) {
    Message.success({ message: success.data.msg })
  }
  // 返回服务器响应回来的数据
  return success.data
}, error => {
  // 以下对请求失败的一些处理
  if (error.response.status === 504 || error.response.status === 404) {
    Message.error({ message: '服务器被吃了( ╯□╰ )' })
  } else if (error.response.status === 403) {
    Message.error({ message: '权限不足，请联系管理员' })
  } else if (error.response.status === 401) {
    Message.error({ message: '尚未登录，请登录' })
    console.log('未登录！')
    router.replace('/')
  } else {
    if (error.response.data.msg) {
      Message.error({ message: error.response.data.msg })
    } else {
      Message.error({ message: '未知错误!' })
    }
  }
})
let base = ''

// post类型请求以x-www-form-urlencoded方式去提交数据
export const postKeyValueRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    // 这里就是把参数进行转换，如果不转换默认是以json形式发送参数
    transformRequest: [function (data) {
      console.log(data)
      let ret = ''
      for (let i in data) {
        console.log(i)
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: params
  })
}
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params
  })
}
