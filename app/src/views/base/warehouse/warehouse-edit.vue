<!-- 会员编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改仓库':'添加仓库'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="仓库编码:" prop="code">
            <el-input
              v-model="form.code"
              :maxlength="20"
              clearable
              placeholder="请输入仓库编码"
              @blur="generateCode"
              :disabled="isUpdate"
            />
          </el-form-item>
          <el-form-item label="部门:" prop="dept_id">
            <tree-select
              v-model="form.dept_id"
              :defaultExpandLevel="2"
              :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
              :options="deptList"
              placeholder="请选择所属部门"/>
          </el-form-item>
          <el-form-item label="电话:" prop="tel">
            <el-input
              v-model="form.tel"
              :maxlength="20"
              clearable
              placeholder="请输入电话"/>
          </el-form-item>
          <el-form-item label="仓库属性:" prop="attribute">
            <el-select
              v-model="form.attribute"
              class="ele-block"
              clearable
              placeholder="请选择仓库属性">
              <el-option :value="1" label="普通仓"/>
              <el-option :value="2" label="现场仓"/>
              <el-option :value="3" label="委外仓"/>
            </el-select>
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
          <el-form-item label="状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">在用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="仓库名称:" prop="name">
            <el-input
              v-model="form.name"
              :maxlength="20"
              clearable
              placeholder="请输入仓库名称"/>
          </el-form-item>
          <el-form-item label="负责人:" prop="user_id">
            <remote-select
              v-model="form.user_name"
              @change-user="changeUser"
              :url="'/user/getCompanyUsers'"
              ref="RemoteSelect"
            />
          </el-form-item>
          <el-form-item label="计价方式:" prop="valuation_type">
            <el-select
              v-model="form.valuation_type"
              class="ele-block"
              clearable
              placeholder="请选择计价方式">
              <el-option :value="1" label="先进先出法"/>
              <el-option :value="2" label="全月平均法"/>
            </el-select>
          </el-form-item>
          <el-form-item label="停用日期:" prop="stop_date">
            <el-date-picker
              v-model="form.stop_date"
              class="ele-fluid"
              placeholder="请选择停用日期"
              type="date"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input
              v-model="form.address"
              :maxlength="150"
              clearable
              placeholder="请输入详细地址"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:">
        <el-input
          v-model="form.remark"
          :maxlength="200"
          :rows="3"
          clearable
          placeholder="请输入备注"
          type="textarea"/>
      </el-form-item>
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
import regions from 'ele-admin/packages/regions';
import RemoteSelect from "@/components/remoteSelect.vue";

export default {
  name: 'WarehouseEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {TreeSelect, RemoteSelect},
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
          {required: true, message: '请输入仓库编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'}
        ],
        user_id: [
          { required: false, message: '请输入责任人名称', trigger: ['change', 'blur']},
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 部门列表
      deptList: [],
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
      this.generateCode();
    }
  },
  mounted() {
    this.getDeptList(); // 查询部门列表
    this.generateCode(); // 生成编码
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
          this.$http.post('/warehouse/edit', this.form).then(res => {
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
      if(this.company.id) {
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
     * 设置 user_id
     * @param user_id
     */
    changeUser(user_id) {
      this.form.user_id = user_id
    },
    /**
     * 生成编码
     */
    generateCode() {
      if(!this.isUpdate) {
        let params = {
          code: this.form ? this.form.code : "",
          start: "1000",
          category: "1"
        }
        if(this.form && !this.form.id) {
          this.$http.post('/warehouse/generateCode', params).then(res => {
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
      }
    },
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {status: 1, attribute: 1, valuation_type: 1};
      if (data) {
        Object.assign(form, data, {
          dept_id: data.dept_id === 0 ? null : data.dept_id,
          stop_date: data.stop_date === 0 ? null : data.stop_date,
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
