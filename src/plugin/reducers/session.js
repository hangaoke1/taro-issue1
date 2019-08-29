import {INIT_SESSION} from '../constants/session';
import { set } from '../global_config';
const initSession = {};

const Session = (state = initSession, action) => {
    switch(action.type){
        case INIT_SESSION:
            let isRobot = action.session.stafftype === 1 || action.session.robotInQueue ===  1;
            set('isRobot', isRobot);
            return {...state, ...action.session};
        default:
            return state;
    }
}

export default Session;
