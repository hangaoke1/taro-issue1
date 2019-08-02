import { combineReducers } from 'redux'
import {chat} from './chat'
import Message from './message';
import Session from './session';

export default combineReducers({
  chat,
  Message,
  Session
})
