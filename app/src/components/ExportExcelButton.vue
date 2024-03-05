<!-- 用户导入弹窗 -->
<template>
  <el-button
    class="ele-btn-icon"
    icon="el-icon-download"
    size="small"
    type="success"
    :disabled="buttonDisable"
    @click="exportExcel">导出 <i :class="downLoading"/>
  </el-button>
</template>

<script>
export default {
  name: 'ExportExcel',
  props: {
    // 导出路径前缀
    target: {
      type:String,
      default: ""
    },
    // 查询条件
    where: Object
  },
  data() {
    return {
      // 导出请求 url
      targetUrl: '/' + this.target + '/export',
      // 加载图标
      downLoading: null,
      // 按钮禁用
      buttonDisable: false
    };
  },
  methods: {
    /* 导出数据Excel */
    exportExcel() {
      this.downLoading = 'el-icon-loading'
      this.buttonDisable = true;
      let params = JSON.parse(JSON.stringify(this.where));
      this.$http
        .get(this.targetUrl, {params: params})
        .then((res) => {
          let data = res.data;
          if (data.code === 0) {
            // 下载文件
            if(data.data.startsWith('http')) {
              window.location.href = data.data;
            } else {
              window.location.href = process.env.VUE_APP_API_DOWNLOAD_URL + data.data;
            }

            this.$message({
              type: "success",
              message: "导出成功",
            });
            this.downLoading = null;
            this.buttonDisable = false;
          } else {
            this.downLoading = null;
            this.buttonDisable = false;
            this.$message.error("导出失败");
          }
        })
    }
  }
}
</script>

<style scoped>
</style>
