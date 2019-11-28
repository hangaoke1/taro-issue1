import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import { PUSH_MESSAGE, UPDATE_MESSAGE_BYKEY, UPDATE_MESSAGE_BYINDEX, UPDATE_MESSAGE_BYACTION, UPDATE_MESSAGE_BYUUID,TIME_TIP_DURATION, REMOVE_MESSAGE_BYUUID, LIMIT_MESSAGE } from '../constants/message';
import eventbus from '../lib/eventbus';
import { genUUID16 } from '../lib/uuid';
import { addUnread } from '@/lib/unread';
import { timestamp2date } from '../utils';

const initMessages = [];

const Message = (state = initMessages, action) => {
    switch(action.type){
        // 截取消息
        case LIMIT_MESSAGE:
            break;
        // 添加消息
        case PUSH_MESSAGE:

            if(action.message && action.message.uniqueKey){
              let index = _findIndex(state, (o) => {
                return o.uniqueKey && o.uniqueKey == action.message.uniqueKey;
              })

              if(index != -1)
              return state;
            }

            // 分配uuid
            if (!_get(action, 'message.uuid')) {
                action.message.uuid = genUUID16();
            }

            if (_get(action, 'message.msg.idClient')) {
                action.message.idClient = _get(action, 'message.msg.idClient');
            }

            // 统一处理转人工附带参数
            if (_get(action, 'message.msg.content')) {
                try {
                    const { transferRgType } = JSON.parse(_get(action, 'message.msg.content'));
                    action.message.transferRgType = transferRgType || '';
                } catch (err) {}
            }

            // 删除消息原，优化性能
            delete action.message.msg;

            // 触发事件
            eventbus.trigger('push_message');

            // 未读消息设置
            addUnread(action.message);

            // 时间的提示按TIME_TIP_DURATION时间段展示
            let prevMessage = [...state], currentMessage = {...action.message};
            currentMessage.time = new Date().getTime();

            if(prevMessage.length){
              if((currentMessage.time - prevMessage[prevMessage.length - 1].time) > TIME_TIP_DURATION){
                let timeTip = {
                  type: 'systip',
                  content: timestamp2date(currentMessage.time,'HH:mm')
                }

                return [...state, timeTip, currentMessage];
              }else{
                return [...state, currentMessage];
              }
            }else{
              let timeTip = {
                type: 'systip',
                content: timestamp2date(new Date().getTime(),'HH:mm')
              }

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
                return [...updateMessage(state, action, 'uuid')];
        // 根据index更新消息
        case UPDATE_MESSAGE_BYINDEX:
            return [...updateMessage(state, action, 'index')];
        // 根据uuid删除消息 供消息重发使用
        case REMOVE_MESSAGE_BYUUID:
            const uuid = action.uuid;
            return [...state.filter(msg => msg.uuid !== uuid)];
        default:
            return state;
    }
}

const updateMessage = (state, action, by) => {
    let message = [...state];
    let ret = [];

    if (by === 'index') {
        ret = message.map((item, index) => {
            if(index === action.index){
                return {
                    ...item,...action.message
                }
            }else{
                return item;
            }
        })
    } else {
        ret = message.map(item => {
            if(item[by] && item[by] === action.message[by]) {
                return {
                    ...item,...action.message
                }
            } else {
                return item;
            }
        })
    }

    return ret;
}

export default Message;
