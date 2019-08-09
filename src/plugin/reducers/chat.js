import { combineReducers } from 'redux'


const corpConfig = (state = {
  appKey: 'c583f9c0cb3945b577814c39d152ff4a'
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