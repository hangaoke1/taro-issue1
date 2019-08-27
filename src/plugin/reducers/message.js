import { PUSH_MESSAGE, UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYINDEX, UPDATE_MESSAGE_BYACTION, UPDATE_MESSAGE_BYUUID } from '../constants/message';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '../lib/uuid';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            eventbus.trigger('push_message');
            if (!action.message.uuid) {
                action.message.uuid = genUUID16();
            }
            return [...state, action.message];
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
