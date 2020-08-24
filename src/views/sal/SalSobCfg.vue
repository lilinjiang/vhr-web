<template>
  <!-- 员工账套设置 -->
  <div>
    <!-- 预留的头 -->
    <div>
    </div>
    <!-- 表 -->
    <div>
      <el-table
        height="532"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="emps" border stripe size="small">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" fixed width="120" align="left"></el-table-column>
        <el-table-column prop="workID" label="工号" width="120" align="left"></el-table-column>
        <el-table-column prop="email" label="电子邮件" width="200" align="left"></el-table-column>
        <el-table-column prop="phone" label="电话号码" width="120" align="left"></el-table-column>
        <el-table-column prop="department.name" label="所属部门" width="120" align="left"></el-table-column>
        <el-table-column label="工资账套" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                      <td>基本工资</td>
                      <td>{{scope.row.salary.basicSalary}}</td>
                  </tr>
                  <tr>
                      <td>交通补助</td>
                      <td>{{scope.row.salary.trafficSalary}}</td>
                  </tr>
                  <tr>
                      <td>午餐补助</td>
                      <td>{{scope.row.salary.lunchSalary}}</td>
                  </tr>
                  <tr>
                      <td>奖金</td>
                      <td>{{scope.row.salary.bonus}}</td>
                  </tr>
                  <tr>
                      <td>养老金比率</td>
                      <td>{{scope.row.salary.pensionPer}}</td>
                  </tr>
                  <tr>
                      <td>养老金基数</td>
                      <td>{{scope.row.salary.pensionBase}}</td>
                  </tr>
                  <tr>
                      <td>医疗保险比率</td>
                      <td>{{scope.row.salary.medicalPer}}</td>
                  </tr>
                  <tr>
                      <td>医疗保险基数</td>
                      <td>{{scope.row.salary.medicalBase}}</td>
                  </tr>
                  <tr>
                      <td>公积金比率</td>
                      <td>{{scope.row.salary.accumulationFundPer}}</td>
                  </tr>
                  <tr>
                      <td>公积金基数</td>
                      <td>{{scope.row.salary.accumulationFundBase}}</td>
                  </tr>
                  <tr>
                      <td>启用时间</td>
                      <td>{{scope.row.salary.createDate|dateformat}}</td>
                  </tr>
                </table>
              </div>
              <el-tag style="width:110px">{{scope.row.salary.name}}</el-tag>
            </el-tooltip>
            <el-tag v-else style="width:110px">暂未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <el-popover
                placement="left"
                title="修改工资账套"
                width="200"
                trigger="click"
                @show="showPop(scope.row.salary)"
                >
                <div>
                  <el-button style="width:193px;margin-bottom:5px" @click="hidePop(scope.row)" size="mini" type="primary">确认修改</el-button>
                  <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in salaries"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                  </el-select>
                </div>
                <el-button icon="el-icon-edit" slot="reference" size="small" type="danger">修改工资账套</el-button>
              </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end; margin-top:5px">
        <el-pagination
          @current-change="currentChange"
          @size-change="sizeChange"
          :page-sizes="[10, 15, 20, 30]"
          background
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
let vm
export default {
  name: 'SalSobCfg',
  data () {
    return {
      loading: false,
      // 员工集合数据
      emps: [],
      // 工资账套集合数据
      salaries: [],
      // 当前员工所属工资账套的id
      currentSalary: null,
      // 员工总数
      total: 0,
      // 当前分页
      currentPage: 1,
      currentSize: 10
    }
  },
  mounted () {
    this.initEmps()
    this.initSalaries()
    vm = this
  },
  filters: {
    // 时间格式化
    dateformat (date) {
      if (date != null) {
        return vm.moment(date).format('YYYY年MM月DD日')
      }
    }
  },
  methods: {
    initEmps () { // 获取数据
      this.loading = true
      this.getRequest(`/salary/sobcfg/?page=${this.currentPage}&size=${this.currentSize}`).then(resp => {
        if (resp) {
          this.emps = resp.list
          this.total = resp.total
          this.loading = false
        }
      })
    },
    initSalaries () { // 获取工资套
      this.getRequest('/salary/sobcfg/salaries').then(resp => {
        if (resp) {
          this.salaries = resp
        }
      })
    },
    showPop (data) { // 修改员工工资账套当弹出框打开时
      if (data) {
        this.currentSalary = data.id
      } else {
        this.currentSalary = null
      }
    },
    hidePop (data) { // 修改员工工资账套当弹出框关闭时
      if (this.currentSalary) {
        this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
          if (resp) {
            this.initEmps()
          }
        })
      }
    },
    sizeChange (size) { // 每页行数发生变化
      this.currentSize = size
      this.initEmps()
    },
    currentChange (page) { // 页码发生变化
      this.currentPage = page
      this.initEmps()
    }
  }
}
</script>
