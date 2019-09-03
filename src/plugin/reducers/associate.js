import _get from 'lodash/get';
import { SET_ASSOCIATE_RES } from '../constants/associate';

const Associate = (state = {
  content: '',
  questionContents: []
}, action) => {
  switch(action.type){
    case SET_ASSOCIATE_RES:
      return {
        ...state,
        content: _get(action, 'value.content'),
        questionContents: _get(action, 'value.questionContents', []) || []
      }
    default:
      return state;
  }
}


export default Associate;
