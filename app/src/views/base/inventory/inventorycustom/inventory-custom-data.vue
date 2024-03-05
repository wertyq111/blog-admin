<template>
  <div>
    <!-- 数据表格 -->
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="url"
      :where="where"
      height="calc(100vh - 261px)"
      tool-class="ele-toolbar-form">
      <!-- 表头工具栏 -->
      <template slot="toolbar">
        <el-form
          :model="where"
          class="ele-form-search"
          size="small"
          @keyup.enter.native="reload"
          @submit.native.prevent>
          <el-row :gutter="15">
            <el-col :md="6">
              <el-form-item>
                <el-input
                  v-model="where.code"
                  clearable
                  placeholder="请输入编码"
                  size="small"/>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item>
                <el-input
                  v-model="where.name"
                  clearable
                  placeholder="请输入名称"
                  size="small"/>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item>
                <el-button
                  class="ele-btn-icon"
                  icon="el-icon-search"
                  size="small"
                  type="primary"
                  @click="reload">查询
                </el-button>
                <el-button
                  v-if="permission.includes('sys:inventorycustomdata:add')"
                  class="ele-btn-icon"
                  icon="el-icon-plus"
                  size="small"
                  type="success"
                  @click="openEdit(null)">添加
                </el-button>
                <el-button
                  v-if="permission.includes('sys:inventorycustomdata:import')"
                  class="ele-btn-icon"
                  icon="el-icon-upload2"
                  size="small"
                  type="warning"
                  @click="showImport=true">导入
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 状态列 -->
      <template slot="status" slot-scope="{row}">
        <el-switch
          v-if="permission.includes('sys:inventorycustomdata:status')"
          v-model="row.status"
          :active-value="1"
          :inactive-value="2"
          @change="editStatus(row)"/>
        <el-tag
          v-else-if=" row.status !== 1"
          size="small"
          type="danger"
        >停用
        </el-tag>
        <el-tag
          v-else-if="row.status === 1"
          size="small"
          type="success"
        >在用
        </el-tag>
      </template>
      <!-- 操作列 -->
      <template slot="action" slot-scope="{row}">
        <el-link
          v-if="permission.includes('sys:inventorycustomdata:edit')"
          :underline="false"
          icon="el-icon-edit"
          type="primary"
          @click="openEdit(row)">修改
        </el-link>
        <el-popconfirm
          v-if="permission.includes('sys:inventorycustomdata:delete')"
          class="ele-action"
          title="确定要删除此存货自定义项吗？"
          @confirm="remove(row)">
          <el-link
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            type="danger">删除
          </el-link>
        </el-popconfirm>
      </template>
    </ele-pro-table>
    <!-- 编辑弹窗 -->
    <inventory-custom-data-edit
      :data="current"
      :custom-id="customId"
      :visible.sync="showEdit"
      @done="reload"/>
    <!-- 导入弹窗 -->
    <import-excel
      :visible.sync="showImport"
      :title="'导入自由值'"
      :target="'inventorycustomdata'"
      :params="{custom_id: customId}"
      :template_file_name="'inventorycustom/inventorycustomdata'"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import InventoryCustomDataEdit from './inventory-custom-data-edit.vue';
import ImportExcel from "@/components/ImportExcel.vue";

export default {
  name: 'InventoryCustomData',
  components: {ImportExcel, InventoryCustomDataEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    // 存货自定义id
    customId: Number
  },
  data() {
    return {
      // 表格数据接口
      url: '/inventorycustomdata/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: "left"
        },
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'code',
          label: '存货自定义项编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'name',
          label: '存货自定义项名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'sort',
          label: '排序号',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'note',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          width: 80,
          resizable: false,
          slot: 'status',
        },
        {
          prop: 'create_time',
          label: '创建时间',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'update_time',
          label: '更新时间',
          sortable: true,
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 130,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {
        customId: this.customId
      },
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/inventorycustomdata/delete', {id: row.id}).then(res => {
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
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": row.status
      })
      this.$http.post('/inventorycustomdata/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.status = row.status !== 1 ? 1 : 2;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
  },
  watch: {
    // 监听存货自定义id变化
    customId() {
      this.where.customId = this.customId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
