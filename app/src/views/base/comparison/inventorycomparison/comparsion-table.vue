<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card
          body-style="padding: 0;"
          :header="titleList[0]"
          shadow="never">
          <slot name="first"></slot>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card
          body-style="padding: 0;"
          :header="titleList[1]"
          shadow="never">
          <slot name="second"></slot>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card
          body-style="padding: 0;"
          :header="titleList[2]"
          shadow="never">
          <slot name="third"></slot>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'ComparisonTable',
  props: {
    titleList: Array
  },
  data() {
    return {};
  },
}
</script>

<style scoped>
</style>
