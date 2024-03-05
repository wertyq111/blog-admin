/**
 * 业务逻辑配置
 */
export default {
  // 采购订单状态
  purchaseOrderStatus: {
    wait: 1,
    open: 2,
    audited: 3,
    changing: 4,
    changed: 5
  },

  // 采购订单状态列表
  purchaseOrderStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }, {
    id: 4,
    name: "变更中"
  }, {
    id: 5,
    name: "已变更"
  }],

  // 到货订单状态
  arrivalOrderStatus: {
    wait: 1,
    open: 2,
    audited: 3,
    changing: 4,
  },

  // 到货订单状态列表
  arrivalOrderStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }, {
    id: 4,
    name: "变更中"
  }],

  // 入库订单状态
  warehouseEntryOrderStatus: {
    wait: 1,
    open: 2,
    audited: 3,
  },

  // 入库订单状态列表
  warehouseEntryOrderStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }],

  // 开票状态
  invoiceStatus: {
    wait: 1,
    open: 2,
    audited: 3,
  },

  // 开票状态列表
  invoiceStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }],

  // 销售订单状态
  saleOrderStatus: {
    wait: 1,
    open: 2,
    audited: 3,
    changing: 4,
    changed: 5
  },

  // 销售订单状态列表
  saleOrderStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }, {
    id: 4,
    name: "变更中"
  }, {
    id: 5,
    name: "已变更"
  }],


  // 发货订单状态
  shipmentOrderStatus: {
    wait: 1,
    open: 2,
    audited: 3,
    changing: 4,
  },

  // 发货订单状态列表
  shipmentOrderStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }, {
    id: 4,
    name: "变更中"
  }],

  // 出库订单状态
  warehouseOutOrderStatus: {
    wait: 1,
    open: 2,
    audited: 3,
  },

  // 出库订单状态列表
  warehouseOutOrderStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }],

  // 销售开票状态
  saleInvoiceStatus: {
    wait: 1,
    open: 2,
    audited: 3,
  },

  // 开票状态列表
  saleInvoiceStatusList: [{
    id: 1,
    name: '待开立',
  }, {
    id: 2,
    name: '已开立'
  }, {
    id: 3,
    name: '已审核'
  }],

  // 业务类型
  purchaseBusinessType: {
    generalPurchase: 1,
    fixedAssets: 2
  },

  saleBusinessType: {
    generalSale: 1,
    fixedAssets: 2
  },
  // 业务类型列表
  purchaseBusinessTypeList: [{
    id: 1,
    name: '普通采购',
  }, {
    id: 2,
    name: '固定资产'
  }],

  saleBusinessTypeList: [{
    id: 1,
    name: '普通销售',
  }, {
    id: 2,
    name: '固定资产'
  }],

  // 发票类型
  invoiceType: {
    regular: 1,
    special: 2
  },

  // 发票类型列表
  invoiceTypeList: [{
    id: 1,
    name: '普通发票'
  }, {
    id: 2,
    name: '专用发票'
  }],

  // 币种人民币值
  currency_rmb_id: 117
}
