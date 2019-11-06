import _get from 'lodash/get';
import { SET_SETTING } from '../constants/setting';

// 访客端配置
const Setting = (state = {
  setting:{},
  themeColor: '',
  themeBg: '',
  themeText: '',
  themeBorder: '',
  themeButton: '',
  themeTextButton: ''
}, action) => {
  switch(action.type){
    case SET_SETTING:
      const themeColor = _get(action.value, 'dialogColor') || '#337EFF';
      const themeBg = `background-color:${themeColor};`;
      const themeText = `color:${themeColor};`;
      const themeBorder = `border:1px solid ${themeColor};`;
      const themeButton = `background-color:${themeColor};color:#fff;` + themeBorder;
      const themeTextButton = `color:${themeColor};` + themeBorder;
      return {
        ...state,
        setting: action.value,
        themeColor,
        themeBg,
        themeButton,
        themeTextButton,
        themeText,
        themeBorder
      }
    default:
      return state;
  }
}


export default Setting;
