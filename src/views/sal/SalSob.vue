<template>
  <!-- 工资账套管理 -->
  <div style="width:1115px">
    <!-- 工具栏 -->
    <div class="sal-tools">
      <el-button @click="showAddSalaryView" icon="el-icon-plus" size="small" type="primary">添加工资账套</el-button>
      <el-button size="small" @click="initSalaries()" icon="el-icon-refresh" type="success"></el-button>
    </div>
    <!-- 表格 -->
    <div style="margin-top:10px;" >
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="salaries"
        style="width: 100%"
        border
        stripe
        size="small"
        >
        <el-table-column align="center" type="selection" width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="账套名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="basicSalary"
          label="基本工资"
          width="70">
        </el-table-column>
        <el-table-column
          prop="trafficSalary"
          label="交通补助"
          width="70">
        </el-table-column>
        <el-table-column
          prop="lunchSalary"
          label="午餐补助"
          width="70">
        </el-table-column>
        <el-table-column
          prop="bonus"
          label="奖金"
          width="70">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="启用时间"
          :formatter="dateFormat"
          width="100">
        </el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column
            prop="pensionPer"
            label="比率"
            width="70">
          </el-table-column>
          <el-table-column
            prop="pensionBase"
            label="基数"
            width="70">
          </el-table-column>
        </el-table-column>
         <el-table-column label="医疗保险" align="center">
          <el-table-column
            prop="medicalPer"
            label="比率"
            width="70">
          </el-table-column>
          <el-table-column
            prop="medicalBase"
            label="基数"
            width="70">
          </el-table-column>
        </el-table-column>
         <el-table-column label="公积金" align="center">
          <el-table-column
            prop="accumulationFundPer"
            label="比率"
            width="70">
          </el-table-column>
          <el-table-column
            prop="accumulationFundBase"
            label="基数"
            width="70">
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <el-button size="small" @click="showEditSalaryView(scope.row)" >编辑</el-button>
            <el-button size="small" @click="deleteSalary(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增工资套的dialog对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @close="handleClose"
      width="40%"
      >
      <div class="sal-input-dialog">
        <el-steps direction="vertical" :active="activeItemIndex">
          <el-step :title="itemName" v-for="(itemName,index) in salaryItemName" :key="index"></el-step>
        </el-steps>
        <el-input v-model="salary[title]" style="width:200px" v-show="activeItemIndex==index" type="text" :placeholder="'请输入'+salaryItemName[index]+'...'" v-for="(value,title,index) in  salary" :key="index">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button style="width:84px" @click="preStep">{{activeItemIndex==0?'取消':'上一步'}}</el-button>
        <el-button style="width:84px" type="primary"  @click="nextStep">{{activeItemIndex==10?'完成':'下一步'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SalSob',
  data () {
    return {
      loading: false,
      // 工资账套数据
      salaries: [],
      // 工资账套对话框的标题
      dialogTitle: '添加工资账套',
      // 工资账套的dialog显示控制
      dialogVisible: false,
      // 工资账套的步骤条数据
      salaryItemName: [
        '基本工资',
        '交通补助',
        '午餐补助',
        '奖金',
        '养老金比率',
        '养老金基数',
        '医疗保险比率',
        '医疗保险基数',
        '公积金比率',
        '公积金基数',
        '账套名称'
      ],
      // 标识工资账套的步骤条当前进行到的步骤
      activeItemIndex: 0,
      // 工资账套表单数据
      salary: {
        // 基本工资
        basicSalary: null,
        // 交通补助
        trafficSalary: null,
        // 午餐补助
        lunchSalary: null,
        // 奖金
        bonus: null,
        // 养老金比率
        pensionPer: null,
        // 养老金基数
        pensionBase: null,
        // 医疗保险比率
        medicalPer: null,
        // 医疗保险基数
        medicalBase: null,
        // 公积金比率
        accumulationFundPer: null,
        // 公积金基数
        accumulationFundBase: null,
        // 账套名称
        name: ''
      }
    }
  },
  mounted () {
    this.initSalaries()
  },
  methods: {
    initSalaries () { // 初始化工资账套信息
      this.loading = true
      this.getRequest('/salary/sob/').then(resp => {
        if (resp) {
          this.salaries = resp
        }
        this.loading = false
      })
    },
    dateFormat (row, column, cellValue, index) { // 格式化时间
      const daterc = row[column.property]
      if (daterc != null) {
        const timeFormat = this.moment(daterc).format('YYYY-MM-DD')
        return timeFormat
      }
    },
    showAddSalaryView () { // 打开新增工资账套对话框
      this.dialogTitle = '添加工资账套'
      this.dialogVisible = true
    },
    nextStep () { // 下一步操作
      // 当处于最后一步操作时点击完成则添加新的账套
      if (this.activeItemIndex === 10) {
        if (this.salary.id) {
          this.putRequest('/salary/sob/', this.salary).then(resp => {
            if (resp) {
              this.initSalaries()
              this.dialogVisible = false
            }
          })
        } else {
          this.postRequest('/salary/sob/', this.salary).then(resp => {
            if (resp) {
              this.initSalaries()
              this.dialogVisible = false
            }
          })
        }
        return
      }
      this.activeItemIndex++
    },
    preStep () { // 上一步操作
      if (this.activeItemIndex === 0) {
        this.dialogVisible = false
        this.activeItemIndex = 0
        return
      }
      this.activeItemIndex--
    },
    handleClose () { // 工资账套表单对话框关闭前回调
      this.activeItemIndex = 0
      this.salary = {
        // 基本工资
        basicSalary: null,
        // 交通补助
        trafficSalary: null,
        // 午餐补助
        lunchSalary: null,
        // 奖金
        bonus: null,
        // 养老金比率
        pensionPer: null,
        // 养老金基数
        pensionBase: null,
        // 医疗保险比率
        medicalPer: null,
        // 医疗保险基数
        medicalBase: null,
        // 公积金比率
        accumulationFundPer: null,
        // 公积金基数
        accumulationFundBase: null,
        // 账套名称
        name: ''
      }
    },
    deleteSalary (row) { // 删除一个工资账套
      this.$confirm(`此操作将永久删除 【 ${row.name} 】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/salary/sob/${row.id}`).then(resp => {
          if (resp) {
            this.initSalaries()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditSalaryView (data) { // 打开修改工资账套界面
      this.dialogTitle = '添加工资账套'
      this.dialogVisible = true
      this.salary.basicSalary = data.basicSalary
      this.salary.trafficSalary = data.trafficSalary
      this.salary.lunchSalary = data.lunchSalary
      this.salary.bonus = data.bonus
      this.salary.pensionPer = data.pensionPer
      this.salary.pensionBase = data.pensionBase
      this.salary.medicalPer = data.medicalPer
      this.salary.medicalBase = data.medicalBase
      this.salary.accumulationFundPer = data.accumulationFundPer
      this.salary.accumulationFundBase = data.accumulationFundBase
      this.salary.name = data.name
      this.salary.id = data.id
    }
  }
}
</script>

<style lang="scss" scoped>
.sal-tools{
  display: flex;
  justify-content: space-between;
}
.sal-input-dialog{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
