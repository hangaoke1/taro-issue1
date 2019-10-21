import { SET_BOT_LIST } from '../constants/bot';

const Bot = (state = {
  botList: [],
  len: 0
}, action) => {
  switch(action.type){
    case SET_BOT_LIST:
      return {
        ...state,
        botList: action.value,
        len: action.len
      }
    default:
      return state;
  }
}


export default Bot;
