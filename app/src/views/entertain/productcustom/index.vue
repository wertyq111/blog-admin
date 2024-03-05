<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        class="ele-form-search"
        label-width="77px"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="公司:">
              <el-select
                v-model="where.company_id"
                class="ele-block"
                filterable
                clearable
                placeholder="请选择公司">
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="商品ID:">
              <el-input
                v-model="where.product_id"
                clearable
                placeholder="请输入商品ID"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="商品名称:">
              <el-input
                v-model="where.product_name"
                clearable
                placeholder="请输入商品名称"/>
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
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :columns="columns"
        :datasource="url"
        :need-page="false"
        :parse-data="parseData"
        :where="where"
        default-expand-all
        @select-all="selectAll"
        @select="select"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 270px)"
        row-key="id">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:productcustom:add')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="openEdit(null)">添加
          </el-button>
          <el-button
            v-if="permission.includes('sys:productcustom:edit')"
            class="ele-btn-icon"
            icon="el-icon-finished"
            size="small"
            type="warning"
            @click="approvedBatch">激活
          </el-button>
          <el-button
            v-if="permission.includes('sys:productcustom:dall')"
            class="ele-btn-icon"
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="removeBatch">删除
          </el-button>
          <el-button
            class="ele-btn-icon"
            size="small"
            @click="expandAll">展开全部
          </el-button>
          <el-button
            class="ele-btn-icon"
            size="small"
            @click="foldAll">折叠全部
          </el-button>
        </template>
        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-switch
            v-if="row.status && isNaN(Number(row.status, 10)) === false"
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            @change="editStatus(row)"/>
          <ele-dot v-else-if="row.status" :ripple="true" :text="row.status" type="danger"/>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            v-if="row.pid === 0 && permission.includes('sys:productcustom:edit')"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            v-if="row.pid !== 0 && permission.includes('sys:productcustom:delete')"
            class="ele-action"
            title="确定要删除吗？"
            @confirm="remove(row)">
            <el-link
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              type="danger">删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <product-custom-edit
      :data="current"
      :company-list="companyAllList"
      :product-list="productList"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ProductCustomEdit from './productcustom-edit.vue';

export default {
  name: 'ProductCustom',
  components: {ProductCustomEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/productcustom/index',
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          selectable: this.checkSelectable,
          fixed: "left"
        },
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'company_name',
          label: '公司名称',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'product_id',
          label: '商品ID',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
        },
        {
          prop: 'product_name',
          label: '商品名称',
          showOverflowTooltip: true,
          align: 'center',
          minWidth: 200
        },
        {
          prop: 'status',
          label: '状态',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
          slot: 'status',
        },
        {
          prop: 'create_time',
          label: '创建时间',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 190,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 全部商品订阅列表
      productCustomList: [],
      // 公司列表
      companyList: [],
      // 所有公司列表
      companyAllList: [],
      // 商品列表
      productList: [],
    };
  },
  mounted() {
    this.getCompanyList(); // 获取公司列表
    this.getProductList(); // 获取商品列表
  },
  methods: {
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data, 'cid', 'pid');
      this.productCustomList = res.data;
      // 菜单数据处理完成后执行折叠方法
      this.$nextTick(() => {
        if(Object.keys(this.where).length > 0) {
          this.expandAll()
        } else {
          this.foldAll()
        }
      });
      return res;
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 显示编辑 */
    openEdit(row,) {
      if (!row) {
        // 添加
        this.current = {};
        this.showEdit = true;
      } else {
        // 编辑
        this.$http.get('/productcustom/info?company_id=' + row.cid).then(res => {
          if (res.data.code === 0) {
            this.current = res.data.data;
            this.showEdit = true;
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要删除选中的商品申请吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.post('/productcustom/delete', {id: this.selection.filter(d => d.status !== 1).map(d => d.id)}).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
    /* 删除 */
    remove(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error('请先删除商品记录');
        return;
      }
      const loading = this.$loading({lock: true});
      this.$http.post('/productcustom/delete', {id: row.id}).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 展开全部 */
    expandAll() {
      this.$refs.table.data.forEach(d => {
        this.$refs.table.toggleRowExpansion(d, true);
      });
    },
    /* 折叠全部 */
    foldAll() {
      this.$refs.table.data.forEach(d => {
        this.$refs.table.toggleRowExpansion(d, false);
      });
    },
    /* 获取公司列表 */
    getCompanyList() {
      this.$http.get('/productcustom/getCompanyList').then(res => {
        if (res.data.code === 0) {
          this.companyList = res.data.data.list;
          this.companyAllList = res.data.data.all;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取商品列表 */
    getProductList() {
      this.$http.get('/marketanalyse/getProductList').then(res => {
        if (res.data.code === 0) {
          this.productList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 批量审核(不支持灭活) */
    approvedBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据')
        return;
      }
      this.$confirm('确定要激活选中的商品申请吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        let params = {
          id: this.selection.filter(d => d.status !== 1).map(d => d.id),
          status: 1
        }
        this.$http.post('/productcustom/status', params).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({type: 'success', message: res.data.msg});
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": row.status
      })
      this.$http.post('/productcustom/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.status = row.status !== 1 ? 1 : 2;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 复选框禁用 */
    checkSelectable(row) {
      return row.status !== 1;
    },
    /* 复选框权限 */
    selectAll() {
      this.$refs.table.data.forEach(row => {
        if(row.children) {
          row.children.forEach(childRow => {
            if (childRow.status !== 1) {
              this.$refs.table.toggleRowSelection(childRow);
            }
          })
        }
      })
    },
    /* 复选框单选 */
    select(selection, row) {
      if(row.children) {
        let selected = true
        let result = selection.some(item => item.cid === row.cid)
        if(!result){
          selected = false
        }
        row.children.forEach(childRow => {
          if (childRow.status !== 1) {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(childRow, selected);
            })
          }
        })
      }
    },
    /* 处理选中行 */
    handleSelectionChange(selection) {
      // 将选中行写入 this.selection
      selection.forEach(selected => {
        if(!this.selection.some(item => item.cid === selected.cid) && !selected.children) {
          this.selection.push(selected)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
