<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部卡片 -->
    <el-card body-style="padding: 20px;" shadow="never">
      <div class="ele-cell workplace-user-card">
        <div class="ele-cell-content ele-cell">
          <el-avatar :size="68" :src="loginUser.avatar ? loginUser.avatar : require('@/assets/logo.png')"/>
          <div class="ele-cell-content">
            <h4 class="ele-elip">{{ hello }}，{{ loginUser.nickname }}</h4>
            <div class="ele-text-secondary ele-elip" style="margin-top: 8px;">
              <i class="el-icon-hot-water"></i>
              <span><s/><s/>{{ poetry }}</span>
            </div>
          </div>
        </div>
        <div class="workplace-count-group">
          <div v-if="content.approveNoticeNum" class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" type="warning">
                <i class="el-icon-finished"></i>
              </el-tag>
              <span class="workplace-count-name">待审核通知</span>
            </div>
            <div class="workplace-count-num">{{ content.approveNoticeNum }}</div>
          </div>
          <div v-if="content.noticeNum" class="workplace-count-item">
            <div class="workplace-count-header">
              <el-tag class="ele-tag-round" size="small" type="success">
                <i class="el-icon-bell"></i>
              </el-tag>
              <span class="workplace-count-name">系统通知</span>
            </div>
            <div class="workplace-count-num">{{ content.noticeNum }}</div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 快捷方式 -->
    <el-row :gutter="15">
      <el-col v-for="(shortcuts,index) in content.shortcuts.list" :key="index" :lg="content.shortcuts.num"
              :md="6" :sm="6" :xs="12">
        <el-card body-style="padding: 8px;" shadow="hover">
          <router-link class="app-link-block" :to="shortcuts.target">
            <i class="app-link-icon" :class="shortcuts.icon"></i>
            <div class="app-link-title">{{ shortcuts.name }}</div>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <!-- 最新动态、我的任务、本月目标 -->
    <el-row :gutter="15">
      <!-- 公司列表 -->
      <el-col :lg="8" :md="12" v-if="content.companies">
        <el-card
          body-style="padding: 8px;"
          :header="content.companies.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.companies.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="公司编号">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="公司全称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.fullname }}
                    </el-link>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 角色列表 -->
      <el-col :lg="8" :md="12" v-if="content.roles">
        <el-card
          body-style="padding: 8px;"
          :header="content.roles.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.roles.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="角色编码">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="角色名">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 字典列表 -->
      <el-col :lg="8" :md="12" v-if="content.dictionaries">
        <el-card
          body-style="padding: 8px;"
          :header="content.dictionaries.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.dictionaries.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="字典编码">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="字典名称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 最新动态 -->
      <el-col :lg="8" :md="12" v-if="content.activities">
        <el-card
          body-style="padding: 8px;"
          header="更新动态"
          shadow="never">
          <el-scrollbar
            style="height: 314px;"
            viewStyle="padding: 20px 10px;"
            wrapStyle="overflow-x: hidden;">
            <el-timeline
              v-if="content.activities.length"
              :reverse="true"
              class="ele-timeline">
              <el-timeline-item
                v-for="(act, index) in content.activities"
                :key="index"
                :timestamp="act.timestamp"
                :type="act.primary ? 'primary' : ''">
                {{ act.title }}
              </el-timeline-item>
            </el-timeline>
            <ele-empty v-if="!content.activities.length" text="暂无最新动态"/>
          </el-scrollbar>
        </el-card>
      </el-col>
      <!-- 仓库列表 -->
      <el-col :lg="8" :md="12" v-if="content.warehouse">
        <el-card
          body-style="padding: 8px;"
          :header="content.warehouse.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.warehouse.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="仓库名称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }} - {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100vh">
                  <template slot-scope="{row}">
                    <el-tag
                      :type="['','success','danger'][row.status]"
                      size="mini">
                      {{ ['', '激活', '未激活'][row.status] }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 供应商列表 -->
      <el-col :lg="8" :md="12" v-if="content.supplier">
        <el-card
          body-style="padding: 8px;"
          :header="content.supplier.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.supplier.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="供应商名称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }} - {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100vh">
                  <template slot-scope="{row}">
                    <el-tag
                      :type="['','success','danger'][row.status]"
                      size="mini">
                      {{ ['', '已审核', '未审核'][row.status] }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 客户列表 -->
      <el-col :lg="8" :md="12" v-if="content.customer">
        <el-card
          body-style="padding: 8px;"
          :header="content.customer.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.customer.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="客户名称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }} - {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100vh">
                  <template slot-scope="{row}">
                    <el-tag
                      :type="['','success','danger'][row.status]"
                      size="mini">
                      {{ ['', '已审核', '未审核'][row.status] }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 存货列表 -->
      <el-col :lg="8" :md="12" v-if="content.inventory">
        <el-card
          body-style="padding: 8px;"
          :header="content.inventory.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.inventory.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="存货名称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }} - {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100vh">
                  <template slot-scope="{row}">
                    <el-tag
                      :type="['','success','danger'][row.status]"
                      size="mini">
                      {{ ['', '已审核', '未审核'][row.status] }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 采购订单 -->
      <el-col v-if="content.purchase" :lg="8" :md="12">
        <el-card
          body-style="padding: 8px;"
          class="workplace-table-card"
          :header="content.purchase.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.purchase.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="订单编号">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.order_number }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="70">
                  <template slot-scope="{row}">
                  <span
                    :class="['', 'ele-text-warning','ele-text-info','ele-text-success'][row.status]">
                      {{ row.status_name }}
                  </span>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 销售订单 -->
      <el-col v-if="content.sale" :lg="8" :md="12">
        <el-card
          body-style="padding: 8px;"
          class="workplace-table-card"
          :header="content.sale.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.sale.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="订单编号">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.order_number }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="70">
                  <template slot-scope="{row}">
                  <span
                    :class="['', 'ele-text-warning','ele-text-info','ele-text-success'][row.status]">
                      {{ row.status_name }}
                  </span>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 存货自定义 -->
      <el-col v-if="content.inventoryCustom" :lg="8" :md="12">
        <el-card
          body-style="padding: 8px;"
          class="workplace-table-card"
          :header="content.inventoryCustom.name"
          shadow="never">
          <el-table-draggable :animate="300" handle=".sort-handle">
            <el-table :data="content.inventoryCustom.list" :height="314" class="ele-table-default-head">
              <el-scrollbar
                style="height: 320px;"
                viewStyle="padding: 20px 10px;"
                wrapStyle="overflow-x: hidden;">
                <el-table-column align="center" width="38">
                  <i class="sort-handle el-icon-_nav ele-text-placeholder"></i>
                </el-table-column>
                <el-table-column label="自由项编码">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.code }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="自由项名称">
                  <template slot-scope="{row}">
                    <el-link
                      :underline="false"
                      type="primary">
                      {{ row.name }}
                    </el-link>
                  </template>
                </el-table-column>
              </el-scrollbar>
            </el-table>
          </el-table-draggable>
        </el-card>
      </el-col>
      <!-- 现存量 -->
      <el-col v-if="content.reserve" :lg="16" :md="24">
        <el-card
          body-style="padding: 8px;"
          class="workplace-table-card"
          :header="content.reserve.name"
          shadow="never">
          <el-table :data="content.reserve.list" height="314">
            <el-scrollbar
              style="height: 345px;"
              viewStyle="padding: 20px 10px;"
              wrapStyle="overflow-x: hidden;">
              <el-table-column
                align="right"
                min-width="35"
                width="50"/>
              <el-table-column
                label="存货名称"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.inventory_code }} - {{ row.inventory_name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="仓库名称"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.warehouse_name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="剩余量"
                min-width="100"
                width="160">
                <template slot-scope="{row}">
                  <el-progress :percentage="row.progress" class="ele-text-small"/>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="可用数量"
                min-width="100"
                width="160">
                <template slot-scope="{row}">
                  {{ row.available_number }}
                </template>
              </el-table-column>
            </el-scrollbar>
          </el-table>
        </el-card>
      </el-col>
      <!-- 出入库流水 -->
      <el-col v-if="content.inventoryStatement" :lg="16" :md="24">
        <el-card
          body-style="padding: 8px;"
          class="workplace-table-card"
          :header="content.inventoryStatement.name"
          shadow="never">
          <el-table :data="content.inventoryStatement.list" height="314">
            <el-scrollbar
              style="height: 345px;"
              viewStyle="padding: 20px 10px;"
              wrapStyle="overflow-x: hidden;">
              <el-table-column
                align="right"
                min-width="35"
                width="50"/>
              <el-table-column
                label="订单类型"
                min-width="80">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.type_name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="订单号"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.order_number }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="存货名称"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.inventory_number }} - {{ row.inventory_name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="仓库"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.warehouse }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="数量"
                min-width="100"
                width="160">
                <template slot-scope="{row}">
                  {{ row.entry_quantity ? row.entry_quantity : row.out_quantity }}
                </template>
              </el-table-column>
            </el-scrollbar>
          </el-table>
        </el-card>
      </el-col>
      <!-- 登录日志 -->
      <el-col v-if="content.loginLog" :lg="16" :md="24">
        <el-card
          body-style="padding: 8px;"
          class="workplace-table-card"
          :header="content.loginLog.name"
          shadow="never">
          <el-table :data="content.loginLog.list" height="314px">
            <el-scrollbar
              style="height: 314px;"
              viewStyle="padding: 20px 10px;"
              wrapStyle="overflow-x: hidden;">
              <el-table-column
                align="right"
                min-width="35"
                width="50"/>
              <el-table-column
                label="登录账号"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.login_name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="请求方法"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.method }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="IP 地址"
                min-width="110">
                <template slot-scope="{row}">
                  <el-link
                    :underline="false"
                    type="primary">
                    {{ row.ip }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="类型"
                min-width="100"
                width="160">
                <template slot-scope="{row}">
                  <el-tag
                    :type="['','success','danger'][row.type]"
                    size="mini">
                    {{ row.title }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="时间"
                min-width="100"
                width="160">
                <template slot-scope="{row}">
                  {{ row.create_time }}
                </template>
              </el-table-column>
            </el-scrollbar>
          </el-table>
        </el-card>
      </el-col>
      <!-- 企业管理员列表 -->
      <el-col :lg="8" :md="12" v-if="content.admins">
        <el-card
          body-style="padding: 8px;"
          :header="content.admins.name"
          shadow="never">
          <el-scrollbar
            style="height: 314px;"
            viewStyle="padding: 20px 10px;"
            wrapStyle="overflow-x: hidden;">
            <div
              v-for="(item, index) in content.admins.list"
              :key="index"
              class="ele-cell user-list-item">
              <el-avatar :size="42" :src="item.avatar ? item.avatar : require('@/assets/logo.png')"/>
              <div class="ele-cell-content">
                <div class="ele-cell-title">{{ item.realname }}</div>
                <div class="ele-cell-desc">{{ item.dept_name }}</div>
              </div>
              <el-tag
                :type="['','success','danger'][item.status]"
                size="mini">
                {{ ['', '在用', '禁用'][item.status] }}
              </el-tag>
            </div>
            <ele-empty v-if="!content.admins.list.length" text="暂无最新动态"/>
          </el-scrollbar>
        </el-card>
      </el-col>
      <!-- 公司成员 -->
      <el-col v-if="content.companyUser" :lg="8" :md="12">
        <el-card
          body-style="padding: 8px;"
          :header="content.companyUser.name"
          shadow="never">
          <el-scrollbar
            style="height: 314px;"
            viewStyle="padding: 20px 10px;"
            wrapStyle="overflow-x: hidden;">
            <div
              v-for="(item, index) in content.companyUser.list"
              :key="index"
              class="ele-cell user-list-item">
              <el-avatar :size="42" :src="item.avatar ? item.avatar : require('@/assets/logo.png')"/>
              <div class="ele-cell-content">
                <div class="ele-cell-title">{{ item.realname }}</div>
                <div class="ele-cell-desc">{{ item.dept_name }}</div>
              </div>
              <el-tag
                :type="['','success','danger'][item.status]"
                size="mini">
                {{ ['', '在用', '禁用'][item.status] }}
              </el-tag>
            </div>
            <ele-empty v-if="!content.companyUser.list.length" text="暂无最新动态"/>
          </el-scrollbar>
        </el-card>
      </el-col>
      <!-- 部门成员 -->
      <el-col v-if="content.deptUser" :lg="8" :md="12">
        <el-card
          body-style="padding: 8px;"
          :header="content.deptUser.name"
          shadow="never">
          <el-scrollbar
            style="height: 314px;"
            viewStyle="padding: 20px 10px;"
            wrapStyle="overflow-x: hidden;">
            <div
              v-for="(item, index) in content.deptUser.list"
              :key="index"
              class="ele-cell user-list-item">
              <el-avatar :size="42" :src="item.avatar ? item.avatar : require('@/assets/logo.png')"/>
              <div class="ele-cell-content">
                <div class="ele-cell-title">{{ item.realname }}</div>
                <div class="ele-cell-desc">{{ item.dept_name }}</div>
              </div>
              <el-tag
                :type="['','success','danger'][item.status]"
                size="mini">
                {{ ['', '在用', '禁用'][item.status] }}
              </el-tag>
            </div>
            <ele-empty v-if="!content.deptUser.list.length" text="暂无最新动态"/>
          </el-scrollbar>
        </el-card>
      </el-col>
      <!-- 默认 -->
      <el-col :lg="8" :md="12" v-for="(item, index) in content.defaultList" :key="index">
        <el-card
          body-style="padding: 8px;"
          header=""
          shadow="never">
          <el-scrollbar
            style="height: 314px;"
            viewStyle="padding: 20px 10px;"
            wrapStyle="overflow-x: hidden;">
            <el-skeleton style="width: 240px" :loading="true" animated>
              <template slot="template">
                <div style="padding: 14px;">
                  <el-skeleton-item variant="h3" style="width: 100%;" />
                  <div style="display: flex; align-items: center; margin-top: 16px; height: 16px;">
                    <el-skeleton-item variant="text" style="margin-right: 16px;" />
                    <el-skeleton-item variant="text" style="width: 30%;" />
                  </div>
                  <el-skeleton-item variant="h3" style="width: 100%; margin-top: 16px;" />
                </div>
              </template>
            </el-skeleton>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardWorkplace',
  data() {
    return {
      // 工作区内容
      content: {
        shortcuts: {
          list: [],
          num: 0
        },
        defaultList: ["","","","","",""],
      },
      // 诗词
      poetry: ""
    };
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    },
    // 根据当前时间打招呼
    hello() {
      let content = "晚上好"
      let currentHour = new Date().getHours()
      if (currentHour > 6 && currentHour <= 11) {
        content = "早上好"
      } else if (currentHour > 11 && currentHour <= 13) {
        content = "中午好"
      } else if (currentHour > 13 && currentHour <= 18) {
        content = "下午好"
      }
      return content
    },
  },
  mounted() {
    this.getContent();// 获取工作区内容
    this.getPoetry(); // 获取诗词
  },
  methods: {
    /* 工作区内容 */
    getContent() {
      this.$http.get('/index/workplace').then(res => {
        if (res.data.code === 0) {
          Object.keys(res.data.data).forEach(key => {
            if(key !== 'shortcuts') {
              this.$set(this.content, key, res.data.data[key].data)
              this.content.defaultList.splice(0,res.data.data[key].size)
            } else {
              Object.assign(this.content.shortcuts, res.data.data[key].data);
            }
          })
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 诗词 */
    getPoetry() {
      let xhr = new XMLHttpRequest();
      let poetryString;
      xhr.open( 'get', 'https://v1.jinrishici.com/all.json', false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let content = JSON.parse(xhr.responseText);
          poetryString = content.content + " - " + content.origin + "(" + content.author + ")"
        }
      };
      xhr.send();

      if(poetryString) {
        this.poetry = poetryString;
      }
    }
  }
}
</script>

<style scoped>
/* 顶部用户信息卡片 */
.workplace-user-card .ele-cell-content {
  overflow: hidden;
}

.workplace-count-group {
  white-space: nowrap;
}

.workplace-count-item {
  padding: 0 5px 0 25px;
  box-sizing: border-box;
  display: inline-block;
  text-align: right;
}

.workplace-count-name {
  padding-left: 8px;
}

.workplace-count-num {
  font-size: 24px;
  margin-top: 6px;
}

@media screen and (max-width: 992px) {
  .workplace-count-item {
    padding: 0 5px 0 10px;
  }
}

@media screen and (max-width: 768px) {
  .workplace-user-card,
  .workplace-count-group {
    display: block;
  }

  .workplace-count-group {
    margin-top: 15px;
    text-align: right;
  }

  .workplace-user-card ::v-deep .el-avatar {
    width: 45px !important;
    height: 45px !important;
  }

  .workplace-user-card h4 {
    font-size: 16px;
  }

  .workplace-user-card h4 + .ele-text-secondary {
    font-size: 12px;
  }

  .workplace-user-card {
    margin: -10px;
  }
}

/* 快捷方式 */
.app-link-block {
  display: block;
  color: inherit;
  padding: 15px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.app-link-block .app-link-icon {
  color: #69c0ff;
  font-size: 30px;
  margin-top: 5px;
}

.app-link-block .app-link-title {
  margin-top: 8px;
}

/* 最新动态时间轴 */
.ele-timeline-act {
  padding-left: 50px;
}

.ele-timeline-act ::v-deep .el-timeline-item__timestamp {
  margin: 0;
  position: absolute;
  top: 3px;
  left: -45px;
}

.ele-timeline-act ::v-deep .el-timeline-item {
  padding-bottom: 19px;
}

.ele-timeline-act ::v-deep .el-timeline-item:last-child {
  padding-bottom: 0;
}

/* 表格 */
.workplace-table-card ::v-deep .el-table tbody > .el-table__row:last-child td {
  border-bottom: none;
}

.workplace-table-card ::v-deep .el-table:before {
  display: none;
}

.workplace-table-card .sort-handle {
  cursor: move;
  font-size: 18px;
  vertical-align: middle;
}

.workplace-table-card ::v-deep .el-table__row.sortable-chosen {
  background-color: hsla(0, 0%, 60%, .1);
}

.workplace-table-card ::v-deep .el-table__row.sortable-chosen td {
  background-color: transparent;
}

/* 本月目标 */
.workplace-goal-group {
  text-align: center;
  position: relative;
  padding: 48px 0;
}

.workplace-goal-group .workplace-goal-content {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
}

.workplace-goal-group .workplace-goal-num {
  font-size: 40px;
  margin-top: 15px;
}

/* 小组成员 */
.user-list-item {
  padding: 13px 18px;
}

.user-list-item + .user-list-item {
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

.user-list-item .ele-cell-desc {
  margin-top: 5px;
}

/* 小屏幕优化 */
@media screen and (max-width: 768px) {

}
</style>
