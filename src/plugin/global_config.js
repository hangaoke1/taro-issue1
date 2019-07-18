const globalConfig = {
    appKey: '',
    domain: 'https://qytest.netease.com',
    account: '',
    bid: '-1',
    token: ''
};

export const get = (key) => globalConfig[key];

export const set = (key, value) => {
    globalConfig[key] = value;
}