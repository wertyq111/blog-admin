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
    width="550px"
    @update:visible="updateVisible">
    <div class="sketch_content" v-html="data.content"/>
    <div slot="footer">
      <el-button type="danger"
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
.sketch_content {
  overflow: auto;
  height: 434px;
  border-top: 1px solid #eff1f4;
  border-bottom: 1px solid #eff1f4;
  padding: 0 30px 11px 27px;

// 滚动条的样式,宽高分别对应横竖滚动条的尺寸

  &::-webkit-scrollbar {
    width: 3px;
  }

// 滚动条里面默认的小方块,自定义样式

  &::-webkit-scrollbar-thumb {
    background: #8798AF;
    border-radius: 2px;
  }

// 滚动条里面的轨道

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
