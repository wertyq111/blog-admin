<template>
  <el-card>
    <el-cascader-panel
      :options="options"
    ></el-cascader-panel>
  </el-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'InventoryComparison',
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      options: []
    };
  },
  mounted() {
    this.getComparison()
  },
  methods: {
    getComparison() {
      const loading = this.$loading({lock: true});
      let params = {target: 'inventory'}
      this.$http.get('/comparison/index', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.options = res.data.data;
          loading.close()
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  },
}
</script>

<style scoped>
/deep/.el-cascader-menu{
  height: calc(100vh - 215px);
}
/deep/.el-cascader-menu__wrap{
  height: calc(100vh - 215px);
  width: calc(100vh / 2)
}
</style>
