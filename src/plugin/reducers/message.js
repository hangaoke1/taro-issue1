import _get from 'lodash/get';
import { PUSH_MESSAGE, UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYINDEX, UPDATE_MESSAGE_BYACTION, UPDATE_MESSAGE_BYUUID,TIME_TIP_DURATION } from '../constants/message';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '../lib/uuid';
import { addUnread } from '@/lib/unread';
import { timestamp2date } from '../utils';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            if (!_get(action, 'message.uuid')) {
                action.message.uuid = genUUID16();
            }
            if (_get(action, 'message.msg.idClient')) {
                action.message.idClient = _get(action, 'message.msg.idClient')
            }
            delete action.message.msg;
            eventbus.trigger('push_message'); // 触发事件

            // 未读消息设置
            addUnread(action.message);


            // 时间的提示按TIME_TIP_DURATION时间段展示
            let prevMessage = [...state], currentMessage = {...action.message};
            currentMessage.time = new Date().getTime();

            if(prevMessage.length){
              if((currentMessage.time - prevMessage[prevMessage.length - 1].time) > TIME_TIP_DURATION){
                let timeTip = {
                  type: 'systip',
                  content: timestamp2date(currentMessage.time,'HH:mm')
                }

                return [...state, timeTip, currentMessage];
              }else{
                return [...state, currentMessage];
              }
            }else{
              let timeTip = {
                type: 'systip',
                content: timestamp2date(new Date().getTime(),'HH:mm')
              }

              return [...state, timeTip, currentMessage];
            }
        case UPDATE_MESSAGE_BYKEY:
            return [...updateMessage(state, action, 'key')];
        case UPDATE_MESSAGE_BYACTION:
            return [...updateMessage(state, action, 'action')];
        case UPDATE_MESSAGE_BYUUID:
                return [...updateMessage(state, action, 'uuid')];
        case UPDATE_MESSAGE_BYINDEX:
            return [...updateMessage(state, action, 'index')];
        default:
            return state;
    }
}

const updateMessage = (state, action, by) => {
    let message = [...state];
    let ret = [];

    if (by === 'index') {
        ret = message.map((item, index) => {
            if(index === action.index){
                return {
                    ...item,...action.message
                }
            }else{
                return item;
            }
        })
    } else {
        ret = message.map(item => {
            if(item[by] && item[by] === action.message[by]) {
                return {
                    ...item,...action.message
                }
            } else {
                return item;
            }
        })
    }

    return ret;
}

export default Message;
