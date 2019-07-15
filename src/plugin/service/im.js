import NIM from '../vendors/nim/NIM_Web_NIM_weixin_v6.6.6';

export default class IMSERVICE {
    constructor(initer){
        NIM.getInstance({
            appKey: initer.appKey,
            account: initer.account,
            promise: true,
            token: initer.token,
            onconnect: this.onConnect,
            onerror: this.onError,
            ondisconnect: this.onDisconnect
        })
    }

    onConnect(data){
        debugger;
        console.log(data);
    }

    onError(data){
        debugger;
    }

    onDisconnect(data){
        debugger;
    }
}