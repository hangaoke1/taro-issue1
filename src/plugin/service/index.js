import {request} from '../utils/ajax';

const post = (url="", params={}) => {
    return request({
        url,
        data: params,
        method: 'POST',
        json: false
    })
}


export const queryAccont = (params) => {
    return post('https://qytest.netease.com/webapi/user/create.action', params);
}