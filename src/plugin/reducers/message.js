import { PUSH_MESSAGE } from '../constants/message';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            return [...state, action.message];
        default: 
            return state;
    }
} 

export default Message;