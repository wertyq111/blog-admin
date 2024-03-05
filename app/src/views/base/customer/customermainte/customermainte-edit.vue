<!-- 客户维护编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="isUpdate?'修改客户':'添加客户'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="calc(100vh + 300px)"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px">
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="info">
          <el-row :gutter="15" class="top">
            <el-col :sm="8">
              <el-form-item label="编码:" prop="code">
                <el-input
                  v-model="form.code"
                  :maxlength="20"
                  clearable
                  placeholder="请输入客户编码"
                  @blur="generateCode"
                  :disabled="categories.list.length === 0 ? true : isUpdate"
                />
              </el-form-item>
              <el-form-item label="简称:" prop="short_name">
                <el-input
                  v-model="form.short_name"
                  :maxlength="50"
                  clearable
                  placeholder="请输入客户简称"/>
              </el-form-item>
              <el-form-item label="总公司:" prop="pid">
                <el-select
                  v-model="form.pid"
                  class="ele-block"
                  clearable
                  filterable
                  placeholder="请选择总公司">
                  <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="对应供应商:" prop="supplier_id">
                <el-select
                  v-model="form.supplier_id"
                  class="ele-block"
                  clearable
                  filterable
                  placeholder="请选择供应商">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="客户管理类型:" prop="type_id">
                <el-select
                  v-model="form.type_id"
                  class="ele-block"
                  clearable
                  placeholder="请选择客户管理类型">
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="社会信用代码:" prop="register_number">
                <el-input
                  v-model="form.register_number"
                  :maxlength="18"
                  clearable
                  placeholder="请输入统一社会信用代码"/>
              </el-form-item>
              <el-form-item label="成立日期:" prop="register_date">
                <el-date-picker
                  v-model="form.register_date"
                  class="ele-fluid"
                  placeholder="请选择成立日期"
                  type="date"
                  value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="form.name"
                  :maxlength="20"
                  clearable
                  placeholder="请输入客户名称"
                  :disabled="form.status === 1"
                />
              </el-form-item>
              <el-form-item label="助记码:" prop="mnemonic">
                <el-input
                  v-model="form.mnemonic"
                  :maxlength="20"
                  clearable
                  placeholder="请输入助记码"/>
              </el-form-item>
              <el-form-item label="所属分类:" prop="category_id">
                <el-select
                  v-model="form.category_id"
                  class="ele-block"
                  clearable
                  filterable
                  @change="generateCode(false)"
                  placeholder="请选择所属分类">
                  <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="客户级别:" prop="level_id">
                <el-select
                  v-model="form.level_id"
                  class="ele-block"
                  clearable
                  placeholder="请选择客户级别">
                  <el-option
                    v-for="item in levelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="法人:" prop="legal_personal">
                <el-input
                  v-model="form.legal_personal"
                  :maxlength="50"
                  clearable
                  placeholder="请输入法人"/>
              </el-form-item>
              <el-form-item label="税号:" prop="tax">
                <el-input
                  v-model="form.tax"
                  :maxlength="50"
                  clearable
                  placeholder="请输入税号"/>
              </el-form-item>
              <el-form-item label="注册资本:" prop="register_capital">
                <el-input
                  v-model="form.register_capital"
                  :maxlength="10"
                  oninput="value=value.replace(/\D/g,'')"
                  clearable
                  placeholder="请输入注册资本">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="零售:" prop="retail">
                <el-select
                  v-model="form.retail"
                  class="ele-block"
                  clearable
                  placeholder="请选择零售">
                  <el-option :value="1" label="非零售"/>
                  <el-option :value="2" label="门店"/>
                  <el-option :value="2" label="赊销用户"/>
                </el-select>
              </el-form-item>
              <el-form-item label="发展日期:" prop="invite_date">
                <el-date-picker
                  v-model="form.invite_date"
                  class="ele-fluid"
                  placeholder="请选择发展日期"
                  type="date"
                  value-format="yyyy-MM-dd"/>
              </el-form-item>
              <el-form-item label="定金比例:" prop="deposit_ratio">
                <el-input
                  v-model="form.deposit_ratio"
                  :maxlength="5"
                  oninput="value=value.replace(/[^\d|.]/g,'')"
                  clearable
                  placeholder="请输入定金比例">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item label="员工人数:" prop="employee_number">
                <el-input
                  v-model="form.employee_number"
                  :maxlength="5"
                  oninput="value=value.replace(/\D/g,'')"
                  clearable
                  placeholder="请输入员工人数"/>
              </el-form-item>
              <el-form-item label="停用日期:" prop="stop_date">
                <el-date-picker
                  v-model="form.stop_date"
                  class="ele-fluid"
                  placeholder="请选择停用日期"
                  type="date"
                  value-format="yyyy-MM-dd"/>
              </el-form-item>
              <el-form-item label="税率:" prop="rate">
                <el-input
                  v-model="form.rate"
                  :maxlength="5"
                  oninput="value=value.replace(/[^\d|.]/g,'')"
                  clearable
                  placeholder="请输入税率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="联系信息" name="contact">
          <el-row :gutter="15" class="top">
            <el-col :sm="8">
              <el-form-item label="分管部门:" prop="dept_id">
                <tree-select
                  v-model="form.dept_id"
                  :defaultExpandLevel="2"
                  :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
                  :options="deptList"
                  placeholder="请选择分管部门"/>
              </el-form-item>
              <el-form-item label="电话:" prop="tel">
                <el-input
                  v-model="form.tel"
                  :maxlength="20"
                  clearable
                  placeholder="请输入电话"/>
              </el-form-item>
              <el-form-item label="手机:" prop="mobile">
                <el-input
                  v-model="form.mobile"
                  :maxlength="20"
                  clearable
                  placeholder="请输入手机"/>
              </el-form-item>
              <el-form-item label="邮政编码:" prop="zip">
                <el-input
                  v-model="form.zip"
                  :maxlength="20"
                  clearable
                  placeholder="请输入邮政编码"/>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="业务员:" prop="user_name">
                <remote-select
                  v-model="form.user_name"
                  @change-user="changeUser"
                  :url="'/user/getCompanyUsers'"
                  ref="RemoteSelect"
                />
              </el-form-item>
              <el-form-item label="传真:" prop="fax">
                <el-input
                  v-model="form.fax"
                  :maxlength="20"
                  clearable
                  placeholder="请输入传真"/>
              </el-form-item>
              <el-form-item label="QQ:" prop="qq">
                <el-input
                  v-model="form.qq"
                  :maxlength="20"
                  clearable
                  placeholder="请输入QQ"/>
              </el-form-item>
              <el-form-item label="联系人:" prop="contact_id">
                <el-select
                  v-model="form.contact_id"
                  class="ele-block"
                  clearable
                  filterable
                  placeholder="请选择联系人">
                  <el-option
                    v-for="item in contactList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="E-mail:" prop="email">
                <el-input
                  v-model="form.email"
                  :maxlength="20"
                  clearable
                  placeholder="请输入E-mail"/>
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
              <el-form-item label="结算方式:" prop="settle_type">
                <el-select
                  v-model="form.settle_type"
                  class="ele-block"
                  clearable
                  placeholder="请选择结算方式">
                  <el-option
                    v-for="item in settleTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="发货仓库:" prop="warehouse_id">
                <el-select
                  v-model="form.warehouse_id"
                  class="ele-block"
                  clearable
                  placeholder="请选择发货仓库">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="详细地址:" prop="address">
                <el-input
                  v-model="form.address"
                  :maxlength="150"
                  clearable
                  placeholder="请输入详细地址"/>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="网址:" prop="website">
                <el-input
                  v-model="form.website"
                  :maxlength="150"
                  clearable
                  placeholder="请输入网址"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane v-if="form.id > 0" label="银行列表" name="bank">
          <customer-bank
            :bank-list="bankList"
            :customer="customer"/>
        </el-tab-pane>
        <el-tab-pane v-if="form.id > 0" label="地址列表" name="address">
          <customer-address
            :contact-list="contactList"
            :customer="customer"/>
        </el-tab-pane>
        <el-tab-pane v-if="form.id > 0" label="开票列表" name="invoice">
          <customer-invoice
            :invoice-list="customerList"
            :customer="customer"/>
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
import TreeSelect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import RemoteSelect from "@/components/remoteSelect.vue";
import regions from 'ele-admin/packages/regions';
import CustomerBank from '../customerbank/index.vue';
import CustomerAddress from '../customeraddress/index.vue';
import CustomerInvoice from '../customerinvoice/index.vue';

