import { PUSH_MESSAGE } from '../constants/message';
import eventbus from '../lib/eventbus';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            eventbus.trigger('push_message');
            return [...state, action.message];
        default: 
            return state;
    }
} 

export default Message;