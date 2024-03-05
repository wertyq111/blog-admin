<!-- 会员编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改子公司(' + form.dept_name + ')信息':'添加子公司(' + form.dept_name + ')信息'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="102px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="单位名称:" prop="name">
            <el-input
              v-model="form.name"
              :maxlength="20"
              clearable
              placeholder="请输入单位名称"/>
          </el-form-item>
          <el-form-item label="银行账号:" prop="bank_account">
            <el-input
              v-model="form.bank_account"
              :maxlength="20"
              clearable
              placeholder="请输入银行账号"/>
          </el-form-item>
          <el-form-item label="币种:" prop="currency_id">
            <el-select
              v-model="form.currency_id"
              class="ele-block"
              clearable
              placeholder="请选择币种">
              <el-option
                v-for="item in currencyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属银行:" prop="bank_id">
            <el-select
              v-model="form.bank_id"
              class="ele-block"
              clearable
              filterable
              placeholder="请选择所属银行">
              <el-option
                v-for="item in bankList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="机构号:" prop="institution_number">
            <el-input
              v-model="form.institution_number"
              :maxlength="100"
              clearable
              placeholder="请输入机构号"/>
          </el-form-item>
          <el-form-item label="付款单位名称:" prop="pay_name">
            <el-input
              v-model="form.pay_name"
              :maxlength="100"
              clearable
              placeholder="请输入付款单位名称"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="单位简称:" prop="abbreviation">
            <el-input
              v-model="form.abbreviation"
              :maxlength="20"
              clearable
              placeholder="请输入单位简称"/>
          </el-form-item>
          <el-form-item label="账户名称:" prop="account_name">
            <el-input
              v-model="form.account_name"
              :maxlength="50"
              clearable
              placeholder="请输入账户名称"/>
          </el-form-item>
          <el-form-item label="开户银行:" prop="open_bank">
            <el-input
              v-model="form.open_bank"
              :maxlength="100"
              clearable
              placeholder="请输入开户银行"/>
          </el-form-item>
          <el-form-item label="开户日期:" prop="open_date">
            <el-date-picker
              v-model="form.open_date"
              class="ele-fluid"
              placeholder="请选择开户日期"
              type="date"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item label="联行号:" prop="interbank_number">
            <el-input
              v-model="form.interbank_number"
              :maxlength="100"
              clearable
              placeholder="请输入联行号"/>
          </el-form-item>
          <el-form-item label="所在城市:" prop="city">
            <el-cascader
              v-model="city"
              :options="regions.cityData"
              class="ele-fluid"
              clearable
              placeholder="请选择省市区"
              popper-class="ele-pop-wrap-higher"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24">
          <el-form-item :sm="10" label="开户银行地址:" prop="address">
            <el-input
              v-model="form.address"
              :maxlength="150"
              clearable
              placeholder="请输入开户银行地址"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24">
          <el-form-item :sm="10" label="备注:" prop="remark">
            <el-input
              v-model="form.remark"
              :maxlength="200"
              :rows="3"
              clearable
              placeholder="请输入备注"
              type="textarea"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
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
</template>

<script>
import regions from 'ele-admin/packages/regions';

export default {
  name: 'WarehouseEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 省市区数据
      regions: regions,
      // 选中的省市区
      city: [],
      // 选中的省市
      provinceCity: [],
      // 选中的省
      province: [],
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ],
        bank_account: [
          {required: true, message: '请输入银行账号', trigger: 'blur'}
        ],
        currency_id: [
          {required: true, message: '请选择币种', trigger: 'blur'}
        ],
        open_bank: [
          {required: true, message: '请输入开户银行', trigger: 'blur'}
        ],
        bank_id: [
          {required: true, message: '请选择所属银行', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 币种列表
      currencyList: [],
      // 银行列表
      bankList: [],
    };
  },
  computed: {
    company() {
      return this.$store.state.user.user.parent_dept
    }
  },
  watch: {
    data() {
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
    }
  },
  mounted() {
    this.getCurrencyList(); //查询币种列表
    this.getBankList(); //查询银行列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 城市数据处理
          this.form = Object.assign({}, this.form, {
            city: this.city
          });
          this.$http.post('/companychildren/edit', this.form).then(res => {
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
          return false;
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 获取币种列表 */
    getCurrencyList() {
      let params = {code: "currency"};
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
    /* 获取银行列表 */
    getBankList() {
      let params = {code: "bank"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.bankList = res.data.data;
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
      let form = {};
      if (data) {
        Object.assign(form, data, {
          currency_id: data.currency_id === 0 ? null : data.currency_id,
          bank_id: data.bank_id === 0 ? null : data.bank_id,
        });
        this.city = this.data.city;
      } else {
        this.city = [];
      }
      return form;
    },
  }
}
</script>

<style scoped>
</style>
