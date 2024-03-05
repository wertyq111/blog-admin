<!-- 供应商维护编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="isUpdate?'修改联系人':'添加联系人'"
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
              <el-form-item label="供应商:" prop="supplier_id">
                <el-select
                  v-model="form.supplier_id"
                  class="ele-block"
                  clearable
                  filterable
                  placeholder="请选择所属供应商">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="名称:" prop="name">
                <el-input
                  v-model="form.name"
                  :maxlength="20"
                  clearable
                  placeholder="请输入联系人姓名"/>
              </el-form-item>
              <el-form-item label="性别:" prop="gender">
                <el-select
                  v-model="form.gender"
                  class="ele-block"
                  clearable
                  placeholder="请选择性别">
                  <el-option :value="1" label="男"/>
                  <el-option :value="2" label="女"/>
                  <el-option :value="3" label="未知"/>
                </el-select>
              </el-form-item>
              <el-form-item label="籍贯:" prop="native">
                <el-input
                  v-model="form.native"
                  :maxlength="100"
                  clearable
                  placeholder="请输入籍贯"/>
              </el-form-item>
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                  v-model="form.birthday"
                  class="ele-fluid"
                  placeholder="请选择出生日期"
                  type="date"
                  value-format="yyyy-MM-dd"/>
              </el-form-item>
              <el-form-item label="婚姻状况:" prop="marry">
                <el-select
                  v-model="form.marry"
                  class="ele-block"
                  clearable
                  placeholder="请选择婚姻状况">
                  <el-option :value="1" label="未婚"/>
                  <el-option :value="2" label="已婚"/>
                  <el-option :value="3" label="不详"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="编码:" prop="code">
                <el-input
                  v-model="form.code"
                  :maxlength="20"
                  clearable
                  placeholder="请输入联系人编码"/>
              </el-form-item>
              <el-form-item label="简称:" prop="honor_name">
                <el-input
                  v-model="form.honor_name"
                  :maxlength="50"
                  clearable
                  placeholder="请输入联系人称呼"/>
              </el-form-item>
              <el-form-item label="直接上级:" prop="pid">
                <el-select
                  v-model="form.pid"
                  class="ele-block"
                  clearable
                  placeholder="请选择直接上级">
                  <el-option
                    v-for="item in contactList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
              <el-form-item label="职务:" prop="position">
                <el-tag
                  :key="tag"
                  v-for="tag in positionTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(positionTags, tag)">
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="positionInputVisible"
                  v-model="positionInputValue"
                  ref="positionTagInput"
                  size="small"
                  @blur="handleInputConfirm(positionTags, 'position')"
                  @keyup.enter.native="$event.target.blur()"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput('position')">+ 新标签
                </el-button>
              </el-form-item>
              <el-form-item label="个人爱好:" prop="hobby">
                <el-tag
                  :key="tag"
                  v-for="tag in hobbyTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(hobbyTags, tag)">
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="hobbyInputVisible"
                  v-model="hobbyInputValue"
                  ref="hobbyTagInput"
                  size="small"
                  @blur="handleInputConfirm(hobbyTags, 'hobby')"
                  @keyup.enter.native="$event.target.blur()"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput('hobby')">+ 新标签</el-button>
              </el-form-item>
              <el-form-item label="负责人:" prop="user_name">
                <remote-select
                  v-model="form.user_name"
                  @change-user="changeUser"
                  :url="'/user/getCompanyUsers'"
                  ref="RemoteSelect"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="联系信息" name="contact">
          <el-row :gutter="15" class="top">
            <el-col :sm="12">
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
            <el-col :sm="12">
              <el-form-item label="E-mail:" prop="email">
                <el-input
                  v-model="form.email"
                  :maxlength="20"
                  clearable
                  placeholder="请输入E-mail"/>
              </el-form-item>
              <el-form-item label="QQ:" prop="qq">
                <el-input
                  v-model="form.qq"
                  :maxlength="20"
                  clearable
                  placeholder="请输入QQ"/>
              </el-form-item>
              <el-form-item label="个人网页:" prop="website">
                <el-input
                  v-model="form.website"
                  :maxlength="150"
                  clearable
                  placeholder="请输入个人网页"/>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="家庭地址:" prop="address">
                <el-input
                  v-model="form.address"
                  :maxlength="150"
                  clearable
                  placeholder="请输入家庭地址"/>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="工作地址:" prop="company_address">
                <el-input
                  v-model="form.company_address"
                  :maxlength="150"
                  clearable
                  placeholder="请输入工作地址"/>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="家庭成员:" prop="family">
                <el-tag
                  :key="tag"
                  v-for="tag in familyTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(familyTags, tag)">
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="familyInputVisible"
                  v-model="familyInputValue"
                  ref="familyTagInput"
                  size="small"
                  @blur="handleInputConfirm(familyTags, 'family')"
                  @keyup.enter.native="$event.target.blur()"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput('family')">+ 新标签</el-button>
              </el-form-item>
            </el-col>
            <el-col :sm="24">
              <el-form-item :sm="10" label="备注:" prop="remark">
                <el-input
                  v-model="form.remark"
                  :maxlength="150"
                  clearable
                  placeholder="请输入备注"/>
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
import RemoteSelect from "@/components/remoteSelect.vue";

