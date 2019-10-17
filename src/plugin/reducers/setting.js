import { SET_SETTING } from '../constants/setting';

// 访客端配置
const Setting = (state = {
  setting:{}
}, action) => {
  switch(action.type){
    case SET_SETTING:
      return {
        ...state,
        setting: action.value
      }
    default:
      return state;
  }
}


export default Setting;
