import Taro from '@tarojs/taro';
import _get from 'lodash/get';
import { queryAccont } from '../service';
import { get, set } from '../global_config';
import IMSERVICE from '../service/im';
import { PUSH_MESSAGE, UPDATE_MESSAGE_BYUUID } from '../constants/message';
import { SET_EVALUATION_VISIBLE } from '../constants/chat';
import { SET_ASSOCIATE_RES } from '../constants/associate';

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
 * @param {object} msg  消息体
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

/**
 * 发送bot表单信息
 * @param {array} forms 表单数组 
 * @param {object} msg  消息体
 */
export const sendBotForm = (forms, msg) => {
  const dispatch = get('store').dispatch;
  let params = _get(msg, 'content.template.params');

  forms.forEach(item => {
    let value = item.type == 'image' ? JSON.stringify(item.value) : item.value;
    let param = item.id+'='+value;
    params += '&' + param;
  })

  params += '&msgIdClient=' + msg.idClient;

  // 生成本地消息
  const message = {
    type: 'bot',
    content: {
      params: params,
      template: {
        id: 'qiyu_template_botForm',
        forms
      }
    },
    time: new Date().getTime(),
    status: 1,
    fromUser: 1
  }
  dispatch({ type: PUSH_MESSAGE, message })

  return NIM.sendCustomSysMsg({
    cmd: 202,
    params: params,
    template: {
      id: 'qiyu_template_botForm',
      forms
    }
  })
}

/**
 * 
 * @param {object} item 商品信息
 */
export const sendBotGood = (item) => {
  const dispatch = get('store').dispatch;
  // 生成本地消息
  const message = {
    type: 'bot',
    content: {
      target: item.target,
      params: item.params,
      template: {
          id: 'qiyu_template_goods',
          p_status: item.p_status,
          p_img: item.p_img,
          p_name: item.p_name,
          p_stock: item.p_stock,
          p_price: item.p_price,
          p_count: item.p_count
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

export const sendTemplateText = (item) => {
  const dispatch = get('store').dispatch;

  const message = {
    type: 'bot',
    content: {
      target: item.target,
      params: item.params,
      template: {
          id: 'qiyu_template_text',
          label: item.valid_operation
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

/**
 * 文件上传
 * @param {string} wxFilePath 微信本地文件路径
 * @param {string} type 上传文件类型
 */
export const previewFile = (wxFilePath, type = 'image') => {
  return new Promise((resolve, reject) => {
    NIM.getNim().then(nim => {
      nim.previewFile({
        type,
        wxFilePath,
        // uploadprogress: function(obj) {
        //     console.log('文件总大小: ' + obj.total + 'bytes');
        //     console.log('已经上传的大小: ' + obj.loaded + 'bytes');
        //     console.log('上传进度: ' + obj.percentage);
        //     console.log('上传进度文本: ' + obj.percentageText);
        // },
        done: function(error, file) {
            console.log('上传image' + (!error?'成功':'失败'));
            if (!error) {
              resolve(file)
            } else {
              reject(error)
            }
        }
      });
    })
  })
}

/**
 * 输入联想
 * @param {text} 查询关键词
 */
export const associate = (text) => {
  const sessionid = get('sessionid');
  return NIM.sendCustomSysMsg({
    cmd: 24,
    sessionid,
    msgType: 'text',
    content: text
  })
}

/**
 * 清空联想
 */
export const emptyAssociate = () => {
  const dispatch = get('store').dispatch;
  dispatch({ type: SET_ASSOCIATE_RES, value: {} })
}

export const applyHumanStaff = () => {
  NIM.applyKefu({
    stafftype: 1
  })
}
