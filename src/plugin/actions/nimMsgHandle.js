import { get,set } from '../global_config';
import { PUSH_MESSAGE,UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYINDEX } from '../constants/message';
import { INIT_SESSION,REASON_MAP } from '../constants/session';
import { timestamp2date, fmtRobot } from '../utils';

/**
 * 分配客服
 */
export const assignKefu = (content) => {
    const dispatch = get('store').dispatch;

    // init session
    dispatch({type: INIT_SESSION, session: content});

    let isRobot = content.stafftype === 1 || content.robotInQueue ===  1;
    set('isRobot', isRobot);

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
    let message;
    if (msg.type == 'text') {

        message = {
            content: msg.text,
            type: msg.type,
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }
    if (msg.type === 'image') {
        message = {
            content: JSON.stringify(msg.file),
            type: 'image',
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }
    if (msg.type === 'audio') {
        message = {
            content: JSON.stringify(msg.file),
            type: 'audio',
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }
    if (msg.type === 'video') {
        message = {
            content: JSON.stringify(msg.file),
            type: 'video',
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }

    if (msg.type === 'custom') {
        const fmtContent = JSON.parse(msg.content);
        const { cmd, content } = fmtContent;
        console.log('fmt', fmtContent);

        switch(cmd) {
            case 60:
                // 机器人答案返回
                const msgList = fmtRobot(msg, fmtContent)
                msgList.forEach(item => {
                    dispatch({type: PUSH_MESSAGE, message: item});
                })
                break;
            case 65:
                // 富文本
                message = {
                    content,
                    type: 'rich',
                    time: msg.time,
                    status: msg.status,
                    fromUser: 0,
                    msg
                }
                break;
            default:;
        }
    }

    if (message) {
        dispatch({type: PUSH_MESSAGE, message});
    }
}

/**
 * 收到会话结束的指令
 */
export const onfinish = (content) => {
    const dispatch = get('store').dispatch;
    // let session = get('store').getState().Session.Session;

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
        actionText: '重新连接',
        action: 'reApplyKefu'
    }

    dispatch({type: PUSH_MESSAGE, message: msg});
}

/**
 *  收到客服的邀评
 * @param {*} content 
 */
export const onevaluation = (content) => {
    const dispatch = get('store').dispatch;

    let time = new Date().getTime();

    let msg = {
        content: content.message,
        type: 'action',
        fromUser: 0,
        time: time,
        actionText: '评价',
        action: 'evaluation',
        key: `evaluation-${content.sessionid}`
    }

    dispatch({type: PUSH_MESSAGE, message: msg});

}

/**
 * 收到评价成功的推送
 * @param {*} content 
 */
export const onevaluationresult = (content) => {
    const dispatch = get('store').dispatch;

    let time = new Date().getTime();

    let message = {
        content: content.message,
        type: 'rich',
        time: time,
        fromUser: 0
    }

    let updateActionMsg = {
        key: `evaluation-${content.sessionid}`,
        actionText: '已评价',
        disabled: 1
    }

    dispatch({type: PUSH_MESSAGE, message});
    dispatch({type: UPDATE_MESSAGE_BYKEY, message: updateActionMsg});
}

/**
 * 接收到机器人提示
 * @param {object} content 
 */
export const onRobotTip = function (content) {
    const dispatch = get('store').dispatch;

    let message = {
        content: content.message,
        type: 'rich',
        time: content.timestamp,
        fromUser: 0
    }
    dispatch({type: PUSH_MESSAGE, message});
}
