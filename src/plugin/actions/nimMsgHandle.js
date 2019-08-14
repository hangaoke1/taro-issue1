import {get} from '../global_config';
import {PUSH_MESSAGE} from '../constants/message';
import {INIT_SESSION,REASON_MAP} from '../constants/session';
import {timestamp2date} from '../utils/date';

/**
 * 分配客服
 */
export const assignKefu = (content) => {
    const dispatch = get('store').dispatch;

    // init session
    dispatch({type: INIT_SESSION, session: content});

    let { code, staffname } = content;
    let time = new Date().getTime();
    let timeTip = {
        content: timestamp2date(time,'HH:mm'),
        type: 'systip',
        time: time
    }
    let message;
    dispatch({type: PUSH_MESSAGE, message: timeTip});
    switch(code){
        case 200:
            message = {
                content: `${staffname}为您服务`,
                type: 'systip',
                time: time
            }
            dispatch({type: PUSH_MESSAGE, message});
        break;
        case 201:
            // 没有客服在线
            message = {
                content: content.message,
                type: 'systip',
                time: time
            }
            dispatch({type: PUSH_MESSAGE, message});
            break;
        case 206:
            // 进入排队的状态
            
        break;
    }
 }


/**
 * 收到普通的消息
 * @param {object} msg
 * @example
 * 'text' (文本)
 * 'image' (图片)
 * 'audio' (音频)
 * 'video' (视频)
 * 'file' (文件)
 * 'geo' (地理位置)
 * 'custom' (自定义消息)
 * 'tip' (提醒消息)
 * 'robot' (机器人消息)
 * 'notification' (群通知消息)
 */
export const receiveMsg = (msg) => {
    const dispatch = get('store').dispatch;

    if (msg.type == 'text') {

        let message = {
            "content": msg.text,
            "type": msg.type,
            "time": msg.time,
            "status": msg.status,
            "fromUser": 0
        }
    
        dispatch({type: PUSH_MESSAGE, message});
    }
    if (msg.type === 'image') {
        let message = {
            content: JSON.stringify(msg.file),
            type: 'image',
            time: msg.time,
            status: msg.status,
            fromUser: 0
        }

        dispatch({type: PUSH_MESSAGE, message});
    }
}


/**
 * 收到会话结束的指令
 */
export const onfinish = (content) => {
    const dispatch = get('store').dispatch;
    let session = get('store').getState().Session.Session;

    let {close_reason, richmessage, message} = content;
    let time = new Date().getTime();

    let tip;
    tip = REASON_MAP[close_reason] || '会话已断开';
    
    if (close_reason == 0 || close_reason == 2) {
        tip = richmessage || message || REASON_MAP[close_reason];
    }

    // if(session && session.kefu.isRobot && data.close_reason == 1) {
    //     tip = '本次会话已超时结束';
    // }
    
    let msg = {
        content: tip,
        type: 'action',
        fromUser: 0,
        time: time,
        actionText: '重新连接'
    }

    dispatch({type: PUSH_MESSAGE, message: msg});
}