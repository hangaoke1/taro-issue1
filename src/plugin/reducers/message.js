import { PUSH_MESSAGE, UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYINDEX } from '../constants/message';
import eventbus from '../lib/eventbus';

const initMessages = [];

const Message = (state = initMessages, action) => {
    let message;
    let ret;
    switch(action.type){
        case PUSH_MESSAGE:
            eventbus.trigger('push_message');
            return [...state, action.message];
        case UPDATE_MESSAGE_BYKEY:
            message = [...state];
            ret = message.map(item => {
                if(item.key === action.message.key){
                    return {
                        ...item,...action.message
                    }
                }else{
                    return item;
                }
            })
            return [...ret];
        case UPDATE_MESSAGE_BYINDEX:
            message = [...state];
            ret = message.map((item, index) => {
                if(index === action.index){
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