export default {
  name: 'SupplierContactEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {RemoteSelect},
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入联系人编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入联系人名称', trigger: 'blur'}
        ],
        supplier_id: [
          {required: true, message: '请选择所属供应商', trigger: 'blur'}
        ]
      },
      // 职务标签
      positionTags: [],
      positionInputVisible: false,
      positionInputValue: '',
      // 爱好标签
      hobbyTags: [],
      hobbyInputVisible: false,
      hobbyInputValue: '',
      // 家庭标签
      familyTags: [],
      familyInputVisible: false,
      familyInputValue: '',
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 供应商列表
      supplierList: [],
      // 联系人列表
      contactList: [],
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
    },
    form() {
      if (this.form.supplier_id > 0) {
        this.getContactList(); // 查询联系人列表
      }
    }
  },
  mounted() {
    this.getSupplierList(); // 查询供应商列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 城市数据处理
          this.form = Object.assign({}, this.form, {
            position: JSON.stringify(this.positionTags),
            hobby: JSON.stringify(this.hobbyTags),
            family: JSON.stringify(this.familyTags),
          });
          this.$http.post('/suppliercontact/edit', this.form).then(res => {
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
     * 获取联系人列表
     */
    getContactList() {
      let params = {supplier_id: this.form.supplier_id}
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
     * 设置 user_id
     * @param user_id
     */
    changeUser(user_id) {
      this.form.user_id = user_id
    },
    handleClick() {},
    handleClose(tags, tag) {
      tags.splice(tags.indexOf(tag), 1);
    },
    showInput(tagName) {
      switch (tagName) {
        case 'position':
          this.positionInputVisible = true
          break
        case 'hobby':
          this.hobbyInputVisible = true
          break
        case 'family':
          this.familyInputVisible = true
          break
      }

      this.$nextTick(() => {
        switch (tagName) {
          case 'position':
            this.$refs.positionTagInput.$refs.input.focus();
            break
          case 'hobby':
            this.$refs.hobbyTagInput.$refs.input.focus();
            break
          case 'family':
            this.$refs.familyTagInput.$refs.input.focus();
            break
        }
      });
    },
    handleInputConfirm(tags, tagName) {
      let inputValue = null;
      switch (tagName) {
        case 'position':
          inputValue = this.positionInputValue
          break
        case 'hobby':
          inputValue = this.hobbyInputValue
          break
        case 'family':
          inputValue = this.familyInputValue
          break
      }

      if (inputValue) {
        if (tags.indexOf(inputValue) > -1) {
          this.$message.error("不要创建重复的标签")
        } else {
          tags.push(inputValue);
        }
      }

      switch (tagName) {
        case 'position':
          this.positionInputVisible = false
          this.positionInputValue = ''
          break
        case 'hobby':
          this.hobbyInputVisible = false
          this.hobbyInputValue = ''
          break
        case 'family':
          this.familyInputVisible = false
          this.familyInputValue = ''
          break
      }
    },
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {};
      if (data) {
        Object.assign(form, data, {
          pid: data.pid === 0 ? null : data.pid,
          birthday: data.birthday === 0 ? null : data.birthday,
        });
        this.positionTags = data.position ? JSON.parse(data.position) : []
        this.hobbyTags = data.hobby ? JSON.parse(data.hobby) : []
        this.familyTags =  data.family ? JSON.parse(data.family) : []
      } else {
        this.positionTags = []
        this.hobbyTags = []
        this.familyTags = []
      }
      this.active = 'info'
      return form;
    },
  }
}
</script>

<style scoped>
.top {
  margin-top: 10px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
