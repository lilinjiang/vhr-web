<template>
  <!-- 职称管理 -->
  <div>
    <div>
      <el-input
        size="small"
        class="jl-input"
        placeholder="添加职称..."
        prefix-icon="el-icon-plus"
        v-model="jl.name"
      ></el-input>
      <el-select size="small" class="jl-level-select" v-model="jl.titleLevel" placeholder="职称等级">
        <el-option
          v-for="item in titleLevels"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addJobLevel" >添加</el-button>
    </div>
    <div class="jl-main">
      <el-button type="danger" size="small" :disabled="multipleSelection.length==0" @click="deleteMany" style="margin-bottom:10px">批量删除</el-button>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="jls"
        @selection-change="handleSelectionChange"
        size="small" stripe border style="width: 80%"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="职称名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="titleLevel"
          label="职称级别">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          :formatter="dateFormat">
        </el-table-column>
        <el-table-column
          label="是否启用">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 对话框 -->
    <el-dialog title="修改职位" :visible.sync="dialogVisible" width="30%" >
      <div>
        <div style="margin-bottom:8px">
          <el-tag>职称名称</el-tag>
          <el-input placeholder="请输入职称名称" v-model="updateJl.name" size="small" class="update-jl-input"></el-input>
        </div>
        <div style="margin-bottom:8px">
          <el-tag>职称等级</el-tag>
          <el-select size="small" class="updateJl-level-select" v-model="updateJl.titleLevel" placeholder="职称等级">
            <el-option
              v-for="item in titleLevels"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-tag>是否启用</el-tag>
          <el-switch
                  style="margin-left: 8px"
                  v-model="updateJl.enabled"
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
export default {
  name: 'JobLevelMana',
  data () {
    return {
      // 表单数据
      jl: {
        name: '',
        titleLevel: ''
      },
      // 更新表单数据
      updateJl: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      // 职称等级
      titleLevels: [
        '初级',
        '中级',
        '副高级',
        '正高级',
        '员级'
      ],
      // 职称数据
      jls: [

      ],
      // 用于标识对话框是否是关闭的
      dialogVisible: false,
      // 选中职称数据
      multipleSelection: [],
      loading: false
    }
  },
  mounted () {
    // 初始化所有职称
    this.initJls()
  },
  methods: {
    initJls () { // 获取全部的职称
      this.loading = true
      this.getRequest('/system/basic/joblevel/')
        .then(resp => {
          if (resp) {
            this.jls = resp
          }
          this.loading = false
        })
    },
    dateFormat (row, column, cellValue, index) { // 格式化时间
      const daterc = row[column.property]
      if (daterc != null) {
        const timeFormat = this.moment(daterc).format('YYYY-MM-DD HH:mm:ss')
        return timeFormat
      }
    },
    addJobLevel () { // 添加职称
      if (!this.jl.name) {
        this.$message({
          message: '职称名称不能为空！',
          type: 'warning'
        })
        return false
      }
      if (!this.jl.titleLevel) {
        this.$message({
          message: '请选择职称等级！',
          type: 'warning'
        })
        return false
      }
      this.postRequest('/system/basic/joblevel/', this.jl)
        .then(resp => {
          this.jl.name = ''
          this.jl.titleLevel = ''
          this.initJls()
        })
    },
    handleDelete (row) { // 删除一个职称
      this.$confirm('此操作将永久删除【 ' + row.name + ' 】职称！, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRequest('/system/basic/joblevel/' + row.id).then(resp => {
            if (resp) {
              this.initJls()
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
    showEditView (row) { // 打开修改职称对话框
      Object.assign(this.updateJl, row)
      this.dialogVisible = true
    },
    doUpdate () { // 修改职称
      this.putRequest('/system/basic/joblevel/', this.updateJl)
        .then(resp => {
          if (resp) {
            // 重新加载表格
            this.initJls()
            // 关闭对话框
            this.dialogVisible = false
          }
        })
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
        this.deleteRequest('/system/basic/joblevel/', ids).then(resp => {
          if (resp) {
            this.initJls()
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
.jl-input {
  width: 300px;
  margin-right: 10px;
}
.jl-main {
  margin-top: 10px;
}
.jl-level-select{
  margin-right: 10px;
}
.update-jl-input{
  width: 300px;
  margin-left: 8px
}
.updateJl-level-select{
  margin-left: 8px
}
</style>
