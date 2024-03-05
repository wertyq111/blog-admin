<template>
  <div class="ele-body">
    <el-row :gutter="15">
      <el-col :md="24" :sm="16">
        <el-card body-style="padding-top: 5px;" shadow="never">
          <div slot="header" class="clearfix">
            <span>本单位信息</span>
          </div>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="82px">
            <el-form-item label="单位名称:" prop="name">
              <el-input
                v-model="form.name"
                :maxlength="20"
                clearable
                placeholder="请输入单位名称" />
            </el-form-item>
            <el-row :gutter="15">
              <el-col :sm="12">
                <el-form-item label="机构代码:" prop="institution_code">
                  <el-input
                    v-model="form.institution_code"
                    :maxlength="20"
                    clearable
                    placeholder="请输入机构代码" />
                </el-form-item>
                <el-form-item label="电话:" prop="tel">
                  <el-input
                    v-model="form.tel"
                    :maxlength="20"
                    clearable
                    placeholder="请输入电话"/>
                </el-form-item>
                <el-form-item label="邮政编码:" prop="zip">
                  <el-input
                    v-model="form.zip"
                    :maxlength="20"
                    clearable
                    placeholder="请输入邮政编码"/>
                </el-form-item>
                <el-form-item label="税号:" prop="tax">
                  <el-input
                    v-model="form.tax"
                    :maxlength="50"
                    clearable
                    placeholder="请输入税号"/>
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
                <el-form-item label="传真:" prop="fax">
                  <el-input
                    v-model="form.fax"
                    :maxlength="20"
                    clearable
                    placeholder="请输入传真"/>
                </el-form-item>
                <el-form-item label="电子邮箱:" prop="email">
                  <el-input
                    v-model="form.email"
                    :maxlength="20"
                    clearable
                    placeholder="请输入电子邮箱"/>
                </el-form-item>
                <el-form-item label="法人代表:" prop="legal_personal">
                  <el-input
                    v-model="form.legal_personal"
                    :maxlength="20"
                    clearable
                    placeholder="请输入法人代表"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="单位域名:" prop="website">
              <el-input
                v-model="form.website"
                :maxlength="150"
                clearable
                placeholder="请输入单位域名"/>
            </el-form-item>
            <el-form-item label="单位地址:" prop="address">
              <el-input
                v-model="form.address"
                :maxlength="200"
                clearable
                placeholder="请输入单位地址" />
            </el-form-item>
            <el-form-item label="备注1:">
              <el-input
                v-model="form.remark1"
                :maxlength="200"
                :rows="3"
                clearable
                placeholder="请输入备注1"
                type="textarea"/>
            </el-form-item>
            <el-form-item label="备注2:">
              <el-input
                v-model="form.remark2"
                :maxlength="200"
                :rows="3"
                clearable
                placeholder="请输入备注2"
                type="textarea"/>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                @click="save">保存更改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'CompanyInfo',
  data() {
    return {
      // 表单数据
      form: this.initFormData(),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入单位名称', trigger: 'blur'}
        ]
      },
      // 保存按钮loading
      loading: false,
    };
  },
  computed: {
    company() {
      return this.$store.state.user.user.parent_dept;
    }
  },
  mounted() {
    this.getCompanyInfo()
  },
  methods: {
    /* 获取公司信息 */
    getCompanyInfo() {
      this.$http.get('/companyinfo/info').then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          this.form = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /* 保存更改 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/companyinfo/edit', this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success('保存成功');
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
    /* 初始化form数据 */
    initFormData() {
      // 初始化默认值
      return {name: ""};
    },
  }
}
</script>

<style scoped>
</style>
