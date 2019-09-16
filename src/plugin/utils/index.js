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

export const genClassAndStyle = (row, len) => {
  const width = 100 / (len || 1);
  const bit1 = valueAtBit(+row.flag, 1); // 粗体
  const bit2 = valueAtBit(+row.flag, 2); // 斜体
  const bit3 = valueAtBit(+row.flag, 3); // 下划线
  const bit4 = valueAtBit(+row.flag, 4); // 文本类型 0: 多行文本 1: 单行超出隐藏
  const style = `width: ${width}%;text-align: ${row.align};color: ${row.color}`;
  let customerClass = ''
  if (bit1) { customerClass += ' z-bold' }
  if (bit2) { customerClass += ' z-italic' }
  if (bit3) { customerClass += ' z-underline' }
  if (bit4) { customerClass += ' z-ellipsis' }
  return {style, customerClass}
}
