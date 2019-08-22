import { PUSH_MESSAGE,UPDATE_MESSAGE_BYKEY,
        UPDATE_MESSAGE_BYACTION } from '../constants/message';
import eventbus from '../lib/eventbus';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            eventbus.trigger('push_message');
            return [...state, action.message];
        case UPDATE_MESSAGE_BYKEY:
            return [...updateMessage(state, action, 'key')];
        case UPDATE_MESSAGE_BYACTION:
            return [...updateMessage(state, action, 'action')];
        default: 
            return state;
    }
}

const updateMessage = (state, action, by) => {
    let message = [...state];
    let ret = message.map(item => {
        if(item[by] && item[by] === action.message[by]){
            return {
                ...item,...action.message
            }
        }else{
            return item;
        }
    })

    return ret;
}

export default Message;