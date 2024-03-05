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
        v-if="permission.includes('sys:customeraddress:add')"
        class="ele-btn-icon"
        icon="el-icon-plus"
        size="small"
        type="primary"
        @click="add()">添加
      </el-button>
    </template>
    <!-- 地址编码列 -->
    <template slot="code" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.code"
        :maxlength="150"
        clearable
        placeholder="请输入地址编码"/>
      <template v-else>{{ row.code }}</template>
    </template>
    <!-- 收货地址列 -->
    <template slot="address" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.address"
        :maxlength="150"
        clearable
        placeholder="请输入收货地址"/>
      <template v-else>{{ row.address }}</template>
    </template>
    <!-- 收货单位列 -->
    <template slot="unit" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.unit"
        :maxlength="150"
        clearable
        placeholder="请输入收货单位"/>
      <template v-else>{{ row.unit }}</template>
    </template>
    <!-- 联系人列 -->
    <template slot="contact" slot-scope="{row}">
      <el-select
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.contact_id"
        class="ele-block"
        clearable
        placeholder="请选择联系人">
        <el-option
          v-for="item in contactList"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <template v-else>{{ row.bank_name }}</template>
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
    <!-- 英文地址列 -->
    <template slot="eaddress" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.eaddress"
        :maxlength="150"
        clearable
        placeholder="请输入英文地址"/>
      <template v-else>{{ row.eaddress }}</template>
    </template>
    <!-- 英文地址列2 -->
    <template slot="eaddress2" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.eaddress2"
        :maxlength="150"
        clearable
        placeholder="请输入英文地址2"/>
      <template v-else>{{ row.eaddress2 }}</template>
    </template>
    <!-- 英文地址列3 -->
    <template slot="eaddress3" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.eaddress3"
        :maxlength="150"
        clearable
        placeholder="请输入英文地址3"/>
      <template v-else>{{ row.eaddress3 }}</template>
    </template>
    <!-- 英文地址列4 -->
    <template slot="eaddress4" slot-scope="{row}">
      <el-input
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        v-model="row.eaddress4"
        :maxlength="150"
        clearable
        placeholder="请输入英文地址4"/>
      <template v-else>{{ row.eaddress4 }}</template>
    </template>
    <!-- 操作列 -->
    <template slot="action" slot-scope="{$index,row}">
      <el-link
        v-if="permission.includes('sys:customeraddress:edit') && row.isEdit === true"
        :underline="false"
        icon="el-icon-edit"
        type="primary"
        @click="save(row)">保存
      </el-link>
      <el-link
        v-else-if="permission.includes('sys:customeraddress:edit')"
        :underline="false"
        icon="el-icon-edit"
        type="primary"
        @click="edit($index)">编辑
      </el-link>
      <template v-if="permission.includes('sys:customeraddress:delete') && row.id > 0">
        <el-popconfirm
          title="确定要删除此地址吗？"
          @confirm="remove(row)">
          <el-link
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            type="danger">删除
          </el-link>
        </el-popconfirm>
      </template>
      <template v-else-if="permission.includes('sys:customeraddress:delete') && !row.id">
        <el-popconfirm
          title="确定要取消操作吗？"
          @confirm="cancel($index)">
          <el-link
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

export default {
  name: 'CustomerAddress',
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    contactList: Array,
    customer: Object
  },
  data() {
    return {
      // 表格数据接口
      url: '/customeraddress/index',
      // 表格列配置
      columns: [
        {
          prop: 'code',
          label: '地址编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          slot: 'code',
        },
        {
          prop: 'address',
          label: '收货地址',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'address',
        },
        {
          prop: 'unit',
          label: '收货单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'unit',
        },
        {
          prop: 'contact_name',
          label: '联系人',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'contact',
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
          prop: 'eaddress',
          label: '英文地址',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'eaddress',
        },
        {
          prop: 'eaddress2',
          label: '英文地址2',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'eaddress2',
        },
        {
          prop: 'eaddress3',
          label: '英文地址3',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'eaddress3',
        },
        {
          prop: 'eaddress4',
          label: '英文地址4',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200,
          slot: 'eaddress4',
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
    edit(index) {
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
      }
    },
    /* 保存 */
    save(row) {
      const loading = this.$loading({lock: true});
      // 城市数据处理
      row = Object.assign({}, row);
      this.$http.post('/customeraddress/edit', row).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload()
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
      this.$http.post('/customeraddress/delete', {id: row.id}).then(res => {
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
      this.$confirm('确定要删除选中的地址吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/customeraddress/delete', {id: this.selection.map(d => d.id)}).then(res => {
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
      this.$http.post('/customeraddress/status', params).then(res => {
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
