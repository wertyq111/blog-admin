<!-- 顶栏右侧区域按钮 -->
<template>
  <div class="ele-admin-header-tool">
    <!-- 公司选择 -->
    <div v-if="isDevelop" class="ele-admin-header-tool-item" @click="flushNotice">
      <el-select
        v-model="company_id"
        class="ele-block"
        filterable
        @change="changeCompany"
        placeholder="请选择公司">
        <el-option
          v-for="item in companyList"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
    </div>
    <!-- 全屏切换 -->
    <div class="ele-admin-header-tool-item hidden-xs-only" @click="changeFullscreen">
      <i :class="fullscreen ? 'el-icon-_screen-restore' : 'el-icon-_screen-full'"></i>
    </div>
    <!-- 语言切换 -->
    <div class="ele-admin-header-tool-item">
      <el-dropdown placement="bottom" @command="changeLanguage">
        <i class="el-icon-_language"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="en">
            <span :class="{'ele-text-primary': language === 'en'}">English</span>
          </el-dropdown-item>
          <el-dropdown-item command="zh_CN">
            <span :class="{'ele-text-primary': language === 'zh_CN'}">简体中文</span>
          </el-dropdown-item>
          <el-dropdown-item command="zh_TW">
            <span :class="{'ele-text-primary': language === 'zh_TW'}">繁體中文</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 消息通知 -->
    <div class="ele-admin-header-tool-item" @click="flushNotice">
      <ele-notice ref="notice"/>
    </div>
    <!-- 用户信息 -->
    <div class="ele-admin-header-tool-item">
      <el-dropdown @command="onUserDropClick">
        <div class="ele-admin-header-avatar">
          <el-avatar :src="loginUser.avatar ? loginUser.avatar : require('@/assets/logo.png')"/>
          <span class="hidden-xs-only">{{ loginUser.nickname }}</span>
          <i class="el-icon-arrow-down hidden-xs-only"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile" icon="el-icon-user">
            {{ $t('layout.header.profile') }}
          </el-dropdown-item>
          <el-dropdown-item command="password" icon="el-icon-key">
            {{ $t('layout.header.password') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided icon="el-icon-switch-button">
            {{ $t('layout.header.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 主题设置 -->
    <div v-if="showSetting" class="ele-admin-header-tool-item" @click="openSetting">
      <i class="el-icon-_more"></i>
    </div>
  </div>
</template>

<script>
import EleNotice from './notice.vue';
import {isFullscreen, toggleFullscreen} from 'ele-admin/packages/util';
import setting from "@/config/setting";
import {reloadPageTab} from '@/utils/page-tab-util';

export default {
  name: 'EleHeaderRight',
  components: {EleNotice},
  emits: ['item-click', 'change-language'],
  props: {
    // 是否显示打开设置抽屉按钮
    showSetting: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    },
    // 当前语言
    language() {
      return this.$i18n.locale;
    },
  },
  data() {
    return {
      // 是否全屏状态
      fullscreen: false,
      // 公司 ID
      company_id: null,
      // 是否是开发测试角色
      isDevelop: false,
      // 公司列表
      companyList: []
    };
  },
  watch: {
    loginUser(val) {
      this.checkDevelop()
      if(this.isDevelop) {
        this.company_id = val.parent_dept.id
        this.getCompanyList()
      }
    }
  },
  methods: {
    /* 个人信息下拉菜单点击 */
    onUserDropClick(command) {
      if (command === 'logout') {
        // 退出登录
        this.$confirm(
          this.$t('layout.logout.message'),
          this.$t('layout.logout.title'),
          {type: 'warning'}
        ).then(() => {
          // 调用接口退出登录
          this.$http.get('/logout').then(res => {
            if (res.data.code === 0) {
              // 清除缓存的token
              this.$store.dispatch('user/removeToken').then(() => {
                location.replace('/login');  // 这样跳转避免再次登录重复注册动态路由
              });
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch((e) => {
            this.$message.error(e.message);
          });

        }).catch(() => {
        });
      } else if (command === 'profile') {
        if (this.$route.fullPath !== '/user/profile') {
          this.$router.push('/user/profile');
        }
      } else if (command === 'password') {
        this.$emit('item-click', 'password');
      }
    },
    /* 打开设置抽屉 */
    openSetting() {
      this.$emit('item-click', 'setting');
    },
    /* 全屏切换 */
    changeFullscreen() {
      try {
        this.fullscreen = toggleFullscreen();
      } catch (e) {
        this.$message.error('您的浏览器不支持全屏模式');
      }
    },
    /* 检查全屏状态 */
    checkFullscreen() {
      this.fullscreen = isFullscreen();
    },
    /* 切换语言 */
    changeLanguage(lang) {
      this.$emit('change-language', lang);
    },
    /* 刷新通知 */
    flushNotice() {
      this.$refs.notice.getNoticeList();
      this.$refs.notice.getApproveList();
    },
    /* 获取公司列表 */
    getCompanyList() {
      if(this.isDevelop) {
        this.$http.get('/dept/getDevCompanyList').then(res => {
          if (res.data.code === 0) {
            this.companyList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 切换公司 */
    changeCompany() {
      if(this.isDevelop) {
        let params = {company_id: this.company_id}
        this.$http.post('/role/changeCompany', params).then(res => {
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.getUserInfo()
            reloadPageTab()
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 获取当前用户信息 */
    getUserInfo() {
      if (setting.userUrl) {
        this.$http.get(setting.userUrl).then((res) => {
          const result = setting.parseUser ? setting.parseUser(res.data) : res.data;
          if (result.code === 0) {
            const user = result.data;
            this.$store.dispatch('user/setUser', user);
            this.$store.dispatch('user/setRoles', user ? user.roles : null);
            this.$store.dispatch('user/setAuthorities', user ? user.authorities : null);
            // 设置节点权限
            this.$store.dispatch('user/setPermission', user ? user.permissionList : null);
          } else if (result.msg) {
            this.$message.error(result.msg);
          }
          // 在用户权限信息请求完成后再渲染主体部分, 以免权限控制指令不生效
          this.showContent = true;
        }).catch((e) => {
          console.error(e);
          this.showContent = true;
          this.$message.error(e.message);
        });
      }
    },
    /* 验证是否是开发测试角色 */
    checkDevelop() {
      if(this.loginUser && this.loginUser.roles && this.loginUser.roles.includes(setting.develop_code)) {
        this.isDevelop = true
      }
    }
  },
}
</script>
