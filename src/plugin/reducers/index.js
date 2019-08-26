import { combineReducers } from 'redux'
import CorpStatus from './chat'
import Message from './message';
import Session from './session';
import Options from './options';
import Bot from './bot';

export default combineReducers({
  CorpStatus,
  Message,
  Session,
  Options,
  Bot
})
