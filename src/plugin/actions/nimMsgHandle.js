import {get} from '../global_config';
import {PUSH_MESSAGE} from '../constants/message';
import {timestamp2date} from '../utils/date';

/**
 * 分配客服
 */
export const assignKefu = (content) => {
    const dispatch = get('store').dispatch;
    let {code,staffname} = content;

    switch(code){
        case 200:
            let time = new Date().getTime();

            let message = {
                content: `${staffname}为您服务`,
                type: 'systip',
                time: time
            }
            
            let timeTip = {
                content: timestamp2date(time,'HH:mm'),
                type: 'systip',
                time: time
            }

            console.log(timeTip)
            dispatch({type: PUSH_MESSAGE, message: timeTip});
            dispatch({type: PUSH_MESSAGE, message});
        break;
    }
 }


/**
 * 
 * @param {*} msg 
 * 收到普通的消息
 */
export const receiveMsg = (msg) => {
    const dispatch = get('store').dispatch;

    if(msg.type == 'text'){

        let message = {
            "content": msg.text,
            "type": msg.type,
            "time": msg.time,
            "status": msg.status,
            "fromUser": 0
        }
    
        dispatch({type: PUSH_MESSAGE, message});
    }
}