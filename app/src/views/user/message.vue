<template>
  <div class="ele-body">
    <el-card body-style="padding: 0;" shadow="never">
      <div class="ele-cell ele-cell-align-top ele-user-message">
        <el-menu
          :default-active="active"
          :mode="mode"
          class="ele-scrollbar-hide">
          <el-menu-item index="notice">
            <router-link to="/user/message?type=notice">
              <span>系统通知</span>
              <el-badge
                v-if="unreadNum"
                :value="unreadNum"
                class="ele-badge-static"/>
            </router-link>
          </el-menu-item>
        </el-menu>
        <div class="ele-cell-content">
          <!-- 数据表格 -->
          <ele-pro-table
            ref="table"
            :columns="columns"
            :datasource="data"
            :loading="loading"
            :selection.sync="selection"
            tool-class="ele-toolbar-actions"
            @refresh="query">
            <template slot="toolbar">
              <el-button
                size="small"
                type="primary"
                @click="read">标记已读
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="readAll">全部已读
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="removeBatch">删除消息
              </el-button>
            </template>
            <template slot="status" slot-scope="{row}">
              <span :class="['', 'ele-text-success', 'ele-text-danger'][row.status]">
                {{ ['', '已读','未读'][row.status] }}
              </span>
            </template>
            <template slot="action" slot-scope="{row}">
              <el-link
                :underline="false"
                icon="el-icon-view"
                type="primary"
                @click="openShow(row);">查看
              </el-link>
              <el-popconfirm
                class="ele-action"
                title="确定要删除此消息吗？"
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
        </div>
      </div>
    </el-card>
    <!-- 编辑弹窗 -->
    <message-show
      :data="current"
      :visible.sync="visible" />
  </div>
</template>

<script>
import MessageShow from "./message-show.vue";

export default {
  name: 'UserMessage',
  components: {MessageShow},
  data() {
    return {
      // 导航选中
      active: 'notice',
      // 加载状态
      loading: true,
      // 全部数据
      allData: [],
      // 列表显示数据
      data: [],
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'notice.title',
          label: '通知标题',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'create_time',
          label: '时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 140
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          width: 80,
          slot: 'status'
        },
        {
          columnKey: 'action',
          label: '操作',
          align: 'center',
          showOverflowTooltip: true,
          width: 140,
          resizable: false,
          slot: 'action'
        }
      ],
      // 列表选中数据
      selection: [],
      // 消息弹出框
      visible: false,
      // 当前显示数据
      current: null,
    };
  },
  computed: {
    // 小屏幕水平导航
    mode() {
      return this.$store.state.theme.screenWidth < 768 ? 'horizontal' : 'vertical';
    },
    // 系统通知未读数量
    unreadNum() {
      return this.allData.filter((d) => d.state === 0 && d.type === 'notice').length;
    },
    // 用户信息
    user() {
      return this.$store.state.user.user;
    },
  },
  mounted() {
    const type = this.$route.query.type;
    if (type) {
      this.active = type;
    }
    this.query();
  },
  methods: {
    /* 查询全部数据 */
    query() {
      if(this.user && this.user.id > 0) {
        let params = {user_id: this.user.id}
        this.loading = true;
        this.$http.get('/noticereceive/getUserList', {params: params}).then((res) => {
          this.loading = false;
          if (res.data.code === 0) {
            this.allData = res.data.data;
            this.changeType();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
      }
    },
    /* 切换消息类型 */
    changeType(index) {
      if (index) {
        this.active = index;
      }
      if (this.active === 'all') {
        this.data = [].concat(this.allData);
      } else {
        this.data = this.allData.filter((d) => d.type === this.active);
      }
      this.selection = [];
    },
    /* 查看 */
    view(row) {
      this.$message.info(row.title);
    },
    /* 删除单个 */
    remove(row) {
      this.allData.splice(this.allData.findIndex((t) => t.id === row.id), 1);
      this.deleteNotice(row);
      this.$message.success('删除成功');
      this.changeType();
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        return this.$message.error('请至少选择一条数据');
      }
      this.$confirm('确定要删除选中的消息吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.selection.forEach((d) => {
          this.deleteNotice(d);
          this.allData.splice(d, 1);
        });
        this.$message.success('删除成功');
        this.changeType();
      }).catch(() => {
      });
    },
    /* 标记已读 */
    read() {
      if (!this.selection.length) {
        return this.$message.error('请至少选择一条数据');
      }
      this.selection.forEach((d) => {
        const index = this.allData.findIndex((t) => t.id === d.id);
        if(this.allData[index].status === 2) this.readNotice(this.allData[index])
        this.allData[index].status = 1;
      });
      this.changeType();
    },
    /* 全部标记已读 */
    readAll() {
      this.allData.forEach((d) => {
        if(d.status === 2) this.readNotice(d)
        d.status = 1;
      });
      this.changeType();
    },
    /* 已读通知 */
    readNotice(notice) {
      if(notice.status === 2) {
        let params = {id: notice.id}
        this.$http.post('/noticereceive/read', params).then(res => {
          if (res.data.code === 0) {
            notice.status = 1;
            this.unreadNum--;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 清除通知 */
    deleteNotice(notice) {
      let params = {id: notice.id}
      this.$http.post('/noticereceive/delete', params).then(res => {
        if (res.data.code !== 0) {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 显示编辑 */
    openShow(row) {
      this.current = {
        title: row.notice.title,
        content: row.notice.content
      };
      this.visible = true;
      // 标记已读
      this.readNotice(row)
    }
  },
  watch: {
    $route() {
      const type = this.$route.query.type;
      this.changeType(type || 'notice');
    },
    user() {
      this.query()
    }
  }
}
</script>

<style scoped>
.ele-user-message ::v-deep .el-menu {
  width: 151px;
  flex-shrink: 0;
}

.ele-user-message .ele-cell-content {
  padding: 15px;
  box-sizing: border-box;
  overflow: auto;
}

.ele-user-message .ele-badge-static {
  margin-left: 10px;
}

@media screen and (min-width: 768px) {
  .ele-user-message ::v-deep .el-menu .el-menu-item {
    text-align: right;
  }

  .ele-user-message ::v-deep .el-menu .el-menu-item:first-child {
    margin-top: 15px;
  }
}

@media screen and (max-width: 768px) {
  .ele-user-message {
    display: block;
  }

  .ele-user-message ::v-deep .el-menu {
    width: auto;
    text-align: center;
    white-space: nowrap;
    overflow: auto;
  }

  .ele-user-message ::v-deep .el-menu .el-menu-item {
    height: 45px;
    line-height: 45px;
    padding: 0 5px;
    display: inline-block;
    float: none;
  }

  .ele-user-message .ele-badge-static {
    margin-left: 3px;
  }
}
</style>
