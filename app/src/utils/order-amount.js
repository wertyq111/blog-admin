import {create, all} from "mathjs";
const $math = create(all, {
  epsilon: 1e-12,
  matrix: 'Matrix',
  number: 'BigNumber', // 可选值：number BigNumber
  precision: 64,
  predictable: false,
  randomSeed: null
})

function mathComputed(evalstr, need2fixed = true, precision = 5) {
  const num = Number($math.format($math.evaluate(evalstr)));
  if (need2fixed) { // 是否需要进行 四舍五入，保留两位小数的处理
    return num2Fixed(num, precision);
  }
  return num;
}

function num2Fixed(num) {
  const numStr = num.toString();
  if (numStr.includes('.')) {
    const numArr = numStr.split('.');
    const decimalNum = parseInt(`${numArr[1][2]}`, 10);
    let numcArr = [];
    if (decimalNum >= 5) {
      numcArr = (num + 0.01).toString().split('.'); // 这里不放心的话可以用mathjs的方法
    } else {
      numcArr = num.toString().split('.');
    }
    return parseFloat(`${numcArr[0]}.${numcArr[1].substring(0, 2)}`);
  }
  return num;
}

// 改变含税单价
// 思路 将 含税单价, 数量, 税率, 折扣率, 折扣率2 5个值作为基础, 即可求出所有其他六个剩余值, 然后根据6个值倒推无税单价或者数量(这两个其中有一个是
// 确定的, 也就是改变的那个), 再通过公式去推所有
export function changePrice(row) {
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    unitPrice = getUnitPrice(price, taxRate);
    if (!this.commonApi.isEmpty(quantity)) {
      [price, amount, tax, amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    }  else if (!this.commonApi.isEmpty(amount)) {
      quantity = getQuantityByAmount(amount, unitPrice, taxRate);
      [price, , tax, amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(tax)) {
      quantity = getQuantityByTax(tax, unitPrice, taxRate);
      [price, amount, , amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(amountWithTax)) {
      quantity = getQuantityByAmountWithTax(amountWithTax, unitPrice);
      [price, amount, tax, , quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(discount)) {
      quantity = getQuantityByDiscount(discount, taxRate, discountRate, discountRate2, unitPrice);
      [price, amount, tax, amountWithTax, quotation] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    }
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}

export function changeQuantity(row) {
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    if (!this.commonApi.isEmpty(unitPrice)) {
      [price, amount, tax, amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(price)) {
      unitPrice = getUnitPrice(price, taxRate);
      [, amount, tax, amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(quotation)) {
      unitPrice = getUnitPriceByQuotation(quotation, discountRate, discountRate2);
      [price, amount, tax, amountWithTax, , discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(amount)) {
      unitPrice = getUnitPriceByAmount(amount, quantity, taxRate);
      [price, , tax, amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(tax)) {
      unitPrice = getUnitPriceByTax(tax, quantity, taxRate);
      [price, amount, , amountWithTax, quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(amountWithTax)) {
      unitPrice = getUnitPriceByAmountWithTax(amountWithTax, quantity);
      [price, amount, tax, , quotation, discount] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    } else if (!this.commonApi.isEmpty(discount)) {
      unitPrice = getUnitPriceByDiscount(discount, discountRate, discountRate2, quantity);
      [price, amount, tax, amountWithTax, quotation] =
        getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
    }
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}

export function changeTaxRate(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    [price, amount, tax, amountWithTax, quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeQuotation(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    unitPrice = getUnitPriceByQuotation(quotation, discountRate, discountRate2);
    [price, amount, tax, amountWithTax, , discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeUnitPrice(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    [price, amount, tax, amountWithTax, quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeAmount(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    unitPrice = getUnitPriceByAmount(amount, quantity, taxRate);
    [price, , tax, amountWithTax, quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeTax(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    unitPrice = getUnitPriceByTax(tax, quantity, taxRate);
    [price, amount, , amountWithTax, quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeAmountWithTax(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    unitPrice = getUnitPriceByAmountWithTax(amountWithTax, quantity);
    [price, amount, tax, , quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeDiscount(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    unitPrice = getUnitPriceByDiscount(discount, discountRate, discountRate2, quantity);
    [price, amount, tax, amountWithTax, quotation, ] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeDiscountRate(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    [price, amount, tax, amountWithTax, quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}
export function changeDiscountRate2(row) {
  // FIXME 考虑是否需要进一步优化, 主要这里完全信任无税单价, 数量的值
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  let that = this;
  try {
    [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2] = initValue(row, that);

    [price, amount, tax, amountWithTax, quotation, discount] =
      getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity);
  } catch (error) {

    return false;
  }

  setRow(row, [
    price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2
  ], that);
}

function initValue(row, that) {
  let price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2;
  quantity = !that.commonApi.isEmpty(row.quantity) ? row.quantity : 0;
  price = !that.commonApi.isEmpty(row.price) ? row.price : 0;
  quotation = row.quotation;
  unitPrice = !that.commonApi.isEmpty(row.unit_price) ? row.unit_price : 0;
  amount = row.amount;
  tax = row.tax;
  amountWithTax = row.amount_with_tax;
  discount = row.discount;

  // 折扣率
  discountRate = !that.commonApi.isEmpty(row.discount_rate) ? row.discount_rate : 100;
  discountRate2 = !that.commonApi.isEmpty(row.discount_rate2) ? row.discount_rate2 : 100;
  // 税率
  taxRate = 0;
  if (!that.commonApi.isEmpty(row.tax_rate)) {
    taxRate = row.tax_rate;
  } else {
    if (!that.commonApi.isEmpty(that.form.tax_rate)) {
      taxRate = that.form.tax_rate
    }
  }

  return [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2]
}

function setRow(row, [price, quantity, taxRate, quotation, unitPrice, amount, tax, amountWithTax, discount, discountRate, discountRate2], that)
{
  that.$set(row, 'quantity', quantity);
  that.$set(row, 'quotation', quotation);
  that.$set(row, 'unit_price', unitPrice);
  that.$set(row, 'amount', amount);
  that.$set(row, 'tax', tax);
  that.$set(row, 'amount_with_tax', amountWithTax);
  that.$set(row, 'tax_rate', taxRate);
  that.$set(row, 'price', price);
  that.$set(row, 'discount', discount);
  that.$set(row, 'discount_rate', discountRate);
  that.$set(row, 'discount_rate2', discountRate2);
}

/* 获取剩余六个计算值开始 */
export function getPrice(unitPrice, taxRate)
{
  return mathComputed(`(${unitPrice} / ((${taxRate} / 100) + 1))`)
}

export function getUnitPrice(price, taxRate)
{
  return mathComputed(`(${price} * ((${taxRate} / 100) + 1))`);
}

export function getAmount(unitPrice, quantity, taxRate)
{
  return mathComputed(`((${unitPrice} * ${quantity}) / ((${taxRate} / 100) + 1))`);
}

export function getTax(unitPrice, quantity, taxRate) {
  return mathComputed(`(${unitPrice} * ${quantity}) * ((${taxRate} / 100) / ((${taxRate} / 100) + 1))`);
}

export function getAmountWithTax(unitPrice, quantity)
{
  return mathComputed(`${unitPrice} * ${quantity}`);
}

export function getQuotation(unitPrice, discountRate, discountRate2)
{
  return mathComputed(`${unitPrice} / (${discountRate} / 100) / (${discountRate2} / 100)`);
}

export function getDiscount(unitPrice, discountRate, discountRate2, quantity)
{
  return mathComputed(`(1 - (${discountRate} / 100) * (${discountRate2} / 100)) * ${quantity} * (${unitPrice} / (${discountRate} / 100) / (${discountRate2} / 100))`);
}
/* 获取剩余六个计算值结束 */

export function getCalculatedValue(unitPrice, taxRate, discountRate, discountRate2, quantity)
{
  let quotation, price, amount, tax, amountWithTax, discount;
  price = getPrice(unitPrice, taxRate);
  amountWithTax = getAmountWithTax(unitPrice, quantity);
  amount = getAmount(unitPrice, quantity, taxRate);
  tax = getTax(unitPrice, quantity, taxRate);
  quotation = getQuotation(unitPrice, discountRate, discountRate2);
  discount = getDiscount(unitPrice, discountRate, discountRate2, quantity)

  return [price, amount, tax, amountWithTax, quotation, discount];
}

export function getUnitPriceByQuotation(quotation, discountRate, discountRate2)
{
  return mathComputed(`${quotation} * (${discountRate} / 100) * (${discountRate2} / 100)`);
}

export function getPriceByUnitPrice(unitPrice, taxRate)
{
  return mathComputed(`${unitPrice} / ((${taxRate} / 100) + 1)`);
}

export function getUnitPriceByAmount(amount, quantity, taxRate)
{
  return mathComputed(`${amount} / ${quantity} * ((${taxRate} / 100) + 1))`);
}

export function getQuantityByAmount(amount, unitPrice, taxRate)
{
  return mathComputed(`${amount} / (${unitPrice} / ((${taxRate} / 100) + 1))`);
}

export function getUnitPriceByTax(tax, quantity, taxRate)
{
  return mathComputed(`${tax} / ${quantity} / (${taxRate} / 100) * ((${taxRate} / 100) + 1))`);
}

export function getQuantityByTax(tax, unitPrice, taxRate)
{
  return mathComputed(`${tax} / (${unitPrice} / ((${taxRate} / 100) + 1)) / (${taxRate} / 100)`);
}

export function getUnitPriceByAmountWithTax(amountWithTax, quantity)
{
  return mathComputed(`${amountWithTax} / ${quantity}`);
}

export function getQuantityByAmountWithTax(amountWithTax, unitPrice)
{
  return mathComputed(`${amountWithTax} / ${unitPrice}`);
}

export function getUnitPriceByDiscount(discount, discountRate, discountRate2, quantity)
{
  return mathComputed(`(${discount} / (1 - (${discountRate} / 100) * (${discountRate2} / 100)) /  ${quantity}) * (${discountRate} / 100) * (${discountRate2} / 100)`);
}

export function getQuantityByDiscount(discount,taxRate, discountRate, discountRate2, unitPrice)
{
  return mathComputed(`${discount} / (1 - (${discountRate} / 100) * (${discountRate2} / 100)) / (${unitPrice} / (${discountRate} / 100) / (${discountRate2} / 100))`);
}


