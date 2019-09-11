import { SET_ENTRY_CONFIG,DEL_ENTRY_BYKEY,SET_EVALUATION_VISIBLE } from '../constants/chat';


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
    case DEL_ENTRY_BYKEY:
      let entry = [...state.entryConfig];
      let index = -1;

      entry.forEach((item,inx) => {
        if(item.key == action.value){
          index = inx;
        }
      })

      if(index == -1){
        return state;
      }else{
        entry.splice(index,1);
        return {
          ...state,
          entryConfig: [...entry]
        }
      }
    default:
      return state;
  }
}


export default CorpStatus;
