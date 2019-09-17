import { set, initDeviceid } from './global_config';
import { exitSession } from './actions/chat';

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

  // 有名用户切换有名用户
  // todo

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
