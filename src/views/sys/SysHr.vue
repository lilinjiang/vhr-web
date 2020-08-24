<template>
  <!-- 操作员管理 -->
  <div>
    <div class="hr-titil">
      <el-input v-model="keywords" placeholder="通过用户名搜索用户..." @keydown.enter.native="doSearch" class="hr-input" prefix-icon="el-icon-search"></el-input>
      <el-button icon="el-icon-search" @click="doSearch" type="primary">搜索</el-button>
    </div>
    <div class="hr-container">
      <el-card class="box-card" v-for="(hr, index) in hrs" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ hr.name }}</span>
          <el-button style="float: right; padding: 3px 0; color:red" type="text" @click="deleteHr(hr)" icon="el-icon-delete"></el-button>
        </div>
        <div>
           <div class="img-container">
              <el-avatar shape="circle" :alt="hr.name" :size="70" fit="contain" :src="hr.userface">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
           </div>
           <div class="userinfo-container">
             <div>用户名: {{hr.name}}</div>
             <div>手机号码: {{hr.phone}}</div>
             <div>电话号码: {{hr.telephone}}</div>
             <div>地址: {{hr.address}}</div>
             <div>
                用户状态:
                <el-switch
                  v-model="hr.enabled"
                  active-text="启用"
                  @change="enabledChange(hr)"
                  inactive-text="禁用">
                </el-switch>
             </div>
             <div>
               用户角色:
               <el-tag type="success" style="margin-right:4px;margin-top:4px" size="small" v-for="(item, index) in hr.roles" :key="index">{{item.nameZh}}
               </el-tag>
               <!-- 弹出框 -->
               <el-popover
                placement="right"
                title="角色列表"
                width="200"
                @show="showPop(hr)"
                trigger="click"
                >
                <el-button class="update-roles" icon="el-icon-edit" type="primary" @click="hidePop(hr)" size="mini" >确认修改</el-button>
                <el-select multiple size="small" v-model="selectedRoles" placeholder="请选择">
                  <el-option
                    v-for="(r,index) in allRoles"
                    :key="index"
                    :label="r.nameZh"
                    :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
               </el-popover>
             </div>
             <div>备注: {{hr.remark}}</div>
           </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SysHr',
  data () {
    return {
      // 搜索表单的用户名
      keywords: '',
      // 所有的hr
      hrs: [],
      // 用于存放所有角色
      allRoles: [],
      // 已经选中的角色
      selectedRoles: []
    }
  },
  mounted () {
    this.initHrs()
  },
  methods: {
    initHrs () { // 初始化Hr数据
      this.getRequest(`/system/hr/?keywords=${this.keywords}`).then(resp => {
        if (resp) {
          this.hrs = resp
          console.log(resp)
        }
      })
    },
    enabledChange (hr) { // 修改hr 的状态
      delete hr.roles
      this.putRequest('/system/hr/', hr).then(resp => {
        if (resp) {
          this.initHrs()
        }
      })
    },
    initAllRoles () { // 初始化所有角色信息
      this.getRequest('/system/hr/roles').then(resp => {
        if (resp) {
          this.allRoles = resp
        }
      })
    },
    showPop (hr) { // 当修改角色弹出层弹出时触发事件
      this.initAllRoles()
      let roles = hr.roles
      this.selectedRoles = []
      roles.forEach(r => {
        this.selectedRoles.push(r.id)
      })
    },
    hidePop (hr) { //  当修改角色弹出层隐藏时触发事件 保存hr的新角色
      let roles = []
      Object.assign(roles, hr.roles)
      let flag = false
      if (roles.length !== this.selectedRoles.length) {
        flag = true
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i]
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j]
            if (role.id === sr) {
              roles.splice(i, 1)
              i--
              break
            }
          }
        }
        if (roles.length !== 0) {
          flag = true
        }
      }
      if (flag) {
        let hrRole = {
          hrId: hr.id,
          rids: this.selectedRoles
        }
        this.putRequest('/system/hr/role', hrRole).then(resp => {
          if (resp) {
            this.initHrs()
          }
        })
      }
      // 清空选中角色数组
      // this.selectedRoles = []
    },
    doSearch () { // 搜索hr
      this.initHrs()
    },
    deleteHr (hr) {
      this.$confirm(`此操作将永久删除 【 ${hr.name} 】 , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/system/hr/${hr.id}`).then(resp => {
          if (resp) {
            this.initHrs()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.hr-titil{
  display: flex;
  justify-content:center ;
}
.hr-input{
  width: 400px;
  margin-right: 10px;
}
.box-card{
  width: 350px;
  margin: 15px;
}
// .hr-container:after{
//   content: '';
//   width: 60%;
// }
.hr-container{
  margin-top:20px;
  display: flex;
  flex-wrap:wrap;
  justify-content:space-around;
}
.img-container{
  width: 100%;
  display: flex;
  justify-content: center;
}
.userinfo-container{
  margin-top: 20px
}
.userinfo-container div{
  font-size: 14px;
  color: #409EFF;
  margin-bottom: 5px;
}
.update-roles{
  margin-bottom: 5px;
  width: 100%;
}
</style>
