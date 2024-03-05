<!-- 入库订单编辑弹窗 -->
<template>
  <div>
    <el-dialog
      :destroy-on-close="true"
      :lock-scroll="false"
      :title="(isUpdate?'修改':'添加') + (form.is_return===0?'入库订单':'入库退货订单')"
      :visible="visible"
      custom-class="ele-dialog-form"
      width="80%"
      @update:visible="updateVisible">

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="82px">
        <el-input
          v-model="form.is_return"
          v-show="false"
        />
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="订单状态:" prop="status">
              <el-tag type="info" effect="dark" v-if="form.status == business.warehouseEntryOrderStatus.wait">待提交</el-tag>
              <el-tag effect="dark" v-if="form.status == business.warehouseEntryOrderStatus.open">已开立</el-tag>
              <el-tag type="success" effect="dark" v-if="form.status == business.warehouseEntryOrderStatus.audited">已审核</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核日期:" prop="audit_date">
              {{form.audit_date}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="业务类型:" prop="business_type_id">
              <el-select
                v-model="form.business_type_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择业务类型-"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                size="small">
                <el-option v-for="item in business.purchaseBusinessTypeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库单号:" prop="warehouse_entry_order_number">
              <el-input
                v-model="form.warehouse_entry_order_number"
                :disabled=true
                :maxlength="255"
                clearable
                placeholder="单据新增后自动生成"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库日期:" prop="order_date">
              <el-date-picker
                v-model="form.order_date"
                class="ele-fluid"
                format="yyyy-MM-dd"
                placeholder="请选择订单日期"
                type="date"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="采购类型:" prop="purchase_type_id">
              <el-select
                v-model="form.purchase_type_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择采购类型-"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                size="small">
                <el-option v-for="item in purchaseTypeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商:" prop="supplier_id">
              <el-select
                v-model="form.supplier_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择供应商-"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                size="small">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门:" prop="department_id">
              <treeselect
                v-model="form.department_id"
                :defaultExpandLevel="2"
                :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
                :options="departmentList"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                placeholder="请选择所属部门"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="业务员:" prop="employee_id">
              <el-select
                v-model="form.employee_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择业务员-"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                size="small">
                <el-option v-for="item in employeeList" :key="item.id" :label="item.realname" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库:" prop="warehouse_id">
              <el-select
                v-model="form.warehouse_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择仓库-"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                size="small">
                <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="form.remark"
                :maxlength="255"
                :rows="2"
                clearable
                placeholder="请输备注"
                :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 采购订单项目表 -->
        <el-form-item label-width="0">
          <el-table
            ref="table"
            :data="form.order_items"
            border
            height="250"
            show-summary
            :summary-method="getSummaries"
            style="width: 100%; margin-top: 20px">
            <el-table-column
              label="存货"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.inventory_id'" :rules="rules.inventory_id">
                  <!-- 这里选择存货在变更中状态情况下, 点击新增项目按钮, 那一列是可以编辑的-->
                  <el-cascader
                    v-model="scope.row.inventory_id"
                    clearable
                    filterable
                    :props="{emitPath:false}"
                    placeholder="-请选择存货-"
                    :options="inventoryList"
                    :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                    @change="changeInventory(scope.row)"
                  >
                  </el-cascader>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="存货编码"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.inventory_number'" :rules="rules.inventory_number">
                  <el-input
                    :maxlength="255"
                    clearable
                    disabled
                    placeholder="请输入存货编码"
                    v-model="scope.row.inventory_number"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="存货名称"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.inventory_name'" :rules="rules.inventory_name">
                  <el-input
                    :maxlength="255"
                    clearable
                    disabled
                    v-model="scope.row.inventory_name"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="主计量"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.inventory_measurement'" :rules="rules.inventory_measurement">
                  <el-input
                    :maxlength="255"
                    clearable
                    disabled
                    v-model="scope.row.inventory_measurement"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.quantity'" :rules="rules.quantity">
                  <el-input
                    :maxlength="255"
                    clearable
                    v-model="scope.row.quantity"
                    :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                    @change="changeQuantity(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原币单价"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.price'" :rules="rules.price">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                    v-model="scope.row.price"
                    @change="changePrice(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="原币金额"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.amount'" :rules="rules.amount">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                    v-model="scope.row.amount"
                    @change="changeAmount(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              v-for="customItem in inventoryCustomList"
              :key="customItem.id"
              :label="customItem.name + (customItem.status == business.customStatus.close? '(已停用)' : '')"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.' + customItem.code" :rules="rules[customItem.code]">
                  <el-select
                    v-model="scope.row[customItem.code]"
                    class="ele-block"
                    clearable
                    filterable
                    :placeholder="'-请选择' + customItem.name"
                    :disabled="(customItem.status == business.customStatus.close
                          || form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                    size="small">
                    <el-option
                      v-for="item in (inventoryCustomDetailList[customItem.code] ?  inventoryCustomDetailList[customItem.code][scope.row.inventory_id] : [])"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :disabled="item.status == business.customItemStatus.close ? true : false"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="采购单号"
              width="250">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.order_number'" :rules="rules.order_number">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(
                    form.status == business.warehouseEntryOrderStatus.wait
                    || form.status == business.warehouseEntryOrderStatus.open
                    || form.status == business.warehouseEntryOrderStatus.audited)"
                    v-model="scope.row.order_number"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="到货单号"
              width="250">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.arrival_order_number'" :rules="rules.arrival_order_number">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(
                    form.status == business.warehouseEntryOrderStatus.wait
                    || form.status == business.warehouseEntryOrderStatus.open
                    || form.status == business.warehouseEntryOrderStatus.audited)"
                    v-model="scope.row.arrival_order_number"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-form-item>
                  <el-button
                    size="mini"
                    type="danger"
                    :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                    @click="deleteOrderItem(scope.$index, scope.row)">删除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item style="float:right">
            <el-button type="primary"
                       :disabled="(form.status == business.warehouseEntryOrderStatus.open
                          || form.status == business.warehouseEntryOrderStatus.audited)"
                       @click="addOrderItem">
              新增项目
            </el-button>
          </el-form-item>
        </el-form-item>
        <div style="margin: 12px 0;">
          <el-divider/>
        </div>
        <!--操作人员信息-->
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="制单人:">
              <div class="ele-text-secondary">
                {{ form.document_maker }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人:">
              <div class="ele-text-secondary">
                {{ form.auditor }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button
          v-if="permission.includes('sys:warehouseentryorder:cancelOpen')"
          :disabled="!(isUpdate && (form.status == business.warehouseEntryOrderStatus.open))"
          @click="cancelOpen(form.id)"
        >
          修改
        </el-button>
        <el-button
          v-if="permission.includes('sys:invoice:edit') && form.is_return === 0"
          :disabled="!(isUpdate && form.status == business.warehouseEntryOrderStatus.audited)"
          @click="openInvoiceEdit(form)"
        >
          开票
        </el-button>
        <el-button
          v-if="permission.includes('sys:invoice:edit') && form.is_return === 1"
          :disabled="!(isUpdate && form.status == business.warehouseEntryOrderStatus.audited)"
          @click="openInvoiceEdit(form, 1)"
        >
          开票退货
        </el-button>
        <el-button
          v-if="permission.includes('sys:warehouseentryorder:audit')"
          :disabled="!(isUpdate && (form.status == business.warehouseEntryOrderStatus.open))"
          @click="audit(form.id)"
        >
          审核
        </el-button>
        <el-button
          v-if="permission.includes('sys:warehouseentryorder:restoreAudit')"
          :disabled="!(isUpdate && form.status == business.warehouseEntryOrderStatus.audited)"
          @click="restoreAudit(form.id)"
        >
          弃审
        </el-button>
        <el-button
          @click="updateVisible(false)">取消
        </el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="save">保存
        </el-button>
      </div>

    </el-dialog>
    <!-- 发票单编辑弹窗 -->
    <invoice-edit
      :referenceData="currentInvoice"
      :visible.sync="showInvoice"
      @done="fillFormByRemote(form.id)"/>
  </div>
</template>

<script>
// import validate from 'ele-admin/packages/validate';
import Treeselect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {mapGetters} from "vuex";
import business from '@/config/business';
import InvoiceEdit from '../invoice/order-edit.vue';
import {
  changeAmount,
  changePrice,
  changeQuantity,
  getAmount
} from "@/utils/order-amount";

export default {
  name: 'WarehouseEntryOrderEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    referenceData: Object
  },
  components: {Treeselect, InvoiceEdit},
  data() {
    return {
      // 表单数据, this.data传入到表单中, status默认为1, 将 order_items 默认当成空数组
      // 初始化表单默认参数
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        // username: [
        //   {
        //     required: true,
        //     type: 'string',
        //     trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (!value) {
        //         return callback(new Error('请输入用户账号'));
        //       }
        //       this.$http.get('/user/checkUser?username=' + value).then(res => {
        //         if (res.data.code !== 0 || !res.data.data.length) {
        //           return callback();
        //         }
        //         if (this.isUpdate && res.data.data[0].username === this.data.username) {
        //           return callback();
        //         }
        //         callback(new Error('账号已经存在'));
        //       }).catch(() => {
        //         callback();
        //       });
        //     }
        //   }
        // ],
        department_id: [
          {required: false, message: '请选择所属部门', trigger: 'blur'}
        ],
        business_type_id: [
          {required: true, message: '请选择业务类型', trigger: 'blur'}
        ],
        order_date: [
          {required: true, message: '请选择订单日期', trigger: 'blur'}
        ],
        supplier_id: [
          {required: true, message: '请选择供应商', trigger: 'blur'}
        ],
        warehouse_id: [
          {required: true, message: '请选择仓库', trigger: 'blur'}
        ],
        warehouse_entry_order_number: [
          {required: false, message: '请输入订单编号', trigger: 'blur'}
        ],
        purchase_type_id: [
          {required: true, message: '请选择采购类型', trigger: 'blur'}
        ],
        employee_id: [
          {required: false, message: '请选择业务员', trigger: 'blur'}
        ],
        inventory_id: [
          {required: true, message: '请选择存货', trigger: 'blur'}
        ],
        inventory_number: [
          {required: false, trigger: 'blur'}
        ],
        inventory_name: [
          {required: false, trigger: 'blur'}
        ],
        inventory_measurement: [
          {required: false, trigger: 'blur'}
        ],
        quantity: [
          {required: true, message: '数量不得为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '原币单价不得为空', trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '原币金额不得为空',  trigger: 'blur'}
        ],
        order_number: [
          {required: false, trigger: 'blur'}
        ],
        arrival_order_number: [
          {required: false, trigger: 'blur'}
        ],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 供应商列表
      supplierList: [],
      // 部门列表
      departmentList: [],
      // 采购类型列表
      purchaseTypeList: [],
      // 业务员列表
      employeeList: [],

      // 存货列表
      inventoryList: [],
      // 存货自定义项名称:
      inventoryCustomList: [],
      // 存货自定义项详情
      inventoryCustomDetailList: [],
      // 仓库列表
      warehouseList: [],
      // 业务设置
      business: business,
      // 当前开票单编辑数据
      currentInvoice: null,
      // 是否显示开票单编辑弹窗
      showInvoice: null,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    company() {
      return this.$store.state.user.user.parent_dept
    }
  },
  watch: {
    data() {
      if (this.data) {
        this.fillFormByRemote(this.data.warehouse_entry_order_id);
        this.isUpdate = true;
      } else {
        this.form = this.initFormData();
        this.isUpdate = false;
      }
    },
    // 从到货订单中添加入库的情况
    referenceData() {
      if (this.referenceData) {
        // 把要拿的信息重新定义
        let fillData = {
          status: business.warehouseEntryOrderStatus.wait,
          is_return: this.referenceData.is_return,
          business_type_id: this.referenceData.business_type_id,
          order_date: this.referenceData.order_date,
          purchase_type_id: this.referenceData.purchase_type_id,
          supplier_id: this.referenceData.supplier_id,
          department_id: this.referenceData.department_id,
          employee_id: this.referenceData.employee_id,
          remark: this.referenceData.remark,
        };
        let orderItems = [];
        let oldOrderItems = this.referenceData.order_items;
        let unit_price, quantity, tax_rate;
        let inventoryCustomObject = {};
        let inventoryCustomList = this.inventoryCustomList;
        for (let i = 0; i < oldOrderItems.length; i++) {
          unit_price = oldOrderItems[i].unit_price;
          quantity = oldOrderItems[i].remain_warehouse_entry_quantity;
          tax_rate = oldOrderItems[i].tax_rate;
          for (let j = 0; j < inventoryCustomList.length; j++) {
            inventoryCustomObject[inventoryCustomList[j].code] = oldOrderItems[i][inventoryCustomList[j].code]
          }
          orderItems.push(Object.assign({
            arrival_order_item_id: oldOrderItems[i].id,
            inventory_id: oldOrderItems[i].inventory_id,
            inventory_number:oldOrderItems[i].inventory_number,
            inventory_name:oldOrderItems[i].inventory_name,
            inventory_specification:oldOrderItems[i].inventory_specification,
            inventory_measurement:oldOrderItems[i].inventory_measurement,
            quantity: oldOrderItems[i].remain_warehouse_entry_quantity,
            price: oldOrderItems[i].price,
            amount: getAmount(unit_price, quantity, tax_rate),
            order_number: oldOrderItems[i].order_number,
            arrival_order_number: this.referenceData.arrival_order_number
          }, inventoryCustomObject));
        }
        fillData.order_items = orderItems;

        // 将参照的采购订单数据填充表单
        this.fillForm(fillData);
        this.isUpdate = false;
      }
    }
  },
  mounted() {
    this.getDepartmentList(); // 查询部门列表
    this.getEmployeeList(); // 查询业务员列表
    this.getPurchaseTypeList(); // 查询采购类型列表
    this.getSupplierList(); // 查询供应商列表
    this.getInventoryList(); // 查询存货列表
    this.getWarehouseList(); // 查询仓库列表
    this.getInventoryCustomList(); // 查询存货列表
  },
  methods: {
    changePrice, changeQuantity, changeAmount,
    // 打开开票编辑框
    openInvoiceEdit(row, isReturn = 0) {
      this.currentInvoice = Object.assign({}, row);
      this.currentInvoice.is_return = isReturn;
      this.showInvoice = true;
    },

    // 填充弹框数据
    fillForm(data) {
      this.form = this.initFormData(data);

      // 填充存货选项信息
      for (let i = 0; i < this.form.order_items.length; i++) {
        // 初始化row
        this.$set(this.form.order_items, i, this.initOrderItem(this.form.order_items[i]));

        // 填充orderItem值
        this.fillInventory(this.form.order_items[i]);
      }
    },

    // 填充弹框数据通过远程数据
    fillFormByRemote(order_id) {
      let params = {id: order_id};
      this.$http.get("/warehouseentryorder/info", {params: params}).then(res => {
        if (res.data.code === 0) {
          this.fillForm(res.data.data)
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },

    // 重新选择存货后,
    changeInventory(row) {
      // 清空存货自定义项
      let inventoryCustomList = this.inventoryCustomList;
      for (let i = 0; i < inventoryCustomList.length; i++) {
        this.$set(row, inventoryCustomList[i].code, '');
      }

      this.fillInventory(row);
    },

    // 根据存货编号填充存货相关固定信息
    fillInventory(row) {
      let inventoryId = row.inventory_id;
      if (inventoryId) {
        let params = {
          id: inventoryId
        };

        // 填充其他项
        this.$http.get('/inventoryarchive/info', {params: params}).then(res => {
          if (res.data.code === 0) {
            let result = res.data.data;
            this.$set(row, 'inventory_number', result.code);
            this.$set(row, 'inventory_name', result.name);
            this.$set(row, 'inventory_measurement', result.unit_name);

            // 填入存货自定义项
            let inventoryCustomList = this.inventoryCustomList;
            let customDataDetail = result.custom_data_detail;
            /* 原先这里有BUG, 如果row.id都存在, 则会影响其他行的项, 所以都改成用存货编号 */
            for (let i = 0; i < inventoryCustomList.length; i++) {
              if (this.commonApi.isEmpty(this[inventoryCustomList[i].code + 'List'])) {
                this[inventoryCustomList[i].code + 'List'] = [];
              }
              this.$set(
                this[inventoryCustomList[i].code + 'List'],
                inventoryId,
                customDataDetail[inventoryCustomList[i].name]
              );
              this.$set(this['inventoryCustomDetailList'], inventoryCustomList[i].code, this[inventoryCustomList[i].code + 'List']);
            }
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },

    // 新增采购订单项目
    addOrderItem() {
      let newOrderItem = {
        tax_rate: this.form.tax_rate
      };
      if (!this.form.order_items) {
        this.$set(this.form, 'order_items', [newOrderItem])
      }
      this.form.order_items.push(newOrderItem);
    },

    // 删除采购订单项目
    deleteOrderItem(index) {
      if (index !== -1) {
        this.form.order_items.splice(index, 1)
      }
    },

    // 撤销开立
    cancelOpen(id) {
      const loading = this.$loading({lock: true});
      this.$http.post('/warehouseentryorder/cancelOpen', {id: id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.fillFormByRemote(id);
          this.$emit('done');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },

    // 审核订单
    audit(id) {
      const loading = this.$loading({lock: true});
      this.$http.post('/warehouseentryorder/audit', {id: id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.fillFormByRemote(id);
          this.$emit('done');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },

    // 弃审订单
    restoreAudit(id) {
      const loading = this.$loading({lock: true});
      this.$http.post('/warehouseentryorder/restoreAudit', {id: id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.fillFormByRemote(id);
          this.$emit('done');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },

    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 检查 order_items 是否存在
          if (this.form.order_items && this.form.order_items.length > 0) {
            this.loading = true;
            this.$http.post('/warehouseentryorder/edit', this.form).then(res => {
              this.loading = false;
              if (res.data.code === 0) {
                this.$message({type: 'success', message: res.data.msg});
                if (!this.isUpdate) {
                  this.form = this.initFormData(this.data);
                }
                this.updateVisible(false);
                this.$emit('done');
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch(e => {
              this.loading = false;
              this.$message.error(e.message);
            });
          } else {
            this.$message.error('缺少相关项目信息!')
          }
        } else {
          return false;
        }
      });
    },

    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
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

    /**
     * 获取业务员列表
     */
    getEmployeeList() {
      if(this.company.id) {
        this.$http.get('/user/getCompanyUsers').then(res => {
          if (res.data.code === 0) {
            this.employeeList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },

    /* 获取采购类型列表 */
    getPurchaseTypeList() {
      let params = {code: 'purchase_type'};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.purchaseTypeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
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

    /* 获取存货列表 */
    getInventoryList() {
      let params = {status: 1};
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

    /* 获取自定义信息列表 */
    getInventoryCustomList () {
      this.$http.get('/inventorycustom/getList').then(res => {
        if (res.data.code === 0) {
          this.inventoryCustomList = res.data.data;
          // 将ruler里面的值填充
          let inventoryCustoms = this.inventoryCustomList;
          for (let i = 0; i < inventoryCustoms.length; i ++) {
            this.$set(this.rules, inventoryCustoms[i].code, [
              {required: false, trigger: 'blur'}
            ]);
          }
          // 清除获取自定义信息后, 表单rule更改后, 触发了form校验的问题
          if (!this.commonApi.isEmpty(this.$refs['form'])) {
            this.$nextTick(()=>{
              this.$refs.form.clearValidate();
            })
          }
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },

    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {
        status: business.warehouseEntryOrderStatus.wait,
        is_return: 0,
        business_type_id: business.purchaseBusinessType.generalPurchase,
        order_date: new Date(),
        order_items: [{}]
      };
      if (data) {
        form = Object.assign({}, form, data, {
          id: data.id === 0 ? null : data.id,
          business_type_id: data.id === 0 ? null : data.business_type_id,
          order_date: data.order_date === 0 ? null : data.order_date,
          supplier_id: data.supplier_id === 0 ? null : data.supplier_id,
          warehouse_id: data.warehouse_id === 0 ? null : data.warehouse_id,
          employee_id: data.employee_id === 0 ? null : data.employee_id,
          purchase_type_id: data.purchase_type_id === 0 ? null : data.purchase_type_id,
          department_id: data.department_id === 0 ? null : data.department_id,
          document_maker_id: data.document_maker_id === 0 ? null : data.document_maker_id,
          auditor_id: data.auditor_id === 0 ? null : data.auditor_id,
        });
      }

      return form;
    },

    /**
     * 初始化存货项
     * @param orderItem
     * @returns {*}
     */
    initOrderItem(orderItem) {
      let inventoryCustom = {};
      let inventoryCustomList = this.inventoryCustomList;
      for (let i = 0; i < inventoryCustomList.length; i++) {
        inventoryCustom[inventoryCustomList[i].code] =
          orderItem[inventoryCustomList[i].code] === 0 ? null : orderItem[inventoryCustomList[i].code];
      }

      orderItem = Object.assign({}, orderItem, inventoryCustom);

      return orderItem;
    },

    /*
    * 这里写表格里面自己的逻辑,返回数据就是表格中合计的显示
    * */
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += '';
        } else {
          sums[index] = '';
        }
      });

      return sums;
    }
  }
}
</script>

<style scoped>
</style>
