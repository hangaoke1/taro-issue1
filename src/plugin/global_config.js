import Taro from '@tarojs/taro';

const globalConfig = {};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
  globalConfig[key] = value;
}
