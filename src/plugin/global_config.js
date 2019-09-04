import Taro from '@tarojs/taro';
import NIM from './vendors/nim/NIM_Web_NIM_weixin_v6.6.6'
import NIM_TEST from './vendors/nim/NIM_Web_NIM_weixin.test.min';


const initDeviceid = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'; // 随机数种子
    const deviceid = [];
    let ret = null;

    ret = Taro.getStorageSync('YSF-DEVICEID');

    if(!ret){
      for (let i = 0, n; i < 20; ++i) {
        n = Math.floor(Math.random() * chars.length);
        deviceid.push(chars.charAt(n));
      }
      ret = deviceid.join('').toLowerCase();
      Taro.setStorageSync(
         'YSF-DEVICEID',ret
      )
    }
    return ret;
}

const globalConfig = {
    appKey: '',
    domain: 'https://qytest.netease.com',
    account: '',
    bid: '-1',
    token: '',
    deviceid: initDeviceid(),
    foreignid: '1442286211167',
    userInfo: {
      uid:"1442286211167",
      data:JSON.stringify([
        {"key":"real_name", "value":"土豪"},
        {"key":"mobile_phone", "hidden":true},
        {"key":"email", "value":"13800000000@163.com"},
        {"index":0, "key":"account", "label":"账号", "value":"zhangsan" , "href":"http://example.domain/user/zhangsan"},
        {"index":1, "key":"sex", "label":"性别", "value":"先生"},
        {"index":2, "key":"reg_date", "label":"注册日期", "value":"2015-11-16"},
        {"index":3, "key":"last_login", "label":"上次登录时间", "value":"2015-12-22 15:38:54"},
        {"index": 4, "key":"avatar","label":"头像","value":"https://xxxxx.jpg"}
      ])
   },
    heartbeatCycle: 8000,
    store: null,
    NIM: NIM_TEST
};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
    if(key == 'domain'){
        if(value == 'https://qytest.netease.com'){
            globalConfig['NIM'] = NIM_TEST;
            console.log(NIM_TEST);
        }else{
            globalConfig['NIM'] = NIM;
            console.log(NIM);
        }
    }
    globalConfig[key] = value;
}
