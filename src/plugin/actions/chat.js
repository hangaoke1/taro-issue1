import {queryAccont} from '../service';
import Taro from '@tarojs/taro'
import IMSERVICE from '../service/im';

export const createAccount = param => {
    Taro.request({
        url: 'https://qytest.netease.com/webapi/user/create.action',
        data: {
            deviceid: 'lusl4x7jhruzecuk6faq',
            appKey: '7540b40c6afa96fc975ce040733ae7f6'
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
    }).then(json => {
        const info = json.data.info;
        new IMSERVICE({
            appKey: '7540b40c6afa96fc975ce040733ae7f6',
            account: info.accid,
            promise: true,
            token: info.token
        });
    })
}