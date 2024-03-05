<!-- 客户维护编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="isUpdate?'修改开户银行':'添加开户银行'"
    :visible="visible"
    custom-class="ele-dialog-form"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px">
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="info">
          <el-row :gutter="16" class="top">
            <el-col :sm="12">
              <el-form-item label="编码:" prop="code">
                <el-input
                  v-model="form.code"
                  :maxlength="20"
                  clearable
                  placeholder="请输入编码"
                  :disabled="isUpdate"
                />
              </el-form-item>
              <el-form-item label="账户名称:" prop="account_name">
                <el-input
                  v-model="form.account_name"
                  :maxlength="50"
                  clearable
                  placeholder="请输入账户名称"/>
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
              <el-form-item label="主账号:" prop="main_account">
                <el-input
                  v-model="form.main_account"
                  :maxlength="50"
                  clearable
                  placeholder="请输入主账号"/>
              </el-form-item>
              <el-form-item label="集团下属账号:" prop="is_subordinate">
                <el-select
                  v-model="form.is_subordinate"
                  class="ele-block"
                  clearable
                  placeholder="是否集团下属账号">
                  <el-option :value="1" label="是"/>
                  <el-option :value="2" label="否"/>
                </el-select>
              </el-form-item>
              <el-form-item label="总公司账号:" prop="head_account">
                <el-input
                  v-model="form.head_account"
                  :maxlength="100"
                  clearable
                  placeholder="请输入总公司账号"/>
              </el-form-item>
              <el-form-item label="开户银行:" prop="open_bank">
                <el-input
                  v-model="form.open_bank"
                  :maxlength="100"
                  clearable
                  placeholder="请输入开户银行"/>
              </el-form-item>
              <el-form-item label="机构号:" prop="institution_number">
                <el-input
                  v-model="form.institution_number"
                  :maxlength="100"
                  clearable
                  placeholder="请输入机构号"/>
              </el-form-item>
              <el-form-item label="交易代码:" prop="transaction_code">
                <el-input
                  v-model="form.transaction_code"
                  :maxlength="20"
                  clearable
                  placeholder="请输入交易代码"/>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="银行账号:" prop="bank_account">
                <el-input
                  v-model="form.bank_account"
                  :maxlength="50"
                  clearable
                  placeholder="请输入银行账号"/>
              </el-form-item>
              <el-form-item label="开户日期:" prop="open_date">
                <el-date-picker
                  v-model="form.open_date"
                  class="ele-fluid"
                  placeholder="请选择开户日期"
                  type="date"
                  value-format="yyyy-MM-dd"/>
              </el-form-item>
              <el-form-item label="主账号省市代码:" prop="main_city">
                <el-input
                  v-model="form.main_city"
                  :maxlength="50"
                  clearable
                  placeholder="请输入主账号省市代码"/>
              </el-form-item>
              <el-form-item label="总公司名称:" prop="head_name">
                <el-input
                  v-model="form.head_name"
                  :maxlength="50"
                  clearable
                  placeholder="请输入总公司名称"/>
              </el-form-item>
              <el-form-item label="付款单位名称:" prop="pay_name">
                <el-input
                  :value="form.pay_name"
                  disabled
                  placeholder="请输入付款单位名称"/>
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
          </el-row>
        </el-tab-pane>
      </el-tabs>
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
  name: 'CompanyBankEdit',
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
      // 默认标签页
      active: 'info',  // tab页选中
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
    this.fillPayName(); // 填充付款单位信息
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
          this.$http.post('/companybank/edit', this.form).then(res => {
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
    /* 填充付款单位 */
    fillPayName() {
      if(!this.form.pay_name) {
        this.$http.get('/companyinfo/info').then(res => {
          if (res.data.code === 0) {
            this.form.pay_name = res.data.data.name;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 触发点击事件 */
    handleClick() {},
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {pay_name: ""};
      if (data) {
        Object.assign(form, data, {
          currency_id: data.currency_id === 0 ? null : data.currency_id,
          bank_id: data.bank_id === 0 ? null : data.bank_id,
        });
        this.city = this.data.city;
      } else {
        this.city = [];
      }
      this.active = 'info'
      return form;
    },
  }
}
</script>

<style scoped>
.top {
  margin: 20px auto;
}
</style>
