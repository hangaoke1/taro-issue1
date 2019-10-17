import Taro from '@tarojs/taro';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import { queryAccont, querySdkSetting } from '../service';
import { get, set } from '../global_config';
import IMSERVICE,{ STATUS } from '../service/im';
import { PUSH_MESSAGE, UPDATE_MESSAGE_BYUUID, REMOVE_MESSAGE_BYUUID,UPDATE_MESSAGE_BYACTION } from '../constants/message';
import { DEL_ENTRY_BYKEY } from '../constants/chat';
import { SET_ASSOCIATE_RES } from '../constants/associate';
import { SET_SETTING } from '../constants/setting';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '@/lib/uuid';

eventbus.on('do_send_product_card', function(extraParms){
  sendProductCard(extraParms);
});


let NIM = null;

// 清空未读数量
eventbus.on('clear_unread', function(extraParms){
  if (canSendMessage()) {
    NIM.clearUnreadMsg();
  }
});

/**
 * 获取访客端配置
 */
export const getSdkSetting = () => {
  const dispatch = get('store').dispatch;
  const appKey = get('appKey');
  if (!appKey) return;
  return querySdkSetting({
    appKey,
    fromType: 'ios'
  }).then(res => {
    console.log('获取访客端配置', res)
    dispatch({ type: SET_SETTING, value: res.result });
  })
}

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

  const session = get('store').getState().Session;

  if(!extraParms.entryid && session && (session.code == 200 || session.code == 203)){
    NIM.updateCrmInfo();
    return;
  }

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
  if (!text.trim()) {return}

  if(isShuntEntriesStatus()){
    Taro.showToast({
      title: '为了给您提供更专业的服务，请您选择要咨询的内容类型',
      icon: 'none',
      duration: 2000
    })

    return;
  }

  let message = {
    type: 'text',
    uuid: genUUID16(),
    content: text,
    time: new Date().getTime(),
    status: 1, // 0成功 1发送中 -1发送失败
    fromUser: 1,
    resendContent: text
  };

  dispatch({ type: PUSH_MESSAGE, message });

  return NIM.sendTextMsg(text).then(res => {
    const newMessage = _cloneDeep(message)
    newMessage.status = 0
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  }).catch(err => {
    const newMessage = _cloneDeep(message)
    newMessage.status = -1
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  });
};

/**
 * 发送相似或者关联文本
 * @param {object} item 消息对象 { id, text, idClient }
 */
export const sendRelateText = item => dispatch => {
  if (!canSendMessage()) {
    Taro.showToast({
      title: '请等待连线成功后，再发送消息',
      icon: 'none',
      duration: 2000
    })
    return;
  }

  let message = {
    content: item.text,
    type: 'text',
    time: new Date().getTime(),
    status: 1,
    fromUser: 1
  };
  dispatch({ type: PUSH_MESSAGE, message });

  const msg = {
    cmd: 63, //相似问题或者关联问题时，用户将选择的问题发给服务器
    question: item.text, //问题语句
    questionid: item.id, //问题id
    questionMsgidClient: item.idClient, // 与该问题关联的消息id，即用户所选问题对应的消息id
    msgidClient: item.idClient // 随机生成消息id，用于（72条指令中）服务器广播回来时使用
  };
  return NIM.sendCustomSysMsg(msg).then(res => {
    const newMessage = _cloneDeep(message)
    newMessage.status = 0
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  }).catch(err => {
    const newMessage = _cloneDeep(message)
    newMessage.status = -1
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  });
};

/**
 * 发送图片消息
 * @param {object} res 微信sdk返回对象
 */
