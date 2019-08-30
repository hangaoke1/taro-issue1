import Taro from '@tarojs/taro';
import _get from 'lodash/get';
import { queryAccont } from '../service';
import { get, set } from '../global_config';
import IMSERVICE from '../service/im';
import { PUSH_MESSAGE, UPDATE_MESSAGE_BYUUID } from '../constants/message';
import { SET_EVALUATION_VISIBLE } from '../constants/chat';

let NIM = null;

/**
 * 申请分配客服
 * @param {number} stafftype 申请客服类型
 */

export const applyKefu = (
  extraParms = {
    stafftype: 0
  }
) => {
  const appKey = get('appKey');
  const account = get('account');
  const token = get('token');

  NIM = IMSERVICE.getInstance({
    appKey: appKey,
    account: account,
    token: token
  });

  NIM.applyKefu(extraParms);
};

/**
 *
 * @param {*} param
 * 创建云信的账户
 */
export const createAccount = (param = {}) => dispatch => {
  let appKey = get('appKey');
  let deviceid = get('deviceid');
  if (!appKey) return;

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
  });
};

/**
 * 发送文本消息
 * @param {string} text 文本内容
 */
export const sendText = text => dispatch => {
  let message = {
    content: text,
    type: 'text',
    time: new Date().getTime(),
    status: 1,
    fromUser: 1
  };

  dispatch({ type: PUSH_MESSAGE, message });
  NIM.sendTextMsg(text).then(msg => {
    console.log('文本发送完成', msg);
  });
};

/**
 * 发送图片消息
 * @param {object} res 微信sdk返回对象
 */
export const sendImage = res => dispatch => {
  const tempFilePaths = res.tempFilePaths;

  // TODO: 处理发送失败问题
  Promise.all(
    tempFilePaths.map(tempFilePath => {
      NIM.sendImageMsg(tempFilePath).then(msg => {
        let message = {
          type: 'image',
          idClient: msg.idClient,
          content: msg.file,
          time: msg.time,
          status: msg.status,
          fromUser: 1
        };
        dispatch({ type: PUSH_MESSAGE, message });
      });
    })
  );
};

/**
 * 机器人差评原因
 * @param {string} msgidClient 客户端消息唯一标志
 * @param {string} evalcontent 差评原因
 */
export const evaluationContent = (msgidClient, evalcontent = '') => {
  const msg = {
    cmd: 66,
    msgidClient,
    evaluation_content: evalcontent
  };
  console.log('----机器人差评原因----', msg);
  return NIM.sendCustomSysMsg(msg);
};

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
  };
  console.log('----机器人评价----', msg);
  return NIM.sendCustomSysMsg(msg);
};

/**
 * 处理文本链接点击
 * @param {string} url 链接地址
 */
export const parseUrlAction = url => {
  console.log('----点击富文本a标签----', url);

  // 处理转人工请求
  if (url === 'qiyu://action.qiyukf.com?command=applyHumanStaff') {
    const isRobot = get('isRobot');
    if (!isRobot) {
      console.log('----非机器人情况下无法转人工----');
    } else {
      NIM.applyKefu({
        stafftype: 1
      });
    }
  }
};

/**
 * 访客发送评价
 * @param {*} param
 */
export const sendEvaluation = (data = {}) => dispatch => {
  NIM.sendEvaluation(data).then(json => {
    dispatch({
      type: SET_EVALUATION_VISIBLE,
      value: false
    });
  });
};

/**
 * 访客主动取消了排队
 * @param {*} data
 */
export const cancelQueue = (data = {}) => dispatch => {
  NIM.cancelQueue(data).then(json => {
    let message = {
      type: 'systip',
      content: '您退出了咨询',
      time: new Date().getTime()
    };
    dispatch({ type: PUSH_MESSAGE, message });
  });
};

/**
 * 根据序号修改消息内容
 * @param {object} message 新消息内容[带uuid]
 */
export const changeMessageByUUID = message => dispatch => {
  dispatch({ type: UPDATE_MESSAGE_BYUUID, message });
};

/* ----bot相关开始---- */

/**
 * BOT平台动态查询，客户端通知服务器加载更多列表
 * @param {object} data 请求参数
 * @return {promise}
 */
export const getMoreBotList = (data) => {
  return NIM.sendCustomSysMsg({
    cmd: 204,
    templateId: data.id,
    target: data.target,
    params: data.params
  });
};

/**
 * BOT平台发送标准信息条目
 * @param {object} item 发送单元信息
 * @param {object} msg  发送原消息体
 * @return {promise}
 */
export const sendBotCard = (item, msg) => {
  const dispatch = get('store').dispatch;
  // 生成本地消息
  const message = {
    type: 'bot',
    content: {
      relatedTplId: _get(msg, 'content.template.id'),
      relatedUUID: msg.uuid,
      relatedMsgId: msg.idClient,
      template: {
        id: 'qiyu_template_item',
        p_img: item.p_img,
        p_title: item.p_title,
        p_sub_title: item.p_sub_title,
        p_attr_1: item.p_attr_1,
        p_attr_2: item.p_attr_2,
        p_attr_3: item.p_attr_3
      }
    },
    time: new Date().getTime(),
    status: 1,
    fromUser: 1
  }
  
  dispatch({ type: PUSH_MESSAGE, message })

  return NIM.sendCustomSysMsg({
    cmd: 202,
    target: item.target,
    params: item.params,
    template: message.content.template
  })
}

/* ----bot相关结束---- */

export const applyHumanStaff = () => {
  NIM.applyKefu({
    stafftype: 1
  })
}
