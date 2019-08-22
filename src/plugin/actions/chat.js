import Taro from '@tarojs/taro'
import {queryAccont} from '../service';
import {get,set} from '../global_config';
import {PUSH_MESSAGE} from '../constants/message';
import IMSERVICE from '../service/im';

let NIM = null;


/**
 * 申请分配客服
 * @param {number} stafftype 申请客服类型
 */

export const applyKefu = (stafftype = 0) => {
    const appKey = get('appKey');
    const account = get('account');
    const token = get('token');
    
    NIM = new IMSERVICE({
        appKey: appKey,
        account: account,
        token: token
    });

    NIM.applyKefu(stafftype);
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
        applyKefu(0);
    })
}

/**
 * 发送文本消息
 * @param {string} text 文本内容
 */
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

/**
 * 发送图片消息
 * @param {object} res 微信sdk返回对象
 */
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

/**
 * 评价机器人返回信息
 * @param {string} msgidClient 客户端消息唯一标志
 * @param {number} evaluation 1没评价，2有用，3没用
 * @return {promise}
 */
export const evalRobotAnswer = (msgidClient, evaluation) => {
    const msg = {
        cmd: 64,
        msgidClient,
        evaluation
    }
    console.log('----评价机器人答案----', msg)
    return NIM.sendCustomSysMsg(msg);
}

/**
 * 处理文本链接点击
 * @param {string} url 链接地址
 */
export const parseUrlAction = (url) => {
    console.log('----点击富文本a标签----', url);
    if (url === 'qiyu://action.qiyukf.com?command=applyHumanStaff') {
        const isRobot = get('isRobot');
        if (!isRobot) {
            console.log('<---非机器人情况下无法转人工--->')
        } else {
            NIM.applyKefu(1);
            console.log('<---转人工处理--->')
        }
    }
}
