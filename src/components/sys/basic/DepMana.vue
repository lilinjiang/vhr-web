<template>
  <!-- 部门管理 -->
  <div style="width:500px">
    <el-input
      size="small"
      placeholder="输入部门名称进行搜索..."
      prefix-icon="el-icon-search"
      v-model="filterText">
    </el-input>

    <!--
      :filter-node-method 指定过滤器方法
     -->
    <el-tree
      style="margin-top:10px"
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree">
        <!-- 这里的 slot-scope="{ node, data }  node是 defaultProps  data是这一行的数据 -->
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span>
            <el-button
              type="primary"
              size="mini"
              class="dep-btn"
              @click="() => showAddDepView(data)">
              添加部门
            </el-button>
            <el-button
              type="danger"
              size="mini"
              class="dep-btn"
              @click="() => deleteDep(data)">
              删除部门
            </el-button>
          </span>
        </span>
    </el-tree>
    <!-- 新增对话框 -->
    <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <div style="margin-bottom:8px">
          <el-tag>上级部门</el-tag>
          <span style="margin-left: 8px">{{pname}}</span>
        </div>
        <div>
          <el-tag>部门名称</el-tag>
          <el-input placeholder="请输入部门名称" v-model="dep.name" size="small" class="dep-add-input"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initDep(),dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddDep">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'DepMana',
  data () {
    return {
      // 用于保存要搜索的部门名称
      filterText: '',
      // 用于保存部门集合
      deps: [],
      // 定义tree数据取值规则
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 标识新增对话框是否打开
      dialogVisible: false,
      // 添加部门的表单数据
      dep: {
        name: '',
        parentId: -1
      },
      // 用于储存添加窗口要显示父级部门name
      pname: ''
    }
  },
  mounted () {
    // 初始化部门数据
    this.initDeps()
  },
  watch: {
    // 当监听到 filterText发生改变则触发 tree组件的过滤器方法
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) { // 方法过滤
      // 该方法的value 是过滤值，data是tree树的每一条数据（该方法会执行多次） 该方法如果返回true则代表保留data，返回false则代表剔除data
      // 判断传来的参数是否为空，也就是搜索框的值，如果为空则直接把数据返回
      if (!value) return true
      console.log(data)
      return data.name.indexOf(value) !== -1
    },
    initDeps () { // 加载所有部门
      this.getRequest('/system/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp
        }
      })
    },
    showAddDepView (data) { // 打开添加部门视图
      this.pname = data.name
      this.dep.parentId = data.id
      this.dialogVisible = true
    },
    deleteDep (data) { // 删除部门
      console.log(data)
      if (data.parent) {
        this.$message({
          message: '该部门下存在子部门 !',
          type: 'warning'
        })
        return
      }
      this.$confirm(`此操作将永久删除 【 ${data.name} 】 部门, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/system/basic/department/${data.id}`).then(resp => {
          if (resp) {
            console.log('删除成功！')

            this.removeDepFromDeps(null, this.deps, data.id)// 动态在组件内删除此项
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    doAddDep () { // 添加部门
      if (!this.dep.name) {
        this.$message({
          message: '部门名称不能为空！',
          type: 'warning'
        })
        return false
      }
      this.postRequest('/system/basic/department/', this.dep).then(resp => {
        if (resp) {
          this.dialogVisible = false
          this.addDepToDeps(this.deps, resp.obj)
          this.initDep()
        }
      })
    },
    initDep () { // 清空Dep对象数据
      this.dep = {
        name: '',
        parentId: -1
      }
      this.pname = ''
    },
    addDepToDeps (deps, dep) { // 在添加部门后动态的向tree组件内添加数据 这里使用递归
      // 循环tree的数据数组 deps
      for (let i = 0; i < deps.length; i++) {
        // 取出数组内每一个dep
        let d = deps[i]
        // 用取出来的dep去对比是否传进来的dep的父级
        if (d.id === dep.parentId) {
          // 如果是，则直接拼接到其父级的children内
          d.children = d.children.concat(dep)
          // 如果其父级的children不为空则代表有子部门将该项设置为 父级部门 以便于删除时判断是否可以删除
          if (d.children.length > 0) {
            d.parent = true
          }
          return
          // 如果该数组取出的dep不是参数传进的dep的父级则用数组取出的dep的children再去进行匹配
        } else {
          this.addDepToDeps(d.children, dep)
        }
      }
    },
    removeDepFromDeps (p, deps, did) { // 在删除部门后动态的向tree组件内删除数据 这里使用递归
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i]
        // 如果 被删除的部门id 等于 数组对比上的id 则代表这一项就是被删除了的部门，即直接删除此项
        if (d.id === did) {
          // 删除匹配项
          deps.splice(i, 1)
          // 如果数组空了则代表该部门下面没有子部门
          if (deps.length === 0) {
            // 并且将该部门设置为非父级部门
            p.parent = false
          }
          return
        } else {
          // 如果该项没有匹配到就看一下 该项的children是否存在此部门
          this.removeDepFromDeps(d, d.children, did)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dep-btn{
  padding: 2px
}
.custom-tree-node{
  width: 100%;
  display: flex;
  justify-content:space-between;
}
.dep-add-input{
  width: 300px;
  margin-left: 8px
}
</style>
