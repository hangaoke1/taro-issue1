import Taro from '@tarojs/taro';
import { get, set } from '../global_config';
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
  queueFail,
  receiveEvaluationShowEntry
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
  RECEIVE_ASSOCIATE_CMD,
  UPDATE_CRM_CMD,
  EXIT_SESSION_CMD,
  SEND_PRODUCT_CARD_CMD,
  RECEIVE_SHOW_EVALUATION_ENTRY,
  WILL_RECONNECT_TITLE
} from '../constants';
import { getCurrentUrl } from '@/lib/unread';

export const STATUS = {
  status: 'init'
};

let heartbeatTimer = null, nimInstance = null;

export default class IMSERVICE {
  constructor(initer) {
    this.appKey = initer.appKey;
    this.account = initer.account;
    this.token = initer.token;
    STATUS.status = 'init';
  }

  static getInstance(initer) {
    if (!this.instance) {
      this.instance = new IMSERVICE(initer);
    } else {
      if (
        initer.appKey != this.instance.appKey ||
        initer.account != this.instance.account ||
        initer.token != this.instance.token
      ) {
        // STATUS.status = 'disconnect';
        this.instance = new IMSERVICE(initer);
        // this.instance.getNim().then(nim => {
        //   nim.destroy({
        //     done: () => {
        //       console.log('destroy really done!');
        //     }
        //   });
        // });
      }
    }

    return this.instance;
  }

