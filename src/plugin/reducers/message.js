import { PUSH_MESSAGE,UPDATE_MESSAGE_BYKEY } from '../constants/message';
import eventbus from '../lib/eventbus';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            eventbus.trigger('push_message');
            return [...state, action.message];
        case UPDATE_MESSAGE_BYKEY:
            let message = [...state];
            let ret = message.map(item => {
                if(item.key === action.message.key){
                    return {
                        ...item,...action.message
                    }
                }else{
                    return item;
                }
            })
            return [...ret];
        default: 
            return state;
    }
} 

export default Message;