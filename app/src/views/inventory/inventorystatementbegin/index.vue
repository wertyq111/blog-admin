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
          <el-col :lg="4" :md="12">
            <el-form-item label="存货:">
              <el-cascader
                v-model="where.inventory_id"
                clearable
                filterable
                placeholder="-请选择存货-"
                :options="inventoryList"
                :props="{emitPath: false}"
              />
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="仓库:">
              <el-select
                v-model="where.warehouse_id"
                class="ele-block"
                filterable
                clearable
                placeholder="-请选择仓库-"
                size="small">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="5" :md="12">
            <el-form-item label="结算日期:" prop="settle_date">
              <el-date-picker
                v-model="where.settle_date"
                type="daterange"
                class="ele-fluid"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :lg="5" :md="12">
            <el-form-item label="单据日期:" prop="order_date">
              <el-date-picker
                v-model="where.order_date"
                type="daterange"
                class="ele-fluid"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
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
        v-if="columns"
        ref="table"
        :columns="columns"
        :datasource="url"
        :where="where"
        :summary-method="getSummaries"
        show-summary
        height="calc(100vh - 300px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <!-- 导出按钮 -->
          <export-excel-button
            v-if="permission.includes('sys:inventorystatementbegin:export')"
            :target="'inventorystatementbegin'"
            :where="where"
          />
          <el-button
            v-if="permission.includes('sys:inventorystatementbegin:import') && importValid === true"
            class="ele-btn-icon"
            icon="el-icon-upload2"
            size="small"
            @click="showImport=true">期初导入
          </el-button>
          <el-button
            v-if="permission.includes('sys:inventorystatementbegin:import') && importValid === true"
            class="ele-btn-icon"
            icon="el-icon-upload2"
            size="small"
            @click="showImportTable=true">期初导入(表单)
          </el-button>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 导入弹窗 -->
    <import-excel
      v-if="importTemplateUrl"
      :visible.sync="showImport"
      :title="'导入期初数据'"
      :target="'inventorystatementbegin'"
      :dynamic_template_url="importTemplateUrl"
      @done="reload"/>
    <!-- 导入表单弹窗 -->
    <import-table
      :visible.sync="showImportTable"
      :title="'期初导入(表单)'"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import business from '@/config/business';
import ExportExcelButton from "@/components/ExportExcelButton.vue";
import ImportExcel from "@/components/ImportExcel.vue";
import ImportTable from "./import-table.vue";

export default {
  name: 'InventoryStatement',
  components: {ImportTable, ImportExcel, ExportExcelButton},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/inventorystatementbegin/index',
      // 表格列配置
      columns: [],
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
        '结算数量': 'settle_number',
        '单价': 'settle_price'
      },
      // 业务设置
      business: business,
      // 导入验证状态
      importValid: false,
      // 快捷日期范围选择
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 是否显示导入弹窗
      showImport: false,
      // 导入模板地址
      importTemplateUrl: '',
      // 是否显示导入表单弹窗
      showImportTable: false,
    };
  },
  watch: {},
  mounted() {
    this.getInventoryList(); // 查询存货列表
    this.getWarehouseList(); // 查询仓库列表
    this.getStatistics(); // 查询统计信息
    this.getImportValid(); // 导入验证
    this.getImportTemplate(); // 获取导入模板地址
    this.getColumns(); //获取动态列
  },
  updated () {
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    })
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
      this.$http.get('/inventoryarchive/getCascadeList', {params: params}).then(res => {
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
      this.$http.get('/inventorystatementbegin/statistics', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          this.statisticsData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 导入验证 */
    getImportValid() {
      this.$http.get('/inventorystatementbegin/importValid').then(res => {
        if (res.data.code === 0) {
          this.importValid = res.data.data;
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
    /* 获取导入模板地址 */
    getImportTemplate() {
      this.$http.get('/inventorystatementbegin/getImportTemplate').then(res => {
        if (res.data.code === 0) {
          this.importTemplateUrl = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取动态列 */
    getColumns() {
      const loading = this.$loading({target: '.ele-pro-table',lock: true});
      this.$http.get('/inventorystatementbegin/getColumns').then(res => {
        if (res.data.code === 0) {
            res.data.data.forEach(column => {
              this.columns.push(column)
            })
          loading.close();
        } else {
          this.$message.error(res.data.msg);
          loading.close();
        }
      }).catch(e => {
        this.$message.error(e.message);
        loading.close();
      });
    }
  },
}
</script>

<style scoped>
/deep/ .el-table--border th.gutter:last-of-type {
  display: table-cell !important;
}
</style>
