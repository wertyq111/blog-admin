<!-- 供应商维护编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="isUpdate?'修改存货':'添加存货'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px">
      <el-tabs v-model="active" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="info" style="margin: 20px auto;">
          <el-row :gutter="15">
            <el-col :sm="12">
              <el-form-item label="存货编码:" prop="code">
                <el-input
                  v-model="form.code"
                  :maxlength="20"
                  clearable
                  placeholder="请输入存货编码"
                  @blur="generateCode"
                  :disabled="categories.list.length === 0 ? true : isUpdate"
                />
              </el-form-item>
              <el-form-item label="存货分类:" prop="category_id">
                <el-select
                  v-model="form.category_id"
                  class="ele-block"
                  clearable
                  @change="generateCode(false)"
                  placeholder="请选择存货分类">
                  <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="item.code + '-' + item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="存货代码:" prop="code_name">
                <el-input
                  v-model="form.code_name"
                  :maxlength="50"
                  clearable
                  placeholder="请输入存货代码"/>
              </el-form-item>
              <el-form-item label="助记码:" prop="mnemonic">
                <el-input
                  v-model="form.mnemonic"
                  :maxlength="50"
                  clearable
                  placeholder="请输入助记码"/>
              </el-form-item>
              <el-form-item label="主计量单位:" prop="unit_id">
                <el-select
                  v-model="form.unit_id"
                  class="ele-block"
                  clearable
                  placeholder="请选择主计量单位">
                  <el-option
                    v-for="item in unitList"
                    :key="item.id"
                    :label="item.code + '-' + item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="海关编码:" prop="customs_code">
                <el-input
                  v-model="form.customs_code"
                  :maxlength="50"
                  clearable
                  placeholder="请输入海关编码"/>
              </el-form-item>
              <el-form-item label="进项税率:" prop="sale_rate">
                <el-input
                  v-model="form.sale_rate"
                  :maxlength="7"
                  oninput="value=value.replace(/[^\d|.]/g,'')"
                  clearable
                  :disabled="form.status === 1"
                  placeholder="请输入进项税率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="存货名称:" prop="name">
                <el-input
                  v-model="form.name"
                  :maxlength="20"
                  clearable
                  :disabled="form.status === 1"
                  placeholder="请输入存货名称"/>
              </el-form-item>
              <el-form-item label="英文名:" prop="ename">
                <el-input
                  v-model="form.ename"
                  :maxlength="20"
                  clearable
                  placeholder="请输入英文名"/>
              </el-form-item>
              <el-form-item label="通用名称:" prop="common_name">
                <el-input
                  v-model="form.common_name"
                  :maxlength="20"
                  clearable
                  placeholder="请输入通用名称"/>
              </el-form-item>
              <el-form-item label="规格型号:" prop="spec">
                <el-input
                  v-model="form.spec"
                  :maxlength="20"
                  clearable
                  placeholder="请输入规格型号"/>
              </el-form-item>
              <el-form-item label="海关计量单位:" prop="customs_unit">
                <el-input
                  v-model="form.customs_unit"
                  :maxlength="20"
                  clearable
                  placeholder="请输入海关计量单位"/>
              </el-form-item>
              <el-form-item label="海关单位换算率:" prop="customs_rate">
                <el-input
                  v-model="form.customs_rate"
                  :maxlength="20"
                  clearable
                  placeholder="请输入海关计量单位"/>
              </el-form-item>
              <el-form-item label="销项税率:" prop="purchase_rate">
                <el-input
                  v-model="form.purchase_rate"
                  :maxlength="7"
                  oninput="value=value.replace(/[^\d|.]/g,'')"
                  clearable
                  :disabled="form.status === 1"
                  placeholder="请输入销项税率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="存货属性:" prop="attributes">
                <el-select
                  v-model="form.attributes"
                  style="display: block;"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择存货属性">
                  <el-option
                    v-for="item in attributeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane v-for="item in customList" :key="item.id" :label="item.name" :name="item.code" style="margin: 20px auto;">
          <transfer-change
            v-model="customData[item.id]"
            @change-array="changeCustomData"
            :url="'/inventorycustomdata/getList'"
            :title="item.name"
            :params="{custom_id: item.id}"
            :custom_disabled="item.status !== 1"
            :ref="'transfer-change-' + item.id"
          />
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
import TransferChange from '@/components/TransferChange.vue';

export default {
  name: 'InventoryMainteEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {TransferChange},
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入存货编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入存货名称', trigger: 'blur'}
        ],
        category_id: [
          {required: true, message: '请选择存货分类', trigger: 'blur'}
        ],
        unit_id: [
          {required: true, message: '请选择主计量单位', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 分类列表
      categoryList: [],
      // 计量单位列表
      unitList: [],
      // 存货属性列表
      attributeList: [],
      // 存货自定义列
      customList: [],
      // 存货自定义绑定值
      customData: {},
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
    this.getCategoryList(); // 查询分类列表
    this.getUnitList(); // 查询计量单位列表
    this.getAttributeList(); // 查询存货属性列表
    this.getCustomList(); // 查询存货自定义列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.form = (!this.form.custom_data)
            ? Object.assign({}, this.form, {custom_data: this.customData})
            : Object.assign({}, this.form);
          this.$http.post('/inventorymainte/edit', this.form).then(res => {
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
          this.active='info'
          return false;
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /**
     * 获取分类列表
     */
    getCategoryList() {
      let params = {code: "inventory_category"};
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
     * 获取计量单位列表
     */
    getUnitList() {
      let params = {code: "unit"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.unitList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取存货属性列表
     */
    getAttributeList() {
      let params = {code: "inventory_attributes"};
      this.$http.get('/customdictdata/getAllByCode', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.attributeList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取存货自定义列表
     */
    getCustomList() {
      this.$http.get('/inventorycustom/getList').then(res => {
        if (res.data.code === 0) {
          this.customList = res.data.data;
          this.customList.forEach(l => {this.$set(this.customData, l.id, [])})
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 生成编码 */
    generateCode(init) {
      if(!this.isUpdate && this.visible === true) {
        let category = this.form.category_id
          ? this.categories.list[this.form.category_id] : this.categories.list[this.categories.first];
        let params = {
          code: this.form ? this.form.code : "",
          start: category.code + "00000000",
          category: category.code,
          category_id: category.id
        }
        if(init === false) {
          params.code = "";
        }
        this.$http.post('/inventoryarchive/generateCode', params).then(res => {
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
    handleClick() {},
    /**
     * 传入自定义项选中值
     * @param custom_data
     * @param params
     */
    changeCustomData(custom_data, params) {
      let customKey = params.custom_id
      this.$set(this.customData, customKey, custom_data)
    },
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {status: 2, customs_rate: "1.0000000", sale_rate: "13.00", purchase_rate: "13.00"};
      if (data) {
        Object.assign(form, data, {
          category_id: data.category_id === 0 ? null : data.category_id,
          unit_id: data.unit_id === 0 ? null : data.unit_id
        });
        if(data.custom_data) {
          this.customData = data.custom_data
        }
      }
      return form;
    },
  }
}
</script>

<style scoped>
</style>
