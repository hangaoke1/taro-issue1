import IMSERVICE from '../service/im';
import{get} from '../global_config';



const sendCustomSysMsg = ({
    content,
    to = -1,
    done
}) => {
    const appKey = get('appKey');
    const account = get('account');
    const token = get('token');
    
    let imService = new IMSERVICE({
        appKey: appKey,
        account: account,
        promise: true,
        token: token
    });

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

    let content = {
        cmd: 1,
        deviceid: 'lusl4x7jhruzecuk6faq'
    }

    sendCustomSysMsg({
        content,
        done
    })
}