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
          <el-col :lg="3" :md="12">
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
          <el-col :lg="3" :md="12">
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
          <el-col :lg="3" :md="12">
            <el-form-item label="业务类型:" prop="business_type_id">
              <el-select
                v-model="where.business_type_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择业务类型-"
                size="small">
                <el-option label="普通采购" :value="1"/>
                <el-option label="普通销售" :value="2"/>
              </el-select>
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
          <el-col :lg="3" :md="12">
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="where.status"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择状态-"
                size="small">
                <el-option label="待开立" :value="1"/>
                <el-option label="已开立" :value="2"/>
                <el-option label="已审核" :value="3"/>
              </el-select>
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
            v-if="permission.includes('sys:inventorystatement:export')"
            :target="'inventorystatement'"
            :where="where"
          />
          <el-button
            v-if="permission.includes('sys:inventorystatement:settle') && settleValid === true"
            class="ele-btn-icon"
            icon="el-icon-s-finance"
            size="small"
            type="warning"
            :disabled="settleButtonDisable"
            @click="settle">结算<i :class="settleLoading"/>
          </el-button>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-tag
            size="small"
            :type="row.status === 3 ? 'success' : 'warning'"
          >{{row.status_name}}
          </el-tag>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import business from '@/config/business';
import ExportExcelButton from "@/components/ExportExcelButton.vue";

export default {
  name: 'InventoryStatement',
  components: {ExportExcelButton},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/inventorystatement/index',
      // 表格列配置
      columns: [
        {
          prop: 'order_date',
          label: '日期',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "left"
        },
        {
          prop: 'type_name',
          label: '单据类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'order_number',
          label: '单据号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
        },
        {
          prop: 'warehouse',
          label: '仓库',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'business_type',
          label: '收发类别',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'dept_name',
          label: '部门',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'employee',
          label: '业务员',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'supplier',
          label: '供货单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'customer',
          label: '客户',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'remark',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 50,
        },
        {
          prop: 'document_maker',
          label: '制单人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'auditor',
          label: '审核人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'audit_date',
          label: '审核日期',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
        },
        {
          prop: 'inventory_number',
          label: '存货编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'inventory_name',
          label: '存货名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'inventory_measurement',
          label: '主计量单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 80,
          slot: "status",
          fixed: "right"
        },
        {
          prop: 'entry_quantity',
          label: '入库数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "right"
        },
        {
          prop: 'entry_price',
          label: '入库单价',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "right"
        },
        {
          prop: 'entry_amount',
          label: '入库金额',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "right"
        },
        {
          prop: 'out_quantity',
          label: '出库数量',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "right"
        },
        {
          prop: 'out_price',
          label: '出库单价',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "right"
        },
        {
          prop: 'out_amount',
          label: '出库金额',
          align: 'center',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: "right"
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
        '入库数量': 'entry_number',
        '入库金额': 'entry_amount',
        '出库数量': 'out_number',
        '出库金额': 'out_amount'
      },
      // 业务设置
      business: business,
      // 结算验证状态
      settleValid: false,
      // 结算按钮状态
      settleButtonDisable: false,
      // 结算中
      settleLoading: null,
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
    };
  },
  watch: {},
  mounted() {
    this.getInventoryList(); // 查询存货列表
    this.getWarehouseList(); // 查询仓库列表
    this.getStatistics(); // 查询统计信息
    this.getSettleValid(); // 结算验证
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
      this.$http.get('/inventorystatement/statistics', {params: this.where}).then(res => {
        if (res.data.code === 0) {
          this.statisticsData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 结算验证 */
    getSettleValid() {
      this.$http.get('/inventorystatement/settleValid').then(res => {
        if (res.data.code === 0) {
          this.settleValid = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 结算 */
    settle() {
      this.$confirm('确定要对上一个月的出入库流水进行结算吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.settleLoading = 'el-icon-loading'
        this.settleButtonDisable = true;
        this.$http.get('/inventorystatement/settle').then(res => {
          if (res.data.code === 0) {
            this.settleValid = res.data.data;
            this.settleLoading = null;
            this.settleButtonDisable = false;
            this.$message.success('结算成功');
            this.reload();
          } else {
            this.settleButtonDisable = false;
            this.settleLoading = ''
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.settleButtonDisable = false;
          this.settleLoading = ''
          this.$message.error(e.message);
        });
      }).catch(() => {
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
</style>
