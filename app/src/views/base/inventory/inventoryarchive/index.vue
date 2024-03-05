<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="编码:">
              <el-input
                v-model="where.code"
                clearable
                placeholder="请输入存货编码"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入存货名称"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                class="ele-btn-icon"
                icon="el-icon-search"
                type="primary"
                @click="reload">查询
              </el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="url"
        :selection.sync="selection"
        :where="where">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:inventoryarchive:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
          <el-button
            v-if="permission.includes('sys:inventoryarchive:dall')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
          <el-button
            v-if="permission.includes('sys:inventoryarchive:edit')"
            class="ele-btn-icon"
            icon="el-icon-finished"
            size="small"
            type="warning"
            @click="approvedBatch">审核
          </el-button>
          <el-button
            v-if="permission.includes('sys:inventoryarchive:import')"
            class="ele-btn-icon"
            icon="el-icon-upload2"
            size="small"
            @click="showImport=true">导入
          </el-button>
          <!-- 导出按钮 -->
          <export-excel-button
            v-if="permission.includes('sys:inventoryarchive:export')"
            :target="'inventoryarchive'"
            :where="where"
          />
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-switch
            v-if="permission.includes('sys:inventoryarchive:status')"
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="editStatus(row)"/>
          <el-tag
            v-else-if=" row.status !== 1"
            size="small"
            type="danger"
          >待审核
          </el-tag>
          <el-tag
            v-else-if="row.status === 1"
            size="small"
            type="success"
          >已审核
          </el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:inventoryarchive:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            v-if="permission.includes('sys:inventoryarchive:delete') && row.status !== 1"
            class="ele-action"
            title="确定要删除此存货吗？"
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
    </el-card>
    <!-- 编辑弹窗 -->
    <inventory-archive-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
    <!-- 导入弹窗 -->
    <import-excel
      v-if="importTemplateUrl"
      :visible.sync="showImport"
      :title="'导入存货'"
      :target="'inventoryarchive'"
      :dynamic_template_url="importTemplateUrl"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import InventoryArchiveEdit from './inventoryarchive-edit.vue';
import ExportExcelButton from "@/components/ExportExcelButton.vue";
import ImportExcel from "@/components/ImportExcel.vue";


export default {
  name: 'InventoryArchive',
  components: {ImportExcel, ExportExcelButton, InventoryArchiveEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/inventoryarchive/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          selectable: this.checkSelectable,
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
          label: '存货编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'name',
          label: '存货名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'category_name',
          label: '存货分类',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
        },
        {
          prop: 'code_name',
          label: '存货代码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
        },
        {
          prop: 'unit_name',
          label: '主计量单位名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
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
          width: 220,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // 导入模板地址
      importTemplateUrl: '',
    };
  },
  watch: {},
  mounted() {
    this.getImportTemplate(); // 获取导入模板地址
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
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.post('/inventoryarchive/delete', {id: row.id}).then(res => {
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
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的存货吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/inventoryarchive/delete', {id: this.selection.filter(d => d.status !== 1).map(d => d.id)}).then(res => {
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
    /* 批量审核(不支持灭活) */
    approvedBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要审核选中的存货吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        let params = {
          id: this.selection.filter(d => d.status !== 1).map(d => d.id),
          status: 1
        }
        this.$http.post('/inventoryarchive/status', params).then(res => {
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
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": row.status
      })
      this.$http.post('/inventoryarchive/status', params).then(res => {
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
    /* 复选框禁用 */
    checkSelectable(row) {
      return row.status !== 1;
    },
    /* 获取导入模板地址 */
    getImportTemplate() {
      this.$http.get('/inventoryarchive/getImportTemplate').then(res => {
        if (res.data.code === 0) {
          this.importTemplateUrl = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
  }
}
</script>

<style scoped>
</style>
