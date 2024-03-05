<template>
  <el-container>
    <el-aside class="box1 box-bk box1-l">
      <el-card class="box-card" style="height: 100%">
        <p class="ele-text-primary">关于商品价格年度对比图</p><br>
        <p>形成原理：</p>
        <p>按商品价格走势，形成年度曲线，一年一条。</p><br/>
        <p>对比图应用：</p>
        <p>1、用于不同年度之间的比较分析；</p>
        <p>2、用于发现季节性规律或涨跌机会。</p>
      </el-card>
    </el-aside>
    <el-main>
      <el-card style="height: 100%">
        <common-echarts
          ref="echarts"
          key="periodic_analyse_main"
          :data="echartsData"
          type="line"
          title="年度对比表"
          analyse-id="periodic_analyse_main"
          :height="547"/>
      </el-card>
    </el-main>
    <el-aside class="box1 box-bk box1-l">
      <el-card class="box-card" style="height: 100%">
        <template>
          <el-table
            :data="price_data"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格"
              width="80">
            </el-table-column>
          </el-table>
        </template>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
import CommonEcharts from "@/components/CommonEcharts.vue";

export default {
  name: 'PeriodicAnalyseMain',
  components: {CommonEcharts},
  emits: ['update-right'],
  props: {
    productId: Number,
    type: Number
  },
  data() {
    return {
      // 图表数据
      echartsData: {},
      // 金额数据
      price_data: []
    };
  },
  watch: {
    type() {
      this.getSectionsData()
    }
  },
  mounted() {
    this.getEchartsData()
    this.getSectionsData()
  },
  methods: {
    getEchartsData() {
      if (this.productId) {
        let params = {
          product_id: this.productId,
          type: 'periodic_analyse',
          target: 'line'
        }

        // 获取数据的时候进行加载
        const loading = this.$loading({target: '#periodic_analyse_main', lock: true});

        this.$http.get('/marketanalyse/getEchartsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            for (let key in res.data.data) {
              this.$set(this.echartsData, key, res.data.data[key])
            }
            this.$refs.echarts.reload()
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close()
        }).catch(e => {
          this.$message.error(e.message);
          loading.close()
        });
      }
    },
    getSectionsData() {
      if (this.productId) {
        let params = {
          product_id: this.productId,
          type: 'periodic_analyse',
          target: this.type
        }

        // 获取数据的时候进行加载
        const loading = this.$loading({target: '.el-table__body', lock: true});

        this.$http.get('/marketanalyse/getSectionsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.price_data = res.data.data.tinfo2
            this.$emit('update-right', 'periodic_analyse', res.data.data.tinfo)
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close()
        }).catch(e => {
          this.$message.error(e.message);
          loading.close()
        });
      }
    }
  }
}
</script>

<style scoped>
.box1-l {
  line-height: 1.2rem;
}

.box1 {
  width: 100%;
  height: 500px;
  line-height: 1.2rem;
  margin-right: 1rem;
}

.box-bk {
  height: auto;
  padding: 1rem;
  position: relative;
}
</style>
