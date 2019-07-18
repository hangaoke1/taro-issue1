// import NIM from '../vendors/nim/NIM_Web_NIM_weixin_v6.6.6';
import NIM from '../vendors/nim/NIM_Web_NIM_weixin';



export default class IMSERVICE {
    constructor(initer){

        this.account = initer.account;
        this.appKey = initer.appKey;
        this.token = initer.token;

        this.connecting = false;
    }

    getNim(){
        return new Promise((resolve,reject) => {

            const onConnect = (data) => {
                resolve(nim);
                this.onConnect();
            }

            const nim = NIM.getInstance({
                appKey: this.appKey,
                account: this.account,
                promise: true,
                token: this.token,
                onconnect: onConnect,
                ondisconnect: this.onDisconnect,
                onerror: this.onError
            });
        })
    }

    onConnect(data){
        console.log('----onConnect----，data:'+ data);
        this.connecting = true;
    }

    onError(data){
        console.log('----onError----，data:'+ data);
        this.connecting = false;
    }

    onDisconnect(data){
        console.log('----onDisconnect----，data:'+ data);
        this.connecting = false;
    }
}