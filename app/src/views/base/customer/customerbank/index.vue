<template>
  <!-- 数据表格 -->
  <ele-pro-table
    ref="table"
    :columns="columns"
    :datasource="url"
    :where="where"
    height="calc(100vh - 500px)">
    <!-- 表头工具栏 -->
    <template slot="toolbar">
      <el-button
        v-if="permission.includes('sys:customerbank:add')"
        class="ele-btn-icon"
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="add()">添加
      </el-button>
    </template>
    <!-- 所属银行列 -->
    <template slot="bank" slot-scope="{row}">
      <el-select
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.bank_id"
        class="ele-block"
        clearable
        placeholder="请选择所属银行">
        <el-option
          v-for="item in bankList"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <template v-else>{{ row.bank_name }}</template>
    </template>
    <!-- 开户银行列 -->
    <template slot="open_bank" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.open_bank"
        :maxlength="150"
        clearable
        placeholder="请输入开户银行"/>
      <template v-else>{{ row.open_bank }}</template>
    </template>
    <!-- 银行账号列 -->
    <template slot="bank_account" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.bank_account"
        :maxlength="150"
        clearable
        placeholder="请输入银行账号"/>
      <template v-else>{{ row.bank_account }}</template>
    </template>
    <!-- 账户名称列 -->
    <template slot="account_name" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.account_name"
        :maxlength="150"
        clearable
        placeholder="请输入账户名称"/>
      <template v-else>{{ row.account_name }}</template>
    </template>
    <!-- 默认值列 -->
    <template slot="default" slot-scope="{row}">
      <el-switch
        v-if="row.id > 0"
        v-model="row.is_default"
        :active-value="1"
        :inactive-value="0"
        @change="editDefault(row)"/>
    </template>
    <!-- 所在城市列 -->
    <template slot="city" slot-scope="{row}">
      <el-cascader
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="city"
        :options="regions.cityData"
        class="ele-fluid"
        clearable
        placeholder="请选择省市区"
        popper-class="ele-pop-wrap-higher"/>
      <template v-else>{{ row.city_name }}</template>
    </template>
    <!-- 机构号列 -->
    <template slot="institution_number" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.institution_number"
        :maxlength="150"
        clearable
        placeholder="请输入机构号"/>
      <template v-else>{{ row.institution_number }}</template>
    </template>
    <!-- 联行号列 -->
    <template slot="interbank_number" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.interbank_number"
        :maxlength="150"
        clearable
        placeholder="请输入联行号"/>
      <template v-else>{{ row.interbank_number }}</template>
    </template>
    <!-- 联行号2列 -->
    <template slot="interbank_number2" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        v-model="row.interbank_number2"
        :maxlength="150"
        clearable
        placeholder="请输入联行号II"/>
      <template v-else>{{ row.interbank_number2 }}</template>
    </template>
    <!-- 操作列 -->
    <template slot="action" slot-scope="{$index,row}">
      <el-link
        v-if="permission.includes('sys:customerbank:edit') && row.isEdit === true"
        :underline="false"
        icon="el-icon-edit"
        type="primary"
        @click="save(row)">保存
      </el-link>
      <el-link
        v-else-if="permission.includes('sys:customerbank:edit')"
        :underline="false"
        icon="el-icon-edit"
        type="primary"
        @click="edit($index, row)">编辑
      </el-link>
      <template v-if="permission.includes('sys:customerbank:delete') && row.id > 0">
        <el-popconfirm
          title="确定要删除此银行吗？"
          @confirm="remove(row)">
          <el-link
            v-if="permission.includes('sys:customerbank:delete') && row.id > 0"
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            type="danger">删除
          </el-link>
        </el-popconfirm>
      </template>
      <template v-else-if="permission.includes('sys:customerbank:delete') && !row.id">
        <el-popconfirm
          title="确定要取消操作吗？"
          @confirm="cancel($index)">
          <el-link
            v-if="permission.includes('sys:customerbank:delete') && !row.id"
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            type="danger">取消
          </el-link>
        </el-popconfirm>
      </template>
    </template>
  </ele-pro-table>
</template>

<script>
import {mapGetters} from "vuex";
import regions from 'ele-admin/packages/regions';

export default {
  name: 'CustomerBank',
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    bankList: Array,
    customer: Object
  },
  data() {
    return {
      // 表格数据接口
      url: '/customerbank/index',
      // 表格列配置
      columns: [
        {
          prop: 'bank_name',
          label: '所属银行',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'bank',
        },
        {
          prop: 'open_bank',
          label: '开户银行',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'open_bank',
        },
        {
          prop: 'bank_account',
          label: '银行账号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'bank_account',
        },
        {
          prop: 'account_name',
          label: '账户名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'account_name',
        },
        {
          prop: 'is_default',
          label: '默认值',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          slot: 'default'
        },
        {
          prop: 'customer_name',
          label: '所属客户',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'city',
          label: '所在城市',
          align: 'center',
          width: 200,
          resizable: false,
          slot: 'city',
        },
        {
          prop: 'institution_number',
          label: '机构号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'institution_number'
        },
        {
          prop: 'interbank_number',
          label: '联行号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'interbank_number'
        },
        {
          prop: 'interbank_number2',
          label: '联行号II',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'interbank_number2'
        },
        {
          prop: 'create_time',
          label: '创建时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'update_time',
          label: '更新时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 100,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {customer_id: this.customer.id},
      // 省市区数据
      regions: regions,
      // 选中的省市区
      city: [],
      // 选中的省市
      provinceCity: [],
      // 选中的省
      province: [],
    };
  },
  watch: {
    customer() {
      // 客户信息发生改变重新获取列表
      this.where = {customer_id: this.customer.id}
      this.reload()
    }
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 添加 */
    add() {
      let data = this.$refs.table.data;
      let editStatus = true;
      data.forEach(item => {
        if (item.isEdit === true) {
          this.$message.error("请完成当前编辑操作!")
          editStatus = false
        }
      })
      if (editStatus) {
        data.push({
          isEdit: true,
          customer_id: this.customer.id,
          customer_name: this.customer.name
        })
      }
    },
    /* 修改 */
    edit(index, row) {
      let data = this.$refs.table.data;
      let editStatus = true;
      data.forEach(item => {
        if (item.isEdit === true) {
          this.$message.error("请完成当前编辑操作!")
          editStatus = false
        }
      })
      if (editStatus) {
        this.$set(data[index], "isEdit", true)
        this.city = row.city
      }
    },
    /* 保存 */
    save(row) {
      const loading = this.$loading({lock: true});
      // 城市数据处理
      row = Object.assign({}, row, {
        city: this.city
      });
      this.$http.post('/customerbank/edit', row).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.$refs.table.reload()
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/customerbank/delete', {id: row.id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 取消 */
    cancel(index) {
      this.$refs.table.data.splice(index, 1)
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的银行吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/customerbank/delete', {id: this.selection.map(d => d.id)}).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
    /* 更改默认状态 */
    editDefault(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "is_default": row.is_default,
        "group": "customer_id"
      })
      this.$http.post('/customerbank/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
          this.reload()
        } else {
          row.is_default = !row.is_default ? 0 : 1;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
/deep/ .el-table--border th.gutter:last-of-type {
  display: table-cell !important;
}
</style>
