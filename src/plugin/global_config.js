import Taro from '@tarojs/taro';
import NIM from './vendors/nim/NIM_Web_NIM_weixin_v6.8.0'
import NIM_TEST from './vendors/nim/NIM_Web_NIM_weixin.test.min';


export const initDeviceid = (isReset) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'; // 随机数种子
  const deviceid = [];
  let ret = null;

  ret = Taro.getStorageSync('YSF-DEVICEID');

  if (isReset || !ret) {
    for (let i = 0, n; i < 20; ++i) {
      n = Math.floor(Math.random() * chars.length);
      deviceid.push(chars.charAt(n));
    }
    ret = deviceid.join('').toLowerCase();
    Taro.setStorageSync(
      'YSF-DEVICEID', ret
    )
  }
  return ret;
}

const globalConfig = {
  appKey: '',
  domain: 'https://qiyukf.com',
  account: '',
  bid: '-1',
  token: '',
  deviceid: initDeviceid(),
  foreignid: '',
  userInfo: null,
  product: null,
  staffid: '',
  groupid: '',
  level: 0,
  title: '在线客服',
  bundleid: Taro.getAccountInfoSync().miniProgram.appId,
  heartbeatCycle: 8000,
  store: null,
  NIM: NIM,
  autoCopy: true, // 处理链接点击时，是否进行复制
  fullScreen: false // 是否为全面屏模式
};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
  if (process.env.NODE_ENV === 'development') {
    if (key == 'domain') {
      if (value == 'https://qytest.netease.com') {
        globalConfig['NIM'] = NIM_TEST;
        console.log(NIM_TEST);
      } else {
        globalConfig['NIM'] = NIM;
        console.log(NIM);
      }
    }
  }
  globalConfig[key] = value;
}