export default {
  name: 'CustomerMainteEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {TreeSelect, RemoteSelect, CustomerBank, CustomerAddress, CustomerInvoice},
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
          {required: true, message: '请输入客户编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入客户名称', trigger: 'blur'}
        ],
        shortname: [
          {required: true, message: '请输入客户简称', trigger: 'blur'}
        ],
        category_id: [
          {required: true, message: '请选择所属分类', trigger: 'blur'}
        ],
        type_id: [
          {required: true, message: '请选择客户管理类型', trigger: 'blur'}
        ],
        invite_date: [
          {required: true, message: '请选择发展日期', trigger: 'blur'}
        ],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 客户列表
      supplierList: [],
      // 分类列表
      categoryList: [],
      // 客户列表
      customerList: [],
      // 部门列表
      deptList: [],
      // 联系人列表
      contactList: [],
      // 客户管理类型列表
      typeList: [],
      // 客户等级列表
      levelList: [],
      // 结算方式列表
      settleTypeList: [],
      // 仓库列表
      warehouseList: [],
      // 银行列表
      bankList: [],
      // 分类列表
      categories: {
        list: [],
        first: 0
      },
      // 默认标签页
      active: 'info',  // tab页选中
    };
  },
  computed: {
    company() {
      return this.$store.state.user.user.parent_dept
    },
    customer() {
      return this.form ? {id: this.form.id, name: this.form.name} : {};
    }
  },
  watch: {
    data() {
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
      this.getContactList(); // 查询联系人列表
      if(this.categories.list.length > 0) {
        this.generateCode();
      }
    },
    categoryList() {
      if(this.categoryList) {
        this.categoryList.forEach(category => {
          if(this.categories.first === 0) {
            this.categories.first = category.id
          }
          this.$set(this.categories.list, category.id, category);
        })
        if(!this.isUpdate) {this.generateCode()}
      }
    }
  },
  mounted() {
    this.getDeptList(); // 查询部门列表
    this.getSupplierList(); // 查询供应商列表
    this.getCustomerList(); // 查询客户列表
    this.getCategoryList(); // 查询分类列表
    this.getTypeList(); // 查询客户管理类型列表
    this.getLevelList(); // 查询客户等级列表
    this.getSettleTypeList(); // 查询联系方式列表
    this.getWarehouseList(); // 查询仓库列表
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
          this.$http.post('/customermainte/edit', this.form).then(res => {
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
    /* 获取部门列表 */
    getDeptList() {
      if (this.company.id) {
        let params = {id: this.company.id};
        this.$http.get('/dept/getDescendantList', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.deptList = this.$util.toTreeData(res.data.data, 'id', 'pid');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /**
     * 查询供应商列表
     */
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
    /**
     * 获取客户列表
     */
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
    /**
     * 查询仓库列表
     */
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
     * 获取分类列表
     */
    getCategoryList() {
      let params = {code: "customer_category"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.categoryList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取联系人列表
     */
    getContactList() {
      let params = {customer_id: this.form.id}
      this.$http.get('/customercontact/getList', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.contactList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取客户管理类型列表
     */
    getTypeList() {
      let params = {code: "cust_manage_cate"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.typeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取客户等级列表
     */
    getLevelList() {
      let params = {code: "customer_level"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.levelList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取结算方式列表
     */
    getSettleTypeList() {
      let params = {code: "settle_type"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.settleTypeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取银行列表
     */
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
    /**
     * 设置 user_id
     * @param user_id
     */
    changeUser(user_id) {
      this.form.user_id = user_id
    },
    /* 生成编码 */
    generateCode(init) {
      if(!this.isUpdate  && this.visible === true) {
        let category = this.form.category_id
          ? this.categories.list[this.form.category_id] : this.categories.list[this.categories.first];
        let params = {
          code: this.form ? this.form.code : "",
          start: category.code + "0000",
          category: category.code,
          category_id: category.id
        }
        if(init === false) {
          params.code = "";
        }
        this.$http.post('/customerarchive/generateCode', params).then(res => {
          if (res.data.code === 0) {
            if(this.form.code) {
              this.form.code = res.data.data.code;
            } else {
              this.$set(this.form, "code", res.data.data.code);
            }
          } else {
            this.$message.error(res.data.msg);
            if(this.form.code) {
              this.form.code = res.data.data.code;
            } else {
              this.$set(this.form, "code", res.data.data.code);
            }
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 触发点击事件 */
    handleClick(tab) {
      if (tab.name === 'bank') {
        this.getBankList();
      }
    },
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {status: 2, rate: "13.00"};
      if (data) {
        Object.assign(form, data, {
          pid: data.pid === 0 ? null : data.pid,
          category_id: data.category_id === 0 ? null : data.category_id,
          settle_type: data.settle_type === 0 ? null : data.settle_type,
          supplier_id: data.supplier_id === 0 ? null : data.supplier_id,
          customer_id: data.customer_id === 0 ? null : data.customer_id,
          contact_id: data.contact_id === 0 ? null : data.contact_id,
          dept_id: data.dept_id === 0 ? null : data.dept_id,
          type_id: data.type_id === 0 ? null : data.type_id,
          level_id: data.level_id === 0 ? null : data.level_id,
          retail: data.retail === 0 ? null : data.retail,
          warehouse_id: data.warehouse_id === 0 ? null : data.warehouse_id,
          register_date: data.register_date === 0 ? null : data.register_date,
          stop_date: data.stop_date === 0 ? null : data.stop_date
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
