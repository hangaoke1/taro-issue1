import Taro from '@tarojs/taro';
import eventbus from '@/lib/eventbus';
import { get } from '../global_config';
import _get from 'lodash/get';
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
  return (num >> (bit - 1)) & 1;
};

export const genClassAndStyle = (row, len) => {
  const width = 100 / (len || 1);
  const bit1 = valueAtBit(+row.flag, 1); // 粗体
  const bit2 = valueAtBit(+row.flag, 2); // 斜体
  const bit3 = valueAtBit(+row.flag, 3); // 下划线
  const bit4 = valueAtBit(+row.flag, 4); // 文本类型 0: 多行文本 1: 单行超出隐藏
  const style = `width: ${width}%;text-align: ${row.align};color: ${row.color}`;
  let customerClass = '';
  if (bit1) {
    customerClass += ' z-bold';
  }
  if (bit2) {
    customerClass += ' z-italic';
  }
  if (bit3) {
    customerClass += ' z-underline';
  }
  if (bit4) {
    customerClass += ' z-ellipsis';
  }
  return { style, customerClass };
};

/**
 * 处理点击行为
 * @param {*} extralParams
 */
export const clickAction = (extralParams = {}) => {
  if (get('autoCopy')) {
    Taro.setClipboardData(
      {
        data: extralParams.url
      }
    ).then(json => {
      Taro.showToast({
        title: '链接已复制',
        duration: 1000
      })
    })
  }
  eventbus.trigger('click_action', extralParams);
}

/**
 * 文件大小计算
 * @param {number} size 单位byte
 */
export const size2String = (size = 0) => {
  const kb = size / 1024
  const mb = kb / 1024
  if (mb > 1) {
    return mb.toFixed(1) + 'MB'
  }
  return kb.toFixed(1) + 'KB'
}

/**
 * url查询参数转换成对象
 * query2Object
 */
export const query2Object = (url = '') => {
  let obj = {}
  let queryStr = url.split('?')[1] || '';
  queryStr.split('&').forEach(item => {
    if (item) {
      const key = item.split('=')[0]
      const value = item.split('=')[1]
      obj[key] = value
    }
  })
  return obj
}
