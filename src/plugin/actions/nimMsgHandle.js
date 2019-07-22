import {get} from '../global_config';
import {PUSH_MESSAGE} from '../constants/message';

const namespace = 'MESSAGE';

/**
 * 分配客服
 */
export const assignKefu = (content) => {
    console.log('分配客服')
 }


/**
 * 
 * @param {*} msg 
 * 收到普通的消息
 */
export const receiveMsg = (msg) => {
    const dispatch = get('store').dispatch;

    let message = {
        "content": msg.text,
        "type": msg.type,
        "time": msg.time,
        "status": msg.status,
        "fromUser": 0
    }

    dispatch({type: PUSH_MESSAGE, message});
    console.log(msg);
    
}