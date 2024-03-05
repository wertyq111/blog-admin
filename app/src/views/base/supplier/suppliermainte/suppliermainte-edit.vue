<!-- 供应商维护编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="isUpdate?'修改供应商':'添加供应商'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="info">
          <el-row :gutter="15" class="top">
            <el-col :sm="12">
              <el-form-item label="编码:" prop="code">
                <el-input
                  v-model="form.code"
                  :maxlength="20"
                  clearable
                  placeholder="请输入供应商编码"
                  @blur="generateCode"
                  :disabled="categories.list.length === 0 ? true : isUpdate"/>
              </el-form-item>
              <el-form-item label="简称:" prop="short_name">
                <el-input
                  v-model="form.short_name"
                  :maxlength="50"
                  clearable
                  placeholder="请输入供应商简称"/>
              </el-form-item>
              <el-form-item label="总公司:" prop="pid">
                <el-select
                  v-model="form.pid"
                  class="ele-block"
                  clearable
                  filterable
                  placeholder="请选择总公司">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="对应客户:" prop="customer_id">
                <el-select
                  v-model="form.customer_id"
                  class="ele-block"
                  clearable
                  filterable
                  placeholder="请选择客户">
                  <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="税号:" prop="tax">
                <el-input
                  v-model="form.tax"
                  :maxlength="50"
                  clearable
                  placeholder="请输入税号"/>
              </el-form-item>
              <el-form-item label="开户银行:" prop="open_bank">
                <el-input
                  v-model="form.open_bank"
                  :maxlength="150"
                  clearable
                  placeholder="请输入开户银行"/>
              </el-form-item>
              <el-form-item label="法人:" prop="legal_personal">
                <el-input
                  v-model="form.legal_personal"
                  :maxlength="50"
                  clearable
                  placeholder="请输入法人"/>
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
            <el-col :sm="12">
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="form.name"
                  :maxlength="20"
                  clearable
                  placeholder="请输入供应商名称"
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
              <el-form-item label="发展日期:" prop="invite_date">
                <el-date-picker
                  v-model="form.invite_date"
                  class="ele-fluid"
                  placeholder="请选择发展日期"
                  type="date"
                  value-format="yyyy-MM-dd"/>
              </el-form-item>
              <el-form-item label="员工人数:" prop="employee_number">
                <el-input
                  v-model="form.employee_number"
                  :maxlength="5"
                  oninput="value=value.replace(/\D/g,'')"
                  clearable
                  placeholder="请输入员工人数"/>
              </el-form-item>
              <el-form-item label="注册资金:" prop="register_capital">
                <el-input
                  v-model="form.register_capital"
                  :maxlength="10"
                  oninput="value=value.replace(/\D/g,'')"
                  clearable
                  placeholder="请输入注册资金">
                  <template slot="append">万元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="银行账号:" prop="bank_account">
                <el-input
                  v-model="form.bank_account"
                  :maxlength="20"
                  oninput="value=value.replace(/\D/g,'')"
                  clearable
                  placeholder="请输入银行账号"/>
              </el-form-item>
              <el-form-item label="所属银行:" prop="bank_id">
                <el-select
                  v-model="form.bank_id"
                  class="ele-block"
                  clearable
                  placeholder="请选择所属银行">
                  <el-option
                    v-for="item in bankList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="联系信息" name="contact">
          <el-row :gutter="15" class="top">
            <el-col :sm="12">
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
              <el-form-item label="E-mail:" prop="email">
                <el-input
                  v-model="form.email"
                  :maxlength="20"
                  clearable
                  placeholder="请输入E-mail"/>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
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
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="详细地址:" prop="address">
                <el-input
                  v-model="form.address"
                  :maxlength="50"
                  clearable
                  placeholder="请输入详细地址"/>
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
import TreeSelect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import RemoteSelect from "@/components/remoteSelect.vue";

export default {
  name: 'SupplierMainteEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {TreeSelect, RemoteSelect},
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入供应商编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'}
        ],
        category_id: [
          {required: true, message: '请选择所属分类', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 供应商列表
      supplierList: [],
      // 分类列表
      categoryList: [],
      // 客户列表
      customerList: [],
      // 部门列表
      deptList: [],
      // 联系人列表
      contactList: [],
      // 银行列表
      bankList: [],
      // 结算方式列表
      settleTypeList: [],
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
    this.getSettleTypeList(); // 查询联系方式列表
    this.getBankList(); // 查询银行列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form = Object.assign({}, this.form);
          this.$http.post('/suppliermainte/edit', this.form).then(res => {
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
    /**
     * 获取部门列表
     */
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
     * 获取分类列表
     */
    getCategoryList() {
      let params = {code: "supplier_category"};
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
      let params = {supplier_id: this.form.id}
      this.$http.get('/suppliercontact/getList', {params: params}).then(res => {
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
          this.bankList = res.data.data ? res.data.data : [];
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
      if(!this.isUpdate && this.visible === true) {
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
        this.$http.post('/supplierarchive/generateCode', params).then(res => {
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
    /* 点击事件 */
    handleClick() {},
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {status: 2};
      if (data) {
        Object.assign(form, data, {
          pid: data.pid === 0 ? null : data.pid,
          category_id: data.category_id === 0 ? null : data.category_id,
          bank_id: data.bank_id === 0 ? null : data.bank_id,
          settle_type: data.settle_type === 0 ? null : data.settle_type,
          customer_id: data.customer_id === 0 ? null : data.customer_id,
          contact_id: data.contact_id === 0 ? null : data.contact_id,
          dept_id: data.dept_id === 0 ? null : data.dept_id,
          invite_date: data.invite_date === 0 ? null : data.invite_date,
        });
      }
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
