<template>
    <!-- 整个页面 -->
    <el-container>
      <!-- 手风琴导航 -->
      <el-aside width="210px">
        <!-- router 属性代表：
          是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
          -->
          <!-- 这里的菜单采用router菜单路由信息去便利出菜单数据（数据来后端） -->
        <el-menu
          background-color="#304156"
          text-color="#BFCBD9"
          active-text-color="#409EFF"
          router
          unique-opened
          >
          <el-submenu :index="String(index)" v-for="(item, index) in homeRouter" :key="index">
            <template slot="title">
              <i :class="item.iconCls"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="child.path" v-for="(child, index) in item.children" :key="index">{{child.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边布局 -->
      <el-container>
        <!-- header -->
        <el-header height="50px">
          <!-- 左边面包屑 -->
          <div>
            <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path!='/home'" >
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 右边下拉菜单 -->
          <div>
          <el-button icon="el-icon-bell" type="text" style="margin-right: 15px;color: #000000;" @click="goChat" size="normal" ></el-button>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">{{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </el-header>
        <!-- main -->
        <el-main>
          <div class="home-welcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到微人事！
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 存放登录用户信息
      user: JSON.parse(window.sessionStorage.getItem('user'))

    }
  },
  mounted () {
    console.log('组件')
    console.log(this.$route.path)
  },
  methods: {

    handleCommand (command) { // 下拉菜单选项事件
      if (command === 'userinfo') {
        this.$message('用户中心')
      } else if (command === 'settings') {
        this.$message('设置')
      } else if (command === 'logout') {
        // 弹框询问是否真的删除数据
        this.$confirm('确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 点击确定则发送退出 请求
          this.getRequest('/logout')
          // 删除本地下的用户对象
          window.sessionStorage.removeItem('user')
          this.$store.commit('initRoutes', [])
          // 跳转到登录页面
          this.$router.replace('/login')
        })
      }
    },
    goChat () { // 进入IM内部沟通工具
      this.$router.push('/chat')
    }
  },
  computed: {
    // 把除了home下的路由全部过滤掉 以配置的hidden为标记去筛选出hidden不为true的路由信息
    // this.$router.options.routes可以拿到router所有配置信息
    homeRouter () {
      return this.$store.state.routes.filter(item => (!item.hidden === true))
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-container{
    height: 100%;
  }
  .el-header{
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08) !important;
    box-shadow: 0 1px 4px rgba(0,21,41,0.08) !important;

    height: 50px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // padding: 0px 15px;
    box-sizing: border-box;
    //将鼠标变成小手指
    .el-dropdownP,.el-dropdown-link{
      cursor: pointer;
    }
  }
  .el-main{
    background: white;
    .home-welcome {
        text-align: center;
        font-size: 60px;
        font-family: 华文行楷;
        color: #A67C40;
        // color: #DCCC61;
        // color: #C3C3C3;
        padding-top: 200px;
    }
  }
  .el-aside{
    // background: #304156
    i{
      color: #BFCBD9;
      margin-right: 15px;
      font-size: 15px;
    }
  }
  .el-menu{
    height: 100%;
    // background-clip: border-box;
  }
</style>
