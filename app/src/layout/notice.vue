<!-- 顶栏消息图标 -->
<template>
<el-popover
    v-model="visible"
    :width="330"
    class="ele-notice-group"
    popper-class="ele-notice-pop"
    transition="el-zoom-in-top"
    trigger="click"
    @click="getNoticeList();getApproveList()">
  <div slot="reference" class="ele-notice-group">
    <el-badge :hidden="!unreadNum" :value="unreadNum">
      <i class="el-icon-bell"></i>
    </el-badge>
  </div>
  <el-tabs v-model="active">
    <el-tab-pane :label="noticeLabel" name="notice">
      <div class="ele-notice-list ele-scrollbar-mini">
        <div v-for="(item, index) in notice" :key="index" class="ele-notice-item">
          <div class="ele-cell ele-notice-item-wrapper" @click="readNotice(item)">
            <el-badge v-if="item.status === 2" value="new" class="item">
            <i :class="[item.icon, 'ele-notice-item-icon']" />
            </el-badge>
            <i v-else :class="[item.icon, 'ele-notice-item-icon']" />
            <div class="ele-cell-content">
              <div class="ele-elip" @click="openShow(item)"><el-link type="primary">{{ item.title }}</el-link></div>
              <div class="ele-text-secondary ele-elip">{{ item.introduce }}</div>
              <div class="ele-text-secondary ele-elip">{{ item.time }}</div>
            </div>
          </div>
          <el-divider/>
        </div>
      </div>
      <div v-if="notice.length" class="ele-cell ele-notice-actions">
        <div class="ele-cell-content" @click="clear('notice')">清空通知</div>
        <el-divider class="line-color-light" direction="vertical"/>
        <div class="ele-cell-content" @click="more('notice')">查看更多</div>
      </div>
      <ele-empty v-if="!notice.length" text="已查看所有通知"/>
    </el-tab-pane>
    <el-tab-pane :label="approveLabel" name="approve">
      <div class="ele-notice-list ele-scrollbar-mini">
        <div v-for="(item, index) in approve" :key="index" class="ele-notice-item">
          <div class="ele-notice-item-wrapper">
            <div class="ele-cell ele-cell-align-top">
              <div class="ele-cell-content ele-elip">
                <router-link :to="item.target">{{ item.name }}有<el-badge class="mark" :value="item.number" />条待审核记录</router-link>
              </div>
              <router-link :to="item.target"><i :class="[item.icon, 'ele-notice-item-icon']" /></router-link>
            </div>
            <div class="ele-text-secondary ele-elip">{{ item.time }}</div>
          </div>
          <el-divider/>
        </div>
      </div>
      <ele-empty v-if="!approve.length" text="已完成所有待审核"/>
    </el-tab-pane>
  </el-tabs>
  <!-- 编辑弹窗 -->
  <notice-show
    :data="current"
    :visible.sync="noticeDialogVisible" />
</el-popover>
</template>
<script>
import NoticeShow from './notice-show.vue';

