<!-- 编辑弹窗 -->
<template>
  <el-dialog
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="'行情分析 - ' + (data ? data.product_name : '')"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="100%"
    height="calc(100vh - 270px)"
    top="8vh"
    @update:visible="updateVisible">
    <el-container style="height: 503px">
      <el-aside v-if="active !== 'chain'" class="box1 box-bk box1-l">
        <el-card class="box-card" style="height: 100%">
          <template v-if="active === 'market_analyse'">
            <template v-if="category.market_analyse === 'line'">
              <!--生意社价格-->
              <p class="ele-text-primary">关于生意社价格</p><br>
              <p>1、应用</p>
              交易商可以根据约定升贴水及定价公式（交易价格=生意社价格+升贴水）的定价原理，实现现货交易和合约交易的定价。<br><br>
              <p>2、观察</p>
              生意社价格线向上穿越7日均线与30日均线，表明该商品价格进入上行通道；
              生意社价格线向下穿越7日均线与30日均线，表明该商品价格进入下行通道。<br><br>
              <div v-if="sectionData.market_analyse.pred">
                <span class="ele-text-primary">3、预测</span>
                <p>{{ sectionData.market_analyse.pred }}</p>
              </div>
              <div v-else-if="where.date && sectionData.market_analyse.ave">
                <span class="ele-text-primary">3、行情统计</span>
                <p>开始日：{{ sectionData.market_analyse.ave.btime }}</p>
                <p>结束日：{{ sectionData.market_analyse.ave.etime }}</p>
                <p>
                  涨跌幅：
                  <span :class="sectionData.market_analyse.ave.fd >0 ? 'ele-text-danger' : 'ele-text-success'">
                    {{ sectionData.market_analyse.ave.fd }} %
                  </span>
                </p>
                <p>均 价：{{ sectionData.market_analyse.ave.num }}（{{ sectionData.market_analyse.ave.unit }}）</p>
              </div>
            </template>
            <template v-else>
              <!--商品指数k线图-->
              <p class="name">关于商品指数k线图</p>
              <p>1、计算</p>
              <p class="img-item">
                <el-image src="https://www.100ppi.com/images/web/jsgs.png" class="dis-block mx-auto" alt=""/>
              </p>
              <p>2、应用</p>
              <p>7日均线上穿30日均线，则该指数进入上行通道；7日均线下穿30日均线，则该指数进入下行通道。</p>
            </template>
          </template>
          <template v-if="active === 'periodic_analyse'">
            <p class="ele-text-primary">关于商品价格K柱图</p>
            <p>形成原理：</p>
            <p>在一定周期内，比较商品价格的初始价与最终价，如果最终价较初始价上涨，即用
              <el-link type="danger" :underline="false">红柱</el-link>
              ；反之，即用
              <el-link type="success" :underline="false">绿柱</el-link>
              。
            </p>
            <br/>
            <p>按周期，K柱图可分为周K柱图、月K柱图、季K柱图等。</p>
            <br/>
            <p>K柱应用：</p>
            <p>用于帮助原材料相关企业寻找原材料淡旺季与价格涨跌规律。</p>
          </template>
          <template v-if="active === 'current_analyse'">
            <template v-if="category.current_analyse === 'current'">
              <!--生意社价格-->
              <p class="ele-text-primary">关于基差</p><br>
              <p>1、定义</p>
              <p>主力基差=现货价格-主力期货价格</p>
              <br/>
              <p>2、影响因素</p>
              <p>●&nbsp;时间差价，主要指持仓成本</p>
              <p>●&nbsp;品质差价，指因现货品质与合约品质不同，而存在的差价</p>
              <p>●&nbsp;地区差价，指因现货所在地与期货交割地不同，而存在的运费差价</p>
              <br>
              <p>3、基差变动</p>
              <p>基差变大，称为“走强”</p>
              <p>基差变小，称为“走弱”</p>
              <br>
              <p>4、套保效果</p>
              <p>卖出套保：基差走强则净盈利，走弱则净亏损</p>
              <p>买入套保：基差走弱则净盈利，走强则净亏损</p>
            </template>
            <template v-else-if="category.current_analyse === 'basis'">
              <!--关于基差-->
              <p class="name">关于基差</p>
              <template v-if="where.date  && sectionData.current_analyse.basis">
                <p>1、从{{ sectionData.current_analyse.basis.btime }}至{{ sectionData.current_analyse.basis.etime }}期间，
                  {{
                    sectionData.current_analyse.basis.pname
                  }}主力基差最大值为{{ sectionData.current_analyse.basis.max }}，
                  最小值为{{ sectionData.current_analyse.basis.min }}，平均值为{{
                    sectionData.current_analyse.basis.avg
                  }}。</p>
                <p>2、主力基差 = 现货价格 - 主力期货价格 = 主现期差。</p>
              </template>
              <template v-else>
                <p>主力基差 = 现货价格 - 主力期货价格 = 主现期差。</p>
              </template>
              <br/>
              <p>基差应用</p>
              <p>1、基差变化有一定的趋势</p>
              <p>2、基差放大到一定程度，必然回归</p>
              <p>3、基差越趋向于极值，概率越小，越趋向于均值，概率越大</p>
              <br/>
              <p>
                生意社基差法，即基于现货，掌握基差，以发现期货价格及其趋势。事实上，掌握基差的变化及趋势，不仅可用于炒期，也可让套保、基差定价和基差交易等更明朗</p>
            </template>
            <template v-else>
              <!--关于基差率/基差率年度对比图-->
              <p class="name">关于基差率</p>
              <template v-if="sectionData.current_analyse.basis_rate">
                <p>1、{{ sectionData.current_analyse.basis_rate.string1 }}。</p>
                <p>2、基差率 = 主力基差/现货价格 * 100%。</p>
              </template>
              <template v-else>
                <p>基差率 = 主力基差/现货价格 * 100%。</p>
              </template>
              <br/>
              <p>{{ sectionData.current_analyse.basis_rate.string2 }}</p>
              <p>
                <el-table
                  :data="sectionData.current_analyse.basis_rate.list_circle"
                  style="width: 100%">
                  <el-table-column
                    prop="circle_name"
                    label="日期"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="std1"
                    label="1σ外"
                    width="60">
                    <template slot-scope="scope">
                      <span class="ele-text-danger">{{ ['否', '是'][scope.row.std1] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="std2"
                    label="2σ外"
                    width="60">
                    <template slot-scope="scope">
                      <span class="ele-text-danger">{{ ['否', '是'][scope.row.std2] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </p>
              <p>注：1σ外，表示基差率分布在平均值±1个标准差之外；</p>
              <p>2σ外，表示基差率分布在平均值±2个标准差之外。</p>
            </template>
          </template>
          <template v-if="active === 'pricing_tools'">
            <!--商品指数k线图-->
            <p>生意社商品价格指数，不仅可用于反映商品价格变化，也可为更多的产业人士提供商品定价参考。其原理如下：</p><br/>
            <p class="img-item">
              <el-image src="https://www.100ppi.com/images/web/dingjia.png" class="dis-block mx-auto" alt=""/>
            </p><br/>
            <p><span class="ele-text-primary">P1</span> 为定价日的参考价</p>
            <p><span class="ele-text-primary">I1</span> 为定价日的指数</p>
            <p><span class="ele-text-primary">I0</span> 为上一次交易日的指数</p>
            <p><span class="ele-text-primary">P0</span> 为上一次交易日的交易价</p><br/>
            <p>
              由于上述公式中的商品指数，去除了该商品价格的地域、类型和报价单位等一切属性，因此该商品的生产商、经销商和下游企业等产业链人士，以此定价不仅可做到公平公正，而且方便快捷。</p>
          </template>
        </el-card>
      </el-aside>
      <el-main >
        <el-tabs type="border-card" v-model="active" style="height:99%">
          <el-tab-pane label="行情分析" name="market_analyse" :disabled="echartsLoading || sectionsLoading">
            <el-row :gutter="15">
              <!-- 搜索表单 -->
              <el-form
                :model="where"
                class="ele-form-search"
                label-width="77px"
                @keyup.enter.native="reload"
                @submit.native.prevent>
                <el-row :gutter="15">
                  <el-col :lg="5" :md="24">
                    <el-select
                      v-model="category.market_analyse"
                      class="ele-block"
                      placeholder="">
                      <el-option :value="'line'" label="生意社价格"/>
                      <el-option :value="'k_line'" label="商品指数K线图"/>
                    </el-select>
                  </el-col>
                  <el-col v-if="category.market_analyse === 'line'" :lg="8" :md="12">
                    <el-form-item label="统计日期:" prop="date">
                      <el-date-picker
                        v-model="where.date"
                        type="daterange"
                        class="ele-fluid"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"/>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="category.market_analyse === 'line'" :lg="6" :md="12">
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
            </el-row>
            <el-row>
              <common-echarts
                v-if="active === 'market_analyse'"
                ref="echarts"
                class="pane-echarts"
                key="market_analyse"
                :data="echartsData.market_analyse"
                :type="category.market_analyse"
                :title="{line: '生意社价格', k_line: '周K线图'}[category.market_analyse]"
                analyse-id="common_echarts"
                :height="547"/>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="周期分析" name="periodic_analyse" :disabled="echartsLoading || sectionsLoading">
            <el-row :gutter="15">
              <!-- 搜索表单 -->
              <el-form
                :model="where"
                class="ele-form-search"
                label-width="77px"
                @keyup.enter.native="reload"
                @submit.native.prevent>
                <el-row :gutter="15">
                  <el-col :lg="5" :md="24">
                    <el-select
                      v-model="periodic_range_changed"
                      class="ele-block"
                      placeholder="">
                      <el-option v-for="item in periodic_range" :key="item.key" :value="item.key" :label="item.value"/>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form>
            </el-row>
            <el-row>
              <common-echarts
                v-if="active === 'periodic_analyse'"
                ref="echarts"
                class="pane-echarts"
                key="periodic_analyse"
                :data="echartsData.periodic_analyse"
                :type="'bar'"
                :title.sync="periodic_echarts_title"
                analyse-id="common_echarts"
                :height="547"/>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="switch_qx !== 0" label="现期分析" name="current_analyse" :disabled="echartsLoading || sectionsLoading">
            <el-row :gutter="20">
              <!-- 搜索表单 -->
              <el-form
                :model="where"
                class="ele-form-search"
                label-width="77px"
                @keyup.enter.native="reload"
                @submit.native.prevent>
                <el-row :gutter="15">
                  <el-col :lg="5" :md="24">
                    <el-select
                      v-model="category.current_analyse"
                      @change="drawEcharts"
                      class="ele-block"
                      placeholder="">
                      <el-option :value="'current'" label="现期图"/>
                      <el-option :value="'basis'" label="基差图"/>
                      <el-option :value="'basis_rate'" label="基差率图"/>
                      <el-option :value="'basis_year'" label="基差率年度对比图"/>
                    </el-select>
                  </el-col>
                  <el-col v-if="category.current_analyse === 'basis'" :lg="8" :md="12">
                    <el-form-item label="查询日期:" prop="date">
                      <el-date-picker
                        v-model="where.date"
                        type="daterange"
                        class="ele-fluid"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"/>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="category.current_analyse === 'basis'" :lg="6" :md="12">
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
            </el-row>
            <el-row>
              <common-echarts
                v-if="active === 'current_analyse'"
                ref="echarts"
                class="pane-echarts"
                key="market_analyse"
                :data="echartsData.current_analyse"
                :type="'line'"
                :title="{current: '现期图', basis: '基差图', basis_rate: '基差率图', basis_year: '基差率年度对比图'}[category.current_analyse]"
                analyse-id="common_echarts"
                :height="547"/>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="产业链" name="chain" :disabled="echartsLoading || sectionsLoading">
            <el-row :gutter="15">
              <!-- 搜索表单 -->
              <el-form
                :model="where"
                class="ele-form-search"
                label-width="77px"
                @keyup.enter.native="reload"
                @submit.native.prevent>
                <el-row :gutter="15">
                  <el-col :lg="8" :md="12">
                    <el-form-item label="查询日期:" prop="date">
                      <el-date-picker
                        v-model="where.date"
                        type="daterange"
                        class="ele-fluid"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"/>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="6" :md="12">
                    <div class="ele-form-actions">
                      <el-button
                        class="ele-btn-icon"
                        icon="el-icon-search"
                        type="primary"
                        @click="fillChainSections">查询
                      </el-button>
                      <el-button @click="resetChain">重置</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </el-row>
            <el-row class="chain">
              <div v-if="active === 'chain'" ref="chain_img" style="overflow-x:hidden;overflow-y:auto; background-color: #1e1e1e; height: 300px">
                <el-image
                  :src="sectionData.chain.chain_img"
                  :preview-src-list="[sectionData.chain.chain_img]"
                  :fit="'cover'"/>
              </div>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="定价工具" name="pricing_tools" :disabled="echartsLoading || sectionsLoading">
            <el-row>
              <common-echarts
                v-if="active === 'pricing_tools'"
                ref="echarts"
                class="pane-echarts"
                key="pricing_tools"
                :data="echartsData.pricing_tools"
                :type="'line'"
                :title="echartsData.pricing_tools.line ? echartsData.pricing_tools.line.mode_data[0] : '生意社指数'"
                analyse-id="common_echarts"
                :height="547"/>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-aside class="box1 box-bk box1-l">
        <el-card class="box-card" style="height: 100%">
          <template v-if="active === 'market_analyse'">
            <!-- 一年内价格统计 -->
            <p class="l-h04 text-center f-w_b">一年内价格统计</p>
            <div class="justify-content-around text-center">
              <ul class="l-h04">
                <li>当日价格</li>
                <li>日涨跌幅</li>
                <li>一年位置</li>
                <li>最小值</li>
                <li>最大值</li>
                <li>中位值</li>
                <li>顶位差</li>
                <li>底位差</li>
                <li>平均值</li>
                <li>标准差</li>
              </ul>
              <ul v-if="right.market_analyse" class="l-h04 ele-text-warning">
                <li>{{ right.market_analyse.price }}</li>
                <li>{{ right.market_analyse.zdf }}</li>
                <li>{{ right.market_analyse.one_year_position }}</li>
                <li>{{ right.market_analyse.one_year_min }}</li>
                <li>{{ right.market_analyse.one_year_max }}</li>
                <li>{{ right.market_analyse.one_year_zw }}</li>
                <li>{{ right.market_analyse.one_year_dw }}</li>
                <li>{{ right.market_analyse.one_year_xw }}</li>
                <li>{{ right.market_analyse.one_year_avg }}</li>
                <li>{{ right.market_analyse.one_year_std }}</li>
              </ul>
              <ul v-else class="l-h04 ele-text-warning">
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
                <li>--</li>
              </ul>
            </div>
          </template>
          <template v-if="active === 'periodic_analyse'">
            <el-table
              :data="right.periodic_analyse"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="日期"
                width="150">
              </el-table-column>
              <el-table-column
                prop="zdf"
                label="涨跌"
                width="80">
              </el-table-column>
            </el-table>
          </template>
          <template v-if="active === 'current_analyse'">
            <el-table
              :data="sectionData.current_analyse.basis_main"
              style="width: 100%">
              <el-table-column
                prop="date"
                label="日期"
                width="140">
              </el-table-column>
              <el-table-column
                v-if="category.current_analyse === 'current' || category.current_analyse === 'basis'"
                prop="xqc"
                label="主力基差"
                width="90">
                <template slot-scope="scope">
                  <span class="ele-text-danger">{{ scope.row.xqc }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                prop="rate"
                label="主力基差率"
                width="90">
                <template slot-scope="scope">
                  <span class="ele-text-danger">{{ scope.row.rate }}%</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-if="active === 'chain'">
            <div v-if="sectionData.chain.industry_index" slot="header" class="clearfix">
              <span>{{ sectionData.chain.industry_index.name }} (基准日: 2011-12-01)</span>
            </div>
            <div ref="chain_right" style="height:400px; overflow-y: auto; overflow-x: hidden;" class="chain_right">
              <template v-if="sectionData.chain.industry_index">
                <p style="width: 100%;display: block;text-align: center;"><span class="ele-text-primary">{{ sectionData.chain.industry_index.title }}</span></p><br/>
                <p style="text-indent:2em;" v-html="sectionData.chain.industry_index.content"></p><br/>
                <el-image :src="sectionData.chain.industry_index.img" :preview-src-list="[sectionData.chain.industry_index.max_img]" alt=""/>
                <p class="ele-text-info">发布时间: {{ sectionData.chain.industry_index.pubDate }}</p>
                <p class="ele-text-info">发布者: 生意社</p>
                <br/>
                <el-divider/>
                <br/>
                <ul>
                <li class="ele-text-info" v-for="(item, index) in sectionData.chain.industry_index.his_bpi" :key="index">{{ item }}</li>
                </ul>
                <el-table
                  :data="sectionData.chain.industry_index.table"
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
          <template v-if="active === 'pricing_tools'">
            <p>拟定价商品：<span class="ele-text-primary">{{ data ? data.product_name : '' }}</span></p><br/>
            <p>您的上一次交易日和交易价</p>
            <!-- 搜索表单 -->
            <el-form
              :model="where"
              :rules="priceRules"
              ref="price_form"
              class="ele-form-search"
              @keyup.enter.native="reload"
              @submit.native.prevent>
              <el-row :gutter="15">
                <el-col :lg="20" :md="24">
                  <el-form-item label="" prop="last_date">
                    <el-date-picker
                      v-model="where.last_date"
                      type="date"
                      class="ele-fluid"
                      align="right"
                      unlink-panels
                      :picker-options="pickerOptions1"
                      placeholder="请选择交易日"
                      value-format="yyyy-MM-dd"/>
                  </el-form-item>
                </el-col>
                <el-col :lg="20" :md="24">
                  <el-form-item label="" prop="price">
                    <el-input v-model="where.price" placeholder="请输入交易价格"/>
                  </el-form-item>
                </el-col>
                <el-col :lg="20" :md="24">
                  请选择要定价的日期
                </el-col>
                <br/>
                <p></p>
                <el-col :lg="20" :md="24">
                  <el-form-item label="" prop="price_date">
                    <el-date-picker
                      v-model="where.price_date"
                      type="date"
                      class="ele-fluid"
                      align="right"
                      unlink-panels
                      :picker-options="pickerOptions1"
                      placeholder="请选择定价日"
                      value-format="yyyy-MM-dd"/>
                  </el-form-item>
                </el-col>
                <el-col :lg="24" :md="12">
                  <div class="ele-form-actions">
                    <el-button
                      class="ele-btn-icon"
                      icon="el-icon-search"
                      type="primary"
                      @click="fillPricingToolsSections">计算参考定价
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
            <template v-if="sectionData.pricing_tools.price_data">
              <br/>
              <el-divider/>
              <br/>
              <p>参考定价：<span class="ele-text-primary">{{ sectionData.pricing_tools.price_data.ck_price }}</span></p>
              <br/>
              <p>变化幅度：<span class="ele-text-primary">{{ sectionData.pricing_tools.price_data.ck_amp }}</span></p>
            </template>
          </template>
        </el-card>
      </el-aside>
    </el-container>
    <market-analyse-main
      v-if="active === 'market_analyse' && data"
      :product-id="data.product_id"
      @update-right="updateRight"/>
    <periodic-analyse-main
      v-if="active === 'periodic_analyse' && data"
      :product-id="data.product_id"
      :type="periodic_range_changed"
      @update-right="updateRight"/>
    <current-analyse-main
      v-if="active === 'current_analyse' && data"
      :product-id="data.product_id"/>
    <chain-main
      v-if="active === 'chain' && data"
      :product-id="data.product_id"/>
    <pricing-tools-main
      v-if="active === 'pricing_tools' && data"
      :product-id="data.product_id"/>
    <div slot="footer">
      <el-button @click="updateVisible(false)">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CommonEcharts from "@/components/CommonEcharts.vue";
import MarketAnalyseMain from "./marketanalyse-main.vue";
import PeriodicAnalyseMain from "./periodicanalyse-main.vue";
import CurrentAnalyseMain from "./currentanalyse-main.vue";
import ChainMain from "./chain-main.vue";
import PricingToolsMain from "./pricingtools-main.vue";

export default {
  name: 'MarketAnalyseView',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
  },
  components: {
    CommonEcharts,
    MarketAnalyseMain,
    PeriodicAnalyseMain,
    CurrentAnalyseMain,
    ChainMain,
    PricingToolsMain,
  },
  data() {
    return {
      // 提交状态
      loading: false,
      // 图表类型
      category: {
        market_analyse: 'line',
        periodic_analyse: 'bar',
        current_analyse: 'current'
      },
      // 周期分析范围 2 月 K 柱图, 3 季 K 柱图
      periodic_range: [{key: 2, value: '月K柱图'}, {key: 3, value: '季K柱图'}],
      // 选中的周期分析范围 默认 2
      periodic_range_changed: 2,
      // 表格搜索条件
      where: {},
      // 快捷日期范围选择
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            let end = new Date();
            end = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            let start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            let end = new Date();
            end = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            let start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            let end = new Date();
            end = new Date(end.getTime() - 24 * 60 * 60 * 1000);
            let start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate: (time) => {
          return time.getTime() > new Date(new Date() - 24 * 60 * 60 * 1000);
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() > new Date(new Date() - 24 * 60 * 60 * 1000);
        }
      },
      // 图表数据
      echartsData: {},
      // 版块数据
      sectionData: {},
      // 默认标签页
      active: '',  // tab页选中
      // 右侧版块内容
      right: {
        market_analyse: null,
        periodic_analyse: null
      },
      // 图标数据是否加载完毕
      echartsLoading: true,
      // 版块数据是否加载完毕
      sectionsLoading: true,
      // 定价工具表单验证规则
      // 表单验证规则
      priceRules: {
        last_date: [
          {required: true, message: '请输入交易日', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入交易价', trigger: 'blur'}
        ],
        price_date: [
          {required: true, message: '请输入定价日期', trigger: 'blur'}
        ]
      },
    };
  },
  computed: {
    // 现期分析开关
    switch_qx() {
      return this.data ? this.data.product_qx : 0
    },
    periodic_echarts_title() {
      return {2: '月K柱图', 3: '季K柱图'}[this.periodic_range_changed]
    },
    // 默认时间
    timeDefault() {
      return this.getTargetTime(0, 0, 1)
    }
  },
  watch: {
    data() {
      // 标签页打开状态下初始化
      if (this.visible === true) {
        this.where = {} // 清除查询查询
        this.active = 'market_analyse'
        this.initAllData() // 初始化数据
      }
    },
    active(newValue, oldValue) {
      if (newValue !== '' && newValue !== oldValue) {
        if (newValue === 'chain') {
          this.sectionsLoading = true
          this.resetChain()
        } else {
          this.echartsLoading = true
          this.initAllData()
        }
        this.$nextTick(() => {
          this.drawEcharts() // 绘制图表
          this.fillSectionsData() // 填充版块数据
        })
      }
    },
    periodic_range_changed(newValue, oldValue) {
      if (newValue !== '' && newValue !== oldValue) {
        this.echartsData.periodic_analyse.bar = this.echartsData.periodic_analyse[newValue]
        this.$nextTick(() => {
          this.$refs.echarts.reload()
        })
      }
    }
  },
  methods: {
    /* 刷新表格 */
    reload() {
      if (this.visible === true) {
        this.drawEcharts(true)
        if (this.where) {
          this.fillSectionsData()
        }
      }
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 重置产业链搜索 */
    resetChain() {
      this.$set(this.where, 'date', [this.getTargetTime(0, 3, 0), this.getTargetTime()])
    },
    /* 更新visible */
    updateVisible(value) {
      if (value === false) {
        this.resetDialog()
      }
      this.$emit('update:visible', value);
    },
    /* 绘制图表 */
    drawEcharts() {
      if (this.data && this.active !== 'chain') {
        let params = {
          product_id: this.data.product_id,
          date: this.where.date ? this.where.date : null,
          type: this.active,
          target: this.category[this.active]
        }

        if (this.active === 'periodic_analyse') {
          params.periodic_range = this.periodic_range.map(p => p.key)
        }
        // 获取数据的时候进行加载
        const loading = this.$loading({target: '#common_echarts', lock: true});

        this.$http.get('/marketanalyse/getEchartsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            for (let key in res.data.data) {
              this.$set(this.echartsData[this.active], key, res.data.data[key])
            }
            this.$refs.echarts.reload()
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close()
          this.echartsLoading = false
        }).catch(e => {
          this.$message.error(e.message);
          loading.close()
          this.echartsLoading = false
        });
      }
    },
    /* 根据标签类型填充版块数据 */
    fillSectionsData() {
      switch (this.active) {
        case 'market_analyse':
          this.fillMarketAnalyseSections()
          break;
        case 'current_analyse':
          this.fillCurrentAnalyseSections()
          break;
        case 'chain':
          this.fillChainSections()
          break;
      }
    },
    /* 填充行情分析板块 */
    fillMarketAnalyseSections() {
      if (this.data && (!this.sectionData.market_analyse.pred || this.where.date)) {
        let params = {
          product_id: this.data.product_id,
          date: this.where.date ? this.where.date : null,
          type: this.active
        }
        this.$http.get('/marketanalyse/getSectionsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.sectionData.market_analyse = res.data.data
          } else {
            this.$message.error(res.data.msg);
          }
          this.sectionsLoading = false
        }).catch(e => {
          this.$message.error(e.message);
          this.sectionsLoading = false
        });
      }
    },
    /* 填充现期分析板块 */
    fillCurrentAnalyseSections() {
      if (this.data && (this.where.date || (!this.sectionData.basis_rate || !this.sectionData.basis_main))) {
        let params = {
          product_id: this.data.product_id,
          date: this.where.date ? this.where.date : null,
          type: this.active
        }
        this.$http.get('/marketanalyse/getSectionsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            for (let key in res.data.data) {
              this.$set(this.sectionData.current_analyse, key, res.data.data[key]);
            }
          } else {
            this.$message.error(res.data.msg);
          }
          this.sectionsLoading = false
        }).catch(e => {
          this.$message.error(e.message);
          this.sectionsLoading = false
        });
      }
    },
    /* 填充产业链板块 */
    fillChainSections() {
      if (this.data) {
        // 获取数据的时候进行加载
        let loading_right;
        const loading = this.$loading({target: '.chain', lock: true});
        if(!this.where.date) {
          loading_right = this.$loading({target: '.chain_right', lock: false});
        }

        let params = {
          product_id: this.data.product_id,
          width: this.$refs.chain_img.offsetWidth,
          right_width: this.$refs.chain_right.offsetWidth,
          date: this.where.date ? this.where.date : [this.getTargetTime(0, 3, 0), this.getTargetTime()],
          type: this.active
        }
        this.$http.get('/marketanalyse/getSectionsData', {params: params}).then(res => {
          if (res.data.code === 0) {
            this.sectionData.chain.chain_img = res.data.data.chain_img
            this.sectionData.chain.industry_index = res.data.data.industry_index
          } else {
            this.$message.error(res.data.msg);
          }
          loading.close()
          if(!this.where.date) {
            loading_right.close()
          }
          this.sectionsLoading = false
        }).catch(e => {
          this.$message.error(e.message);
          loading.close()
          if(!this.where.date && loading_right) {
            loading_right.close()
          }
          this.sectionsLoading = false
        });
      }
    },
    /* 填充定价工具板块 */
    fillPricingToolsSections() {
      this.$refs['price_form'].validate((valid) => {
        if (valid) {
          let params = {
            product_id: this.data.product_id,
            last_date: this.where.last_date,
            price: this.where.price,
            price_date: this.where.price_date,
            type: this.active
          }
          this.$http.get('/marketanalyse/getSectionsData', {params: params}).then(res => {
            if (res.data.code === 0) {
              this.sectionData.pricing_tools.price_data = res.data.data
            } else {
              this.$message.error(res.data.msg);
            }
            this.sectionsLoading = false
          }).catch(e => {
            this.$message.error(e.message);
            this.sectionsLoading = false
          });
        }
      })
    },
    /* 获取时间 */
    getTargetTime(year = 0, month = 0, day = 0) {
      let date = new Date()

      let targetDate = new Date(date.getFullYear() - year, date.getMonth() - month, date.getDate() - day);

      return targetDate.getFullYear() + '-' + ((targetDate.getMonth() + 1) >= 10 ? (targetDate.getMonth() + 1) : '0' + (targetDate.getMonth() + 1)) + '-' + (targetDate.getDate() >= 10 ? targetDate.getDate() : '0' + targetDate.getDate())
    },
    /* 更新右侧数据 */
    updateRight(type, data) {
      this.right[type] = data
    },
    /* 初始化所有数据 */
    initAllData() {
      // 图表数据
      this.echartsData = {
        market_analyse: {},
        periodic_analyse: {},
        current_analyse: {},
        pricing_tools: {}
      }
      /* 重置下拉 */
      this.category = {
        market_analyse: 'line',
        periodic_analyse: 'bar',
        current_analyse: 'current'
      }
      // 版块数据
      this.sectionData = {
        market_analyse: {pred: null, ave: null},
        current_analyse: {basis: null, basis_rate: null, basis_main: null},
        chain: {chain_img: null},
        pricing_tools: {price_data: null}
      }
      // 周期分析默认选中
      this.periodic_range_changed = 2
      // 清除查询条件
      this.where = {}
      // 初始化条件参数
      this.$set(this.where, 'price_date', this.timeDefault)
    },
    /* 重置弹出框 */
    resetDialog() {
      if (this.active && this.active !== 'chain') {
        this.$refs.echarts.dispose() // 销毁图表
      }
      this.where = {} // 清除查询查询
      this.active = '' // 清除标签选中
      this.initAllData() // 初始化数据
    },
    /* 打开弹出框 */
    openDialog() {
      if(this.active === '') {
        this.active = 'market_analyse'
      }
    }
  }
}
</script>

<style scoped>
.box {
  height: 100%;
  overflow: auto;
}

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

.img-item {
  background-color: #0a0c0d;
}

.l-h04 {
  line-height: 2rem;
  list-style: none;
}

.f-w_b {
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.justify-content-around {
  display: flex;
  justify-content: space-around;
}

.el-tabs--card {
  height: calc(100vh - 110px);
  /* overflow-y: auto; */
}

/deep/ .el-tabs {
  overflow-y: auto;
}

</style>
