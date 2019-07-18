import {set} from './global_config';

export const _$configAppKey = (key) => {
  if(!key) return;
  set('appKey',key);
}
