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
            <el-form-item label="订单号:">
              <el-input
                v-model="where.shipment_order_number"
                clearable
                placeholder="请输入订单号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="仓库:" prop="warehouse_id">
              <el-select
                v-model="where.warehouse_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择仓库-"
                size="small">
                <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="部门:" prop="department_id">
              <treeselect
                v-model="where.department_id"
                :defaultExpandLevel="2"
                :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
                :options="departmentList"
                placeholder="请选择所属部门"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="客户:" prop="customer_id">
              <el-select
                v-model="where.customer_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择客户-"
                size="small">
                <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12">
            <el-form-item label="日期">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="where.start_date" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="where.end_date" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :lg="3" :md="12">
            <div class="ele-form-actions">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-search"
                type="primary"
                @click="reload">查询
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
        :selection.sync="selection"
        :where="where">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
<!--          <el-button
            v-if="permission.includes('sys:shipmentorder:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>-->
          <el-button
            v-if="permission.includes('sys:shipmentorder:deleteShipmentOrderItem')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
          <el-button
            v-if="permission.includes('sys:shipmentorder:warehouseOutBatch')"
            class="ele-btn-icon"
            icon="el-icon"
            size="small"
            type="success"
            @click="warehouseOutBatch">批量出库
          </el-button>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-tag type="info" effect="dark" v-if="row.status == business.shipmentOrderStatus.wait">待提交</el-tag>
          <el-tag effect="dark" v-if="row.status == business.shipmentOrderStatus.open">已开立</el-tag>
          <el-tag type="success" effect="dark" v-if="row.status == business.shipmentOrderStatus.audited">已审核</el-tag>
          <el-tag type="info" effect="dark" v-if="row.status == business.shipmentOrderStatus.changing">变更中</el-tag>
        </template>

        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:shipmentorder:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此订单项目吗？"
            @confirm="remove(row)">
            <el-link
              v-if="permission.includes('sys:shipmentorder:deleteShipmentOrderItem')"
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              type="danger">删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <shipment-order-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
    <!-- 出库单编辑弹窗 -->
    <warehouse-out-order-edit
      :referenceData="currentWarehouseOut"
      :visible.sync="showWarehouseOut"
      @done="reload"/>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {mapGetters} from "vuex";
import ShipmentOrderEdit from './order-edit.vue';
import business from '@/config/business';
import WarehouseOutOrderEdit from '../warehouseoutorder/order-edit.vue';

export default {
  name: 'SaleShipmentorder',
  components: {Treeselect, ShipmentOrderEdit, WarehouseOutOrderEdit},
  computed: {
    ...mapGetters(["permission"]),
    company() {
      return this.$store.state.user.user.parent_dept
    }
  },
  data() {
    return {
      // 表格数据接口
      url: '/shipmentorder/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: "left"
        },
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'sale_order_item_id',
          label: '销售编号',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          slot: 'status',
        },
        {
          prop: 'is_return_name',
          label: '是否退货',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
        },

        // 日期
        {
          prop: 'order_date',
          label: '日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },

        // 客户
        {
          prop: 'customer',
          label: '客户',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
        },

        // 仓库
        {
          prop: 'warehouse',
          label: '仓库',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },

        // 存货名称
        {
          prop: 'inventory_name',
          label: '存货名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },

        // 数量
        {
          prop: 'quantity',
          label: '数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 报价
        {
          prop: 'quotation',
          label: '报价',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 原币含税单价
        {
          prop: 'unit_price',
          label: '原币含税单价',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 原币单价
        {
          prop: 'price',
          label: '原币单价',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 原币金额
        {
          prop: 'amount',
          label: '原币金额',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 税率
        {
          prop: 'tax_rate',
          label: '税率(%)',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 税额
        {
          prop: 'tax',
          label: '税额',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 原币价税合计
        {
          prop: 'amount_with_tax',
          label: '原币价税合计',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 业务类型
        {
          prop: 'business_type_name',
          label: '业务类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 销售类型
        {
          prop: 'sale_type',
          label: '销售类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 部门
        {
          prop: 'department',
          label: '销售部门',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 业务员
        {
          prop: 'employee',
          label: '业务员',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 主计量
        {
          prop: 'inventory_measurement',
          label: '主计量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 存货编码
        {
          prop: 'inventory_number',
          label: '存货编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 发货单号
        {
          prop: 'shipment_order_number',
          label: '发货单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
        },
        // 审核人
        {
          prop: 'auditor',
          label: '审核人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        {
          prop: 'create_time',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'update_time',
          label: '更新时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 220,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // 业务设置
      business: business,
      // 仓库列表
      warehouseList: [],
      // 部门列表
      departmentList: [],
      // 客户列表
      customerList: [],
      // 当前出库单编辑数据
      currentWarehouseOut: null,
      // 是否显示出库单编辑弹窗
      showWarehouseOut: null
    };
  },
  mounted() {
    this.getWarehouseList(); // 查询仓库列表
    this.getDepartmentList(); // 查询部门列表
    this.getCustomerList(); // 查询客户列表
    // 动态添加存货自定义项
    this.getInventoryCustomListForColumns();
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
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/shipmentorder/deleteShipmentOrderItem', {id: row.id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的项目吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/shipmentorder/deleteShipmentOrderItem', {id: this.selection.map(d => d.id)}).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
    /* 获取仓库列表 */
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
    /**
     * 获取部门列表
     */
    getDepartmentList() {
      if(this.company.id) {
        let params = {id: this.company.id};
        this.$http.get('/dept/getDescendantList', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.departmentList = this.$util.toTreeData(res.data.data, 'id', 'pid');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 获取客户列表 */
    getCustomerList() {
      let params = {status: 1};
      this.$http.get('/customerarchive/getList', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.customerList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取自定义信息列表 */
    getInventoryCustomListForColumns () {
      this.$http.get('/inventorycustom/getList').then(res => {
        if (res.data.code === 0) {
          this.inventoryCustomList = res.data.data;
          // 将columns里面的值填充
          let inventoryCustoms = this.inventoryCustomList;
          let index = this.columns.findIndex(object => {
            return object.prop === 'amount_with_tax'
          });
          // 这里得在原币价税合计后添加
          for (let i = 0; i < inventoryCustoms.length; i ++) {
            this.columns.splice(index + 1, 0, {
              prop: inventoryCustoms[i].code + '_name',
              label: inventoryCustoms[i].name,
              align: 'center',
              showOverflowTooltip: true,
              minWidth: 110,
            });
            index++;
          }
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 批量出库 */
    warehouseOutBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要批量出库选中的项目?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/shipmentorder/warehouseOutBatch', {id:this.selection.map(d => d.id)}).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.currentWarehouseOut = res.data.data;
            this.showWarehouseOut = true;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.loading = false;
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
  }
}
</script>

<style scoped>
</style>
