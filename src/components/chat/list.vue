<template>
  <div id="list">
    <ul>
      <!-- 这一块代码简直服了，自己都写醉了 active的class 绑定的根据就是 当前会话的username 与  当前列表中哪一个hr的相同相同就显示按个 -->
      <li v-for="item in hrs" :key="item.id" :class="{ active: currentSession ? item.username === currentSession.username :false }" v-on:click="changeCurrentSession(item)"><!--   :class="[item.id === currentSession ? 'active':'']" -->
        <el-badge :is-dot="isDot[user.username+'#'+item.username]"><img class="avatar" :src="item.userface" :alt="item.name"></el-badge>
        <p class="name">{{item.name}}</p>
      </li>
  </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'list',
  data () {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },

  computed: mapState([
    'hrs',
    'isDot',
    'currentSession'
  ]),
  methods: {
    changeCurrentSession (currentSession) {
      this.$store.commit('changeCurrentSession', currentSession)
    }
  }
}
</script>

<style lang="scss" scoped>
#list {
  li {
  padding: 12px 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;
    list-style: none;
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }
  li.active {/*注意这个是.不是冒号:*/
      background-color: rgba(255, 255, 255, 0.1);
  }
  .avatar {
    border-radius: 2px;
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
  .name {
  display: inline-block;
  margin-left: 15px;
  }
}
</style>
