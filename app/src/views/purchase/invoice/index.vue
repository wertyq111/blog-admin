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
            <el-form-item label="发票号:">
              <el-input
                v-model="where.invoice_number"
                clearable
                placeholder="请输入发票号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="供应商:" prop="supplier_id">
              <el-select
                v-model="where.supplier_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择供应商-"
                size="small">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12">
            <el-form-item label="开票日期">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="where.start_date" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="where.end_date" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12">
            <el-form-item label="发票日期:">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="where.invoice_start_date" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="where.invoice_end_date" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
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
            v-if="permission.includes('sys:invoice:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>-->
          <el-button
            v-if="permission.includes('sys:invoice:deleteInvoiceItem')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-tag type="info" effect="dark" v-if="row.status == business.invoiceStatus.wait">待提交</el-tag>
          <el-tag effect="dark" v-if="row.status == business.invoiceStatus.open">已开立</el-tag>
          <el-tag type="success" effect="dark" v-if="row.status == business.invoiceStatus.audited">已审核</el-tag>
        </template>

        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:invoice:edit')"
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
              v-if="permission.includes('sys:invoice:deleteInvoiceItem')"
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
    <order-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import OrderEdit from './order-edit.vue';
import business from '@/config/business';


export default {
  name: 'PurchaseInvoice',
  components: {OrderEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/invoice/index',
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
          prop: 'warehouse_entry_order_item_id',
          label: '入库编号',
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
        // 业务类型
        {
          prop: 'business_type_name',
          label: '业务类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        {
          prop: 'invoice_type_name',
          label: '发票类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },

        // 发票号
        {
          prop: 'invoice_number',
          label: '发票号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        // 开票日期
        {
          prop: 'billing_date',
          label: '开票日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
          }
        },
        // 供应商
        {
          prop: 'supplier',
          label: '供应商',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 结算日期
        // {
        //   prop: 'settlement_date',
        //   label: '结算日期',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 160,
        //   formatter: (row, column, cellValue) => {
        //     return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
        //   }
        // },

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
        // 原币税额
        {
          prop: 'tax',
          label: '原币税额',
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
        // 采购类型
        {
          prop: 'purchase_type',
          label: '采购类型',
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
        // 订单编号
        {
          prop: 'order_number',
          label: '订单编号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
        },
        // 制单人
        {
          prop: 'document_maker',
          label: '制单人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // 审核人
        {
          prop: 'auditor',
          label: '审核人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
        },
        // FIXME 这里时间格式还需要处理
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
      // 供应商列表
      supplierList: [],
    };
  },
  mounted() {
    this.getSupplierList(); // 查询供应商列表
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
      this.$http.post('/invoice/deleteInvoiceItem', {id: row.id}).then(res => {
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
        this.$http.post('/invoice/deleteInvoiceItem', {id: this.selection.map(d => d.id)}).then(res => {
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
    /* 获取供应商列表 */
    getSupplierList() {
      let params = {status: 1};
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
  }
}
</script>

<style scoped>
</style>
