import NIM from './vendors/nim/NIM_Web_NIM_weixin_v6.6.6'
import NIM_TEST from './vendors/nim/NIM_Web_NIM_weixin.test.min';


const initDeviceid = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'; // 随机数种子
    const deviceid = [];
    for (let i = 0, n; i < 20; ++i) {
        n = Math.floor(Math.random() * chars.length);
        deviceid.push(chars.charAt(n));
    }
	return deviceid.join('').toLowerCase();
}

const globalConfig = {
    appKey: '',
    domain: 'https://qytest.netease.com',
    account: '',
    bid: '-1',
    token: '',
    deviceid: initDeviceid(),
    heartbeatCycle: 8000,
    store: null,
    NIM: NIM_TEST
};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
    if(key == 'domain'){
        if(value == 'https://qytest.netease.com' || value == 'https://qiyukf.netease.com'){
            globalConfig['NIM'] = NIM_TEST;
            console.log(NIM_TEST);
        }else{
            globalConfig['NIM'] = NIM;
            console.log(NIM);
        }
    }
    globalConfig[key] = value;
}