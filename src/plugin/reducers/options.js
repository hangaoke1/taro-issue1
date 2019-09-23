import { TOGGLE_SHOWPORTRAIT, TOGGLE_SHOWFUN, HIDEACTION, SHOW_CHATBOX, HIDE_CHATBOX } from '../constants/options'

export default function options (state = {
  showChatBox: true, // HACK: ios下层级问题
  showPortrait: false,
  showFunc: false,
}, action) {
  let val;
  switch (action.type){
    case SHOW_CHATBOX: {
      return {
        ...state,
        showChatBox: true
      }
    }
    case HIDE_CHATBOX: {
      return {
        ...state,
        showChatBox: false
      }
    }
    case TOGGLE_SHOWPORTRAIT:
      val = !state.showPortrait;
      return {
        ...state,
        showPortrait: val,
        showFunc: false
      }
    case TOGGLE_SHOWFUN:
      val = !state.showFunc;
      return {
        ...state,
        showPortrait: false,
        showFunc: val
      }
    case HIDEACTION:
      return {
        ...state,
        showPortrait: false,
        showFunc: false
      }
    default:
      return state;
  }
}
