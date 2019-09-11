import { SET_EVALUATION_VISIBLE } from '../constants/chat';
import { SET_ENTRY_CONFIG } from '../constants/chat';


const CorpStatus = (state = {
  evaluationVisible: false,
  entryConfig: []
}, action) => {
  switch (action.type) {
    case SET_EVALUATION_VISIBLE:
      return {
        ...state,
        evaluationVisible: action.value
      }
    case SET_ENTRY_CONFIG:
      let isExist = (state.entryConfig.filter(item => {
        return item.key == action.value.key;
      })).length;
      if(isExist){
        return state;
      }else{
        return {
          ...state,
          entryConfig: [
            ...state.entryConfig,
            action.value
          ]
        }
      }
    default:
      return state;
  }
}


export default CorpStatus;
