<!-- 通知内容弹窗 -->
<template>
  <el-dialog
    v-if="visible===true"
    :destroy-on-close="false"
    :lock-scroll="false"
    :title="data.title"
    :visible="visible"
    :append-to-body="true"
    custom-class="ele-dialog-form"
    width="750px"
    @update:visible="updateVisible">
    <div v-html="data.content" />
    <div slot="footer">
      <el-button
        @click="updateVisible(false)">关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'NoticeShow',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {}
  },
  methods: {
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
