import {INIT_SESSION} from '../constants/session';

const initSession = {};

const Session = (state = initSession, action) => {
    switch(action.type){
        case INIT_SESSION:
            return {...state, ...action.session};
        default:
            return state;
    }
}

export default Session;
