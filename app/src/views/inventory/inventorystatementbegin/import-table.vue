<template>
  <el-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :visible="visible"
    :title="title"
    width="80%"
    top="8vh"
    @update:visible="updateVisible">
    <el-form
      :model="form"
      ref="form"
      :rules="rules">
      <div class="text">
        <span>结算月份: <el-tag size="small">{{ data_month.settle_month }}</el-tag></span>&nbsp;&nbsp;
        <el-divider direction="vertical"></el-divider>
        &nbsp;&nbsp;<span>
        备注: 结算月份默认为上个月,
        结算月份为 <el-tag size="small">{{ data_month.settle_month }}</el-tag>
        的数据只在 <el-tag size="small" type="danger">{{ data_month.current_settle }}</el-tag> 月份结算时有效,以此类推
      </span><br/><br/>
        <el-divider content-position="left">说明</el-divider>
        <br/><span>
         <i class="el-icon-warning-outline" style="color:red" />&nbsp;期初导入数据只在<el-link type="primary" :underline="false">出入库流水</el-link>首次结算之前可进行操作
        </span>
      </div>
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :datasource="form.list"
        :need-page="false"
        :columns="columns"
        id="form_table"
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:inventorystatementbegin:import')"
            class="ele-btn-icon"
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="add()">添加
          </el-button>
        </template>
        <template slot="toolbar">
          <el-button
            v-if="permission.includes('sys:inventorystatementbegin:import')"
            class="ele-btn-icon"
            icon="el-icon-upload2"
            size="small"
            type="success"
            @click="save()">保存
          </el-button>
        </template>
        <!-- 存货列 -->
        <template slot="inventory" slot-scope="{row, $index}">
          <el-form-item label="" :prop="'list.' + $index + '.inventory_id'" :rules="rules.inventory_id">
            <el-cascader
              v-model="row.inventory_id"
              clearable
              filterable
              size="small"
              placeholder="-请选择存货-"
              :options="inventoryList"
              :props="{emitPath: false}"
              @change="changeInventory(row)"
            />
          </el-form-item>
        </template>
        <!-- 存货列 -->
        <template slot="warehouse" slot-scope="{row, $index}">
          <el-form-item label="" :prop="'list.' + $index + '.warehouse_id'" :rules="rules.warehouse_id">
            <el-select
              v-model="row.warehouse_id"
              class="ele-block"
              filterable
              clearable
              placeholder="-请选择仓库-"
              size="small">
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
        <!-- 订单日期列 -->
        <template slot="order_date" slot-scope="{row, $index}">
          <el-form-item label="" :prop="'list.' + $index + '.order_date'" :rules="rules.order_date">
            <el-date-picker
              v-model="row.order_date"
              class="ele-fluid"
              format="yyyy-MM-dd"
              placeholder="请选择订单日期"
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
            />
          </el-form-item>
        </template>
        <!-- 期初数量列 -->
        <template slot="settle_number" slot-scope="{row, $index}">
          <el-form-item label="" :prop="'list.' + $index + '.settle_number'" :rules="rules.settle_number">
            <el-input
              :maxlength="255"
              clearable
              oninput="value=value.replace(/\D/g,'')"
              v-model="row.settle_number"
              size="small"
            />
          </el-form-item>
        </template>
        <!-- 单价列 -->
        <template slot="settle_price" slot-scope="{row, $index}">
          <el-form-item label="" :prop="'list.' + $index + '.settle_price'" :rules="rules.settle_price">
            <el-input
              :maxlength="25"
              clearable
              oninput="value=value.replace(/[^\d|.]/g,'')"
              v-model="row.settle_price"
              size="small"
            />
          </el-form-item>
        </template>
        <!-- 存货自定义列 -->
        <template
          v-for="customItem in inventoryCustomList"
          :slot="customItem.code"
          slot-scope="{row, $index}">
          <el-form-item :prop="'list.' + $index + '.' + customItem.code" :key="customItem.id">
            <el-select
              v-model="row[customItem.code + '_id']"
              class="ele-block"
              clearable
              filterable
              :placeholder="'-请选择' + customItem.name"
              size="small">
              <el-option
                v-for="item in (row[customItem.code] ?  row[customItem.code] : [])"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{$index,row}">
          <el-popconfirm
            class="ele-action"
            title="确定要删除此条数据吗？"
            @confirm="cancel($index, row)">
            <el-link
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              type="danger">删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </el-form>

  </el-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'ImportTable',
  computed: {
    ...mapGetters(["permission"]),
    // 结算月份
    data_month() {
      let nowDate = new Date();
      return {
        settle_month: nowDate.getFullYear() + "-" + (nowDate.getMonth() < 10 ? "0" + nowDate.getMonth() : nowDate.getMonth()),
        current_settle: nowDate.getFullYear() + "-" +
          (nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1),
      }
    }
  },
  props: {
    // 是否打开弹窗
    visible: Boolean,
    // 导入标题
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      form: this.initFormData(),
      // 表格列配置
      columns: [],
      // 存货列表
      inventoryList: [],
      // 仓库列表
      warehouseList: [],
      // 存货自定义列表
      inventoryCustomList: [],
      // 表单验证规则
      rules: {
        inventory_id: [
          {required: true, message: '请选择存货', trigger: ['change', 'blur']}
        ],
        warehouse_id: [
          {required: true, message: '请选择仓库', trigger: ['change', 'blur']}
        ],
        order_date: [
          {required: true, message: '请选择结算日期', trigger: 'blur'}
        ],
        settle_number: [
          {required: true, message: '请输入期初数量', trigger: 'blur'}
        ],
        settle_price: [
          {required: true, message: '请输入单价', trigger: 'blur'}
        ],
      },
    };
  },
  watch: {
    inventoryCustomList() {
      this.completeColumns()
    }
  },
  mounted() {
    this.getInventoryList(); // 查询存货列表
    this.getWarehouseList(); // 查询仓库列表
    this.getInventoryCustomList(); // 查询存货列表
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 添加 */
    add() {
      this.form.list.push({inventory_id: null})
    },
    /* 保存 */
    save() {
      const loading = this.$loading({target: '#form_table', lock: true});
      let data = Object.assign({}, this.form);
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post('/inventorystatementbegin/importTable', data).then(res => {
            loading.close();
            if (res.data.code === 0) {
              this.$message({
                dangerouslyUseHTMLString: true,
                message: res.data.msg,
                type: "success"
              });
              this.$refs.table.reload()
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            loading.close();
            this.$message.error(e.message);
          });
        } else {
          loading.close();
          return false;
        }
      });
    },
    /* 取消 */
    cancel(index) {
      this.$refs.table.data.splice(index, 1)
    },
    /* 获取存货列表 */
    getInventoryList() {
      this.$http.get('/inventoryarchive/getCascadeList').then(res => {
        if (res.data.code === 0) {
          this.inventoryList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 查询仓库列表 */
    getWarehouseList() {
      let params = {status: 1};
      this.$http.get('/warehouse/getList', {params: params}).then(res => {
        if (res.data.code === 0) {
          this.warehouseList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 获取自定义信息列表 */
    getInventoryCustomList() {
      this.$http.get('/inventorycustom/getList').then(res => {
        if (res.data.code === 0) {
          this.inventoryCustomList = res.data.data;
          // 合并到 table 列中
          for (let idx in this.inventoryCustomList) {
            this.columns.push({
              prop: this.inventoryCustomList[idx].code,
              label: this.inventoryCustomList[idx].name,
              align: 'center',
              showOverflowTooltip: true,
              minWidth: 100,
              slot: this.inventoryCustomList[idx].code,
            })
          }
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 重新选择存货后 */
    changeInventory(row) {
      // 清空存货自定义值
      for (let idx in this.inventoryCustomList) {
        this.$set(row, this.inventoryCustomList[idx].code, []);
        this.$set(row, this.inventoryCustomList[idx].code + "_id", null);
      }
      this.fillInventory(row);
    },
    /* 根据存货编号填充存货自定义项列表 */
    fillInventory(row) {
      if (row.inventory_id) {
        let params = {id: row.inventory_id};
        this.$http.get('/inventoryarchive/info', {params: params}).then(res => {
          if (res.data.code === 0) {
            let customDataDetail = res.data.data.custom_data_detail;
            // 填入存货自定义值
            for (let idx in this.inventoryCustomList) {
              this.$set(row, this.inventoryCustomList[idx].code, customDataDetail[this.inventoryCustomList[idx].name])
            }
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      }
    },
    /* 完成记录列,防止错位 */
    completeColumns() {
      if(this.inventoryCustomList.length > 0) {
        this.columns = this.columns.concat([
          {
            prop: 'inventory_name',
            label: '存货',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150,
            slot: 'inventory',
            fixed: "left"
          },
          {
            prop: 'warehouse_name',
            label: '仓库',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            slot: 'warehouse',
            fixed: "left"
          },
          {
            prop: 'order_date',
            label: '订单日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            slot: 'order_date',
          },
          {
            prop: 'settle_number',
            label: '期初数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            slot: 'settle_number',
          },
          {
            prop: 'settle_price',
            label: '单价',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            slot: 'settle_price',
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 80,
            align: 'center',
            resizable: false,
            slot: 'action',
            fixed: "right"
          }
        ])
      }
    },
    /* 初始化期初导入数据 */
    initFormData() {
      let form = {
        list: []
      }

      // 通过接口查询期初导入数据列表
      this.$http.get('/inventorystatementbegin/getBeginList').then(res => {
        if (res.data.code === 0) {
          form.list = form.list.concat(res.data.data);
          // 获取存货对应的自定义列
          if(form.list.length > 0) {
            for(let idx in form.list) {
              this.fillInventory(form.list[idx]);
            }
          }
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });

      return form;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
/deep/ .el-table--border th.gutter:last-of-type {
  display: table-cell !important;
}

/deep/ .el-dialog:not(.ele-dialog-form) .el-dialog__body .el-form .el-form-item:last-child {
  margin-bottom: 11px;
}

/deep/ .el-form-item__error {
  line-height: 1px
}

/deep/ .el-cascader {
  width: 100%;
}
</style>
