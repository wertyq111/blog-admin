<!-- 基础数据公共函数 -->
<template>
    <template slot="deptList">
      <tree-select
        v-model="dept_id"
        :defaultExpandLevel="2"
        :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
        :options="deptList"
        placeholder="请选择分管部门"/>
    </template>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'BaseSelectList',
  props: {
    company: Object,
    status: String,
    dept_id: String,
  },
  components: {TreeSelect},
  data() {
    return {
      deptList: [],
      supplierList: [],
      form: this.value
    };
  },
  mounted() {
    this.getDeptList()
    this.getSupplierList()
  },
  methods: {
    /* 获取部门列表 */
    getDeptList() {
      if (this.company.id) {
        let params = {id: this.company.id};
        this.$http.get('/dept/getDescendantList', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.deptList = this.$util.toTreeData(res.data.data, 'id', 'pid');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 查询供应商列表 */
    getSupplierList() {
      let params = {status: this.status};
      this.$http.get('/supplierarchive/getList', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.supplierList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
  }
}
</script>

<style scoped>
</style>
