<!-- 编辑弹窗 -->
<template>
  <!-- 数据表格 -->
  <ele-pro-table
    ref="table"
    :columns="columns"
    :datasource="url"
    :where="where">
    <!-- 报价列 -->
    <template slot="offer" slot-scope="{row}">
      <span>{{ row.price }}{{ row.unit }}</span>
    </template>

    <!-- 升贴水列 -->
    <template slot="upward" slot-scope="{row}">
      <el-popover
        placement="right-start"
        width="200"
        trigger="hover"
        :content="'生意社最新价格为 ' + row.ave + row.unit">
        <span slot="reference" :class="row.is_zd > 0 ? 'ele-text-danger' : 'ele-text-success'">{{ row.is_zd }}</span>
      </el-popover>
    </template>
  </ele-pro-table>
</template>

<script>
export default {
  name: 'PricingToolsMain',
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
          prop: 'intro',
          label: '规格',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 180
        },
        {
          prop: 'cname',
          label: '品牌/产地',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'offer',
          label: '报价',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          slot: 'offer'
        },
        {
          prop: 'upward',
          label: '升贴水',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
          renderHeader: this.getHeaderCellStyle,
          slot: 'upward'
        },
        {
          prop: 'reg_name',
          label: '交货地',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
        },
        {
          prop: 'place_company',
          label: '报价企业',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100
        },
        {
          prop: 'ptime',
          label: '发布时间',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 100,
        }
      ],
      // 表格搜索条件
      where: {
        type: 'pricing_tools',
        product_id: this.productId
      },
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload();
    },

    /* 修改表头 */
    getHeaderCellStyle() {
      return <span>升贴水
        <el-tooltip placement="top-start"><div slot="content">升贴水 = 商品报价 - 生意社价格</div><i class="el-icon-info"></i></el-tooltip>
      </span>
    }
  }
}
</script>

<style scoped>
</style>
