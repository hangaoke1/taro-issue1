export * from './date';
export * from './ajax';
export * from './text2emoji';
export * from './calc-msg';
export * from './calc-time';
export * from './query2object';
export * from './fmt-robot';
export * from './xss';
export * from './uuid';
export * from './text2em';

/**
 * 获取十进制转换成二进制之后第x位的值
 * @param {number} num 十进制数字 
 * @param {number} bit 需要获取的x位数字
 * @example
 * ```js
 * 3 ---> 0011
 * valueAtBit(3, 1) ---> 1
 * valueAtBit(3, 2) ---> 1
 * valueAtBit(3, 3) ---> 0
 * ```
 */
export const valueAtBit = (num, bit) => {
  return (num >> (bit -1)) & 1;
}
