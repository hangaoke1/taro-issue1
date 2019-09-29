/**
 * 处理未读消息
 */
import Taro from '@tarojs/taro';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import { get, set } from '../global_config';

/**
 * 获取当前页面url
 */
export const getCurrentUrl = () => {
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = _get(currentPage, 'route', '');
  return url;
};

/**
 * 追加未读数量
 * @param {object} message 
 */
export const addUnread = message => {
  // 未读消息设置
  const url = getCurrentUrl();
  if (url.indexOf('pages/chat/chat') === -1) {
    const oldCount = get('message_unread_count') || 0;
    set('message_unread_count', oldCount + 1);
    eventbus.trigger('message_unread', message);
  }
};

/**
 * 清空未读数量[用户进入聊天页面后调用]
 */
export const clearUnreadHome = () => {
  set('message_unread_count', 0)
  eventbus.trigger('message_unread', { total: 0, message: null });
  eventbus.trigger('clear_unread')
}
