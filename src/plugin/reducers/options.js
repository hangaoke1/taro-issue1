import { TOGGLE_SHOWPORTRAIT, TOGGLE_SHOWFUN, HIDEACTION } from '../constants/options'

export default function options (state = {
  showPortrait: false,
  showFunc: false,
}, action) {
  let val;
  switch (action.type){
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
