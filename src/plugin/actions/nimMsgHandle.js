import Taro from '@tarojs/taro';
import _get from 'lodash/get';
import { get,set } from '../global_config';
import { PUSH_MESSAGE,UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYACTION } from '../constants/message';
import { INIT_SESSION,REASON_MAP,SET_SESSION_CODE,UPDATE_SESSION } from '../constants/session';
import { INIT_EVALUATION_SETTING,INIT_CURRENT_EVALUATION,INIT_LAST_EVALUATION } from '../constants/evaluation';
import { SET_EVALUATION_VISIBLE, SET_ENTRY_CONFIG,DEL_ENTRY_BYKEY,SET_CHAT_INPUT_DISABLED,
          SET_CHAT_INPUT_PLACEHOLDER,RESET_CHAT_INPUT, UPDATE_ENTRY_BYTEXT, UPDATE_ENTRY_BYKEY,SET_SHUNT_ENTRIES_STATUS } from '../constants/chat';
import { SET_BOT_LIST } from '../constants/bot';
import { SET_ASSOCIATE_RES } from '../constants/associate';
import { timestamp2date, fmtRobot } from '../utils';
import Base64 from '../lib/base64';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '../lib/uuid';

function genExtralMessage (session) {
  if(session.sessionid){
    return {
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
  return {}
}

/**
 * 分配客服
 */
export const assignKefu = (content) => {
    const dispatch = get('store').dispatch;

    const oldSession = get('store').getState().Session;

    const isSameSession = _get(oldSession, 'sessionid') === content.sessionid;

    // init session
    dispatch({type: INIT_SESSION, session: content});

    const extralMessage = genExtralMessage(content);

    // init evaluation
    if(content.evaluation){
      dispatch({type: INIT_EVALUATION_SETTING, value: {
        evaluation: JSON.parse(content.evaluation),
        sessionid: content.sessionid
      }});
    }

    // 显示人工入口
    if(content.operator_enable){
      dispatch({
        type: SET_ENTRY_CONFIG,
        value:
          {
            icon: 'icon-customerservicex',
            text: '人工',
            key: 'applyHumanStaff'
          }
      })
    }

    // 如果分配到人工客服的话，就不显示人工客服的入口了
    if(content.stafftype == 0){
      dispatch({
        type: DEL_ENTRY_BYKEY,
        value: 'applyHumanStaff'
      })
    }

    // 显示评价入口
    if(content.shop.setting.show_evaluation_button){
      // 人工会话才有评价
      if(content.stafftype == 0){
        dispatch({
          type: SET_ENTRY_CONFIG,
          value:
            {
              icon: 'icon-star-linex',
              text: '评价',
              key: 'evaluation'
            }
        })

        // 更新会话结束的时间
      dispatch({
        type: UPDATE_SESSION,
        value: {
          closeTime: null
        }
      })

      }else{
        dispatch({
          type: DEL_ENTRY_BYKEY,
          value: 'evaluation'
        })
      }
    }else{
      dispatch({
        type: DEL_ENTRY_BYKEY,
        value: 'evaluation'
      })
    }

    let message;
    let time = new Date().getTime();
    let { code } = content;

    if (!isSameSession) {
      // 先这么搞一下
      dispatch({
        type: UPDATE_ENTRY_BYKEY,
        value: {
          icon: 'icon-star-linex',
          text: '评价',
          key: 'evaluation'
        }
      })
    }

    // 恢复输入框可输入的状态
    dispatch({
      type: RESET_CHAT_INPUT,
      value: null
    })

    //进线了之前的排队按钮都禁用掉
    dispatch({
      type: UPDATE_MESSAGE_BYACTION,
      message: {
        action: 'cancelQueue',
        disabled: true
      }
    })

    // 只要新会话正常接入，访客分流提示的状态都重置了
    dispatch({
      type: SET_SHUNT_ENTRIES_STATUS,
      value: false
    })

    switch(code){
        case 200:
            // related_session_type == 1 // 机器人转人工接入 session_transfer_robot_switch=0开关关闭
            if(content.shop.setting && !content.shop.setting.session_transfer_robot_switch && content.related_session_type == 1){
              return;
            }

            // 如果分配的是人工客服，然后配置了自动发送商品链接
            if(content.stafftype == 0 && get('product')){
              eventbus.trigger('do_send_product_card', get('product'));
            }

            // 如果有message接入语，才显示接入语
            // 消息列表里面的sessionId用来根据sessionId去重用的
            if(content.stafftype == 0 && content.message){
              message = {
                type: 'systip',
                content: `${content.message}`,
                time: time,
                uniqueKey: `session-start-tip-${content.sessionid}`
              }
              dispatch({type: PUSH_MESSAGE, message});
            }

            // 如果是机器人则提示机器人服务问候
            if ((content.stafftype === 1 || content.robotInQueue ===  1) && !isSameSession) {
              message = {
                type: 'systip',
                content: `${content.staffname}为您服务`,
                time: time
              }
              dispatch({type: PUSH_MESSAGE, message});
            }

            // 会话成功后，重新连接的按钮禁用
            let updateActionMsg = {
                disabled: 1,
                action: 'reApplyKefu'
            }
            dispatch({type: UPDATE_MESSAGE_BYACTION, message: updateActionMsg});
        break;
        case 201:
            // 没有客服在线
            renderLeave({
              richmessage: content.richmessage,
              message: content.message,
              extralMessage
            })
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
        case 205:
          renderLeaveOff({
            richmessage: content.richmessage,
            message: content.message,
            extralMessage
          });
          break
        default:
          console.log(`警告: 暂不支持${code}解析`);
    }
 }


 /**
  * 201渲染留言
  * @param {*} param0
  */
 const renderLeave = ({
  richmessage = "",
  message = "",
  extralMessage = {}
 }) => {
   // 没有客服在线,且进入留言
   const dispatch = get('store').dispatch;

   let msg = {
    type: 'rich',
    content: richmessage || message,
    time: new Date().getTime(),
    fromUser: 0,
    ...extralMessage
  }
  dispatch({type: PUSH_MESSAGE, message: msg });
 }

 const renderLeaveOff = ({
  richmessage = "",
  message = "",
  extralMessage = {}
 }) => {
    // 留言未开启输入框禁用
    const dispatch = get('store').dispatch;

    dispatch({
      type: SET_CHAT_INPUT_DISABLED,
      value: true
    })

    dispatch({
      type: SET_CHAT_INPUT_PLACEHOLDER,
      value: '客服不在线，不支持留言'
    })

    // 留言未开启
    let msg = {
      type: 'rich',
      content: richmessage || message,
      time: new Date().getTime(),
      fromUser: 0,
      ...extralMessage
    }
    dispatch({type: PUSH_MESSAGE, message: msg});
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
 * 'notification' (群通知消息)1
 */
export const receiveMsg = (msg) => {
    const dispatch = get('store').dispatch;
    const session = get('store').getState().Session;
    let message,extralMessage = {};

    if(session.sessionid){
      extralMessage = genExtralMessage(session);
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
        // console.log('格式化: ', fmtContent);

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
                    eventbus.trigger('bot_show_drawer_list', message.uuid);
                }
                // 显示表单
                if (fmtContent.template.id === 'bot_form') {
                  setTimeout(() => {
                    eventbus.trigger('bot_show_bot_form', message.uuid);
                  }, 100)
                }
                break
            case 205:
                eventbus.trigger('bot_loadmore_list', fmtContent);
                break;
            case 95:
              // 转接的先放这吧
              receiveTransfer(fmtContent);
              break;
            case 121:
              // 客服商品卡片
              receiveCustomCard(fmtContent);
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
    let session = get('store').getState().Session;
    const extralMessage = genExtralMessage(session);

    let {close_reason, richmessage, message, evaluate, messageInvite, sessionid, evaluation_auto_popup} = content;
    let time = new Date().getTime();

    let tip;
    tip = REASON_MAP[close_reason] || '会话已断开';

    // 会话结束的状态
    dispatch({
      type: SET_SESSION_CODE,
      value: 206
    })

    // 只要新会话正常接入，访客分流提示的状态都重置了
    dispatch({
      type: SET_SHUNT_ENTRIES_STATUS,
      value: false
    })

    // 更新会话结束的时间
    dispatch({
      type: UPDATE_SESSION,
      value: {
        closeTime: time
      }
    })

    // 7为用户主动关闭会话，不用提示文案
    if(close_reason == 7){
      return;
    }

    if (close_reason == 0 || close_reason == 2) {
        tip = richmessage || message || REASON_MAP[close_reason];
    }

    if(session && session.isRobot && content.close_reason == 1) {
        tip = '本次会话已超时结束';
    }

    // 是否显示关闭文案的开关
    if (session.shop.setting.session_end_switch){
      let msg = {
        type: 'action',
        content: tip,
        fromUser: 0,
        time: time,
        actionText: '重新连接',
        action: 'reApplyKefu',
        ...extralMessage
      }

      dispatch({type: PUSH_MESSAGE, message: msg});
    }

    // 会话结束时需要评价
    if(evaluate){
      let evaluationMsg = {
        type: 'action',
        content: messageInvite,
        fromUser: 0,
        time,
        actionText: '评价',
        action: 'evaluation',
        key: `evaluation-${sessionid}`,
        colorful: true,
        ...extralMessage
      }

      dispatch({type: PUSH_MESSAGE, message: evaluationMsg});

      if(evaluation_auto_popup){
        eventbus.trigger('hide_keyboard');
        dispatch({
          type: SET_EVALUATION_VISIBLE,
          value: true
        })
      }
    }
}

/**
 *  收到客服的邀评
 * @param {*} content
 */
export const onevaluation = (content) => {
    const dispatch = get('store').dispatch;
    const session = get('store').getState().Session;
    const { evaluationSetting } = get('store').getState().Evaluation;

    let time = new Date().getTime();

    let msg = {
        type: 'action',
        content: content.message,
        fromUser: 0,
        time: time,
        actionText: content.evaluationTimes ? '再次评价' : '评价',
        action: 'evaluation',
        colorful: content.evaluationTimes ? false : true,
        key: `evaluation-${content.sessionid}`
    }

    // pattern==2是新页面的模式，没做，不弹窗了
    if(content.evaluation_auto_popup && evaluationSetting.pattern != 2){
      eventbus.trigger('hide_keyboard');
      dispatch({
        type: SET_EVALUATION_VISIBLE,
        value: true
      })
    }

    if(content.evaluationTimes){
      // init evaluation
      dispatch({type: INIT_EVALUATION_SETTING, value: {
        evaluation: JSON.parse(session.evaluation),
        sessionid: session.sessionid
      }});
      dispatch({
        type: INIT_CURRENT_EVALUATION,
        value: {
          remarks: '',
          evaluation_resolved: null,
          selectTagList: []
        }
      })
    }

    dispatch({type: PUSH_MESSAGE, message: msg});

}

/**
 * 收到评价成功的推送
 * @param {*} content
 */
export const onevaluationresult = (content) => {
    const dispatch = get('store').dispatch;
    const evaluation = get('store').getState().Evaluation;
    const session = get('store').getState().Session;

    if (content.body == 414) {
      Taro.showToast({
        title: '不能评价',
        icon: 'none',
        duration: 2000
      })

      return;
    }
    if (content.body == 412) {
      Taro.showToast({
        title: '评价已超时，无法进行评价',
        icon: 'none',
        duration: 2000
      })

      return;
    }

    // 评价成功
    dispatch({
      type: SET_EVALUATION_VISIBLE,
      value: false
    });

    // 如果会话已经评价过
    dispatch({
      type: UPDATE_ENTRY_BYKEY,
      value: {
        icon: 'icon-star-line-hookx',
        text: '已评价',
        key: 'evaluation',
        disabled: true
      }
    })

    // 存储上次评价内容
    dispatch({
      type: INIT_LAST_EVALUATION,
      value: evaluation.currentEvaluation
    })
    // 存储到last后将当前的清空
    eventbus.trigger('reset_evaluation');

    // 是否支持多次评价的开关
    let enable_evaluation_muttimes = session.shop.setting && session.shop.setting.enable_evaluation_muttimes;
    let messageType = enable_evaluation_muttimes ? 'action' : 'rich';
    let time = new Date().getTime();

    let message = {
        type: messageType,
        content: content.message,
        time: time,
        fromUser: 0,
        actionText: '修改评价',
        action: 'updateEvaluation'
    }

    let updateUpdateEvaluationMsg = {
      actionText: '已评价',
      disabled: 1,
      action: 'updateEvaluation'
    }

    dispatch({type: UPDATE_MESSAGE_BYACTION, message: updateUpdateEvaluationMsg});

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

  // 维护处于访客分流的状态
  dispatch({
    type: SET_SHUNT_ENTRIES_STATUS,
    value: true
  })

  dispatch({type: PUSH_MESSAGE, message});
}


/**
 * 接收到机器人提示
 * @param {object} content
 */
export const onRobotTip = (content) => {
    const dispatch = get('store').dispatch;
    const session = get('store').getState().Session;
    const extralMessage = genExtralMessage(session);

    let message = {
        type: 'rich',
        content: content.message,
        time: content.timestamp,
        fromUser: 0,
        ...extralMessage
    }
    dispatch({type: PUSH_MESSAGE, message});
}

/**
 * 收到bot入口信息
 * @param {object} content 内容
 */
export const onBotEntry = (content) => {
    const dispatch = get('store').dispatch;
    const len = _get(content, 'bot.length', 0);
    dispatch({ type: SET_BOT_LIST, value: [], len});
    setTimeout(() => {
      dispatch({ type: SET_BOT_LIST, value: content.bot || [], len});
    }, 500)
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


/**
 * 收到转接通知
 * @param {*} content
 */
export const receiveTransfer = (content) => {

  // 会话id有变化，需要更新新的会话id
  const dispatch = get('store').dispatch;
  const session = get('store').getState().Session;

  // 如果转接显示提示的开关关掉，不显示转接提示
  if (!session.shop.setting.session_transfer_switch) return;

  let time = new Date().getTime();
  if(content.message){
    let message = {
      type: 'systip',
      content: `${content.message}`,
      time
    }

    dispatch({type: PUSH_MESSAGE, message});
  }
}

/**
 * 监听联想文本
 * @param {object} content 格式化消息体
 */
export const onReceiveAssociate = (content) => {
  const dispatch = get('store').dispatch;
  dispatch({ type: SET_ASSOCIATE_RES, value: content});
}


/**
 * 收到客服发送的自定义卡片
 * @param {*} content
 */
export const receiveCustomCard = (content) => {
  const dispatch = get('store').dispatch;

  let message = {
    type: 'order-card',
    content,
    time: new Date().getTime(),
    status: 1,
    fromUser: 0
  }
  dispatch({ type: PUSH_MESSAGE, message });
}


/**
 * 进入排队失败的状态
 */
export const queueFail = (content) => {
  const dispatch = get('store').dispatch;

  if(content.code == 302){
    dispatch({
      type: SET_SESSION_CODE,
      value: 201
    })
    renderLeave({
      richmessage: content.richmessage,
      message: content.message
    })
  }

  if(content.code == 303){
    dispatch({
      type: SET_SESSION_CODE,
      value: 205
    })
    renderLeaveOff({
      richmessage: content.richmessage,
      message: content.message
    })
  }
}

/**
 * 收到显示评价入口的指令
 * @param {*} content
 */
export const receiveEvaluationShowEntry = (content) => {
  const dispatch = get('store').dispatch;

  dispatch({
    type: SET_ENTRY_CONFIG,
    value:
      {
        icon: 'icon-star-linex',
        text: '评价',
        key: 'evaluation'
      }
  })
}
