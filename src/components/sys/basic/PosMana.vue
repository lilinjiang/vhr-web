<template>
  <!-- 职位管理页面 -->
  <div>
    <div>
      <el-input
        size="small"
        class="pos-input"
        placeholder="添加职位..."
        prefix-icon="el-icon-plus"
        @keydown.enter.native="addPosition"
        v-model="pos.name"
      ></el-input>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addPosition">添加</el-button>
    </div>
    <div class="pos-main">
      <el-button type="danger" size="small" @click="deleteMany" :disabled="multipleSelection.length==0" style="margin-bottom:10px">批量删除</el-button>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="positions" @selection-change="handleSelectionChange" size="small" stripe border style="width: 70%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号" width="55"></el-table-column>
        <el-table-column prop="name" label="职位名称" width="180"></el-table-column>
        <el-table-column prop="createDate" :formatter="dateFormat" label="创建时间"></el-table-column>
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag size="small" type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 对话框 -->
    <el-dialog title="修改职位" :visible.sync="dialogVisible" width="30%" >
      <div>
        <div style="margin-bottom:8px">
          <el-tag>职位名称</el-tag>
          <el-input placeholder="请输入职位名称" v-model="updatePos.name" size="small" class="update-pos-input"></el-input>
        </div>
        <div>
          <el-tag>是否启用</el-tag>
          <el-switch
                  style="margin-left: 8px"
                  v-model="updatePos.enabled"
                  active-text="启用"
                  inactive-text="禁用">
          </el-switch>
        </div>
      </div>
      <span slot="footer"  class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// // 引入时间格式化插件
// import moment from 'moment'
// // 中文简体
// moment.locale('zh-cn')

export default {
  name: 'PosMana',
  data () {
    return {
      // 用于保存表单职位数据
      pos: {
        name: ''
      },
      // 用于保存修改时表单职位数据
      updatePos: {
        name: '',
        enabled: false
      },
      // 用于保存表格职位数据
      positions: [],
      // 用于标识对话框是否是关闭的
      dialogVisible: false,
      // 用于保存复选框选中的对象
      multipleSelection: [],
      loading: false
    }
  },
  created () {},
  mounted () {
    // 获取职位信息
    this.initPositions()
  },
  methods: {
    initPositions () { // 获取全部职位
      this.loading = true
      this.getRequest('/system/basic/pos/').then(resp => {
        if (resp) {
          this.positions = resp
        }
        this.loading = false
      })
    },
    showEditView (index, row) { // 打开修改职位对话框
      Object.assign(this.updatePos, row)
      this.dialogVisible = true
    },
    doUpdate () { // 确认修改职位
      this.putRequest('/system/basic/pos/', this.updatePos)
        .then(resp => {
          if (resp) {
            // 重新加载表格
            this.initPositions()
            // 关闭对话框
            this.dialogVisible = false
          }
        })
    },
    handleDelete (index, row) { // 删除一个职位
      this.$confirm('此操作将永久删除【 ' + row.name + ' 】职位！, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRequest('/system/basic/pos/' + row.id).then(resp => {
            if (resp) {
              this.initPositions()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addPosition () { // 新增一个职位
      if (this.pos.name) {
        this.postRequest('/system/basic/pos/', this.pos).then(resp => {
          if (resp) {
            this.initPositions()
            this.pos.name = ''
          }
        })
      } else {
        this.$message({
          message: '职位名称不能为空！',
          type: 'warning'
        })
      }
    },
    dateFormat (row, column, cellValue, index) { // 格式化时间
      const daterc = row[column.property]
      if (daterc != null) {
        const timeFormat = this.moment(daterc).format('YYYY-MM-DD HH:mm:ss')
        return timeFormat
      }
    },
    handleSelectionChange (val) { // 复选框选中回调
      this.multipleSelection = val
    },
    deleteMany () { // 批量删除
      this.$confirm('此操作将永久删除【 ' + this.multipleSelection.length + ' 】个职位！, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里需要一个数组参数
        let ids = []
        this.multipleSelection.forEach(item => {
          ids.push(item.id)
        })
        this.deleteRequest('/system/basic/pos/', ids).then(resp => {
          if (resp) {
            this.initPositions()
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
.pos-input {
  width: 300px;
  margin-right: 10px;
}
.pos-main {
  margin-top: 10px;
}
.update-pos-input{
  width: 300px;
  margin-left: 8px
}
</style>
