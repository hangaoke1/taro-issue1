import { combineReducers } from 'redux'
import {chat} from './chat'
import Message from './message';

export default combineReducers({
  chat,
  Message
})
