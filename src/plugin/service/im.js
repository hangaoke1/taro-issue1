// import NIM from '../vendors/nim/NIM_Web_NIM_weixin_v6.6.6';
import NIM from '../vendors/nim/NIM_Web_NIM_weixin';
import {get} from '../global_config';



export default class IMSERVICE {
    constructor(initer,{onMsg,onCustomsysmsg}){

        this.account = initer.account;
        this.appKey = initer.appKey;
        this.token = initer.token;
        this.contenting = false;

        this.onMsg = onMsg;
        this.onCustomsysmsg = onCustomsysmsg;
    }

    getNim(){
        return new Promise((resolve,reject) => {

            const onConnect = (data) => {
                resolve(nim);
                this.onConnect();
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

    sendHeartbeat(){
        this.nim.sendCustomSysMsg({
            to: -1,
            cc: !0,
            filter: !0,
            scene: 'p2p',
            content: JSON.stringify({
                cmd: -1000,
                deviceid: get('deviceid')
            }),
            done: (error,msg) => {
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
        console.log('----onError----，data:'+ data);
        this.contenting = false;
    }

    onDisconnect(data){
        console.log('----onDisconnect----，data:'+ data);
        this.contenting = false;
    }

}