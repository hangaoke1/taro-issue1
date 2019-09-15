import { set, initDeviceid } from './global_config';

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
}
