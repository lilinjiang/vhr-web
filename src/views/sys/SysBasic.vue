<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="部门管理" name="depmana"><DepMana></DepMana></el-tab-pane>
      <el-tab-pane label="职位管理" name="posmana"><PosMana></PosMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="joblevelmana"><JobLevelMana></JobLevelMana></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="ecmana"><EcMana></EcMana></el-tab-pane>
      <el-tab-pane label="权限管理" name="permissmana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 部门管理
import DepMana from '../../components/sys/basic/DepMana.vue'
// 奖惩规则
import EcMana from '../../components/sys/basic/EcMana.vue'
// 职称管理
import JobLevelMana from '../../components/sys/basic/JobLevelMana.vue'
// 权限管理
import PermissMana from '../../components/sys/basic/PermissMana.vue'
// 职位管理
import PosMana from '../../components/sys/basic/PosMana.vue'

export default {
  name: 'SysBasic',
  data () {
    return {
      activeName: 'depmana'
    }
  },
  components: {
    [DepMana.name]: DepMana,
    [EcMana.name]: EcMana,
    [JobLevelMana.name]: JobLevelMana,
    [PermissMana.name]: PermissMana,
    [PosMana.name]: PosMana
  }
}
</script>
