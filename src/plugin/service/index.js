import {request} from '../utils/ajax';
import { get } from '../global_config';

const post = (url="", params={}) => {
    return request({
        url,
        data: params,
        method: 'POST',
        json: false
    })
}


export const queryAccont = (params) => {
    const domain = get('domain');
    return post(`${domain}/webapi/user/create.action`, params);
}