  getNim() {
    return new Promise(resolve => {
      // 获取最新的云信包
      const NIM = get('NIM');
      let timer = null;

      const onConnect = msg => {
        timer && clearTimeout(timer);
        this.onConnect(msg);
        Taro.hideNavigationBarLoading();
        Taro.setNavigationBarTitle({
          title: get('title')
        });
        resolve(nimInstance);
      };

      if (STATUS.status == 'connecting') {
        timer && clearTimeout(timer);
        resolve(nimInstance);
      }

      nimInstance = NIM.getInstance({
        appKey: get('appKey'),
        account: get('account'),
        token: get('token'),
        onconnect: onConnect,
        ondisconnect: this.onDisconnect.bind(this),
        onerror: this.onError.bind(this),
        onwillreconnect: this.onWillreconnect.bind(this),
        onmsg: this.onMsg.bind(this),
        oncustomsysmsg: this.onCustomSysMsg.bind(this),
        onofflinefiltermsgs: this.onofflinefiltermsgs.bind(this),
        // onofflinemsgs: this.onOfflineMsgs.bind(this),
        // onofflinecustomsysmsgs: this.onOfflineCustomSysMsgs.bind(this),
        // onroamingmsgs: this.onRoamingMsgs.bind(this),
        // onroamingsysmsgs: this.onRoamingSysMsgs.bind(this),
        syncFilter: true,
        syncRoamingMsgs: true,
        // needReconnect: false
      });

      // 5秒后自动resolve
      timer = setTimeout(function () {
        resolve(nimInstance);
      }, 5000)
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
              STATUS.status = 'error';
              console.log('sendCustomSysMsg error', error);
              // setTimeout(this.sendCustomSysMsg.bind(this, content), 1000);
              reject(error);
            } else {
              STATUS.status = 'connecting';
              console.log('sendCustomSysMsg success', content);
              resolve(error, msg);
            }
          }
        });
      }).catch(error => {
        console.log('getNim error', error)
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
      let sendAction = () => {
        this.getNim()
          .then(nim => {
            nim.sendText({
              scene: 'p2p',
              to: to,
              text: value,
              done: (error, msg) => {
                if (error) {
                  STATUS.status = 'error';
                  console.log('sendTextMsg error', error);
                  // setTimeout(sendAction.bind(this, value), 1000);
                  // reject(error);
                } else {
                  STATUS.status = 'connecting';
                  console.log('sendTextMsg success', error);
                  resolve(msg);
                }
              }
            });
          })
          .catch(reject);
      }

      sendAction();
      setTimeout(() => {
        reject('发送超时');
      }, 5000)
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
            beforesend: function(msg) {},
            uploadprogress: function(obj) {},
            uploaddone: function(error, file) {},
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
   * 发送语音消息
   * @param {string} tempFilePath 微信图片临时路径
   * @param {number} to 标志发送方
   * @return {promise<>}
   */
  sendVoiceMsg(tempFilePath, to = -1) {
    return new Promise((resolve, reject) => {
      this.getNim()
        .then(nim => {
          nim.sendFile({
            type: 'audio',
            scene: 'p2p',
            to: to,
            wxFilePath: tempFilePath,
            beforesend: function(msg) {},
            uploadprogress: function(obj) {},
            uploaddone: function(error, file) {},
            done: (error, msg) => {
              if (error) {
                reject(error);
              } else {
                const mp3Url = nim.audioToMp3({
                  url: msg.file.url
                });
                console.log('aaaaaaa', mp3Url)
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

      // 如果转人工参数不存在，则清除
      if (extraParams.transferRgType === '' || extraParams.transferRgType === undefined) {
        delete extraParams.transferRgType
      }

      // 申请客服的时候导航栏控制
      Taro.showNavigationBarLoading();
      Taro.setNavigationBarTitle({
        title: NAVIGATIONBAR_TITLE_CONNECTING
      });

      let content = {
        cmd: APPLY_KEFU_CMD,
        deviceid: get('foreignid') ? get('foreignid') : get('deviceid'),
        foreignid: get('foreignid'),
        fromType: FROM_TYPE,
        level: get('level'),
        bundleid: get('bundleid') || Taro.getAccountInfoSync().miniProgram.appId,
        version: 65,
        staffid: get('staffid'),
        groupid: get('groupid'),
        ...extraParams
      };

      console.log('start apply staff', content);
      this.sendCustomSysMsg(content)
        .then(msg => {
          console.log('start apply staff success', msg);
          this.updateCrmInfo();
          resolve(msg);
        })
        .catch(error => {
          console.log('start apply staff error', error);
          reject(error);
        });
    });
  }

  /**
   * 访客主动结束会话
   * @param {*} extraParams
   */
  exitSession(
    extraParams = {
      sessionid: ''
    }
  ) {
    return new Promise((resolve, reject) => {
      let content = {
        cmd: EXIT_SESSION_CMD,
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
   * 同步轻量crm
   * @param {*} extraParams
   */
  updateCrmInfo(
    extraParams = {
      authToken: ''
    }
  ) {
    if (!get('userInfo')) return;
    let content = {
      cmd: UPDATE_CRM_CMD,
      foreignid: get('foreignid'),
      userinfo: JSON.stringify(get('userInfo').data),
      ...extraParams
    };

    this.sendCustomSysMsg(content);
  }

  /**
   * 发送商品卡片信息
   * @param {*} extraParams
   */
  sendProductCard(
    extraParams = {
      tags: [],
      title: ''
    }
  ) {
    return new Promise((resolve, reject) => {
      if (!get('product')) return;
      let content = {
        cmd: SEND_PRODUCT_CARD_CMD,
        ...extraParams
      };

      this.sendCustomSysMsg(content)
        .then(msg => {
          // 发送成功后清除商品信息，只发一次
          if (get('product')) {
            set('product', null);
          }
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
          this.clearQueueTimer();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 客户端告知服务器消息状态变更
   * @param {number} status 推送消息状态 1: 收到消息 2: 已读
   * @param {array} ids     消息会话Id列表
   */
  sendPushMsgStatus(status, ids) {
    ids = Array.isArray(ids) ? ids : [ids];
    for (let i = 0; i < ids.length; i++) {
      this.sendCustomSysMsg({
        cmd: 135,
        status,
        msgidClient
      });
    }
  }

  // 清除未读消息
  clearUnreadMsg() {
    const url = getCurrentUrl();
    if (url.indexOf('pages/chat/chat') > -1) {
      // 如果在聊天页面则同步服务器清空未读数
      const sessionid = get('sessionid');
      this.sendCustomSysMsg({
        cmd: 500,
        sessionid
      });
    } else {
    }
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
            title: get('title')
          });
          console.log('apply staff success', content);
          assignKefu(content);
          this.clearQueueTimer();
          if (content.code == 203) {
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
            title: get('title')
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
          } else if (content.code == 302 || content.code == 303) {
            queueFail(content);
            this.clearQueueTimer();
          } else {
            console.log('queue code 异常');
            this.clearQueueTimer();
          }
          break;
        case RECEIVE_SHOW_EVALUATION_ENTRY:
          receiveEvaluationShowEntry(content);
          break;
        default:
          console.log('oncustomsysmsg 未知指令' + JSON.stringify(msg));
          break;
      }

      // 清空未读消息
      this.clearUnreadMsg();
    } catch (e) { }
  }

  // 七鱼定制离线消息处理
  onofflinefiltermsgs(msgs) {
    msgs.forEach(msg => {
      receiveMsg(msg);
    });
  }

  /**
   * 发送心跳
   */
  sendHeartbeat = () => {
    let content = {
      cmd: HEART_BEAT_CMD,
      deviceid: get('deviceid')
    };

    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }

    heartbeatTimer = setInterval(this.sendCustomSysMsg.bind(this, content), get('heartbeatCycle'));
  };

  /**
   * 轮询的方式询问排队的状态
   */
  askQueueStatus = (
    extraParams = {
      deviceid: get('deviceid')
    }
  ) => {
    if (this.queueTimer)
      clearInterval(this.queueTimer);

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
      });
    }, QUEUE_TIMER);
  };

  clearQueueTimer = () => {
    if (!this.queueTimer) return;
    clearInterval(this.queueTimer);
  };

  onConnect(data) {
    console.log('----onConnect----，data:' + data);
    STATUS.status = 'connecting';
    // 连接成功后发送访客心跳
    this.sendHeartbeat();
  }

  onWillreconnect(options) {
    console.log('onWillreconnect', options);
    STATUS.status = 'disconnect';
    Taro.showNavigationBarLoading();
    Taro.setNavigationBarTitle({
      title: WILL_RECONNECT_TITLE
    });
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
  }

  onError(data) {
    STATUS.status = 'error';
    nimInstance.disconnect()
    nimInstance.connect()
    console.log('----onError----，data:' + data);
  }

  onDisconnect(data) {
    STATUS.status = 'disconnect';
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    console.log('----onDisconnect----，data:' + data);
  }
}
