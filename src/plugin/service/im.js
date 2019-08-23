import Taro from '@tarojs/taro'
import { get } from '../global_config';
import { assignKefu, receiveMsg, onfinish, onevaluation,onevaluationresult,
        receiveShuntEntries } from '../actions/nimMsgHandle';
import { FROM_TYPE, SEND_EVALUATION_CMD, APPLY_KEFU_CMD,
        ASSIGN_KEFU_CMD,FINISH_SESSION_CMD,RECEIVE_EVALUATION_CMD,
        RECEIVE_EVALUATION_RESULT_CMD,NAVIGATIONBAR_TITLE_CONNECTING,
        NAVIGATIONBAR_TITLE,RECEIVE_SHUNT_ENTRIES_CMD } from '../constants';

let contenting = false;

export default class IMSERVICE {
    constructor(initer){
        this.appKey = initer.appKey;
        this.account = initer.account;
        this.token = initer.token;
    }

    getNim(){
        return new Promise((resolve) => {

            // 获取最新的云信包
            const NIM  = get('NIM');

            const onConnect = (msg) => {
                resolve(nim);
                this.onConnect(msg);
            }

            const nim = this.nim = NIM.getInstance({
                appKey: this.appKey,
                account: this.account,
                promise: true,
                token: this.token,
                onconnect: onConnect,
                ondisconnect: this.onDisconnect,
                onerror: this.onError,
                onmsg: this.onMsg,
                oncustomsysmsg: this.onCustomsysmsg
            });

            if(contenting){
                resolve(nim);
            }
        })
    }

    /**
     * 发送自定义消息
     * @param {obj} content
     * @param {number} to
     * @param {} done
     */
    sendCustomSysMsg(
        content,
        to = -1
    ){
        return new Promise((resolve,reject) => {
            this.getNim().then((nim) => {
                nim.sendCustomSysMsg({
                    to: to,
                    cc: !0,
                    filter: !0,
                    scene: 'p2p',
                    content: JSON.stringify(content),
                    done: (error,msg) => {
                        if(error){
                            console.log(content.cmd+'--error!');
                            reject(error);
                        }else{
                            console.log(content.cmd+'--success!')
                            resolve(error,msg);
                        }
                    }
                })
            })
        })
    }


    /**
     * 发送文本消息
     * @param {text} value
     * @param {number} to
     */
    sendTextMsg(
        value,
        to = -1
    ) {
        return new Promise((resolve,reject) => {
            this.getNim().then(nim => {
                nim.sendText({
                    scene: 'p2p',
                    to: to,
                    text: value,
                    done: (error,msg) => {
                        if(error){
                            reject(error);
                        }else{
                            resolve(msg);
                        }
                    }
                })
            }).catch(reject)
        })
    }

    /**
     * 发送图片消息
     * @param {string} tempFilePath 微信图片临时路径
     * @param {number} to 标志发送方
     * @return {promise<>}
     */
    sendImageMsg (tempFilePath, to = -1) {
        return new Promise((resolve, reject) => {
            this.getNim().then(nim => {
                nim.sendFile({
                    type: 'image',
                    scene: 'p2p',
                    to: to,
                    wxFilePath: tempFilePath,
                    done: (error, msg) => {
                        if(error){
                            reject(error);
                        }else{
                            resolve(msg);
                        }
                    }
                })
            }).catch(reject)
        })
    }

    /**
     * 申请分配客服
     * @param {number} stafftype 0:申请客服，不管是机器人还是人工客服；1：只申请人工客服；
     */
    applyKefu(extraParms = {
      stafftype: 0
    }){
        return new Promise((resolve, reject) => {

            // 申请客服的时候导航栏控制
            Taro.showNavigationBarLoading();
            Taro.setNavigationBarTitle({
                title: NAVIGATIONBAR_TITLE_CONNECTING
            })

            let content = {
                cmd: APPLY_KEFU_CMD,
                deviceid: get('deviceid'),
                fromType: FROM_TYPE,
               ...extraParms
            }

            this.sendCustomSysMsg(content)
            .then((msg) => {
                resolve(msg);
            })
            .catch(error => {
                reject(error);
            })
        })
    }

    /**
     * 访客发送评价
     * @param {*} data
     */
    sendEvaluation(data){
        return new Promise((resolve, reject) => {

            let content = {
                cmd: SEND_EVALUATION_CMD,
                fromType: FROM_TYPE,
                ...data
            }

            this.sendCustomSysMsg(content)
            .then(msg => {
                resolve(msg);
            }).catch(error => {
                reject(error);
            })
        })
    }

    /**
     *
     * @param {*} msg
     * 收到普通文本消息
     */
    onMsg(msg){
        console.log('---onMsg---', msg)
        receiveMsg(msg);
    }

    /**
     *
     * @param {*} msg
     * 收到系统自定义消息
     */
    onCustomsysmsg(msg){
        console.log('---onCustomsysmsg---', msg)
        try{
            let content = JSON.parse(msg.content);

            switch (content.cmd){
                case ASSIGN_KEFU_CMD:
                    // 申请客服成功后的导航栏控制
                    Taro.hideNavigationBarLoading();
                    Taro.setNavigationBarTitle({
                        title: NAVIGATIONBAR_TITLE
                    })
                    assignKefu(content);
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
                case RECEIVE_SHUNT_ENTRIES_CMD:
                    // 申请客服成功后的导航栏控制
                    Taro.hideNavigationBarLoading();
                    Taro.setNavigationBarTitle({
                        title: NAVIGATIONBAR_TITLE
                    })
                    receiveShuntEntries(content);
                    break;
                default:
                    console.log('onCustomsysmsg 未知指令'+JSON.stringify(msg))
                    break;
            }

        }catch(e){}
    }


    /**
     * 发送心跳
     */
    sendHeartbeat = () => {
        this.nim.sendCustomSysMsg({
            to: -1,
            cc: !0,
            filter: !0,
            scene: 'p2p',
            content: JSON.stringify({
                cmd: -1000,
                deviceid: get('deviceid')
            }),
            done: (error) => {
                if(error){
                    console.log('sendHeartbeat--error!');
                }else{
                    console.log('sendHeartbeat--success!')
                }
            }
        })

        setTimeout(this.sendHeartbeat.bind(this), get('heartbeatCycle'))
    }

    onConnect(data){
        console.log('----onConnect----，data:'+ data);
        contenting = true;
        // 连接成功后发送访客心跳
        this.sendHeartbeat();
    }

    onError(data){
        contenting = false;
        console.log('----onError----，data:'+ data);
    }

    onDisconnect(data){
        contenting = false;
        console.log('----onDisconnect----，data:'+ data);
    }

}
