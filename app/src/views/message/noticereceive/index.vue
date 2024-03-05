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
            <el-form-item label="通知标题:">
              <el-input
                v-model="where.notice_title"
                clearable
                placeholder="请输入通知标题"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="成员姓名:">
              <el-input
                v-model="where.user_name"
                clearable
                placeholder="请输入成员姓名"/>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="12">
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="where.status"
                class="ele-block"
                clearable
                filterable
                placeholder="-请选择状态-"
                size="small">
                <el-option label="已读" :value="1"/>
                <el-option label="未读" :value="2"/>
              </el-select>
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
        :where="where"
        height="calc(100vh - 315px)">
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-tag
            v-if=" row.status === 2"
            size="small"
            type="danger"
          >未读
          </el-tag>
          <el-tag
            v-else-if="row.status === 1"
            size="small"
            type="success"
          >已读
          </el-tag>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'NoticeReceive',
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/noticereceive/index',
      // 表格列配置
      columns: [
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'notice.title',
          label: '通知标题',
          showOverflowTooltip: true,
          minWidth: 300,
          align: 'center',
        },
        {
          prop: 'user.realname',
          label: '通知成员',
          align: 'center',
          width: 100,
          resizable: false,
        },
        {
          prop: 'status',
          label: '读取状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'status',
        },
        {
          prop: 'create_time',
          label: '创建时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'update_time',
          label: '更新时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        }
      ],
      // 表格搜索条件
      where: {},
    };
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
  }
}
</script>

<style scoped>
</style>
