<!-- 编辑弹窗 -->
<template>
  <!-- 数据表格 -->
  <ele-pro-table
    ref="table"
    :columns="columns"
    :datasource="url"
    :where="where">
    <!-- 当日价格列 -->
    <template slot="price" slot-scope="{row}">
      <span class="ele-text-warning">{{ row.price }}</span>
    </template>

    <!-- 日涨跌幅列 -->
    <template slot="zdf" slot-scope="{row}">
      <span :class="parseFloat(row.zdf)  !== 0 ? parseFloat(row.zdf) > 0 ? 'ele-text-danger' : 'ele-text-success' : 'ele-text-info'">{{ row.zdf }}</span>
    </template>

    <!-- 一年位置列 -->
    <template slot="one_year" slot-scope="{row}">
      <el-popover
        placement="right-start"
        width="200"
        trigger="hover">
        <div>
          <p>最小值：{{ row.one_year_min }}</p>
          <p>最大值：{{ row.one_year_max }}</p>
          <p>中位值：{{ row.one_year_zw }}</p>
          <p>顶位差：{{ row.one_year_dw }}</p>
          <p>底位差：{{ row.one_year_xw }}</p>
          <p>平均值：{{ row.one_year_avg }}</p>
          <p>标准差：{{ row.one_year_std }}</p>
        </div>
        <span slot="reference">{{ row.one_year_position }}</span>
      </el-popover>
    </template>

    <!-- 两年位置列 -->
    <template slot="two_year" slot-scope="{row}">
      <el-popover
        placement="right-start"
        width="200"
        trigger="hover">
        <div>
          <p>最小值：{{ row.two_year_min }}</p>
          <p>最大值：{{ row.two_year_max }}</p>
          <p>中位值：{{ row.two_year_zw }}</p>
          <p>顶位差：{{ row.two_year_dw }}</p>
          <p>底位差：{{ row.two_year_xw }}</p>
          <p>平均值：{{ row.two_year_avg }}</p>
          <p>标准差：{{ row.two_year_std }}</p>
        </div>
        <span slot="reference">{{ row.two_year_position }}</span>
      </el-popover>
    </template>

    <!-- 三年位置列 -->
    <template slot="three_year" slot-scope="{row}">
      <el-popover
        placement="right-start"
        width="200"
        trigger="hover">
        <div>
          <p>最小值：{{ row.three_year_min }}</p>
          <p>最大值：{{ row.three_year_max }}</p>
          <p>中位值：{{ row.three_year_zw }}</p>
          <p>顶位差：{{ row.three_year_dw }}</p>
          <p>底位差：{{ row.three_year_xw }}</p>
          <p>平均值：{{ row.three_year_avg }}</p>
          <p>标准差：{{ row.three_year_std }}</p>
        </div>
        <span slot="reference">{{ row.three_year_position }}</span>
      </el-popover>
    </template>

    <!-- 7日离均差列 -->
    <template slot="m7" slot-scope="{row}">
      <span :class="parseFloat(row.M7_ljc)  !== 0 ? parseFloat(row.M7_ljc) > 0 ? 'ele-text-danger' : 'ele-text-success' : 'ele-text-info'">{{ row.M7_ljc }}</span>
    </template>

    <!-- 30日离均差列 -->
    <template slot="m30" slot-scope="{row}">
      <span :class="parseFloat(row.M30_ljc)  !== 0 ? parseFloat(row.M30_ljc) > 0 ? 'ele-text-danger' : 'ele-text-success' : 'ele-text-info'">{{ row.M30_ljc }}</span>
    </template>

    <!-- 警戒列 -->
    <template slot="warn" slot-scope="{row}">
      <span v-html="row.warn"/>
    </template>
  </ele-pro-table>
</template>

<script>
export default {
  name: 'MarketAnalyseMain',
  emits: ['update-right'],
  props: {
    productId: Number,
  },
  data() {
    return {
      // 提交状态
      loading: false,
      // 表格数据接口
      url: '/marketanalyse/list',
      // 表格列配置
      columns: [
        {
          prop: 'pname',
          label: '商品名称',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'cdate',
          label: '日期',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'price',
          label: '当日价格',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'price'
        },
        {
          prop: 'zdf',
          label: '日涨跌幅',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'zdf'
        },
        {
          prop: 'one_year_position',
          label: '一年位置',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'one_year'
        },
        {
          prop: 'two_year_position',
          label: '两年位置',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'two_year'
        },
        {
          prop: 'three_year_position',
          label: '三年位置',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'three_year'
        },
        {
          prop: 'M7_ljc',
          label: '7日离均差',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'm7'
        },
        {
          prop: 'M30_ljc',
          label: '30日离均差',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'm30'
        },
        {
          prop: 'warn',
          label: '警戒',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'warn'
        },
      ],
      // 表格搜索条件
      where: {
        type: 'market_analyse',
        product_id: this.productId
      },
      // 统计数据 列表页第一行
      static_data: null
    };
  },
  mounted() {
    // 监听表格组件中的data
    this.$watch(
      () => {return this.$refs.table.data},
      (val) => {
        if(!this.static_data) {
          this.static_data = val[0];
          this.$emit('update-right', 'market_analyse', this.static_data)
        }
      })
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload();
    }
  }
}
</script>

<style scoped>
</style>
