import Taro from '@tarojs/taro';
import { INIT_SESSION, SET_SESSION_CODE,UPDATE_SESSION, UPDATE_READ_TIME } from '../constants/session';
import { set } from '../global_config';
const initSession = {
  readTime: Taro.getStorageSync('SERVICE_LAST_READ_TIME') || Date.now()
};

const Session = (state = initSession, action) => {
  switch (action.type) {
    case INIT_SESSION:
      let isRobot = action.session.stafftype === 1 || action.session.robotInQueue === 1;
      let isKefuOnline = action.session.stafftype === 0 && action.session.code === 200;
      set('isKefuOnline', isKefuOnline)
      set('isRobot', isRobot);
      set('sessionid', action.session.sessionid);
      return { ...state, ...action.session };
    case SET_SESSION_CODE:
      return {
        ...state,
        code : action.value
      }
    case UPDATE_SESSION:
      let newSession = {
        ...state, ...action.value
      }
      set('sessionid', newSession.sessionid);
      return newSession
    case UPDATE_READ_TIME:
      return {
        ...state,
        readTime : action.value
      }
    default:
      return state;
  }
}

export default Session;
