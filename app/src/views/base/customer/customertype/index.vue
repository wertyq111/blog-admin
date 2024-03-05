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
                placeholder="请输入分类编码"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="名称:">
              <el-input
                v-model="where.name"
                clearable
                placeholder="请输入分类名称"/>
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
              <el-button v-if="custom_status" type="warning" @click="changeCustom">
                <span v-if="where.isCustom === 1">切换到系统列表</span>
                <span v-else>切换到自定义列表</span>
              </el-button>
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
            v-if="custom_status && where.isCustom === 1"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
        </template>
        <!-- 操作列 -->
        <template v-if="custom_status && where.isCustom" slot="action" slot-scope="{row}">
          <el-link
            v-if="permission.includes('sys:dictionary:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此字典项吗？"
            @confirm="remove(row)">
            <el-link
              v-if="permission.includes('sys:dictionary:delete')"
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
    <dict-data-edit
      :data="current"
      :dict-id="dict_id"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import DictDataEdit from "@/views/data/custom-dictionary/dict-data-edit.vue";

export default {
  name: 'CustomerType',
  components: {DictDataEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/customdictdata/getDictByCode',
      // 表格列配置
      columns: [
        {
          prop: 'code',
          label: '分类编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60,
        },
        {
          prop: 'name',
          label: '分类名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
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
        dictCode: "cust_manage_cate",
        isCustom: 0
      },
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 自定义状态
      custom_status: false,
      // 字典 ID
      dict_id: 0,
    };
  },
  mounted() {
    this.getDictInfo()
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
      this.$http.post('/customdictdata/delete', {id: row.id}).then(res => {
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
      this.$confirm('确定要删除选中的分类吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/customdictdata/delete', {id: this.selection.map(d => d.id)}).then(res => {
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
    /* 获取字典信息 */
    getDictInfo() {
      this.$http.get('/customdict/info', {params: {code: 'cust_manage_cate'}}).then(res => {
        if (res.data.code === 0) {
          this.custom_status = res.data.data.custom_status === 1
          this.dict_id = res.data.data.id
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
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
      this.$http.post('/customdictdata/status', params).then(res => {
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
    /* 切换到自定义列表 */
    changeCustom() {
      this.where.isCustom = this.where.isCustom === 1 ? 0 : 1
      this.reload()
    }
  }
}
</script>

<style scoped>
</style>
