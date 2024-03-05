<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="24">
            <el-form-item label="对比类型:">
              <el-select
                v-model="where.type"
                class="ele-block"
                clearable
                placeholder="请选择类型">
                <el-option :value="'inventory_id'" label="存货"/>
                <el-option :value="'custom_id'" label="自由项"/>
                <el-option :value="'custom_data_id'" label="自由值"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-search"
                type="primary"
                @click="getComparison">查询
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <comparison-table ref="table" :titleList="titleList">
        <div v-for="(item, index) in list" :key="index" :slot="item.name">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <ele-pro-table
              :datasource="item.list"
              :columns="columns"
              height="calc(100vh - 305px)"
              class="ele-table-default-head"
              :show-header="false"
              :needPage="false"
              highlight-current-row
              @current-change="handleCurrentChange">
                <template slot="name" slot-scope="{row}">
                  <el-link
                    :underline="false"
                    :disabled="row.disabled"
                    type="primary">
                    {{ row.name }}{{ row.disabled ? "(已停用)" : "" }}
                  </el-link>
                </template>
            </ele-pro-table>
          </el-table-draggable>
        </div>
      </comparison-table>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ComparisonTable from "./comparsion-table.vue";

export default {
  name: 'InventoryComparison',
  components: {ComparisonTable},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格字段
      columns: [
        {
          prop: 'name',
          label: '名称',
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 120,
          slot: 'name',
        },
      ],
      // 表格数据列表
      list: [
        {name: 'first', list: []},
        {name: 'second', list: []},
        {name: 'third', list: []}
      ],
      // 当前选中行
      currentRow: null,
      // 表格搜索条件
      where: { type: 'inventory_id' },
      // 标题组
      titles: {
        'inventory_id': ['存货', '自由项', '自由值'],
        'custom_id': ['自由项', '存货', '自由值'],
        'custom_data_id': ['自由值', '存货', '自由项'],
      },
      // 查询显示的 title 组 默认存货
      titleList: []
    };
  },
  mounted() {
    this.getComparison()
  },
  methods: {
    /* 获取数组 */
    getComparison() {
      // 初始化列表
      this.initList()
      // loading 覆盖.app-container下
      const loading = this.$loading({target: '.app-container',lock: true});
      let params = {target: 'inventory', column: this.where.type}
      this.$http.get('/inventorycomparison/index', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.options = res.data.data;
          this.list[0].list = this.getLevelList(res.data.data, 1)
          this.titleList = this.titles[this.where.type]
          loading.close()
        } else {
          loading.close()
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close()
        this.$message.error(e.message);
      });
    },
    /* 获取子级数组 */
    getLevelList(data, level) {
      let array = [];
      data.forEach(item => {
        let children = []
        if (item.children) {
          children = this.getLevelList(item.children, level + 1)
        }
        let line = {code: item.value, name: item.label, level: level, disabled: item.disabled}
        if (children.length > 0) {
          line.children = children
        }
        array.push(line)
      })
      return array
    },
    /* 选中行触发事件 */
    handleCurrentChange(val) {
      this.currentRow = val;
      if (val && val.children) {
        this.list[val.level].list = val.children
        if(this.list[val.level + 1]) {
          this.list[val.level + 1].list = []
        }
      }
    },
    /* 初始化列表 */
    initList() {
      this.list = [
        {name: 'first', list: []},
        {name: 'second', list: []},
        {name: 'third', list: []}
      ]
    }
  },
}
</script>

<style scoped>
</style>
