import { INIT_SESSION, SET_SESSION_CODE } from '../constants/session';
import { set } from '../global_config';
const initSession = {};

const Session = (state = initSession, action) => {
  switch (action.type) {
    case INIT_SESSION:
      let isRobot = action.session.stafftype === 1 || action.session.robotInQueue === 1;
      set('isRobot', isRobot);
      set('sessionid', action.session.sessionid);
      return { ...state, ...action.session };
    case SET_SESSION_CODE:
      return {
        ...state,
        code : action.value
      }
    default:
      return state;
  }
}

export default Session;
