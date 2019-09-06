import Taro from '@tarojs/taro';
import { get } from '../global_config';
import {
  assignKefu,
  receiveMsg,
  onfinish,
  onevaluation,
  onevaluationresult,
  receiveShuntEntries,
  onRobotTip,
  onBotEntry,
  onBotLongMessage,
  onQueueStatus,
  receiveTransfer,
  onReceiveAssociate,
} from '../actions/nimMsgHandle';
import {
  FROM_TYPE,
  SEND_EVALUATION_CMD,
  APPLY_KEFU_CMD,
  ASSIGN_KEFU_CMD,
  FINISH_SESSION_CMD,
  RECEIVE_EVALUATION_CMD,
  RECEIVE_EVALUATION_RESULT_CMD,
  NAVIGATIONBAR_TITLE_CONNECTING,
  NAVIGATIONBAR_TITLE,
  RECEIVE_SHUNT_ENTRIES_CMD,
  REVEIVE_ROBOT_TIP_CMD,
  RECEIVE_BOT_ENTRY_CMD,
  RECEIVE_BOT_LONG_MESSAGE_CMD,
  RECEIVE_BOT_LIST__CMD,
  CANCEL_QUEUE_CMD,
  RECEIVE_QUEUE_NUM_CMD,
  ASK_QUEUE_STATUS_CMD,
  QUEUE_TIMER,
  HEART_BEAT_CMD,
  RECEIVE_TRANSFER_CMD,
  RECEIVE_ASSOCIATE_CMD
} from '../constants';

let contenting = false;

export default class IMSERVICE {
  constructor(initer) {
    this.appKey = initer.appKey;
    this.account = initer.account;
    this.token = initer.token;
  }

  static getInstance(initer) {
    if (!this.instance) {
      this.instance = new IMSERVICE(initer);
    }
    return this.instance;
  }

  getNim() {
    return new Promise(resolve => {
      // 获取最新的云信包
      const NIM = get('NIM');

      const onConnect = msg => {
        resolve(nim);
        this.onConnect(msg);
      };

      const nim = (this.nim = NIM.getInstance({
        appKey: this.appKey,
        account: this.account,
        promise: true,
        token: this.token,
        onconnect: onConnect,
        ondisconnect: this.onDisconnect,
        onerror: this.onError,
        onmsg: this.onMsg.bind(this),
        oncustomsysmsg: this.onCustomSysMsg.bind(this),
        onofflinemsgs: this.onOfflineMsgs.bind(this),
        onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs.bind(this)
      }));

      if (contenting) {
        resolve(nim);
      }
    });
  }

  /**
   * 发送自定义消息
   * @param {obj} content
   * @param {number} to
   * @param {} done
   */
  sendCustomSysMsg(content, to = -1) {
    return new Promise((resolve, reject) => {
      this.getNim().then(nim => {
        nim.sendCustomSysMsg({
          to: to,
          cc: !0,
          filter: !0,
          scene: 'p2p',
          content: JSON.stringify(content),
          done: (error, msg) => {
            if (error) {
              reject(error);
            } else {
              resolve(error, msg);
            }
          }
        });
      });
    });
  }

  /**
   * 发送文本消息
   * @param {text} value
   * @param {number} to
   */
  sendTextMsg(value, to = -1) {
    return new Promise((resolve, reject) => {
      this.getNim()
        .then(nim => {
          nim.sendText({
            scene: 'p2p',
            to: to,
            text: value,
            done: (error, msg) => {
              if (error) {
                reject(error);
              } else {
                resolve(msg);
              }
            }
          });
        })
        .catch(reject);
    });
  }

  /**
   * 发送图片消息
   * @param {string} tempFilePath 微信图片临时路径
   * @param {number} to 标志发送方
   * @return {promise<>}
   */
  sendImageMsg(tempFilePath, to = -1) {
    return new Promise((resolve, reject) => {
      this.getNim()
        .then(nim => {
          nim.sendFile({
            type: 'image',
            scene: 'p2p',
            to: to,
            wxFilePath: tempFilePath,
            done: (error, msg) => {
              if (error) {
                reject(error);
              } else {
                resolve(msg);
              }
            }
          });
        })
        .catch(reject);
    });
  }

