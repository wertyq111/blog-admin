<!-- 图标组件 -->
<template>
  <div v-if="analyseId" ref="echarts" :id="analyseId" :style="{height: scrollerHeight}"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'CommonEcharts',
  props: {
    // 传入的数据
    data: Object,
    // 标题
    title: String,
    // analyseId
    analyseId: {
      type: String,
      default: 'analyse'
    },
    // 类型: line - 折线图, k_line - k线图, bar - 柱状图
    type: {
      type: String,
      default: 'line'
    },
    // 高度
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currEcharts: null,
      splitData: null,
    };
  },
  computed: {
    scrollerHeight() {
      let currentHeight = window.innerHeight - this.height

      return (currentHeight > 300 ? currentHeight : 300) + 'px'
    }
  },
  watch: {
    type() {
      this.reload()
    }
  },
  mounted() {
  },
  methods: {
    /* 重新加载 */
    reload() {
      const loading = this.$loading({target: '#' + this.analyseId, lock: true});
      if (this.currEcharts && this.currEcharts.id) {
        this.currEcharts.dispose()
      }
      this.currEcharts = echarts.init(document.getElementById(this.analyseId))
      this.drawLine()
      loading.close()
    },
    /* 销毁 */
    dispose() {
      if (this.currEcharts) {
        this.currEcharts.dispose()
      }
      this.currEcharts = null
      this.splitData = null
    },
    /* Echarts 绘图 */
    drawLine() {
      // 只有容器存在 ID 的情况下才进行绘图
      if (this.analyseId) {
        // 基于准备好的dom，初始化echarts实例, 如果已实例化过就不进行实例化
        let options = {};
        let typeData = this.data[this.type] ? this.data[this.type] : [];
        switch (this.type) {
          case 'line':
            options = this.getLineOptions(typeData)
            break
          case 'k_line':
            options = this.getKLineOptions(typeData)
            break
          case 'bar':
            options = this.getBarOptions(typeData)
            break
        }
        // 绘制图表
        this.currEcharts.setOption(options);
      }
    },
    /* 获取折线图配置 */
    getLineOptions(data) {
      let source = data.source ? parseInt(data.source) : 0;
      let options = {
        title: {
          x: 'center',
          text: data.title ? data.title : data.name + this.title + (data.unit ? '(' + data.unit + ')' : '')
        },
        tooltip: {
          trigger: 'axis',
        },
        color: ['#5470c6', '#FF0000', '#91cc75'],
        legend: {
          type: 'scroll',
          top: "10%",
          data: data.mode_data
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            borderColor: '#575757',
            start: 100,
            end: 86
          },
          {
            type: 'inside',
            xAxisIndex: 0,
          },
        ],
        grid: {
          y: '20%',
          left: '3%',
          right: '4%',
          bottom: '11%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#575757',//左边线的颜色
              width: '2'
            }
          },
          boundaryGap: false,
          data: data.date_data
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#575757',//左边线的颜色
              width: '2'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#575757'
            }
          },
          scale: true,  //自适应
        },
        series: []
      }

      if (source === 0 || source === 3) {
        options.tooltip.formatter = function (params) {
          let str = params[0].name + '<br>';
          for (let item of params) {
            str += item.seriesName + ' : ' + item.value + '%<br>';
          }
          return str;
        }

        options.yAxis.axisLabel = {
          show: true,
          interval: 'auto',
          formatter: '{value}%'
        }
      }

      if (source === 0 || source === 2) {
        options.legend.selected = data.sel_data
      }

      for (let key in data.data_data) {
        let record = {
          name: key,
          type: 'line',
        }
        let recordData = []
        for (let idx in data.data_data[key]) {
          recordData.push(data.data_data[key][idx])
        }
        if (key === data.prominent) {
          record.markPoint = {
            data: [
              {type: 'max', name: 'Max', itemStyle: {color: '#ffff00'}},
              {type: 'min', name: 'Min', itemStyle: {color: '#ffff00'}}
            ],
            label: {
              fontWeight: '1000',
              formatter: function (param) {
                return param != null ? Math.round(param.value) + '' : '';
              }
            },
            symbolSize: 55
          }
        }
        record.data = recordData

        options.series.push(record)
      }

      return options;
    },
    /* 获取K线图配置 */
    getKLineOptions(data) {
      if (this.splitData === null) {
        this.splitData = this.splitKLineData(data.splitdata)
      }
      return {
        title: {
          text: data.name + this.title + '(' + data.unit + ')',
          x: 'center',
          y: 'top',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function (params) {
            let str = params[0].name + '<br>';
            for (let item of params) {
              if (item.seriesName === "周K线") {
                str += item.seriesName + ' :<br>';
                str += '&nbsp开盘:' + item.value[1] + '<br>';
                str += '&nbsp收盘:' + item.value[2] + '<br>';
                str += '&nbsp最低:' + item.value[3] + '<br>';
                str += '&nbsp最高:' + item.value[4] + '<br>';
              } else
                str += item.seriesName + ' : ' + item.value + '<br>';
            }
            return str;
          }
        },
        color: ['#ff8a45', '#7cffb2'],
        legend: {
          top: "10%",
          data: data.legend_data
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '20%'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              width: '2'
            },
            onZero: false
          },
          data: this.splitData.categoryData,
          scale: true,
          boundaryGap: false,
          splitLine: {show: false},
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax'
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 97.8,
            end: 100
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            borderColor: '#575757',
          }
        ],
        series: [
          {
            name: '周K线',
            type: 'candlestick',
            data: this.splitData.values,
            markPoint: {
              label: {
                formatter: function (param) {
                  return param != null ? Math.round(param.value) + '' : '';
                }
              },
              data: [
                {
                  name: 'highest value',
                  type: 'max',
                  valueDim: 'highest',
                  itemStyle: {
                    color: '#ffff00'
                  }
                },
                {
                  name: 'lowest value',
                  type: 'min',
                  valueDim: 'lowest',
                  itemStyle: {
                    color: '#ffff00'
                  }
                }
              ],
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '');
                }
              }, symbol: "pin",
              symbolSize: 50,
            },
          },
          {
            name: '7日均线',
            type: 'line',
            data: data.day_7,
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          },
          {
            name: '30日均线',
            type: 'line',
            data: data.day_30,
            smooth: true,
            lineStyle: {
              opacity: 0.5
            }
          }
        ]
      };
    },
    /* 组装K线图数据 */
    splitKLineData(rawData) {
      let categoryData = [];
      let values = [];
      for (let i in rawData) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
      }
      return {
        categoryData: categoryData,
        values: values
      };
    },
    /* 获取柱状图配置 */
    getBarOptions(data) {
      return {
        title: {
          x: 'center',
          subtext: (data.sdate && data.edate) ? data.sdate + "至" + data.edate : data.spec,
          text: data.name + this.title + '（' + data.unit + '）'
        },
        color: ['#FF0000', '#00E700'],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let str = params[0].name + "：";
            if (params[0].data >= 0) str += params[0].data + "%";
            if (params[1].data < 0) str += params[1].data + "%";
            return str;
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            borderColor: '#575757',
            start: 100,
            end: data.sdate && data.edate ? 0 : 80
          },
          {
            type: 'inside',
            xAxisIndex: 0,
          },
        ],
        grid: {
          y: '20%',
          left: '5%',
          right: '5%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#575757',//左边线的颜色
              width: '2'
            }
          },
          data: data.date_data
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#575757',//左边线的颜色
              width: '2'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#575757'
            }
          },
          scale: true,  //自适应
          axisLabel: {formatter: "{value}%"}
        },
        series: [
          {
            data: data.data1,
            type: 'bar',
            stack: 'Total',
            label: {
              formatter: "{c}" + "%",
              show: true,
              position: "top",
            }
          },
          {
            data: data.data0,
            type: 'bar',
            stack: 'Total',
            label: {
              formatter: "{c}" + "%",
              show: true,
              position: "bottom",
            }
          },
        ]
      };
    },
    eventOpt() {
      // 注意二、事件名必须为update:属性名
      // 更改prop中的属性show的属性值，同时更新父组件中中valueChild的属性值
      this.$emit('update:title', false);
    }
  }
}
</script>

<style scoped>
</style>
