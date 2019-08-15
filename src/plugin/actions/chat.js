import {queryAccont} from '../service';
import {get,set} from '../global_config';
import {PUSH_MESSAGE} from '../constants/message';
import IMSERVICE from '../service/im';

let NIM = null;


/**
 * 申请分配客服
 */

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
    NIM.sendTextMsg(text);
}

export const sendImage = (res) => dispatch => {
    const tempFilePaths = res.tempFilePaths;
    
    // TODO: 处理发送失败问题
    Promise.all(tempFilePaths.map(tempFilePath => {
        NIM.sendImageMsg(tempFilePath).then(msg => {
            let message = {
                content: JSON.stringify(msg.file),
                type: 'image',
                time: msg.time,
                status: msg.status,
                fromUser: 1
            }
            dispatch({type: PUSH_MESSAGE, message});
        })
    }))
}