export const sendImage = res => dispatch => {
  if (!canSendMessage()) {
    Taro.showToast({
      title: '请等待连线成功后，再发送消息',
      icon: 'none',
      duration: 2000
    })
    return;
  }

  const tempFilePaths = res.tempFilePaths;

  Promise.all(
    tempFilePaths.map(tempFilePath => {
      // 1. 生成空消息
      // 2. 更新消息
      const uuid = genUUID16()

      let message = {
        type: 'image',
        idClient: '',
        content: {},
        time: Date.now(),
        status: 1,
        fromUser: 1,
        resendContent: {
          tempFilePaths: [tempFilePath]
        },
        uuid
      };

      dispatch({ type: PUSH_MESSAGE, message });

      NIM.sendImageMsg(tempFilePath).then(msg => {
        const newMessage = {
          type: 'image',
          idClient: msg.idClient,
          content: msg.file,
          time: msg.time,
          status: msg.status,
          fromUser: 1,
          status: 0,
          uuid
        };

        dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
      }).catch(err => {
        const newMessage = _cloneDeep(message);
        newMessage.status = -1
        dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
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
  if (!canSendMessage()) {
    Taro.showToast({
      title: '请等待连线成功后，再操作',
      icon: 'none',
      duration: 2000
    })
    return;
  }

  const msg = {
    cmd: 66,
    msgidClient,
    evaluation_content: evalcontent
  };
  // console.log('----机器人差评原因----', msg);
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
  // console.log('----机器人评价----', msg);
  return NIM.sendCustomSysMsg(msg);
};

/**
 * 处理文本链接点击
 * @param {string} url 链接地址
 */
export const parseUrlAction = url => {
  // console.log('----点击富文本a标签----', url);

  // 处理转人工请求
  if (url === 'qiyu://action.qiyukf.com?command=applyHumanStaff') {
    const isRobot = get('isRobot');
    if (!isRobot) {
      // console.log('----非机器人情况下无法转人工----');
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
  NIM.sendEvaluation(data);
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

    let updateMessage = {
      action: 'cancelQueue',
      disabled: true
    }
    dispatch({ type: UPDATE_MESSAGE_BYACTION, message:updateMessage});
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
export const getMoreBotList = data => {
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
  };

  dispatch({ type: PUSH_MESSAGE, message });

  // 更新原消息
  const updateMessage = _cloneDeep(msg);
  updateMessage.content.template.choosed = true;
  dispatch({type: UPDATE_MESSAGE_BYUUID, message: updateMessage});

  return NIM.sendCustomSysMsg({
    cmd: 202,
    target: item.target,
    params: item.params,
    template: message.content.template
  }).then(res => {
    const newMessage = _cloneDeep(message)
    newMessage.status = 0
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  }).catch(err => {
    const newMessage = _cloneDeep(message)
    newMessage.status = -1
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  });;
};

/**
 * 发送bot表单信息
 * @param {array} forms 表单数组
 * @param {object} msg  消息体
 */
export const sendBotForm = (forms, msg) => {
  if (!canSendMessage()) {
    Taro.showToast({
      title: '请等待连线成功后，再发送消息',
      icon: 'none',
      duration: 2000
    })
    return;
  }

  const dispatch = get('store').dispatch;
  let params = _get(msg, 'content.template.params');

  forms.forEach(item => {
    let value = item.type == 'image' ? JSON.stringify(item.value) : item.value;
    let param = item.id + '=' + value;
    params += '&' + param;
  });

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
  };
  dispatch({ type: PUSH_MESSAGE, message });

  return NIM.sendCustomSysMsg({
    cmd: 202,
    params: params,
    template: {
      id: 'qiyu_template_botForm',
      forms
    }
  }).then(res => {
    const newMessage = _cloneDeep(message)
    newMessage.status = 0
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  }).catch(err => {
    const newMessage = _cloneDeep(message)
    newMessage.status = -1
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  });;
};

/**
 *
 * @param {object} item 商品信息
 */
export const sendBotGood = item => {
  if (!canSendMessage()) {
    Taro.showToast({
      title: '请等待连线成功后，再发送消息',
      icon: 'none',
      duration: 2000
    })
    return;
  }

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
    fromUser: 1,
    resendContent: item
  };

  dispatch({ type: PUSH_MESSAGE, message });

  return NIM.sendCustomSysMsg({
    cmd: 202,
    target: item.target,
    params: item.params,
    template: message.content.template
  }).then(res => {
    const newMessage = _cloneDeep(message)
    newMessage.status = 0
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  }).catch(err => {
    const newMessage = _cloneDeep(message)
    newMessage.status = -1
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  });;
};

export const sendTemplateText = item => {
  if (!canSendMessage()) {
    Taro.showToast({
      title: '请等待连线成功后，再发送消息',
      icon: 'none',
      duration: 2000
    })
    return;
  }

  const dispatch = get('store').dispatch;

  const message = {
    type: 'bot',
    content: {
      target: item.target,
      params: item.params,
      template: {
        id: 'qiyu_template_text',
        label: item.label
      }
    },
    time: new Date().getTime(),
    status: 1,
    fromUser: 1
  };
  dispatch({ type: PUSH_MESSAGE, message });

  return NIM.sendCustomSysMsg({
    cmd: 202,
    target: item.target,
    params: item.params,
    template: message.content.template
  }).then(res => {
    const newMessage = _cloneDeep(message)
    newMessage.status = 0
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  }).catch(err => {
    const newMessage = _cloneDeep(message)
    newMessage.status = -1
    dispatch({ type: UPDATE_MESSAGE_BYUUID, message: newMessage });
  });;
};

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
          // console.log('上传image' + (!error ? '成功' : '失败'));
          if (!error) {
            resolve(file);
          } else {
            reject(error);
          }
        }
      });
    });
  });
};

