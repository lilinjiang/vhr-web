<template>
  <!-- 基本资料 -->
  <div>
    <!-- 工具栏 -->
    <div>
      <div class="emp-tools">
      <!-- 左边 -->
        <div>
          <el-input :disabled="showAdvanceSearchView" size="small" v-model="keyword"  @clear="initEmps" clearable @keydown.enter.native="initEmps" prefix-icon="el-icon-search" placeholder="搜索员工..." style="width:300px;margin-right:10px"></el-input>
          <el-button :disabled="showAdvanceSearchView" type="primary" size="small" @click="this.initEmps" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" size="small" @click="showAdvanceSearchView=!showAdvanceSearchView;popVisible2=false">
            <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <!-- 右边 -->
        <div>
          <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="importDataDisable"
            style="display:inline-flex;margin-right:10px"
            action="/employee/basic/import"
            >
            <el-button :disabled="importDataDisable" size="small" :icon="importDataBtnIcon" type="success">
              {{importDataBtnText}}
            </el-button>
          </el-upload>
          <el-button @click="exportData" icon="el-icon-download" size="small" type="success">
            导出数据
          </el-button>
          <el-button size="small" icon="el-icon-plus" @click="showAddEmpView" type="primary">
            添加员工
          </el-button>
        </div>
      </div>
      <!-- 高级搜索 -->
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchView" class="more-input">
          <el-row>
            <el-col :span="5">
              政治面貌:
              <el-select size="mini" class="add-emp-item-width" v-model="searchValue.politicId" placeholder="政治面貌">
                <el-option
                  v-for="item in politicsstatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              民族:
              <el-select size="mini" class="add-emp-item-width" v-model="searchValue.nationId" placeholder="民族">
                <el-option
                  v-for="item in nations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职位:
              <el-select size="mini" class="add-emp-item-width" v-model="searchValue.posId" placeholder="职位">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职称:
              <el-select size="mini" class="add-emp-item-width" v-model="searchValue.jobLevelId" placeholder="职称">
                <el-option
                  v-for="item in jobLevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              聘用形式:
              <el-radio-group v-model="searchValue.engageForm">
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="5">
              所属部门:
              <el-popover
                placement="right"
                title="部门列表"
                width="250"
                trigger="manual"
                v-model="popVisible2">
                <div>
                  <!-- 部门树 -->
                  <el-tree :data="allDeps" default-expand-all :props="defaultProps" @node-click="searvhViewHandleNodeClick"></el-tree>
                </div>
                <div class="emp-dept-input-more" slot="reference"  @click="showDepView('advanced')">
                  {{inputDepName}}
                </div>
              </el-popover>
            </el-col>
            <el-col :span="10">
              入职日期:
              <el-date-picker
                size="mini"
                v-model="searchValue.beginDataScope"
                unlink-panels
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="5" :offset="2">
              <el-button size="mini" type="">取消</el-button>
              <el-button size="mini" @click="emptyAdvanced" type="">清空</el-button>
              <el-button size="mini" icon="el-icon-search" @click="initEmps ('advanced')" type="primary">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <!-- 表格 -->
    <div style="margin-top:15px">
      <el-table
        height="545"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        size="small"
        :data="emps"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          fixed
          align="left"
          width="90">
        </el-table-column>
        <el-table-column
          prop="workID"
          label="工号"
          align="left"
          width="85">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="出生日期"
          :formatter="dateFormat"
          align="left"
          width="95">
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号码"
          align="left"
          width="150">
        </el-table-column>
        <el-table-column
          prop="wedlock"
          label="婚姻情况"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="nation.name"
          label="民族"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="nativePlace"
          label="籍贯"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="politicsstatus.name"
          label="政治面貌"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          width="180"
          align="left"
          label="电子邮件">
        </el-table-column>
        <el-table-column
          prop="phone"
          width="100"
          align="left"
          label="电话号码">
        </el-table-column>
        <el-table-column
          prop="address"
          width="220"
          align="left"
          label="联系地址">
        </el-table-column>
        <el-table-column
          prop="department.name"
          width="100"
          align="left"
          label="所属部门">
        </el-table-column>
         <el-table-column
            prop="position.name"
            width="100"
            label="职位">
          </el-table-column>
          <el-table-column
            prop="jobLevel.name"
            width="100"
            label="职称">
          </el-table-column>
          <el-table-column
            prop="engageForm"
            width="100"
            align="left"
            label="聘用形式">
          </el-table-column>
          <el-table-column
            prop="tiptopDegree"
            width="80"
            align="left"
            label="最高学历">
          </el-table-column>
          <el-table-column
            prop="specialty"
            width="150"
            align="left"
            label="专业">
          </el-table-column>
          <el-table-column
            prop="school"
            width="150"
            align="left"
            label="毕业院校">
          </el-table-column>
          <el-table-column
            prop="beginDate"
            width="95"
            align="left"
            :formatter="dateFormat"
            label="入职日期">
          </el-table-column>
          <el-table-column
            prop="conversionTime"
            width="95"
            align="left"
            :formatter="dateFormat"
            label="转正日期">
          </el-table-column>
          <el-table-column
            prop="beginContract"
            width="95"
            align="left"
            :formatter="dateFormat"
            label="合同起始日期">
          </el-table-column>
          <el-table-column
            prop="endContract"
            width="95"
            align="left"
            :formatter="dateFormat"
            label="合同截止日期">
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="合同期限">
            <template slot-scope="scope">
                <el-tag style="width:50px">{{scope.row.contractTerm}}</el-tag>
                年
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="showEditEmpView(scope.row)" type="info" style="padding: 3px" size="mini">编辑</el-button>
              <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
              <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
      <div style="display:flex;justify-content:flex-end;margin-top:5px">
        <el-pagination
          background
          :page-sizes="[10, 15, 20, 30]"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          @current-change="currentChange"
          @size-change="sizeChange"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 新增员工对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="70%"
      @close="colseAddEmpDialog"
      >
      <div>
        <el-form :model="emp" ref="empFrom" :rules="rules">
          <!-- 第一行 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input class="add-emp-item-width" size="mini"  prefix-icon="el-icon-user" v-model="emp.name" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                  size="mini"
                  class="add-emp-item-width"
                  v-model="emp.birthday"
                  type="date"
                  placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select size="mini" class="add-emp-item-width" v-model="emp.politicId" placeholder="政治面貌">
                  <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select size="mini" class="add-emp-item-width" v-model="emp.nationId" placeholder="民族">
                  <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input class="add-emp-item-width" size="mini"  prefix-icon="el-icon-edit" v-model="emp.nativePlace" placeholder="请输入籍贯"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input class="add-emp-item-width" size="mini"  prefix-icon="el-icon-message" v-model="emp.email" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系地址:" prop="address">
                <el-input class="add-emp-item-width" size="mini"  prefix-icon="el-icon-edit" v-model="emp.address" placeholder="联系地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第三行 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select size="mini" class="add-emp-item-width" v-model="emp.posId" placeholder="职位">
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select size="mini" class="add-emp-item-width" v-model="emp.jobLevelId" placeholder="职称">
                  <el-option
                    v-for="item in jobLevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-popover
                  placement="right"
                  title="部门列表"
                  width="250"
                  trigger="manual"
                  v-model="popVisible">
                  <div>
                    <!-- 部门树 -->
                    <el-tree :data="allDeps" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </div>
                  <div class="emp-dept-input" slot="reference"  @click="showDepView">
                    {{inputDepName}}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话号码:" prop="phone">
                <el-input class="add-emp-item-width" size="mini" prefix-icon="el-icon-phone" v-model="emp.phone" placeholder="请输入电话号码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第四行 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workID">
                <el-input class="add-emp-item-width" size="mini" disabled v-model="emp.workID" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select size="mini" class="add-emp-item-width" v-model="emp.tiptopDegree" placeholder="学历">
                  <el-option
                    v-for="item in tiptopDegrees"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input class="add-emp-item-width" size="mini"  prefix-icon="el-icon-edit"  v-model="emp.school" placeholder="请输入毕业院校"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input class="add-emp-item-width" size="mini" prefix-icon="el-icon-edit" v-model="emp.specialty" placeholder="请输入专业名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第五行 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                  size="mini"
                  class="add-emp-item-width"
                  v-model="emp.beginDate"
                  type="date"
                  placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                  size="mini"
                  class="add-emp-item-width"
                  v-model="emp.conversionTime"
                  type="date"
                  placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                  size="mini"
                  class="add-emp-item-width"
                  v-model="emp.beginContract"
                  type="date"
                  placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同终止日期:" prop="endContract">
                <el-date-picker
                  placement="right"
                  size="mini"
                  class="add-emp-item-width"
                  v-model="emp.endContract"
                  type="date"
                  placeholder="合同终止日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第六行 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="身份证号码:" prop="idCard">
                <el-input style="width:170px" size="mini" prefix-icon="el-icon-edit"  v-model="emp.idCard" placeholder="请输入身份证号码" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EmpBasic',
  data () {
    return {
      // 员工数据
      emps: [],
      // 动画控制
      loading: false,
      popVisible: false,
      popVisible2: false,
      // 总页数
      total: 0,
      // 当前页码
      page: 1,
      // 每页显示行数
      size: 10,
      // 关键字 用户名
      keyword: '',
      // 民族select数据
      nations: [],
      // 职称select 数据
      jobLevels: [],
      // 政治面貌 select 数据
      politicsstatus: [],
      // 职位
      positions: [],
      // 学历
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      // 所有部门
      allDeps: [],
      // 选择部门的树结构赋值策略
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 员工表单的部门name
      inputDepName: '所属部门',
      // 员工数据模型
      emp: {
        // 姓名*
        name: '时光',
        // 性别*
        gender: '',
        // 生日*
        birthday: '',
        // 身份证号码*
        idCard: '965896145896852365',
        // 婚姻情况*
        wedlock: '',
        // 民族*
        nationId: null,
        // 籍贯*
        nativePlace: '山东',
        // 政治面貌id*
        politicId: null,
        // 邮箱*
        email: '1657371717@qq.com',
        // 手机号*
        phone: '17353527767',
        // 联系地址*
        address: '烟台海阳',
        // 部门id*
        departmentId: null,
        // 职称id*
        jobLevelId: null,
        // 职位id*
        posId: null,
        // 聘用形式*
        engageForm: '',
        // 最高学历*
        tiptopDegree: '',
        // 专业*
        specialty: '计算机应用技术',
        // 毕业院校*
        school: '鲁东大学',
        // 入职日期*
        beginDate: '2017-12-31T16:00:00.000+0000',
        // 在职状态
        workState: '在职',
        // 工号*
        workID: '',
        // 合同期限
        contractTerm: 1.0,
        // 转正日期*
        conversionTime: '2018-03-31T16:00:00.000+0000',
        // 离职日期
        notWorkDate: null,
        // 合同开始日期*
        beginContract: '2017-12-31T16:00:00.000+0000',
        // 合同截止日期*
        endContract: '2018-12-31T16:00:00.000+0000',
        salary: null
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
        idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }, {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          message: '身份证号码格式不正确',
          trigger: 'blur'
        }],
        wedlock: [{ required: true, message: '请选择婚姻状况', trigger: 'blur' }],
        nationId: [{ required: true, message: '请选择民族', trigger: 'blur' }],
        nativePlace: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        politicId: [{ required: true, message: '请选择政治面貌', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }, {
          pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
          message: '手机号码格式不正确',
          trigger: 'blur'
        }],
        address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
        jobLevelId: [{ required: true, message: '请选择职称', trigger: 'blur' }],
        posId: [{ required: true, message: '请选择职位', trigger: 'blur' }],
        engageForm: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        tiptopDegree: [{ required: true, message: '请选择学历', trigger: 'blur' }],
        specialty: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
        school: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
        workID: [{ required: true, message: '请重新获取工号', trigger: 'blur' }],
        contractTerm: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        conversionTime: [{ required: true, message: '请选择转正日期', trigger: 'blur' }],
        beginContract: [{ required: true, message: '请选择合同开始日期', trigger: 'blur' }],
        endContract: [{ required: true, message: '请选择合同截止日期', trigger: 'blur' }]
      },
      // 标识员工表单对话框是否打开
      dialogVisible: false,
      // 员工表单title
      title: '添加员工',
      // 导入数据按钮的文本
      importDataBtnText: '导入数据',
      // 导入数据按钮的icon
      importDataBtnIcon: 'el-icon-upload2',
      // 导入数据按钮是否可用
      importDataDisable: false,
      // 控制当前是否启动高级搜索
      showAdvanceSearchView: false,
      // 高级搜索的数据
      searchValue: {
        // 政治面貌id*
        politicId: null,
        // 民族*
        nationId: null,
        // 职位id*
        posId: null,
        // 职称id*
        jobLevelId: null,
        // 聘用形式*
        engageForm: '',
        // 部门id*
        departmentId: null,
        // 入职日期范围 开始
        beginDataScope: null
      }
    }
  },
  mounted () {
    this.initEmps()
    // 民族、职称、政治面貌的数据一般来讲不会变化所以一进页面我们就加载
    this.initData()
    this.initPositions()
  },
  methods: {
    emptyEmp () { // 初始化emp数据
      // this.emp = {
      //   // 姓名*
      //   name: '',
      //   // 性别*
      //   gender: '',
      //   // 生日*
      //   birthday: '',
      //   // 身份证号码*
      //   idCard: '',
      //   // 婚姻情况*
      //   wedlock: '',
      //   // 民族*
      //   nationId: null,
      //   // 籍贯*
      //   nativePlace: '',
      //   // 政治面貌id*
      //   politicId: null,
      //   // 邮箱*
      //   email: '',
      //   // 手机号*
      //   phone: '',
      //   // 联系地址*
      //   address: '',
      //   // 部门id*
      //   departmentId: null,
      //   // 职称id*
      //   jobLevelId: null,
      //   // 职位id*
      //   posId: null,
      //   // 聘用形式*
      //   engageForm: '',
      //   // 最高学历*
      //   tiptopDegree: '',
      //   // 专业*
      //   specialty: '',
      //   // 毕业院校*
      //   school: '',
      //   // 入职日期*
      //   beginDate: '',
      //   // 在职状态
      //   workState: '在职',
      //   // 工号*
      //   workID: '',

      //   // 合同期限 （合同期限是后端计算这里的值不管用）
      //   // contractTerm: 1.0,

      //   // 转正日期*
      //   conversionTime: '',
      //   // 离职日期
      //   notWorkDate: null,
      //   // 合同开始日期*
      //   beginContract: '',
      //   // 合同截止日期*
      //   endContract: '',
      //   salary: null
      // }
      this.emp = {
        // 姓名*
        name: '时光',
        // 性别*
        gender: '',
        // 生日*
        birthday: '',
        // 身份证号码*
        idCard: '370687199810250000',
        // 婚姻情况*
        wedlock: '',
        // 民族*
        nationId: null,
        // 籍贯*
        nativePlace: '山东',
        // 政治面貌id*
        politicId: null,
        // 邮箱*
        email: '3519342832@qq.com',
        // 手机号*
        phone: '17353527767',
        // 联系地址*
        address: '烟台海阳',
        // 部门id*
        departmentId: null,
        // 职称id*
        jobLevelId: null,
        // 职位id*
        posId: null,
        // 聘用形式*
        engageForm: '',
        // 最高学历*
        tiptopDegree: '',
        // 专业*
        specialty: '计算机应用技术',
        // 毕业院校*
        school: '鲁东大学',
        // 入职日期*
        beginDate: '2017-12-31T16:00:00.000+0000',
        // 在职状态
        workState: '在职',
        // 工号*
        workID: '',
        // 合同期限
        contractTerm: 1.0,
        // 转正日期*
        conversionTime: '2018-03-31T16:00:00.000+0000',
        // 离职日期
        notWorkDate: null,
        // 合同开始日期*
        beginContract: '2017-12-31T16:00:00.000+0000',
        // 合同截止日期*
        endContract: '2018-12-31T16:00:00.000+0000',
        salary: null
      }
      this.inputDepName = ''
    },
    emptyAdvanced () { // 初始化高级搜索数据
      this.searchValue = {
        // 政治面貌id*
        politicId: null,
        // 民族*
        nationId: null,
        // 职位id*
        posId: null,
        // 职称id*
        jobLevelId: null,
        // 聘用形式*
        engageForm: '',
        // 部门id*
        departmentId: null,
        // 入职日期范围 开始
        beginDataScope: null
      }
      this.inputDepName = '所属部门'
      this.initEmps('advanced')
    },
    initEmps (type) { // 加载表格员工数据
      // 如果type存在，并且值为 advanced则代表是高级搜索 否则则为普通搜索
      let url = `/employee/basic/?page=${this.page}&size=${this.size}`
      if (type && type === 'advanced') {
        if (this.searchValue.politicId) {
          url += `&politicId=${this.searchValue.politicId}`
        }
        if (this.searchValue.nationId) {
          url += `&nationId=${this.searchValue.nationId}`
        }
        if (this.searchValue.posId) {
          url += `&posId=${this.searchValue.posId}`
        }
        if (this.searchValue.jobLevelId) {
          url += `&jobLevelId=${this.searchValue.jobLevelId}`
        }
        if (this.searchValue.engageForm) {
          url += `&engageForm=${this.searchValue.engageForm}`
        }
        if (this.searchValue.departmentId) {
          url += `&departmentId=${this.searchValue.departmentId}`
        }
        if (this.searchValue.beginDataScope) {
          url += `&beginDateScope=${this.searchValue.beginDataScope}`
        }
      } else {
        url += `&name=${this.keyword}`
      }
      this.loading = true
      this.getRequest(url).then(resp => {
        this.loading = false
        if (resp) {
          this.emps = resp.list
          this.total = resp.total
        }
      })
    },
    dateFormat (row, column, cellValue, index) { // 格式化时间
      const daterc = row[column.property]
      if (daterc != null) {
        const timeFormat = this.moment(daterc).format('YYYY-MM-DD')
        return timeFormat
      }
    },
    currentChange (currentPage) { // 分页组件页码改变事件
      this.page = currentPage
      this.initEmps()
    },
    sizeChange (currentSize) { // 分页组件每页行数改变事件
      this.size = currentSize
      this.initEmps()
    },
    showAddEmpView () { // 新增员工按钮点击事件
      this.initPositions()
      this.getMaxWordId()
      this.emptyEmp()
      this.dialogVisible = true
    },
    initData () { // 初始化职称，民族，政治面貌，等一些必要数据
      // 初始化民族
      if (!window.sessionStorage.getItem('nations')) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp
            window.sessionStorage.setItem('nations', JSON.stringify(resp))
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
      }

      // 获取职称
      if (!window.sessionStorage.getItem('jobLevels')) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.jobLevels = resp
            window.sessionStorage.setItem('jobLevels', JSON.stringify(resp))
          }
        })
      } else {
        this.jobLevels = JSON.parse(window.sessionStorage.getItem('jobLevels'))
      }

      // 获取政治面貌
      if (!window.sessionStorage.getItem('politicsstatus')) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp
            window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp))
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'))
      }

      // // 获取部门
      if (!window.sessionStorage.getItem('deps')) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp
            window.sessionStorage.setItem('deps', JSON.stringify(resp))
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem('deps'))
      }
    },
    initPositions () { // 初始化职位 因为职位可能会被变更所以在打开添加对话框时再加载
      this.getRequest('/employee/basic/position').then(resp => {
        if (resp) {
          this.positions = resp
        }
      })
    },
    getMaxWordId () { // 获取新增的员工号
      this.getRequest('/employee/basic/maxworkid').then(resp => {
        if (resp) {
          this.emp.workID = resp.obj
        }
      })
    },
    showDepView (type) { // 打开选择员工部门的popover弹出框
      if (type && type === 'advanced') {
        this.popVisible2 = !this.popVisible2
      } else {
        this.popVisible = !this.popVisible
      }
    },
    handleNodeClick (data) { // 新增 部门树的点击事件
      console.log(data)
      this.inputDepName = data.name
      this.emp.departmentId = data.id
      this.popVisible = !this.popVisible
    },
    searvhViewHandleNodeClick (data) { // 高级查询的部门树的点击事件
      this.inputDepName = data.name
      this.searchValue.departmentId = data.id
      this.popVisible2 = !this.popVisible2
    },
    colseAddEmpDialog () { // 添加员工dialog对话框关闭时间
      this.popVisible = false
    },
    doAddEmp () { // 执行添加或者修改员工方法
      // 如果有id代表是修改
      if (this.emp.id) {
        this.$refs['empFrom'].validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false
                this.initEmps()
              }
            })
          } else {
            return false
          }
        })
      } else {
        // 无id代表是新增
        this.$refs['empFrom'].validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false
                this.initEmps()
              }
            })
          } else {
            return false
          }
        })
      }
    },
    deleteEmp (emp) { // 根据id删除员工
      this.$confirm(`此操作将永久删除 【 ${emp.name} 】 , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/employee/basic/${emp.id}`).then(resp => {
          if (resp) {
            this.initEmps()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showEditEmpView (data) { // 打开修改员工窗口
      this.title = '编辑员工信息'
      this.initPositions()
      this.emp = data
      this.inputDepName = data.department.name
      this.dialogVisible = true
    },
    exportData () { // 导出下载员工数据
      window.open('/employee/basic/export', '_parent')
    },
    beforeUpload () { // 文件上传之前
      this.importDataDisable = true
      this.importDataBtnText = '正在导入'
      this.importDataBtnIcon = 'el-icon-loading'
    },
    onSuccess (response, file, fileList) { // 文件上传成功的回调
      this.$message({
        message: '上传成功！',
        type: 'success'
      })
      this.importDataDisable = false
      this.importDataBtnText = '导入数据'
      this.importDataBtnIcon = 'el-icon-upload2'
      this.initEmps()
    },
    onError (err, file, fileList) { // 文件上传失败
      console.log(err)
      this.importDataDisable = false
      this.importDataBtnText = '导入数据'
      this.importDataBtnIcon = 'el-icon-upload2'
      this.$message.error('上传失败！')
    }

  }
}
</script>

<style scoped>
.emp-tools{
  display: flex;
  justify-content: space-between;
}
.add-emp-item-width{
  width: 150px;
}
.emp-dept-input{
  width: 150px;
  display: inline-flex;
  font-size: 13px;
  border: 1px solid #dedede;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  padding-left: 8px;
  box-sizing: border-box;
  height: 28px;
  float: left;
  margin-top: 7px;
}
.emp-dept-input-more{
  width: 150px;
  display: inline-flex;
  font-size: 13px;
  border: 1px solid #dedede;
  border-radius: 5px;
  cursor: pointer;
  align-items: center;
  padding-left: 8px;
  box-sizing: border-box;
  height: 28px;
}
.more-input{
  border: 1px solid #409eff;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  margin: 10px 0px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(10px);
  opacity: 0;
}

</style>
