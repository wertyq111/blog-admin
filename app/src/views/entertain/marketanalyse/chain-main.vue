<template>
  <el-container>
    <el-main>
      <el-card style="height: 39%">
        <common-echarts
          v-if="echartsData.index"
          ref="echarts_index"
          key="chain_index_main"
          :data="echartsData.index"
          type="line"
          title="上下游商品指数对比表"
          analyse-id="chain_index_main"
          :height="400"/>
      </el-card>
      <el-card style="height: 59%" :style="{display: bottomDisplay ? 'block' : 'none'}">
        <el-row :gutter="15">
          <el-col :lg="5" :md="24">
            <el-select
              v-if="echartsData.price && echartsData.price.line && echartsData.price.line.data_data"
              v-model="category.price"
              @change="getEchartsData('price')"
              class="ele-block"
              placeholder="">
              <el-option v-for="item in echartsData.price.line.bijia" :key="item.bid" :value="item.bid" :label="item.name" />
            </el-select>
          </el-col>
        </el-row>
        <common-echarts
          v-if="echartsData.price"
          ref="echarts_price"
          key="chain_price_main"
          :data="echartsData.price"
          type="line"
          analyse-id="chain_price_main"
          :height="400"/><br/>
        <div v-if="echartsData.price && echartsData.price.line && echartsData.price.line.data_data">
          <p class="ele-text-primary">上下游商品比价指数</p>
          <p class="ele-text-info">生意社定义，比价指数为周期内上下游商品每日价格之比的定基指数化结果。</p>
          <p class="ele-text-info">一、算法</p>
          <p class="ele-text-info">1、比价率R＝上游商品价格/下游商品价格</p>
          <p class="ele-text-info">2、比价指数IR＝当日比价率R/基准日比价率R0*100</p>
          <p class="ele-text-info">二、比价指数应用</p>
          <p class="ele-text-info">1、反映上下游商品的价格比及其趋势</p>
          <p class="ele-text-info">2、某组上下游商品的比价指数应在一定的范围内波动</p>
          <p class="ele-text-info">3、比价指数的变化，可助于分析下游商品的某一成本的相对压力和上游商品的某一需求的相对动力</p>
        </div>
      </el-card>
    </el-main>
    <el-aside class="box1 box-bk box1-l">
      <el-card class="box-card" style="height: 100%">
        <template>
          <div v-if="sectionData.section_index" slot="header" class="clearfix">
            <span>{{ sectionData.section_index.name }} (基准日: 2013-06-01)</span>
          </div>
          <div ref="right" style="overflow-y: auto; overflow-x: hidden;" class="bottom_right">
            <template v-if="sectionData.section_index">
                <el-row :gutter="15">
                  <el-col :lg="5" :md="24">
                    <el-link style="padding-top:7px" :underline="false">板块:</el-link>
                  </el-col>
                  <el-col :lg="19" :md="24">
                    <el-select
                      v-model="category.section"
                      @change="getSectionsData"
                      class="ele-block"
                      placeholder="请选择版块">
                      <el-option
                        v-for="item in sectionData.section_index.bk_list"
                        :key="item.id"
                        :value="item.func"
                        :label="item.indexname"/>
                    </el-select>
                  </el-col>
                </el-row>
              <br/>
              <p style="width: 100%;display: block;text-align: center;"><span class="ele-text-primary">{{ sectionData.section_index.title }}</span></p><br/>
              <p style="text-indent:2em;" v-html="sectionData.section_index.content"></p><br/>
              <el-image :src="sectionData.section_index.img" :preview-src-list="[sectionData.section_index.max_img]" alt=""/>
              <p class="ele-text-info">发布时间: {{ sectionData.section_index.pubDate }}</p>
              <p class="ele-text-info">发布者: 生意社</p>
              <br/>
              <el-divider/>
              <br/>
              <ul>
                <li class="ele-text-info" v-for="(item, index) in sectionData.section_index.his_bpi" :key="index">{{ item }}</li>
              </ul>
              <el-table
                :data="sectionData.section_index.table"
                border
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="日期"
                  width="135">
                </el-table-column>
                <el-table-column
                  prop="data_c1"
                  label="BPI"
                  width="100">
                </el-table-column>
              </el-table>
            </template>
          </div>
        </template>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
import CommonEcharts from "@/components/CommonEcharts.vue";

export default {
  name: 'ChainMain',
  components: {CommonEcharts},
  props: {
    productId: Number,
  },
  data() {
    return {
      // 图表数据
      echartsData: {
        index: {},
        price: {},
      },
      // 类别
      category: {
        price: null,
        section: null
      },
      // 版块内容
      sectionData: { section_index: {}},
      // 底部卡片隐藏
      bottomDisplay: true
    };
  },
  watch: {
  },
  mounted() {
    this.getEchartsData('index')
    this.getEchartsData('price')
    this.getSectionsData()
  },
  methods: {
    getEchartsData(target) {
      if (this.productId) {
        let params = {
          product_id: this.productId,
          bid: this.category.price,
          type: 'chain',
          target: target
        }

        // 获取数据的时候进行加载
        const loading = this.$loading({target: '#chain_' + target + '_main', lock: true});

        this.$http.get('/marketanalyse/getEchartsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.$set(this.echartsData[target], 'line', res.data.data[target])
            if(target === 'price') {
              this.category.price = res.data.data[target].bid
            }
            switch(target) {
              case 'index':
                this.$refs.echarts_index.reload()
                break
              case 'price':
                if(res.data.data[target].data_data) {
                  this.$refs.echarts_price.reload()
                } else {
                  this.$refs.echarts_price.dispose()
                  this.bottomDisplay = false
                }
                break
            }
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
        // 获取数据的时候进行加载
        const loading = this.$loading({target: '.bottom_right', lock: true});
        let params = {
          product_id: this.productId,
          right_width: this.$refs.right.offsetWidth,
          func: this.category.section,
          target: 'section_index',
          type: 'chain'
        }
        this.$http.get('/marketanalyse/getSectionsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.sectionData.section_index = res.data.data.section_index
            this.category.section = res.data.data.section_index.func
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
