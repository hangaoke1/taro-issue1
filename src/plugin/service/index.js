import Taro from '@tarojs/taro'

const post = (url="", params={}) => {
    console.log('3333')
    return Taro.request({
        url,
        data: params,
        method: 'POST'
    })
}


export const queryAccont = (params) => {
    console.log('2222');
    return post('http://qytest.netease.com/webapi/user/create.action', params);
}