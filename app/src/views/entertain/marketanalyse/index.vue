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
          <el-col :lg="4" :md="12">
            <el-form-item label="商品类别:">
              <el-select
                v-model="where.category_id"
                class="ele-block"
                filterable
                clearable
                placeholder="请选择商品类别">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="商品ID:">
              <el-input
                v-model="where.product_id"
                clearable
                placeholder="请输入商品ID"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="商品名称:">
              <el-input
                v-model="where.product_name"
                clearable
                placeholder="请输入商品名称"/>
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
        height="calc(100vh - 270px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:marketanalyse:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            :loading="makeLoading"
            @click="openEdit()">订阅商品
          </el-button>
          <el-button
            v-if="permission.includes('sys:marketanalyse:dall')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <ele-dot :ripple="row.status===1" :text="['', '激活', '未激活'][row.status]"
                   :type="['', 'success', 'danger'][row.status]"/>
        </template>
        <!-- 商品名称列 -->
        <template slot="product_name" slot-scope="{row}">
          <el-link v-if="row.status === 1"
                   type="primary"
                   :underline="false"
                   @click="openView(row)" >{{ row.product_name }}</el-link>
          <el-link v-if="row.status !== 1"
                   type="info"
                   :underline="false"
                   :disabled="true">{{ row.product_name }}</el-link>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-popconfirm
            v-if="permission.includes('sys:marketanalyse:delete') && row.status !== 1"
            class="ele-action"
            title="确定要删除吗？"
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
    <market-analyse-edit
      :data="current"
      :product-list="productList"
      :visible.sync="showEdit"
      @done="reload"/>
    <!-- 图表弹窗 -->
    <market-analyse-view
      ref="info"
      :data="current"
      :visible.sync="showView"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import MarketAnalyseEdit from './marketanalyse-edit.vue';
import MarketAnalyseView from './marketanalyse-view.vue';

export default {
  name: 'MarketAnalyse',
  components: {MarketAnalyseView, MarketAnalyseEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/marketanalyse/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'product_id',
          label: '商品ID',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
        },
        {
          prop: 'product_name',
          label: '商品名称',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 200,
          slot: 'product_name'
        },
        {
          prop: 'product_category_name',
          label: '商品类别',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 200
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
          slot: 'status',
        },
        {
          prop: 'create_time',
          label: '创建时间',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 190,
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
      // 是否显示图表弹窗
      showView: false,
      // 全部菜单数据
      productCustomList: [],
      // 商品列表
      productList: [],
      // 商品类别列表
      categoryList: [],
      // 打开订阅商品,按钮进行加载开关
      makeLoading: false
    };
  },
  mounted() {
    this.getCategoryList(); // 获取商品类别列表
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
    openEdit() {
      this.makeLoading = true
      if(this.productList.length === 0) {
        this.getProductList(); // 获取商品列表
      }

      // 订阅商品申请
      this.$http.get('/marketanalyse/info').then(res => {
        if (res.data.code === 0) {
          this.current = res.data.data;
          this.showEdit = true;
        } else {
          this.$message.error(res.data.msg);
        }
        this.makeLoading = false
      }).catch(e => {
        this.$message.error(e.message);
        this.makeLoading = false
      });
    },
    /* 显示图表 */
    openView(row) {
      // 商品行情分析
      this.current = row;
      this.showView = true;
      this.$refs.info.openDialog()
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的订阅商品吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/marketanalyse/delete', {id: this.selection.filter(d => d.status !== 1).map(d => d.id)}).then(res => {
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
    /* 删除 */
    remove(row) {
      if (row.status === 1) {
        this.$message.error('已激活的商品无法被删除');
        return;
      }
      const loading = this.$loading({lock: true});
      this.$http.post('/marketanalyse/delete', {id: row.id}).then(res => {
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
    /* 获取商品列表 */
    getProductList() {
      this.$http.get('/marketanalyse/getProductList').then(res => {
        if (res.data.code === 0) {
          this.productList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取商品类别列表 */
    getCategoryList() {
      this.$http.get('/marketanalyse/getCategoryList').then(res => {
        if (res.data.code === 0) {
          this.categoryList = res.data.data;
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