  /**
   * 申请分配客服
   * @param {number} stafftype 0:申请客服，不管是机器人还是人工客服；1：只申请人工客服；
   */
  applyKefu(
    extraParams = {
      stafftype: 0
    }
  ) {
    return new Promise((resolve, reject) => {
      // 申请客服的时候导航栏控制
      Taro.showNavigationBarLoading();
      Taro.setNavigationBarTitle({
        title: NAVIGATIONBAR_TITLE_CONNECTING
      });

      let content = {
        cmd: APPLY_KEFU_CMD,
        deviceid: get('deviceid'),
        foreignid: '',
        fromType: FROM_TYPE,
        version: 64,
        // version: 8,
        ...extraParams
      };

      this.sendCustomSysMsg(content)
        .then( msg => {
          resolve(msg);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 访客发送评价
   * @param {*} extraParams
   */
  sendEvaluation(extraParams) {
    return new Promise((resolve, reject) => {
      let content = {
        cmd: SEND_EVALUATION_CMD,
        fromType: FROM_TYPE,
        ...extraParams
      };

      this.sendCustomSysMsg(content)
        .then(msg => {
          resolve(msg);
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  /**
   * 访客主动取消排队
   * @param {*} extraParams
   */
  cancelQueue(extraParams) {
    return new Promise((resolve, reject) => {
      let content = {
        cmd: CANCEL_QUEUE_CMD,
        ...extraParams
      };

      this.sendCustomSysMsg(content)
        .then(msg => {
          resolve(msg);
        })
        .catch(error => {
          reject(error);
        });

    })
  }

  /**
   * 客户端告知服务器消息状态变更
   * @param {number} status 推送消息状态 1: 收到消息 2: 已读
   * @param {array} ids     消息会话Id列表
   */
  sendPushMsgStatus(status, ids) {
    ids = Array.isArray(ids) ? ids : [ids];
    for(let i = 0; i < ids.length; i++) {
      this.sendCustomSysMsg({
        cmd: 135,
        status,
        msgidClient
      });
    }
  }

  // 清除未读消息
  clearUnreadMsg() {
    const sessionid = get('sessionid');
    this.sendCustomSysMsg({
      cmd: 500,
      sessionid
    });
  }

  /**
   *
   * @param {*} msg
   * 收到普通文本消息
   */
  onMsg(msg) {
    receiveMsg(msg);
    
    // 当接收到普通消息时，标记已读状态
    this.clearUnreadMsg();
  }

  /**
   *
   * @param {*} msg
   * 收到系统自定义消息
   */
  onCustomSysMsg(msg) {
    try {
      let content = JSON.parse(msg.content);
      console.log('fmt: ', content);

      switch (content.cmd) {
        case ASSIGN_KEFU_CMD:
          // 申请客服成功后的导航栏控制
          Taro.hideNavigationBarLoading();
          Taro.setNavigationBarTitle({
            title: NAVIGATIONBAR_TITLE
          })
          assignKefu(content);
          if (content.code == 203) {
            console.log('queuqe', this);
            this.askQueueStatus();
          }
          break;
        case FINISH_SESSION_CMD:
          onfinish(content);
          break;
        case RECEIVE_EVALUATION_CMD:
          onevaluation(content);
          break;
        case RECEIVE_EVALUATION_RESULT_CMD:
          onevaluationresult(content);
          break;
        case REVEIVE_ROBOT_TIP_CMD:
          // 接收到机器人提示
          onRobotTip(content);
          break;
        case RECEIVE_SHUNT_ENTRIES_CMD:
          // 申请客服成功后的导航栏控制
          Taro.hideNavigationBarLoading();
          Taro.setNavigationBarTitle({
            title: NAVIGATIONBAR_TITLE
          });
          receiveShuntEntries(content);
          break;
        case RECEIVE_BOT_ENTRY_CMD:
          // 接收到bot推送入口
          onBotEntry(content);
          break;
        case RECEIVE_BOT_LONG_MESSAGE_CMD:
          // bot超长信息处理
          onBotLongMessage(content, msg);
          break;
        case RECEIVE_BOT_LIST__CMD:
          // BOT列表加载更多
          receiveMsg(msg);
          break;
        case RECEIVE_ASSOCIATE_CMD:
          onReceiveAssociate(content, msg);
          break;
        case RECEIVE_QUEUE_NUM_CMD:
          if (content.code == 200) {
            onQueueStatus(content);
          } else {
            this.clearQueueTimer();
          }
          break;
        default:
          console.log('oncustomsysmsg 未知指令' + JSON.stringify(msg));
          break;
      }
      
      this.clearUnreadMsg();
    } catch (e) { }
  }

  onOfflineMsgs(msg) {
    console.log('-------接收离线消息 onofflinemsgs-------')
  }
  
  onOfflineCustomSysMsgs(msg) {
    console.log('-------接收离线消息 onofflinecustomsysmsgs-------')
  }

  /**
   * 发送心跳
   */
  sendHeartbeat = () => {

    let content = {
      cmd: HEART_BEAT_CMD,
      deviceid: get('deviceid')
    }
    this.sendCustomSysMsg(content);

    setTimeout(this.sendHeartbeat.bind(this), get('heartbeatCycle'));
  };

  /**
   * 轮询的方式询问排队的状态
   */
  askQueueStatus = (extraParams = {
    deviceid: get('deviceid')
  }) => {
    this.queueTimer = setInterval(() => {
      return new Promise((resolve, reject) => {
        let content = {
          cmd: ASK_QUEUE_STATUS_CMD,
          ...extraParams
        };

        this.sendCustomSysMsg(content)
          .then(msg => {
            resolve(msg);
          })
          .catch(error => {
            reject(error);
          });
      })
    }, QUEUE_TIMER);
  };

  clearQueueTimer = () => {
    if (!this.queueTimer)
      return;
    clearInterval(this.queueTimer);
  }

  onConnect(data) {
    console.log('----onConnect----，data:' + data);
    contenting = true;
    // 连接成功后发送访客心跳
    this.sendHeartbeat();
  }

  onError(data) {
    contenting = false;
    console.log('----onError----，data:' + data);
  }

  onDisconnect(data) {
    contenting = false;
    console.log('----onDisconnect----，data:' + data);
  }
}
