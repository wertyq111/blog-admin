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
          <el-col :lg="6" :md="12">
            <el-form-item label="存货:">
              <el-select
                v-model="where.inventory_id"
                class="ele-block"
                filterable
                clearable
                placeholder="请选择存货">
                <el-option
                  v-for="item in inventoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="存货分类:">
              <el-select
                v-model="where.inventory_category_id"
                class="ele-block"
                filterable
                clearable
                placeholder="请选择存货分类">
                <el-option
                  v-for="item in inventoryCategoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="仓库:">
              <el-select
                v-model="where.warehouse_id"
                class="ele-block"
                filterable
                clearable
                placeholder="请选择仓库">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-search"
                type="primary"
                @click="reload(); getStatistics();">查询
              </el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="url"
        :where="where"
        :summary-method="getSummaries"
        show-summary>
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <!-- 导出按钮 -->
          <export-excel-button
            v-if="permission.includes('sys:reserve:export')"
            :target="'reserve'"
            :where="where"
          />
        </template>
      </ele-pro-table>
    </el-card>
    <!--<el-card shadow="always">
      <div slot="header" class="clearfix">
        <span style="font-size: x-large">合计</span>
      </div>
      <div class="text item">
        <el-col :lg="5"><el-tag type="success" effect="plain" ><span style="font-size: large">现存数量: {{ statisticsData.reserve_number }}</span></el-tag></el-col>
        <el-col :lg="5"><el-tag type="warning" effect="plain"><span style="font-size: large">预计入库数量: {{ statisticsData.er_number }}</span></el-tag></el-col>
        <el-col :lg="5"><el-tag type="danger" effect="plain"><span style="font-size: large">待发货数量: {{ statisticsData.ws_number }}</span></el-tag></el-col>
        <el-col :lg="5"><el-tag type="info" effect="plain"><span style="font-size: large">预计出库数量: {{ statisticsData.ed_number }}</span></el-tag></el-col>
        <el-col :lg="4"><el-tag effect="plain"><span style="font-size: large">可用数量: {{ statisticsData.available_number }}</span></el-tag></el-col>
      </div>
    </el-card>-->
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ExportExcelButton from "@/components/ExportExcelButton.vue";

export default {
  name: 'Reserve',
  components: {ExportExcelButton},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/reserve/index',
      // 表格列配置
      columns: [
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'inventory_code',
          label: '存货编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'inventory_name',
          label: '存货名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'warehouse_name',
          label: '仓库名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'reserve_number',
          label: '现存数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'er_number',
          label: '预计入库数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'ws_number',
          label: '待发货数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'ed_number',
          label: '预计出库数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'available_number',
          label: '可用数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 100,
        }
      ],
      // 表格搜索条件
      where: {},
      // 存货列表
      inventoryList: [],
      // 存货分类列表
      inventoryCategoryList: [],
      // 仓库列表
      warehouseList: [],
      // 统计值
      statisticsData: {},
      // 统计值填充
      statisticsFill: {
        '现存数量': 'reserve_number',
        '预计入库数量': 'er_number',
        '待发货数量': 'ws_number',
        '预计出库数量': 'ed_number',
        '可用数量': 'available_number'
      },
    };
  },
  watch: {},
  updated () {
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    })
  },
  mounted() {
    this.getInventoryList(); // 查询部门列表
    this.getWarehouseList(); // 查询仓库列表
    this.getCategoryList(); // 查询存货分类列表
    this.getStatistics(); // 查询统计信息
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 获取存货列表 */
    getInventoryList() {
      let params = {status: 1}
      this.$http.get('/inventoryarchive/getList', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.inventoryList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 查询仓库列表 */
    getWarehouseList() {
      let params = {status: 1};
      this.$http.get('/warehouse/getList', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.warehouseList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取分类列表 */
    getCategoryList() {
      let params = {code: "inventory_category"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.inventoryCategoryList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 查询统计信息 */
    getStatistics() {
      this.$http.get('/reserve/statistics', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          this.statisticsData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 合计 */
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'; //可以改合计行的名称
          return;
        }
        if (this.statisticsFill[column.label]) {
          sums[index] = this.statisticsData[this.statisticsFill[column.label]];
        } else {
          sums[index] = '--';
        }
      });

      return sums; //返回sums数组,sums数组中各项就会显示在合计行的各列中
    },
    /* 表格合并行 */
    objectSpanMethod({rowIndex, columnIndex}) {
      // 合并最后一行前 4 列
      let lastRow = this.$refs.table.data.length - 1;
      if (rowIndex === lastRow) {
        if (columnIndex === 1) {
          return [1, 3];
        } else if (columnIndex >= 2 && columnIndex < 4) {
          return [0, 0];
        }
      }
    },
  },
}
</script>

<style scoped>
/deep/ .el-table--border th.gutter:last-of-type {
  display: table-cell !important;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
