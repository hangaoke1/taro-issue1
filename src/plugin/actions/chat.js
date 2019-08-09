import {queryAccont} from '../service';
import {get,set} from '../global_config';
import {PUSH_MESSAGE} from '../constants/message';
import IMSERVICE from '../service/im';

let NIM = null;

const applyKefuSuccess = (error,msg) => {
    console.log('hi kefu'+msg);
}

const applyKefu = () => {
    const appKey = get('appKey');
    const account = get('account');
    const token = get('token');
    
    NIM = new IMSERVICE({
        appKey: appKey,
        account: account,
        token: token
    });

    NIM.applyKefu();
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
        // applyKefu(applyKefuSuccess)
        applyKefu();
    })
}

export const sendText = (text) => dispatch => {
    let message = {
        "content": text,
        "type": 'text',
        "time": new Date().getTime(),
        "status": 1,
        "fromUser": 1
    }

    dispatch({type: PUSH_MESSAGE, message});
    // sendTextMsg(text);
    NIM.sendTextMsg(text);
}


