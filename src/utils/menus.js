import { getRequest } from './api'

export const initMenu = (router, store) => {
  // 如果没有菜单数据
  if (store.state.routes.length === 0) {
    // 发送获取菜单数据请求
    getRequest('/system/config/menu').then(data => {
      // 如果请求到的数据不为空
      if (data) {
        // 则调用数据格式化函数
        let fmtRoutes = formatRoutes(data)
        // 添加路由信息
        router.addRoutes(fmtRoutes)
        // 将菜单路由信息放进vuex
        store.commit('initRoutes', fmtRoutes)
        store.dispatch('connect')
      }
    })
  }
}
// 格式化菜单路由函数
export const formatRoutes = routes => {
  // 用于保存home页菜单路由规则
  let fmtRoutes = []
  // 对路由进行格式化
  routes.forEach(router => {
    // 解构语法（对router进行分解为变量） 相当于声明很多个变量
    let{
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router
    // 如果该菜单对象下还有子菜单并且还是数组类型则再把该菜单路由下的子菜单路由进行格式化
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    // 将服务端请求回来的菜单进行格式化为一个路由（router）格式
    let fmtRouter = {
      path,
      name,
      meta,
      iconCls,
      children,
      // 引入对应组件
      component (resolve) {
        // 这里是对数据库储存的组件名进行判断是以哪一个文件夹开头的则对应匹配到相应文件夹
        if (component.startsWith('Home')) {
          require(['../views/' + component + '.vue'], resolve)
        } else if (component.startsWith('Emp')) {
          require(['../views/emp/' + component + '.vue'], resolve)
        } else if (component.startsWith('Per')) {
          require(['../views/per/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sal')) {
          require(['../views/sal/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sta')) {
          require(['../views/sta/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sys')) {
          require(['../views/sys/' + component + '.vue'], resolve)
        }
      }
    }
    // 将格式化好的菜单路由对象添加到路由菜单数组中
    fmtRoutes.push(fmtRouter)
  })
  // 当把整个菜单路由格式化完成后返回路由格式的菜单
  return fmtRoutes
}
