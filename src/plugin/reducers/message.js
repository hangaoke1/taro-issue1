import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import { PUSH_MESSAGE, UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYACTION, UPDATE_MESSAGE_BYUUID,TIME_TIP_DURATION, REMOVE_MESSAGE_BYUUID, UNSHIFT_MESSAGE, INIT_MESSAGE } from '../constants/message';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '../lib/uuid';
import { addUnread } from '@/lib/unread';
import { timestamp2date } from '../utils';
import { add, remove, update } from '@/lib/history';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        // 每次进入页面进行消息初始化默认加载历史10条
        case INIT_MESSAGE:
            eventbus.trigger('unshift_message', 'm-bottom', action.finished); // 触发事件
            return [...action.messages];
        // 顶部添加消息
        case UNSHIFT_MESSAGE:
            const tipStr = '———————— 上次看到这里 ————————'
            const historyTip = {
              type: 'systip',
              content: tipStr,
              uuid: genUUID16()
            }
            const noMoreTip = {
              type: 'systip',
              content: '历史消息已经全部加载完毕，默认保留50条',
              uuid: genUUID16()
            }
            eventbus.trigger('unshift_message', historyTip.uuid, action.finished); // 触发事件
            
            let messages = [...action.messages, historyTip, ...state.filter(msg => msg.content !== tipStr)]
            if (action.finished) {
              messages = [noMoreTip, ...messages]
            }
            return messages;
        // 添加消息
        case PUSH_MESSAGE:

            if(action.message && action.message.uniqueKey){
              let index = _findIndex(state, (o) => {
                return o.uniqueKey && o.uniqueKey == action.message.uniqueKey;
              })

              if(index != -1)
              return state;
            }

            if (!_get(action, 'message.uuid')) {
                action.message.uuid = genUUID16();
            }
            if (_get(action, 'message.msg.idClient')) {
                action.message.idClient = _get(action, 'message.msg.idClient')
            }
            delete action.message.msg;
            eventbus.trigger('push_message'); // 触发事件

            // 未读消息设置
            addUnread(action.message);


            // 时间的提示按TIME_TIP_DURATION时间段展示
            let prevMessage = [...state], currentMessage = {...action.message};
            currentMessage.time = new Date().getTime();

            if(prevMessage.length){
              if((currentMessage.time - prevMessage[prevMessage.length - 1].time) > TIME_TIP_DURATION){
                let timeTip = {
                  type: 'systip',
                  content: timestamp2date(currentMessage.time,'HH:mm'),
                  uuid: genUUID16()
                }

                add([timeTip, currentMessage]);
                return [...state, timeTip, currentMessage];
              }else{

                add(currentMessage)
                return [...state, currentMessage];
              }
            }else{
              let timeTip = {
                type: 'systip',
                content: timestamp2date(new Date().getTime(),'HH:mm'),
                uuid: genUUID16()
              }

              add([timeTip, currentMessage])
              return [...state, timeTip, currentMessage];
            }
        // 根据key更新消息
        case UPDATE_MESSAGE_BYKEY:
            return [...updateMessage(state, action, 'key')];
        // 根据action更新消息
        case UPDATE_MESSAGE_BYACTION:
            return [...updateMessage(state, action, 'action')];
        // 根据uuid更新消息
        case UPDATE_MESSAGE_BYUUID:
            update(action.message.uuid, action.message)
            return [...updateMessage(state, action, 'uuid')];
        // 根据uuid删除消息 供消息重发使用
        case REMOVE_MESSAGE_BYUUID:
            const uuid = action.uuid;
            remove(uuid)
            return [...state.filter(msg => msg.uuid !== uuid)];
        default:
            return state;
    }
}

const updateMessage = (state, action, by) => {
    let message = [...state];
    let ret = [];

    ret = message.map(item => {
        if(item[by] && item[by] === action.message[by]) {
            return {
                ...item,...action.message
            }
        } else {
            return item;
        }
    })

    return ret;
}

export default Message;
