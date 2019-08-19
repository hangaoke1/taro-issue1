import {set} from './global_config';

export const _$configAppKey = (key) => {
  if(!key) return;
  set('appKey',key);
}

/**
 * 不对外开发，仅共demo使用
 * @param {*} domain 
 */
export const __configDomain = (domain) => {
  if(!domain) return;
  set('domain', domain)
}
