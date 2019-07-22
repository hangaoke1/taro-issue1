import IMSERVICE from '../service/im';
import{get} from '../global_config';
import {assignKefu,receiveMsg} from '../actions/nimMsgHandle';

let imService = null;

/**
 * 
 * @param {*} msg 
 * 收到普通文本消息
 */
const onMsg = (msg) => {
    receiveMsg(msg);
}

/**
 * 
 * @param {*} msg 
 * 收到系统自定义消息
 */
const onCustomsysmsg = (msg) => {
    try{
        let content = JSON.parse(msg.content);

        switch (content.cmd){
            case 2: 
                assignKefu(content);
                break;
            default:
                console.log('未知指令'+JSON.stringify(msg))
                break;
        }

    }catch(e){}
}

const sendCustomSysMsg = ({
    content,
    to = -1,
    done
}) => {
    imService.getNim().then(nim => {
        nim.sendCustomSysMsg({
            to: to,
            cc: !0,
            filter: !0,
            scene: 'p2p',
            content: JSON.stringify(content),
            done: (error,msg) => {
                if(error){
                    console.log(content.cmd+'--error!');
                }else{
                    console.log(content.cmd+'--success!')
                }
                done(error,msg);
            }
        })
    })
}

/**
 * 申请客服
 */
export const applyKefu = (done) => {

    const appKey = get('appKey');
    const account = get('account');
    const token = get('token');
    
    imService = new IMSERVICE({
        appKey: appKey,
        account: account,
        promise: true,
        token: token
    },{
        onMsg,
        onCustomsysmsg
    });

    let content = {
        cmd: 1,
        deviceid: 'lusl4x7jhruzecuk6faq',
        fromType: 'wx_ma'
    }

    sendCustomSysMsg({
        content,
        done
    })
}

/**
 * 发送普通消息
 * 
 */
export const sendTextMsg = (value) => {
    imService.getNim().then((nim) => {
        nim.sendText({
            scene: 'p2p',
            to: -1,
            text: value
        })
    }).catch(json => {
        debugger;
    })
} 