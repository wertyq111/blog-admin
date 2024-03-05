<template>
  <el-select
    v-model="searchValue"
    filterable
    remote
    reserve-keyword
    clearable
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>

export default {
  name: 'RemoteSelect',
  emits: ['change-user'],
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
    params: Object,
    //这个value值是可以获取到父组件的v-model值的，可以实现父子组件的双向绑定
    value: String
  },
  data() {
    return {
      options: [],
      list: [],
      searchValue: this.value,
      loading: false
    }
  },
  mounted() {
    if(this.states.length > 0) {
      this.list = this.states.map(item => {
        return { value: item.id, label: item.name };
      });
    } else if(this.url !== "") {
      this.getUserList();
    }
  },
  watch: {
    searchValue() {
      if(typeof this.searchValue === 'number') {
        this.$emit('change-user', this.searchValue); // 传值给父组件方法
      }
    },
    // 通过这个来实现父组件与子组件的值绑定
    value(val) {
      this.searchValue = val;
    },
    params() {
      this.getUserList();
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    getUserList() {
      this.$http.get(this.url, {params: this.params}).then(res => {
        if(res.data.code === 0) {
          this.list = res.data.data.map(u => {
            return { value: u.id, label: u.realname }
          })
        }
      })
    }
  }
}
</script>
