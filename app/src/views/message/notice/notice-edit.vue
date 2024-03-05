<!-- 通知编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改通知':'添加通知'"
    :visible="visible"
    width="850px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="82px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item
            label="通知标题:"
            prop="title">
            <el-input
              v-model="form.title"
              :maxlength="150"
              clearable
              placeholder="请输入通知标题"/>
          </el-form-item>
          <el-form-item label="通知状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">在用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="通知来源:" prop="source">
            <el-radio-group
              v-model="form.source">
              <el-radio :label="1">内部通知</el-radio>
              <el-radio :label="2">外部通知</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否置顶:" prop="is_top">
            <el-radio-group
              v-model="form.is_top">
              <el-radio :label="1">置顶</el-radio>
              <el-radio :label="2">不置顶</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 富文本编辑器 -->
      <el-form-item label="通知内容:" prop="content">
        <tinymce-editor v-model="form.content" :init="initEditor"/>
      </el-form-item>
      <el-row>
        <el-col :sm="12">
          <el-form-item label="通知部门:" prop="dept_id">
            <tree-select
              v-model="form.dept_id"
              :defaultExpandLevel="2"
              :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
              :options="deptList"
              placeholder="请选择所属部门"/>
          </el-form-item>
        </el-col>
        <el-col v-if="displayUser === false" :sm="12">
          <el-form-item  label="通知成员:" prop="user_id">
            <remote-select
              v-model="form.user_name"
              @change-user="changeUser"
              :url="'/user/getCompanyUsers'"
              :params="form.dept_id ? {dept_id: form.dept_id} : {}"
              ref="RemoteSelect"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="save">保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import TinymceEditor from '@/components/TinymceEditor/index.vue';
import TreeSelect from '@riophae/vue-treeselect' // 下拉树
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import RemoteSelect from "@/components/remoteSelect.vue";

export default {
  name: 'NoticeEdit',
  components: {TinymceEditor, TreeSelect, RemoteSelect},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({status: 1, is_top: 2, source: 1}, this.data),
      // 表单验证规则
      rules: {
        title: [
          {required: true, message: '请输入通知标题', trigger: 'blur'}
        ],
        source: [
          {required: true, message: '请选择通知来源', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择通知状态', trigger: 'blur'}
        ],
        is_top: [
          {required: true, message: '请选择是否置顶', trigger: 'blur'}
        ],
        dept_id: [
          {required: true, message: '请选择所属部门', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 部门列表
      deptList: [],
      // 用户隐藏
      displayUser: true,
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    },
    "form.dept_id"(newValue, oldValue) {
      if(newValue !== oldValue) {
        this.displayUser = newValue === 0;
      }
    }
  },
  computed: {
    // 初始化富文本
    initEditor() {
      return {
        height: 300,
        branding: false,
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.css',
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: 'code print preview fullscreen paste searchreplace save autosave link autolink image imagetools media table codesample lists advlist hr charmap emoticons anchor directionality pagebreak quickbars nonbreaking visualblocks visualchars wordcount',
        toolbar: 'fullscreen preview code | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | formatselect fontselect fontsizeselect | link image media emoticons charmap anchor pagebreak codesample | ltr rtl',
        toolbar_drawer: 'sliding',
        images_upload_handler: (blobInfo, success, error) => {
          let file = blobInfo.blob();
          // 使用axios上传
          const formData = new FormData();
          formData.append('file', file, file.name);
          this.$http.post('/upload/uploadImage', formData).then(res => {
            if (res.data.code == 0) {
              success(res.data.data);
            } else {
              error(res.data.msg);
            }
          }).catch(e => {
            console.error(e);
            error(e.message);
          });
        },
        file_picker_types: 'media',
        file_picker_callback: () => {
        }
      }
    },
    company() {
      return this.$store.state.user.user.parent_dept
    }
  },
  mounted() {
    this.getDeptList(); // 查询部门列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/notice/edit', this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
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
    /* 获取部门列表 */
    getDeptList() {
      if(this.company.id) {
        let params = {id: this.company.id};
        this.$http.get('/dept/getDescendantList', {params: params}).then(res => {
          if (res.data.code === 0) {
             let data = Array.prototype.concat({
              id: 0,
              name: "所有部门"
            }, res.data.data)
            this.deptList = this.$util.toTreeData(data, 'id', 'pid');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 设置 user_id */
    changeUser(user_id) {
      this.form.user_id = user_id
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
