import { combineReducers } from 'redux'
import {PUSH_MESSAGE} from '../constants/message';

export const initMessages = [];

export const Message = (state = initMessages, action) => {
    switch(action.type){
        case PUSH_MESSAGE:
            return [...state, action.message];
        default: 
            return state;
    }
} 

export default combineReducers({Message});