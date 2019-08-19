
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
    store: null
};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
    globalConfig[key] = value;
}