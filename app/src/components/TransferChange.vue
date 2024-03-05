<template>
  <el-transfer
    filterable
    :filter-method="filterMethod"
    filter-placeholder="请输入关键词"
    v-model="transferValue"
    :titles="[title + '列表', '已选中' + title]"
    @change="handleChange"
    :data="data">
  </el-transfer>
</template>

<script>
export default {
  name: 'TransferChange',
  emits: ['change-array'],
  props: {
    states: {
      type: Array,
      default() {
        return []
      }
    },
    url: {
      type: String,
      default: ""
    },
    title: String,
    params: Object,
    custom_disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    //这个value值是可以获取到父组件的v-model值的，可以实现父子组件的双向绑定
    value: Array
  },
  data() {
    return {
      data: [],
      transferValue: this.value
    };
  },
  mounted() {
    if(this.states.length > 0) {
      this.list = this.states.map(item => {
        return { key: item.id, label: item.name };
      });
    } else if(this.url !== "") {
      this.$http.get(this.url, {params: this.params}).then(res => {
        if(res.data.code === 0) {
          this.data = res.data.data.map(item => {
            return {
              key: item.id,
              label: item.name,
              disabled: this.custom_disabled ? this.custom_disabled : item.status !== 1
            }
          })
        }
      })
    }
  },
  watch: {
    transferValue() {
      if(this.transferValue instanceof Object) {
        this.$emit('change-array', this.transferValue, this.params); // 传值给父组件方法
      }
    },
    // 通过这个来实现父组件与子组件的值绑定
    value(val) {
      this.transferValue = val;
    },
  },
  methods: {
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
    },
    handleChange(value, direction, movedKeys) {
      if(direction === 'left') {
        this.$confirm('确定要删除选中值吗?', '提示', {
          type: 'warning'
        }).then(() => {
        }).catch(() => {
          // 撤回修改
          movedKeys.forEach(m => {
            value.push(m);
          })
        });
      }
    }
  }
};
</script>
