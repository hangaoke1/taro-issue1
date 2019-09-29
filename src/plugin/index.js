import { set, get, initDeviceid } from './global_config';
import { exitSession } from './actions/chat';
import eventbus from '@/lib/eventbus';

export const _$configAppKey = (key) => {
  if (!key) return;
  set('appKey', key);
}

/**
 * 不对外开发，仅共demo使用
 * @param {*} domain
 */
export const __configDomain = (domain) => {
  if (!domain) return;
  set('domain', domain)
}

/**
 * 轻量crm，对接用户信息
 * @param {*} userInfo
 */
export const _$setUserInfo = (userInfo) => {

  // vip
  if(userInfo && userInfo.level){
    _$setVipLevel(userInfo.level);
  }

  if (userInfo && userInfo.userId) {
    set('foreignid', userInfo.userId);
  }

  set('userInfo', userInfo);
}

/**
 * 用户注销
 */
export const _$logout = () => {
  set('foreignid', '');
  set('deviceid', initDeviceid(true));
  _$setUserInfo(null);
  // 注销后yunxin账户都会变化，需要断掉当前会话
  exitSession();
}

/**
 * 设置用户的vip
 * @param {} Level
 */
export const _$setVipLevel = (level = 0) => {
  set('level', level);
}

/**
 * 获取设置的vip
 */
export const _$getVipLevel = () => {
  return get('level');
}

/**
 * 配置商品信息
 * @param {*} product
 */
export const _$configProduct = (product) => {
  if(!product) return;
  set('product', product);
}

/**
 * 获取配置的商品信息
 */
export const _$getProduct = () => {
  return get('product');
}

/**
 * 获取消息未读数
 */
export const _$getAllUnreadCount = () => {
  return get('message_unread_count')
}

/**
 * 监听消息未读书
 * @param {funl} cb 监听回掉函数 
 */
export const _$onunread = (cb) => {
  eventbus.on('message_unread', (msg) => {
    const total = get('message_unread_count')
    cb({
      total,
      msg
    })
  })
}

 /**
  * 清空消息未读数量
  */
export const _clearUnreadCount = () => {
  
}
