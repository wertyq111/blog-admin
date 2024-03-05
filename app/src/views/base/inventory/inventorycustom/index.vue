<template>
  <div class="ele-body">
    <el-card
      body-style="padding-bottom: 0;"
      shadow="never">
      <el-row :gutter="15">
        <el-col :lg="6" style="margin-bottom: 15px;">
          <!-- 数据表格 -->
          <ele-pro-table
            ref="table"
            :columns="columns"
            :current.sync="current"
            :datasource="url"
            :where="where"
            :need-page="false"
            :toolkit="[]"
            :row-class-name="tableRowClassName"
            class="custom-table"
            height="calc(100vh - 261px)"
            highlight-current-row
            tool-class="ele-toolbar-actions"
            @done="done">
            <!-- 表头工具栏 -->
            <template slot="toolbar">
              <el-button
                v-if="permission.includes('sys:inventorycustom:add')"
                class="ele-btn-icon"
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="openEdit(null)">添加
              </el-button>
              <el-button
                v-if="permission.includes('sys:inventorycustom:edit')"
                :disabled="!current"
                class="ele-btn-icon"
                icon="el-icon-edit"
                size="small"
                type="warning"
                @click="openEdit(current)">修改
              </el-button>
            </template>
            <!-- 名称列 -->
            <template slot="name" slot-scope="{row}">
              {{ row.name }}<span v-if="row.status !== 1"> (已停用)</span>
            </template>
          </ele-pro-table>
        </el-col>
        <el-col :lg="18" style="margin-bottom: 15px;">
          <!-- 存货自定义项列表 -->
          <inventory-custom-data v-if="current" :custom-id="current.id"/>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑弹窗 -->
    <inventory-custom-edit
      :data="editData"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import InventoryCustomData from './inventory-custom-data.vue';
import InventoryCustomEdit from './inventory-custom-edit.vue';

export default {
  name: 'InventoryCustom',
  components: {InventoryCustomData, InventoryCustomEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/inventorycustom/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'name',
          label: '自定义名称',
          showOverflowTooltip: true,
          slot: 'name'
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null
    };
  },
  methods: {
    /* 表格渲染完成回调 */
    done(res) {
      if (res.data.length > 0) {
        this.$refs.table.setCurrentRow(res.data[0]);
      }
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload();
    },
    /* 显示编辑 */
    openEdit(row) {
      this.editData = row;
      this.showEdit = true;
    },
    /* 状态停用整行变灰并加上提示 */
    tableRowClassName({row}) {
      if(row.status === 2) {
        return 'warning-row'
      }
    }
    // /* 删除 */
    // remove() {
    //   this.$confirm('确定要删除选中的存货自定义吗?', '提示', {
    //     type: 'warning'
    //   }).then(() => {
    //     const loading = this.$loading({lock: true});
    //     this.$http.post('/inventorycustom/delete?id=' + this.current.id).then(res => {
    //       loading.close();
    //       if (res.data.code === 0) {
    //         this.$message.success(res.data.msg);
    //         this.reload();
    //       } else {
    //         this.$message.error(res.data.msg);
    //       }
    //     }).catch(e => {
    //       loading.close();
    //       this.$message.error(e.message);
    //     });
    //   }).catch(() => {
    //   });
    // }
  }
}
</script>

<style scoped>
.custom-table ::v-deep .el-table__row {
  cursor: pointer;
}

.custom-table ::v-deep .el-table__row > td:last-child:after {
  content: "\e6e0";
  font-family: element-icons,serif !important;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -7px;
}

.custom-table ::v-deep .el-table__row > td:last-child .cell {
  padding-right: 20px;
}

/* 表格整行颜色 */
/deep/ .warning-row {
  color: #ccc !important;
}
</style>
