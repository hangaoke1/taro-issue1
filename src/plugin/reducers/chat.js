import {
  SET_ENTRY_CONFIG, DEL_ENTRY_BYKEY, SET_EVALUATION_VISIBLE,
  SET_CHAT_INPUT_DISABLED, SET_CHAT_INPUT_PLACEHOLDER, RESET_CHAT_INPUT, UPDATE_ENTRY_BYTEXT,
  UPDATE_ENTRY_BYKEY,SET_SHUNT_ENTRIES_STATUS
} from '../constants/chat';
import eventbus from '../lib/eventbus';


const CorpStatus = (state = {
  evaluationVisible: false,
  entryConfig: [],
  chatInputDisabled: false,
  chatInputPlaceHolder: '请输入您要咨询的问题',
  shuntEntriesStatus: false
}, action) => {
  switch (action.type) {
    case SET_EVALUATION_VISIBLE:
      // 先解决ios下的滚动穿透吧
      if(action.value){
        eventbus.trigger('disabled_chat_scrollY');
      }else{
        eventbus.trigger('enable_chat_scrollY');
      }
      return {
        ...state,
        evaluationVisible: action.value
      }
    case SET_ENTRY_CONFIG:
      let isExist = (state.entryConfig.filter(item => {
        return item.key == action.value.key;
      })).length;
      if (isExist) {
        return state;
      } else {
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

      entry.forEach((item, inx) => {
        if (item.key == action.value) {
          index = inx;
        }
      })

      if (index == -1) {
        return state;
      } else {
        entry.splice(index, 1);
        return {
          ...state,
          entryConfig: [...entry]
        }
      }
    case UPDATE_ENTRY_BYTEXT:
      {
        let entry = [...state.entryConfig];

        entry.forEach((item, index) => {
          if (item.text == action.value.text) {
            entry[index] = { ...action.value };
          }
        })

        return {
          ...state,
          entryConfig: [...entry]
        }
      }
    case UPDATE_ENTRY_BYKEY:
      {
        let entry = [...state.entryConfig];

        entry.forEach((item, index) => {
          if (item.key == action.value.key) {
            entry[index] = { ...action.value };
          }
        })

        return {
          ...state,
          entryConfig: [...entry]
        }
      }
    case SET_CHAT_INPUT_DISABLED:
      return {
        ...state,
        chatInputDisabled: action.value
      }
    case SET_CHAT_INPUT_PLACEHOLDER:
      return {
        ...state,
        chatInputPlaceHolder: action.value
      }
    case RESET_CHAT_INPUT:
      return {
        ...state,
        chatInputDisabled: false,
        chatInputPlaceHolder: '请输入您要咨询的问题'
      }
    case SET_SHUNT_ENTRIES_STATUS:
      return {
        ...state,
        shuntEntriesStatus: action.value
      }
    default:
      return state;
  }
}


export default CorpStatus;
