<!-- 用户编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改用户':'添加用户'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="680px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-form-item label="头像：">
        <uploadImage v-model="form.avatar" :limit="1"></uploadImage>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="用户姓名:" prop="realname">
            <el-input
              v-model="form.realname"
              :maxlength="20"
              clearable
              placeholder="请输入用户姓名"/>
          </el-form-item>
          <el-form-item label="性别:" prop="gender">
            <el-select
              v-model="form.gender"
              class="ele-block"
              clearable
              placeholder="请选择性别">
              <el-option :value="1" label="男"/>
              <el-option :value="2" label="女"/>
              <el-option :value="3" label="保密"/>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input
              v-model="form.email"
              :maxlength="100"
              clearable
              placeholder="请输入邮箱"/>
          </el-form-item>
          <el-form-item label="职级：" prop="level_id">
            <el-select
              v-model="form.level_id"
              class="ele-block"
              clearable
              filterable
              placeholder="-请选择职级-"
              size="small">
              <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门:" prop="dept_id">
            <treeselect
              v-model="form.dept_id"
              :defaultExpandLevel="3"
              :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
              :options="deptList"
              placeholder="请选择所属部门"/>
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
          <el-form-item label="排序号:" prop="sort">
            <el-input-number
              v-model="form.sort"
              :min="0"
              class="ele-fluid ele-text-left"
              controls-position="right"
              placeholder="请输入排序号"/>
          </el-form-item>
          <el-form-item label="用户账号:" prop="username">
            <el-input
              v-model="form.username"
              :disabled="isUpdate"
              :maxlength="20"
              clearable
              placeholder="请输入用户账号"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="用户昵称:" prop="nickname">
            <el-input
              v-model="form.nickname"
              :maxlength="20"
              clearable
              placeholder="请输入用户昵称"/>
          </el-form-item>
          <el-form-item label="出生日期:" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              class="ele-fluid"
              format="yyyy-MM-dd"
              placeholder="请选择出生日期"
              type="date"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input
              v-model="form.mobile"
              :maxlength="11"
              clearable
              placeholder="请输入手机号"/>
          </el-form-item>
          <el-form-item label="岗位：" prop="position_id">
            <el-select
              v-model="form.position_id"
              class="ele-block"
              clearable
              filterable
              placeholder="-请选择岗位-"
              size="small">
              <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">在用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input
              v-model="form.address"
              :maxlength="150"
              clearable
              placeholder="请输入详细地址"/>
          </el-form-item>
          <el-form-item label="角色:" prop="role_ids">
            <el-select
              v-model="form.role_ids"
              class="ele-block"
              clearable
              multiple
              placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="登录密码:"
            prop="password">
            <el-input
              v-model="form.password"
              :maxlength="20"
              placeholder="请输入登录密码"
              show-password/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="个人简介:">
        <el-input
          v-model="form.intro"
          :maxlength="200"
          :rows="3"
          clearable
          placeholder="请输入个人简介"
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
import validate from 'ele-admin/packages/validate';
import uploadImage from '@/components/uploadImage.vue'
import Treeselect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import regions from 'ele-admin/packages/regions';

export default {
  name: 'UserEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {uploadImage, Treeselect},
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
      form: Object.assign({status: 1}, this.data),
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
        realname: [
          {required: true, message: '请输入用户姓名', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        birthday: [
          {required: true, message: '请选择出生日期', trigger: 'blur'}
        ],
        dept_id: [
          {required: true, message: '请选择部门', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        // city: [
        //   {required: true, message: '请选择省市区', trigger: 'blur'}
        // ],
        role_ids: [
          {required: true, message: '请选择角色', trigger: 'blur'}
        ],
        email: [
          {pattern: validate.email, message: '邮箱格式不正确', trigger: 'blur'}
        ],
        password: [
          {required: false, pattern: /^[\S]{5,18}$/, message: '密码必须为5-18位非空白字符', trigger: 'blur'}
        ],
        mobile: [
          {pattern: validate.phone, message: '手机号格式不正确', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
      // 职级列表
      levelList: [],
      // 岗位列表
      positionList: [],
      // 部门列表
      deptList: [],
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          role_ids: this.data.roles.map(d => d.id)
        });
        // 取值赋予城市组件
        this.city = this.data.city;
        // 清空密码输入框
        this.form.password = ''
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
        // 清空省市区控件
        this.city = [];
      }
    }
  },
  mounted() {
    this.queryRoles();  // 查询角色列表
    this.getLevelList(); // 查询职级列表
    this.getPositionList(); // 查询岗位列表
    this.getDeptList(); // 查询部门列表
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
          this.$http.post('/user/edit', this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg});
              if (!this.isUpdate) {
                this.form = {};
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
    /* 查询角色列表 */
    queryRoles() {
      this.$http.get('/role/getRoleList').then(res => {
        if (res.data.code === 0) {
          this.roleList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取职级列表
     */
    getLevelList() {
      this.$http.get('/level/getLevelList').then(res => {
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
     * 获取岗位列表
     */
    getPositionList() {
      this.$http.get('/position/getPositionList').then(res => {
        if (res.data.code === 0) {
          this.positionList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取部门列表
     */
    getDeptList() {
      this.$http.get('/dept/getDeptList').then(res => {
        if (res.data.code === 0) {
          this.deptList = this.$util.toTreeData(res.data.data, 'id', 'pid');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
