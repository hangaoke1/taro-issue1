import { combineReducers } from 'redux'
import {INIT_SESSION} from '../constants/session';

const initSession = {};

export const Session = (state = initSession, action) => {
    switch(action.type){
        case INIT_SESSION:
            return {...state, ...action.session};
        default:
            return state;
    }
}

export default combineReducers({Session});