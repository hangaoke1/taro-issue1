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
    return post('http://qytest.netease.com/webapi/user/create.action', params);
}