export default {
  name: 'EleNotice',
  components: {NoticeShow},
  data() {
    return {
      visible: false,
      active: 'notice',
      notice: [],
      approve: [],
      unreadNoticeNum: 0,
      unreadApproveNum: 0,
      // 消息弹出框
      noticeDialogVisible: false,
      // 当前显示数据
      current: null,
    };
  },
  computed: {
    // 通知标题
    noticeLabel() {
      return this.notice.length ? `系统通知(${this.notice.length})` : '系统通知';
    },
    // 待审核标题
    approveLabel() {
      return this.approve.length ? `待审核通知(${this.approve.length})` : '待审核通知';
    },
    // 用户信息
    user() {
      return this.$store.state.user.user;
    },
    // 未读数量
    unreadNum() {
      return this.unreadNoticeNum + this.unreadApproveNum
    }
  },
  mounted() {
    this.getNoticeList()
    this.getApproveList()
    this.timer = setInterval(() => {
      this.getNoticeList()
      this.getApproveList()
    }, 600000)
  },
  beforeDestroy(){
    clearInterval(this.timer);
    this.timer = null;
  },
  watch: {
    user() {
      this.getNoticeList()
    }
  },
  methods: {
    /* 清空消息 */
    clear(type) {
      if (type === 'notice') {
        this.clearNotice();
        this.notice = [];
      }
    },
    /* 查看更多 */
    more(type) {
      this.visible = false;
      if (this.$route.path !== '/user/message' || this.$route.query.type !== type) {
        this.$router.push({
          path: '/user/message',
          query: {
            type: type
          }
        });
      }
    },
    /* 获取通知列表 */
    getNoticeList() {
      if(this.user && this.user.id > 0) {
        let params = {user_id: this.user.id}
        this.$http.get('/noticereceive/getTopList', {params: params}).then(res => {
          if (res.data.code === 0) {
            if(res.data.data.length > 0) {
              this.notice = [];
              res.data.data.forEach(notice => {
                  this.notice.push({
                    icon: 'el-icon-s-comment',
                    id: notice.id,
                    title: notice.notice.title,
                    introduce: notice.notice.introduce,
                    content: notice.notice.content,
                    status: notice.status,
                    time: notice.create_time
                  })
              })

              // 统计未读数量
              this.unreadNoticeNum = res.data.unreadNum;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 获取待审核列表 */
    getApproveList() {
      if(this.user && this.user.id > 0) {
        let params = {user_id: this.user.id}
        let unreadNum = 0;
        this.$http.get('/approvenotice/getList', {params: params}).then(res => {
          if (res.data.code === 0) {
            if(res.data.data.length > 0) {
              this.approve = [];
              res.data.data.forEach(approve => {
                if(approve.number > 0) {
                  this.approve.push({
                    icon: 'el-icon-edit-outline',
                    name: approve.name,
                    target: approve.target,
                    number: approve.number,
                    time: approve.time
                  })
                  unreadNum++;
                }
              })

              this.unreadApproveNum = this.unreadApproveNum !== unreadNum ? unreadNum : this.unreadApproveNum
            }
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 已读通知 */
    readNotice(notice) {
      if(notice.status === 2) {
        let params = {id: notice.id}
        this.$http.post('/noticereceive/read', params).then(res => {
          if (res.data.code === 0) {
            notice.status = 1;
            this.unreadNoticeNum--;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 清除通知列表 */
    clearNotice() {
      // 获取所有的通知 id
      let ids = [];
      this.notice.forEach(notice => {
        ids.push(notice.id)
      })
      let params = {id: ids}
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
      this.current = row;
      this.noticeDialogVisible = true;
    }
  }
}
</script>

<style lang="scss">
.ele-notice-group {
  display: block;

  .el-badge {
    line-height: 1;
    display: block;
  }
}

/* 消息通知pop */
.ele-notice-pop {
  padding: 0 !important;

  /* tab */
  .el-tabs__nav-scroll {
    text-align: center;
  }

  .el-tabs__nav {
    float: none;
    display: inline-block;
  }

  .el-tabs__item {
    height: 44px;
    line-height: 44px;
    padding: 0 20px !important;
  }

  /* 空视图 */
  .ele-empty {
    padding: 100px 0;
  }
}

/* 列表 */
.ele-notice-list {
  padding-top: 8px;
  max-height: 360px;
  overflow: auto;
}

.ele-notice-item {
  .ele-notice-item-wrapper {
    padding: 12px 15px;
    transition: background-color .2s;
    cursor: pointer;

    &:hover {
      background-color: hsla(0, 0%, 60%, .05);
    }
  }

  .ele-text-secondary {
    margin-top: 5px;
    font-size: 13px;
  }

  .ele-cell-desc {
    margin-top: 3px !important;
    font-size: 12px !important;
  }
}

.ele-notice-item-icon {
  width: 32px;
  height: 32px;
  line-height: 32px !important;
  color: #FFF;
  font-size: 16px;
  background-color: #60B2FC;
  border-radius: 50%;
  text-align: center;


  &.el-icon-s-check {
    background-color: #F5686F;
  }

  &.el-icon-video-camera {
    background-color: #7CD734;
  }

  &.el-icon-s-claim {
    background-color: #FAAD14;
  }

  &.el-icon-message-solid {
    background-color: #2BCACD;
  }
}

/* 操作按钮 */
.ele-notice-actions > .ele-cell-content {
  line-height: 42px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: hsla(0, 0%, 60%, .05);
  }
}
</style>
