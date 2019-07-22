const globalConfig = {
    appKey: '',
    domain: 'https://qytest.netease.com',
    account: '',
    bid: '-1',
    token: '',
    deviceid: 'lusl4x7jhruzecuk6faq',
    heartbeatCycle: 8000,
    store: null
};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
    globalConfig[key] = value;
}