import { get,set } from '../global_config';
import { PUSH_MESSAGE,UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYACTION } from '../constants/message';
import { INIT_SESSION,REASON_MAP } from '../constants/session';
import { INIT_EVALUATION_SETTING } from '../constants/evaluation';
import { SET_BOT_LIST } from '../constants/bot';
import { timestamp2date, fmtRobot } from '../utils';
import Base64 from '../lib/base64';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '../lib/uuid';

/**
 * 分配客服
 */
export const assignKefu = (content) => {
    const dispatch = get('store').dispatch;

    // init session
    dispatch({type: INIT_SESSION, session: content});
    // init evaluation
    dispatch({type: INIT_EVALUATION_SETTING, value: {
      evaluation: JSON.parse(content.evaluation),
      sessionid: content.sessionid
    }});

    let isRobot = content.stafftype === 1 || content.robotInQueue ===  1;
    set('isRobot', isRobot);

    let { code, staffname } = content;
    let time = new Date().getTime();
    let timeTip = {
        type: 'systip',
        content: timestamp2date(time,'HH:mm'),
        time: time
    }
    let message;
    dispatch({type: PUSH_MESSAGE, message: timeTip});
    switch(code){
        case 200:
            message = {
                content: `${content.message}` || `${staffname}为您服务`,
                type: 'systip',
                content: `${staffname}为您服务`,
                time: time
            }
            dispatch({type: PUSH_MESSAGE, message});

            // 会话成功后，重新连接的按钮禁用
            let updateActionMsg = {
                disabled: 1,
                action: 'reApplyKefu'
            }
            dispatch({type: UPDATE_MESSAGE_BYACTION, message: updateActionMsg});
        break;
        case 201:
            // 没有客服在线
            message = {
                type: 'rich',
                content: content.richmessage || content.message,
                time: time,
                fromUser: 0
            }
            dispatch({type: PUSH_MESSAGE, message});
            break;
        case 203:
            // 进入排队的状态
            message = {
              type: 'action',
              content: `排队中，您排在第${content.before}位，排到将自动接入。`,
              time: time,
              actionText: '取消排队',
              fromUser: 0,
              action: 'cancelQueue',
              sessionid: content.sessionid,
              key: `inqueue-${content.sessionid}`
            }
            dispatch({type: PUSH_MESSAGE, message});
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
    const session = get('store').getState().Session;
    let message,extralMessage = {};

    if(session.sessionid){
      extralMessage = {
        sessionid: session.sessionid,
        staff: {
          staffname: session.staffname,
          avatar: session.iconurl,
          staffid: session.staffid,
          stafftype: session.stafftype,
          realStaffid: session.realStaffid
        }
      }
    }

    if (msg.type == 'text') {

        message = {
            type: 'text',
            content: msg.text,
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }
    if (msg.type === 'image') {
        message = {
            type: 'image',
            content: msg.file,
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }
    if (msg.type === 'audio') {
        message = {
            type: 'audio',
            content: msg.file,
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }
    if (msg.type === 'video') {
        message = {
            type: 'video',
            content: msg.file,
            time: msg.time,
            status: msg.status,
            fromUser: 0,
            msg
        }
    }

    // 自定义消息解析
    if (msg.type === 'custom') {
        const fmtContent = JSON.parse(msg.content);
        const { cmd, content } = fmtContent;
        console.log('fmt', fmtContent);

        switch(cmd) {
            case 60:
                // 机器人答案返回
                const msgList = fmtRobot(msg, fmtContent)
                msgList.forEach(item => {
                    dispatch({type: PUSH_MESSAGE, message: {...item,...extralMessage}});
                })
                break;
            case 65:
                // 富文本
                message = {
                    type: 'rich',
                    content,
                    time: msg.time,
                    status: msg.status,
                    fromUser: 0,
                    msg
                }
                break;
            case 203:
                // TODO: bot消息解析
                message = {
                    type: 'bot',
                    content: fmtContent,
                    time: msg.time,
                    status: msg.status,
                    fromUser: 0,
                    msg,
                    uuid: genUUID16()
                }
                // 显示抽屉
                if (fmtContent.template.id === 'drawer_list') {
                    eventbus.trigger('show_card_list', message.uuid);
                }
                break
            case 95:
              // 转接的先放这吧
              receiveTransfer(fmtContent);
              break;
            default:;
        }
    }

    if (message) {
        dispatch({type: PUSH_MESSAGE, message: {...message,...extralMessage}});
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
        type: 'action',
        content: tip,
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
        type: 'action',
        content: content.message,
        fromUser: 0,
        time: time,
        actionText: content.evaluationTimes ? '再次评价' : '评价',
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
        type: 'rich',
        content: content.message,
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
 * 收到访客分流入口推送
 * @param {*} content
 */
export const receiveShuntEntries = (content) => {
  const dispatch = get('store').dispatch;

  let time = new Date().getTime();

  let message = {
    type: 'entries',
    content: content.message,
    time: time,
    fromUser: 0,
    action: 'selectEntries',
    entries: JSON.parse(content.entries)
  }

  dispatch({type: PUSH_MESSAGE, message});
}

/**
 * 接收到机器人提示
 * @param {object} content
 */
export const onRobotTip = (content) => {
    const dispatch = get('store').dispatch;

    let message = {
        type: 'rich',
        content: content.message,
        time: content.timestamp,
        fromUser: 0
    }
    dispatch({type: PUSH_MESSAGE, message});
}

/**
 * 收到bot入口信息
 * @param {object} content 内容
 */
export const onBotEntry = (content) => {
    const dispatch = get('store').dispatch;
    dispatch({ type: SET_BOT_LIST, value: content.bot || []});
}

/**
 * bot超长信息拆分处理
 * @param {object} content 内容
 */
export const onBotLongMessage = (() => {
    let cache = {};
    return (content, msg) => {
        const index = content.split_index;
        const count = content.split_count;
        const id = content.split_id;
        const splitContent = content.split_content || '';
        const idClient = content.msg_id || '';
        if (!cache[id]) { cache[id] = {} };
        cache[id][index] = splitContent || '';
        if (Object.keys(cache[id]).length === count) {
            let message = {}
            let contentStr = '';
            for(let i = 0; i < count; i++) {
                contentStr = contentStr + cache[id][i];
            }
            message.content = Base64.decode(contentStr);
            message.idClient = idClient;
            message.type = 'custom';
            receiveMsg(Object.assign({}, msg, message));
            delete cache[id];
        }
    }
})()

/**
 * 收到排队状态更新的推送
 * @param {*} content
 */
export const onQueueStatus = (content) => {
  const dispatch = get('store').dispatch;

  let updateMessage = {
    key: `inqueue-${content.sessionid}`,
    content: `排队中，您排在第${content.before}位，排到将自动接入。`,
  }

  dispatch({
    type: UPDATE_MESSAGE_BYKEY,
    message: updateMessage
  })
}


export const receiveTransfer = (content) => {

  // 会话id有变化，需要更新新的会话id
  const dispatch = get('store').dispatch;
  const session = get('store').getState().Session;

  // 如果转接显示提示的开关关掉，不显示转接提示
  if (!session.shop.setting.session_transfer_switch) return;

  let time = new Date().getTime();
  let message = {
    content: `${content.message}` || `已经为您转接${content.staffname}`,
    type: 'systip',
    time
  }

  dispatch({type: PUSH_MESSAGE, message});
}
