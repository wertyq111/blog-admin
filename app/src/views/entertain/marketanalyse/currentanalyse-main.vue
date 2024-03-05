<!-- 编辑弹窗 -->
<template>
  <!-- 数据表格 -->
  <ele-pro-table
    ref="table"
    :columns="columns"
    :datasource="url"
    :where="where">
  </ele-pro-table>
</template>

<script>
export default {
  name: 'CurrentAnalyseMain',
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
          prop: 'product',
          label: '商品',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'contract',
          label: '代码',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'priceopen',
          label: '开盘价',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'pricesettle',
          label: '结算价',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
        },
        {
          prop: 'positions',
          label: '持仓量',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'volume',
          label: '成交量',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'pubDate',
          label: '日期',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'exchange',
          label: '市场',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        }
      ],
      // 表格搜索条件
      where: {
        type: 'current_analyse',
        product_id: this.productId
      },
      // 统计数据 列表页第一行
      static_data: null
    };
  },
  mounted() {},
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
