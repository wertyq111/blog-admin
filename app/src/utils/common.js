export default {
  /**
   * 判断是否为空
   */
  isEmpty(value) {
    return typeof value === "undefined"
      || value === null
      || (typeof value === "string" && value.trim() === "")
      || (Array.prototype.isPrototypeOf.call(value) && value.length === 0)
      || (Object.prototype.isPrototypeOf.call(value) && Object.keys(value).length === 0);
  }
}
