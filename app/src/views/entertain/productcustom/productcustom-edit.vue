<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改商品申请':'添加商品申请'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="92px"
      @keyup.enter.native="save"
      @submit.native.prevent>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="公司:">
            <el-select
              v-model="form.company_id"
              class="ele-block"
              filterable
              clearable
              placeholder="请选择公司">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否激活:">
            <el-radio-group
              v-model="form.is_approved">
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24">
          <template v-if="productList && productList.length > 0">
            <el-form-item v-for="(product, idx) in productList" :key="idx" :label="'【' + product.category_name + '】:'">
              <el-checkbox
                :indeterminate="productAddList[idx].isIndeterminate"
                v-model="productAddList[idx].checkAll"
                @change="checked=>handleCheckAllChange(checked, idx)">全选
              </el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="products" @change="checked=>handleCheckedProductChange(checked, idx)">
                <el-checkbox v-for="(pro,index) in product.list" :label="pro" :key="index">{{ pro.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
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
export default {
  name: 'ProductCustomEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部菜单数据
    companyList: Array,
    // 可订阅商品
    productList: Array,
  },
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        company_id: [
          {required: true, message: '请选择公司', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 是否全选
      checkAll: false,
      isIndeterminate: true,
      // 已选中商品
      products: []
    };
  },
  computed: {
    productAddList() {
      let checkedArray = [];
      if (this.productList.length > 0) {
        for (let index in this.productList) {
          this.$set(checkedArray, index, {
            'checkAll': false,
            'isIndeterminate': true
          })
        }
      }
      return checkedArray;
    }
  },
  watch: {
    data() {
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http.post('/productcustom/edit',
            Object.assign({}, this.form)
          ).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
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
    /* 商品全选事件 */
    handleCheckAllChange(val, index) {
      this.$set(this.form.products, index, val ? this.productList[index].list : [])

      let products = []
      this.form.products.forEach(list => {
        products = products.concat(list)
      })
      this.products = products
      this.productAddList[index].isIndeterminate = false
    },
    /* 商品选中事件 */
    handleCheckedProductChange(value, index) {
      let checkedCount = value.length;
      // 只去对应键值下的值
      let intersection = this.productList[index].list.filter(function (v) {
        return value.indexOf(v) > -1
      })
      this.$set(this.form.products, index, intersection)

      this.productAddList[index].checkAll = checkedCount === this.productList[index].list.length;
      this.productAddList[index].isIndeterminate = checkedCount > 0 && checkedCount < this.productList[index].list.length;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 初始化form数据 */
    initFormData(data) {
      this.products = [];
      let form = {
        is_approved: 2,
        products: []
      };
      if (data) {
        Object.assign(form, data);
        form.products = [];
        for (let index in data.productIds) {
          let result = this.arrayFind(this.productList, 'ppid', data.productIds[index])
          this.products.push(result.product)
          if (form.products[result.index] !== undefined) {
            form.products[result.index].push(result.product)
          } else {
            this.$set(form.products, result.index, [result.product])
          }
        }
      }
      return form;
    },
    /* 根据键值查找对应对象 */
    arrayFind(data, key, value) {
      for (let i in data) {
        for (let j in data[i].list) {
          if (data[i].list[j][key] === value) {
            return {
              product: data[i].list[j],
              index: i
            }
          }
        }

      }
      return null;
    }
  }
}
</script>

<style scoped>
</style>
