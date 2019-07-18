import {queryAccont} from '../service';
import {get,set} from '../global_config';
import {applyKefu} from '../utils/im';


const applyKefuSuccess = (error,msg) => {
    console.log('hi kefu'+msg);
}

export const createAccount = (param = {}) => dispatch => {

    let appKey = get('appKey');
    if(!appKey) return;

    queryAccont({
        deviceid: 'lusl4x7jhruzecuk6faq',
        appKey: appKey
    }).then(json => {
        let info = json.info;

        info.accid && set('account', info.accid);
        info.bid && set('bid', info.bid);
        info.token && set('token', info.token);

        // 申请客服
        applyKefu(applyKefuSuccess)

    })
}
