import { get } from '../global_config';
import { assignKefu, receiveMsg, onfinish, onevaluation } from '../actions/nimMsgHandle';

export default class IMSERVICE {
    constructor(initer){
        this.appKey = initer.appKey;
        this.account = initer.account;
        this.token = initer.token;
        this.contenting = false;
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

            if(this.contenting){
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
     */
    applyKefu(){
        return new Promise((resolve, reject) => {

            let content = {
                cmd: 1,
                deviceid: get('deviceid'),
                fromType: 'WEB'
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
                case 2: 
                    assignKefu(content);
                    break;
                case 6:
                    onfinish(content);
                    break;
                case 50:
                    onevaluation(content);
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
        this.contenting = true;
        // 连接成功后发送访客心跳
        this.sendHeartbeat();
    }

    onError(data){
        this.contenting = false;
        console.log('----onError----，data:'+ data);
    }

    onDisconnect(data){
        this.contenting = false;
        console.log('----onDisconnect----，data:'+ data);
    }

}