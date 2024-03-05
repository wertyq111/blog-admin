<!-- 销售订单编辑弹窗 -->
<template>
  <div>
    <el-dialog
      :destroy-on-close="true"
      :lock-scroll="false"
      :title="isUpdate?'修改销售订单':'添加销售订单'"
      :visible="visible"
      custom-class="ele-dialog-form"
      width="80%"
      @update:visible="updateVisible">

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="82px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单状态:" prop="status">
              <el-tag type="info" effect="dark" v-if="form.status == business.saleOrderStatus.wait">待提交</el-tag>
              <el-tag effect="dark" v-if="form.status == business.saleOrderStatus.open">已开立</el-tag>
              <el-tag type="success" effect="dark" v-if="form.status == business.saleOrderStatus.audited">已审核</el-tag>
              <el-tag type="info" effect="dark" v-if="form.status == business.saleOrderStatus.changing">变更中</el-tag>
              <el-tag type="warning" effect="dark" v-if="form.status == business.saleOrderStatus.changed">已变更</el-tag>
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
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                size="small">
                <el-option v-for="item in business.saleBusinessTypeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单日期:" prop="order_date">
              <el-date-picker
                v-model="form.order_date"
                class="ele-fluid"
                format="yyyy-MM-dd"
                placeholder="请选择订单日期"
                type="date"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户:" prop="customer_id">
              <el-select
                v-model="form.customer_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择客户-"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                size="small">
                <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="订单编号:" prop="order_number">
              <el-input
                v-model="form.order_number"
                :disabled=true
                :maxlength="255"
                clearable
                placeholder="订单新增后自动生成"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率(%):" prop="tax_rate">
              <el-input-number
                v-model="form.tax_rate"
                :min="0"
                class="ele-fluid ele-text-left"
                controls-position="right"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                placeholder="请输入税率">
                <template slot="append">%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务员:" prop="employee_id">
              <el-select
                v-model="form.employee_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择业务员-"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                size="small">
                <el-option v-for="item in employeeList" :key="item.id" :label="item.realname" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="销售类型:" prop="sale_type_id">
              <el-select
                v-model="form.sale_type_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择销售类型-"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                size="small">
                <el-option v-for="item in saleTypeList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汇率(%):" prop="exchange_rate">
              <el-input-number
                v-model="form.exchange_rate"
                :min="0"
                class="ele-fluid ele-text-left"
                controls-position="right"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                placeholder="请输入汇率"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门:" prop="department_id">
              <treeselect
                v-model="form.department_id"
                :defaultExpandLevel="2"
                :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
                :options="departmentList"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                placeholder="请选择所属部门"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="币种:">
              <el-select
                v-model="form.currency_id"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择币种-"
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changing
                          || form.status == business.saleOrderStatus.changed)"
                size="small">
                <el-option v-for="item in currencyList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同号:" prop="contract_number">
              <el-input
                v-model="form.contract_number"
                :maxlength="255"
                clearable
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                placeholder="请输入合同号"/>
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
                :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 销售订单项目表 -->
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
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || (form.status == business.saleOrderStatus.changing && scope.row.canChange !== true)
                          || form.status == business.saleOrderStatus.changed)"
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
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    @change="changeQuantity(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="报价"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.quotation'" :rules="rules.quotation">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.quotation"
                    @change="changeQuotation(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原币含税单价"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.unit_price'" :rules="rules.unit_price">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.unit_price"
                    @change="changeUnitPrice(scope.row)"
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
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
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
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.amount"
                    @change="changeAmount(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="tax"
              label="原币税额"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.tax'" :rules="rules.tax">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.tax"
                    @change="changeTax(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount_with_tax"
              label="原币价税合计"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.amount_with_tax'" :rules="rules.amount_with_tax">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.amount_with_tax"
                    @change="changeAmountWithTax(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="税率(%)"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.tax_rate'" :rules="rules.item_tax_rate">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.tax_rate"
                    @change="changeTaxRate(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="discount"
              label="折扣额"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.discount'" :rules="rules.item_discount">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.discount"
                    @change="changeDiscount(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="扣率(%)"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.discount_rate'" :rules="rules.item_discount_rate">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.discount_rate"
                    @change="changeDiscountRate(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="扣率2(%)"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.discount_rate2'" :rules="rules.item_discount_rate2">
                  <el-input
                    :maxlength="255"
                    clearable
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    v-model="scope.row.discount_rate2"
                    @change="changeDiscountRate2(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="预发货日期"
              width="180">
              <template slot-scope="scope">
                <el-form-item :prop="'order_items.' + scope.$index + '.estimated_shipment_date'" :rules="rules.item_estimated_shipment_date">
                  <el-date-picker
                    type="date"
                    placeholder="选择预发货日期"
                    v-model="scope.row.estimated_shipment_date"
                    style="width: 100%;"
                    class="ele-fluid"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                  >
                  </el-date-picker>
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
                          || form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
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
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-form-item>
                  <el-button
                    size="mini"
                    type="danger"
                    :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
                    @click="deleteOrderItem(scope.$index, scope.row)">删除
                  </el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item style="float:right">
            <el-button type="primary"
                       :disabled="(form.status == business.saleOrderStatus.open
                          || form.status == business.saleOrderStatus.audited
                          || form.status == business.saleOrderStatus.changed)"
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
          <el-col :span="8">
            <el-form-item label="变更人:">
              <div class="ele-text-secondary">
                {{ form.changer }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button
          v-if="permission.includes('sys:saleorder:cancelOpen')"
          :disabled="!(isUpdate && (form.status == business.saleOrderStatus.open))"
          @click="cancelOpen(form.id)"
        >
          修改
        </el-button>
        <el-button
          v-if="permission.includes('sys:shipmentorder:edit')"
          :disabled="!(isUpdate && form.status == business.saleOrderStatus.audited)"
          @click="openShipmentEdit(form)"
        >
          发货
        </el-button>
        <el-button
          v-if="permission.includes('sys:shipmentorder:edit')"
          :disabled="!(isUpdate && form.status == business.saleOrderStatus.audited)"
          @click="openShipmentEdit(form, 1)"
        >
          退货
        </el-button>
        <el-button
          v-if="permission.includes('sys:saleorder:audit')"
          :disabled="!(isUpdate && (form.status == business.saleOrderStatus.open || form.status == business.saleOrderStatus.changed))"
          @click="audit(form.id)"
        >
          审核
        </el-button>
        <el-button
          v-if="permission.includes('sys:saleorder:restoreAudit')"
          :disabled="!(isUpdate && form.status == business.saleOrderStatus.audited)"
          @click="restoreAudit(form.id)"
        >
          弃审
        </el-button>
        <el-button
          v-if="permission.includes('sys:saleorder:change')"
          :disabled="!(isUpdate && (form.status == business.saleOrderStatus.audited || form.status == business.saleOrderStatus.changed))"
          @click="change(form.id)"
        >
          变更
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
    <!-- 发货单编辑弹窗 -->
    <shipment-order-edit
      :referenceData="currentShipment"
      :visible.sync="showShipment"
      @done="fillFormByRemote(form.id)"/>
  </div>
</template>

<script>
// import validate from 'ele-admin/packages/validate';
import Treeselect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {mapGetters} from "vuex";
import business from '@/config/business';
import ShipmentOrderEdit from '../shipmentorder/order-edit.vue';
import dayjs from 'dayjs';
import {
  changeAmount, changeAmountWithTax, changeDiscount, changeDiscountRate, changeDiscountRate2,
  changePrice,
  changeQuantity,
  changeTax,
  changeTaxRate,
  changeUnitPrice, changeQuotation
} from "@/utils/order-amount";

export default {
  name: 'OrderEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {Treeselect, ShipmentOrderEdit},
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
          {required: true, message: '请选择所属部门', trigger: 'blur'}
        ],
        business_type_id: [
          {required: true, message: '请选择业务类型', trigger: 'blur'}
        ],
        order_date: [
          {required: true, message: '请选择订单日期', trigger: 'blur'}
        ],
        customer_id: [
          {required: true, message: '请选择供应商', trigger: 'blur'}
        ],
        order_number: [
          {required: false, message: '请输入订单编号', trigger: 'blur'}
        ],
        sale_type_id: [
          {required: true, message: '请选择销售类型', trigger: 'blur'}
        ],
        exchange_rate: [
          {required: false, message: '请输入汇率', trigger: 'blur'}
        ],
        currency_id: [
          {required: true, message: '请选择币种', trigger: 'blur'}
        ],
        contract_number: [
          {required: true, message: '请输入合同号', trigger: 'blur'}
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
        quotation: [
          {required: true, message: '报价不得为空', trigger: 'blur'}
        ],
        unit_price: [
          {required: true, message: '原币含税单价不得为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '原币单价不得为空', trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '原币金额不得为空',  trigger: 'blur'}
        ],
        tax: [
          {required: true, message: '原币税额不得为空', trigger: 'blur'}
        ],
        amount_with_tax: [
          {required: true, message: '原币价税合计不得为空', trigger: 'blur'}
        ],
        tax_rate: [
          {required: true, message: '税率不得为空', trigger: 'blur'}
        ],
        item_tax_rate: [
          {required: true, message: '存货税率不得为空', trigger: 'blur'}
        ],
        item_discount: [
          {required: true, message: '折扣额不得为空', trigger: 'blur'}
        ],
        item_discount_rate: [
          {required: true, message: '折扣率不得为空', trigger: 'blur'}
        ],
        item_discount_rate2: [
          {required: true, message: '折扣率2不得为空', trigger: 'blur'}
        ],
        item_estimated_shipment_date: [
          {required: true, message: '预发货日期不得为空', trigger: 'blur'}
        ],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 客户列表
      customerList: [],
      // 部门列表
      departmentList: [],
      // 销售类型列表
      saleTypeList: [],
      // 业务员列表
      employeeList: [],
      // 币种列表
      currencyList: [],
      // 存货列表
      inventoryList: [],
      // 存货自定义项名称:
      inventoryCustomList: [],
      // 存货自定义项详情
      inventoryCustomDetailList: [],
      // 业务设置
      business: business,
      // 当前发货单编辑数据
      currentShipment: null,
      // 是否显示发货单编辑弹窗
      showShipment: null,
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
        this.fillFormByRemote(this.data.sale_order_id);
        this.isUpdate = true;
      } else {
        this.form = this.initFormData();
        this.isUpdate = false;
      }
    },
  },
  mounted() {
    this.getDepartmentList(); // 查询部门列表
    this.getEmployeeList(); // 查询业务员列表
    this.getSaleTypeList(); // 查询销售类型列表
    this.getCurrencyList(); // 查询币种列表
    this.getCustomerList(); // 查询客户列表
    this.getInventoryList(); // 查询存货列表
    this.getInventoryCustomList(); // 查询存货自定义列表
  },
  methods: {
    changePrice, changeQuantity, changeTaxRate, changeUnitPrice, changeAmount, changeTax, changeAmountWithTax,
    changeQuotation, changeDiscount, changeDiscountRate, changeDiscountRate2,
    // 打开到货编辑框
    openShipmentEdit(row, isReturn = 0) {
      this.currentShipment = Object.assign({}, row);
      this.currentShipment.is_return = isReturn;
      this.showShipment = true;
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
      this.$http.get("/saleorder/info", {params: params}).then(res => {
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

    // 新增销售订单项目
    addOrderItem() {
      let newOrderItem = {
        tax_rate: this.form.tax_rate,
        discount : 0.00,
        discount_rate: 100,
        discount_rate2: 100,
        estimated_shipment_date: dayjs().format('YYYY-MM-DD') // display,
      };
      // 如果状态为变更中时候, 新增的销售订单项目item可以进行修改
      if (this.form.status == business.saleOrderStatus.changing) {
        newOrderItem.canChange = true;
      }
      if (!this.form.order_items) {
        this.$set(this.form, 'order_items', [newOrderItem])
      }
      this.form.order_items.push(newOrderItem);
    },

    // 删除销售订单项目
    deleteOrderItem(index) {
      if (index !== -1) {
        this.form.order_items.splice(index, 1)
      }
    },

    // 撤销开立
    cancelOpen(id) {
      const loading = this.$loading({lock: true});
      this.$http.post('/saleorder/cancelOpen', {id: id}).then(res => {
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
      this.$http.post('/saleorder/audit', {id: id}).then(res => {
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
      this.$http.post('/saleorder/restoreAudit', {id: id}).then(res => {
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

    // 变更订单
    change(id) {
      const loading = this.$loading({lock: true});
      this.$http.post('/saleorder/change', {id: id}).then(res => {
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
            this.$http.post('/saleorder/edit', this.form).then(res => {
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

    /* 获取销售类型列表 */
    getSaleTypeList() {
      let params = {code: 'sale_type'};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.saleTypeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },

    /* 获取币种列表 */
    getCurrencyList() {
      let params = {code: 'currency'};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.currencyList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
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
        status: business.saleOrderStatus.wait,
        business_type_id: business.saleBusinessType.generalSale,
        order_date: new Date(),
        exchange_rate: 1,
        currency_id: business.currency_rmb_id,
        order_items: [{
          discount: 0.00,
          discount_rate: 100,
          discount_rate2: 100,
          estimated_shipment_date: dayjs().format('YYYY-MM-DD'),
        }]
      };
      if (data) {
        form = Object.assign({}, form, data, {
          id: data.id === 0 ? null : data.id,
          business_type_id: data.id === 0 ? null : data.business_type_id,
          order_date: data.order_date === 0 ? null : data.order_date,
          customer_id: data.customer_id === 0 ? null : data.customer_id,
          employee_id: data.employee_id === 0 ? null : data.employee_id,
          sale_type_id: data.sale_type_id === 0 ? null : data.sale_type_id,
          currency_id: data.currency_id === 0 ? null : data.currency_id,
          department_id: data.department_id === 0 ? null : data.department_id,
          document_maker_id: data.document_maker_id === 0 ? null : data.document_maker_id,
          auditor_id: data.auditor_id === 0 ? null : data.auditor_id,
          changer_id: data.changer_id === 0 ? null : data.changer_id,
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
