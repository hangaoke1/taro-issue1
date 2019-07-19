import {queryAccont} from '../service';
import {get,set} from '../global_config';
import {applyKefu,sendTextMsg} from '../utils/im';


const applyKefuSuccess = (error,msg) => {
    console.log('hi kefu'+msg);
}

/**
 * 
 * @param {*} param 
 * 创建云信的账户
 */
export const createAccount = (param = {}) => dispatch => {

    let appKey = get('appKey');
    let deviceid = get('deviceid');
    if(!appKey) return;

    queryAccont({
        deviceid,
        appKey
    }).then(json => {
        let info = json.info;

        info.accid && set('account', info.accid);
        info.bid && set('bid', info.bid);
        info.token && set('token', info.token);

        // 申请客服
        applyKefu(applyKefuSuccess)

    })
}

export const sendText = (text) => dispatch => {
    sendTextMsg(text);
}


