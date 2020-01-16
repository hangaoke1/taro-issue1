/**
 * 存储历史消息
 */
import Taro from '@tarojs/taro';
import { get } from '../global_config';
 
const LIMIT = 100; // 默认存储100条，FIFO原则
let DEFAULT_KEY = 'HISTORY_MESSAGE'; // 存储历史消息的键名

function _getKey () {
  const userInfo = get('userInfo')
  if (userInfo && userInfo.userId) {
    return 'HISTORY_' + userInfo.userId
  } else {
    return DEFAULT_KEY
  }
}
// 添加消息
export function add (message) {
  const KEY = _getKey();
  const limit = get('history_limit') || LIMIT;
  const data = Taro.getStorageSync(KEY);
  const oldList = data ? JSON.parse(data) : [];
  const tmp = Array.isArray(message) ? message : [message]
  const newList = [...oldList, ...tmp].slice(-limit);
  Taro.setStorageSync(KEY, JSON.stringify(newList));
}

// 删除消息
export function remove (id) {
  const KEY = _getKey();
  const data = Taro.getStorageSync(KEY);
  const oldList = data ? JSON.parse(data) : [];
  const newList = oldList.filter(message => message.uuid !== id);
  Taro.setStorageSync(KEY, JSON.stringify(newList));
}

// 更新消息
export function update (id, message) {
  const KEY = _getKey();
  const data = Taro.getStorageSync(KEY);
  const oldList = data ? JSON.parse(data) : [];
  let index = -1;
  for(let i = 0; i < oldList.length; i++) {
    if (oldList[i].uuid === id) {
      index = i;
      break;
    }
  }
  if (index !== -1) {
    oldList.splice(index, 1, message)
  }
  Taro.setStorageSync(KEY, JSON.stringify(oldList));
}

// 加载历史消息
export function loadHistroy(id, pageSize = 10) {
  const KEY = _getKey();
  const data = Taro.getStorageSync(KEY);
  const oldList = data ? JSON.parse(data) : [];

  if (!id) {
    return oldList.slice(-pageSize)
  }

  let end = -1;
  for(let i = 0; i < oldList.length; i++) {
    if (oldList[i].uuid === id) {
      end = i;
      break;
    }
  }
  let start  = end - pageSize > 0 ? end - pageSize : 0;

  return oldList.slice(start, end)
}
