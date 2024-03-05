<template>
  <div class="autocomplete">
    <el-autocomplete
      v-model="searchValue"
      :maxlength="maxlen"
      :fetch-suggestions="querySearchAsync"
      :placeholder="placeholder"
      @select="handleSelect"
      :show-word-limit="false"
      @focus="focusFn"
      @blur="blurFn"
      @change="changeFn"
      placement="top"
    >
      <div slot="suffix">
        <span v-if="ifshowWordLimit">{{ searchValue.length }}/{{ maxlen }}</span>
        <i class="el-icon-arrow-up" v-if="searchUp"> </i>
        <i class="el-icon-arrow-down" v-else> </i>
      </div>
    </el-autocomplete>
  </div>
</template>
<script>
export default {
  name: 'RemoteSearch',
  data() {
    return {
      timeout: null,
      searchValue: this.value,
      searchUp: false,
    };
  },
  props: {
    //这个value值是可以获取到父组件的v-model值的，可以实现父子组件的双向绑定
    value: {
      type: String,
      default: '',
    },
    /* 存放数据的数组，element-ui有个bug,
      就是这个数组必须是[{value:'www.baidu.com'}]的形式，
      所以在传数组的时候必须做处理 */
    options: {
      type: Array,
      default: () => {},
    },
    // 最大值
    maxlen: {
      type: Number,
      default: 1000,
    },
    // 默认文案
    placeholder: {
      type: String,
      default: '请输入链接',
    },
    /*开始是想在父组件来传这个值赋值给子组件来实现父子组件双向绑定，
     但是用value父组件就不需要传这个了*/
    defaultVal: {
      type: String,
      default: '',
    },
    // 是否显示字数限制
    ifshowWordLimit: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    // 必须用watch来监听一下这个值，因为要响应父组件的校验
    searchValue() {
      this.validateTextarea();
    },
    /*在watch中把value赋值给searchValue来实现父子组件双向绑定，
      如果用defaultValue直接赋值给data就行 */
    value(val) {
      this.searchValue = val;
    },
  },
  methods: {
    focusFn() {
      this.searchUp = true;
    },
    querySearchAsync(queryString, cb) {
      // 判断是否查询后台的条件
      // if (this.options.filter(this.createStateFilter(queryString)) && this.options.filter(this.createStateFilter(queryString)).length !== 0) {
      let options = this.options;
      let results = queryString ? options.filter(this.createStateFilter(queryString)) : options;
      if (results && results.length > 0) {
        this.searchUp = true;
      } else {
        this.searchUp = false;
      }
      cb(results);
    },
    // 查询输入字符是否存在
    createStateFilter(queryString) {
      return searchValue => {
        // 这里和elementui组件不一样
        // value可以换成从后端传回的data数组中的键，
        // queryString.toLowerCase()输入的字符在所有返回信息中存在，!==-1代表匹配到了搜索的字符，
        // 官方的==0是搜索的字符在第一个字才会匹配，！=-1指的是只要是内容中只要有搜索的字符就会返回匹配**
        return searchValue.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1;
      };
    },
    blurFn() {
      this.searchUp = false;
    },
    handleSelect(item) {
      // 返回的意见点击选择触发事件
      this.searchValue = item.value;
      this.$emit('change', this.searchValue);
    },
    // 传值给父组件，并响应父组件input事件
    validateTextarea() {
      try {
        this.$emit('input', this.searchValue);  // 传值给父组件并响应input事件
      } catch (e) {
        // this.$emit('error', true);
      }
    },
    changeFn(item) {
      // console.log('change', item);
      this.searchValue = item;
      this.$emit('change', this.searchValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.autocomplete {
  width: 100%;
  .el-autocomplete {
    width: 100%;
  }
}
</style>
