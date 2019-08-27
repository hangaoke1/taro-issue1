import { SET_BOT_LIST } from '../constants/bot';

const Bot = (state = {
  botList: []
}, action) => {
  switch(action.type){
    case SET_BOT_LIST:
      return {
        ...state,
        botList: action.value
      }
    default:
      return state;
  }
}


export default Bot;