/**
 * 输入联想
 * @param {text} 查询关键词
 */
export const associate = text => {
  const sessionid = get('sessionid');
  return NIM.sendCustomSysMsg({
    cmd: 24,
    sessionid,
    msgType: 'text',
    content: text
  });
};

/**
 * 清空联想
 */
export const emptyAssociate = () => {
  const dispatch = get('store').dispatch;
  dispatch({ type: SET_ASSOCIATE_RES, value: {} });
};

export const applyHumanStaff = () => {
  NIM.applyKefu({
    stafftype: 1
  });
};

// 判断是否能发送消息
export const canSendMessage = () => {
  const session = get('store').getState().Session;
  if(STATUS.status != 'connecting'){
    return false;
  }

  if(session.code == 200 || session.code == 201 || session.code == 203){
    return true;
  }else{
    return false;
  }
}

/**
 * 判断访客是否处于访客分流页面中
 */
export const isShuntEntriesStatus = () => {
  const {shuntEntriesStatus} = get('store').getState().CorpStatus;
  return shuntEntriesStatus;
}


// 访客主动退出会话
export const exitSession = () => {
  const session = get('store').getState().Session;

  let extraParms = {
    sessionid: session.sessionid
  }

  NIM && NIM.exitSession(extraParms)
}

// 发送商品链接
export const sendProductCard = (extraParms) => {
  const dispatch = get('store').dispatch;

  if(extraParms.isShow){
    let message = {
      type: 'product',
      content: {
        ...extraParms
      },
      time: new Date().getTime(),
      status: 0,
      fromUser: 1
    }

    dispatch({ type: PUSH_MESSAGE, message });
  }

  if(!extraParms.sendByUser){
    NIM.sendProductCard(extraParms);
  }
}

// 客服手动发送商品链接
export const sendProductCardByUser = () => {
  const dispatch = get('store').dispatch;

  if(!get('product'))
    return;

  let extraParms = {
    ...get('product')
  };

  let message = {
    type: 'product',
    content: {
      ...extraParms,
      sendByUser: 0,
    },
    time: new Date().getTime(),
    status: 0,
    fromUser: 1
  }

  dispatch({ type: PUSH_MESSAGE, message });
  NIM.sendProductCard({
    ...extraParms,
    auto: 0
  });
}

// 重新发送消息
export const resendMessage = function (item) {
  // 删除当前消息
  const dispatch = get('store').dispatch;
  dispatch({ type: REMOVE_MESSAGE_BYUUID, uuid: item.uuid });

  setTimeout(() => {
    // 1. 重新发送文本消息
    if (item.type === 'text') {
      sendText(item.resendContent)(dispatch)
    }
    // 2. 重新发送图片消息
    if (item.type === 'image') {
      sendImage(item.resendContent)(dispatch)
    }
  }, 300)
}

/**
 * 删除掉人工客服的入口
 */
export const delApplyHumanStaffEntry = () => dispatch => {
  dispatch({
    type: DEL_ENTRY_BYKEY,
    value: 'applyHumanStaff'
  })
}
