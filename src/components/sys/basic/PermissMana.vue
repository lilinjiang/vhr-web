<template>
  <!-- 权限管理 -->
  <div>
    <div class="permiss-mana-tool">
      <el-input size="small" placeholder="请输入角色英文名" class="primiss" v-model="role.name" >
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名" @keydown.enter.native="doAddRole"></el-input>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div class="permiss-mana-main">
      <el-collapse
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        v-model="activeName"  accordion @change="handleChange">
        <el-collapse-item :title="item.nameZh" :name="item.id" v-for="(item,index) in roles" :key="item.id">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <!-- 删除角色按钮 -->
              <el-button style="float: right; padding: 3px 0;color:red" @click="deleteRole(item)" icon="el-icon-delete"  type="text"></el-button>
            </div>
            <div>
              <!-- 在这里因为tree组件在循环内所以需要给他指定一个key这样子以便vue 去分辨多个tree否则vue会认为这是一个tree -->
              <el-tree ref="tree" :key="item.id" node-key="id" :default-checked-keys="selectedMenus" show-checkbox :data="allMenus" :props="defaultProps"></el-tree>
              <div style="display:flex;justify-content: flex-end;">
                <el-button size="small" @click="cancelUpdate">取消修改</el-button>
                <el-button @click="doUpdate(item.id,index)" size="small" type="primary">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PermissMana',
  data () {
    return {
      // 表单角色数据
      role: {
        name: '',
        nameZh: ''
      },
      // 全部角色数据
      roles: [],
      // 全部菜单数据
      allMenus: [],
      // 默认要选中的菜单数据(也就是当前打开的角色中，已经拥有的菜单)
      selectedMenus: [],
      // tree树形结构的参数设置
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 当前被激活的面板
      activeName: -1,
      loading: false
    }
  },
  mounted () {
    // 初始化角色
    this.initRoles()
  },
  methods: {
    doAddRole () { // 新增一个角色
      if (!this.role.name) {
        this.$message({
          message: '角色英文名不得为空！',
          type: 'warning'
        })
        return false
      }
      if (!this.role.nameZh) {
        this.$message({
          message: '角色中文名不得为空！',
          type: 'warning'
        })
        return false
      }
      this.postRequest('/system/basic/permiss/role', this.role).then(resp => {
        if (resp) {
          this.role.nameZh = ''
          this.role.name = ''
          this.initRoles()
        }
      })
    },
    initRoles () { // 获取所有角色
      this.loading = true
      this.getRequest('/system/basic/permiss/').then(resp => {
        if (resp) {
          this.roles = resp
        }
        this.loading = false
      })
    },
    handleChange (rid) { // 折叠面板的回调
      // 这里回调回来的数据是你打开面板项的name
      // 此回调在打开面板与关闭面板都会触发所以要进行判断此次调用是打开的回调还是关闭回调---这里判断val是否为空，为空则为关闭
      if (rid) {
        // 首先清空已经选中的菜单数据，如果不清会出问题
        this.selectedMenus = []
        this.initallMenus()
        this.initSelectedMenus(rid)
      }
    },
    initallMenus () { // 初始化菜单数据
      this.getRequest('/system/basic/permiss/menus').then(resp => {
        if (resp) {
          this.allMenus = resp
        }
      })
    },
    initSelectedMenus (rid) { // 初始化角色默认拥有的菜单权限
      this.getRequest(`/system/basic/permiss/mid/${rid}`).then(resp => {
        if (resp) {
          this.selectedMenus = resp
        }
      })
    },
    doUpdate (rid, index) { // 根据角色id来修改该角色对应的权限 确认修改按钮
      let tree = this.$refs.tree[index]
      let selected = tree.getCheckedKeys(true)
      // 构建一个参数
      let parm = {
        rid,
        mids: selected
      }
      console.log(parm)
      this.putRequest('/system/basic/permiss/', parm).then(resp => {
        if (resp) {
          this.activeName = -1
        }
      })
    },
    cancelUpdate () { // 取消按钮 关闭当前打开面板
      this.activeName = -1
    },
    deleteRole (role) { // 删除角色
      this.$confirm(`此操作将永久删除该 【 ${role.nameZh} 】 角色, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/system/basic/permiss/role/${role.id}`).then(resp => {
          if (resp) {
            this.initRoles()
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
.permiss-mana-tool{
  .el-input{
    width: 300px;
    margin-right: 10px
  }
}
.permiss-mana-main{
  margin-top: 10px;
  width: 750px;
}
</style>
