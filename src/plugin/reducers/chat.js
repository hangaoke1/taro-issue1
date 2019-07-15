import { combineReducers } from 'redux'


const corpConfig = (state = {
  appKey: '7540b40c6afa96fc975ce040733ae7f6'
},action) => {
  switch(action.type){
    case 'SET_APPKEY':
      return {
        ...state,
        appKey: action.appKey
      }
    default:
      return state;
  }
}


export const chat =  combineReducers({corpConfig});