import {SET_EVALUATION_VISIBLE} from '../constants/chat';



const CorpStatus = (state = {
  evaluationVisible: false
}, action) => {
  switch(action.type){
    case SET_EVALUATION_VISIBLE:
      return {
        ...state,
        evaluationVisible: action.value
      }
    default:
      return state;
  }
}


export default CorpStatus;