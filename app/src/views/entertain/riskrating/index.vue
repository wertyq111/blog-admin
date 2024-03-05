<template>
  <div class="ele-body" style="height:100%;">
    <el-card shadow="never" style="height:100%;" body-style="height:100%">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="公司名称:">
              <el-input
                v-model="where.company"
                clearable
                placeholder="请输入公司名称"/>
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
      <iframe
        ref="iframe"
        :src="src"
        width="100%"
        height="100%"
      >
      </iframe>
    </el-card>
  </div>

</template>
<script>
import {mapGetters} from "vuex";
export default {
  name: 'EntertainRaskRating',
  components: {},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格搜索条件
      where: {},
      src: 'https://www.sinoaaa.com/index.php?_a=iframe&f=list_index'
    };
  },
  methods: {
    /* 刷新详情页面 */
    reload() {
      if (!this.commonApi.isEmpty(this.where.company)) {
        this.src = 'https://www.sinoaaa.com/index.php?_a=iframe&noform=1&name=' + this.where.company;
      } else {
        this.src = 'https://www.sinoaaa.com/index.php?_a=iframe&f=list_index';
      }
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
    },
  }
}
</script>
<style scoped>
</style>
