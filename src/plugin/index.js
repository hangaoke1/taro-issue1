import { set, get, initDeviceid } from './global_config';
import { exitSession } from './actions/chat';
import eventbus from '@/lib/eventbus';


/**
 * 配饰企业的appKey
 * @param {str} key
 */
export const _$configAppKeySync = (key) => {
  if (Object.prototype.toString.call(key) === "[object String]") {
    set('appKey', key);
  } else {
    console.log('appkey数据格式不符合要求');
  }
}

export const _$configAppKey = (key) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (Object.prototype.toString.call(key) === "[object String]") {
          set('appKey', key);
          resolve(key);
        } else {
          reject('appkey数据格式不符合要求');
        }
      } catch (err) {
        reject(err);
      }
    }, 0)
  }).catch((err) => {
    console.error(err);
  })
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
export const _$setUserInfoSync = (userInfo) => {

  if (Object.prototype.toString.call(userInfo) === "[object Object]" || Object.prototype.toString.call(userInfo) === "[object Null]") {
    // vip
    if (userInfo && userInfo.level) {
      _$setVipLevel(userInfo.level);
    }

    if (userInfo && userInfo.userId) {
      set('foreignid', userInfo.userId);
    }

    set('userInfo', userInfo);
  } else {
    console.log('userInfo数据格式不符合要求');
  }
}

export const _$setUserInfo = (userInfo) => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (Object.prototype.toString.call(userInfo) === "[object Object]" || Object.prototype.toString.call(userInfo) === "[object Null]") {
          try {
            // vip
            if (userInfo && userInfo.level) {
              _$setVipLevel(userInfo.level);
            }

            if (userInfo && userInfo.userId) {
              set('foreignid', userInfo.userId);
            }

            set('userInfo', userInfo);
            resolve(userInfo);
          } catch (err) {
            reject(err);
          }
        } else {
          reject('userInfo数据格式不符合要求');
        }
    }, 0)
  }).catch((err) => {
    console.error(err);
  })
}

/**
 * 用户注销
 */
export const _$logoutSync = () => {
  set('foreignid', '');
  set('deviceid', initDeviceid(true));
  _$setUserInfo(null);
  // 注销后yunxin账户都会变化，需要断掉当前会话
  exitSession();
}


export const _$logout = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try{
        set('foreignid', '');
        set('deviceid', initDeviceid(true));
        _$setUserInfo(null);
        // 注销后yunxin账户都会变化，需要断掉当前会话
        exitSession();
        resolve('logout success');
      }catch(err){
        reject(err);
      }
    }, 0)
  }).catch((err) => {
    console.error(err);
  })
}

/**
 * 设置用户的vip
 * @param {Number} Level
 */
export const _$setVipLevelSync = (level = 0) => {
  if (Object.prototype.toString.call(level) === "[object String]" || Object.prototype.toString.call(level) === "[object Number]") {
    set('level', level);
  }else{
    reject('userInfo数据格式不符合要求');
  }
}

export const _$setVipLevel = (level = 0) => {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(level) === "[object String]" || Object.prototype.toString.call(level) === "[object Number]") {
      setTimeout(() => {
        try{
          set('level', level);
          resolve({level});
        }catch(err){
          reject(err);
        }
      }, 0)
    }else{
      reject('level数据格式不符合要求');
    }
  }).catch((err) => {
    console.error(err);
  })
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
export const _$configProductSync = (product) => {
  if (Object.prototype.toString.call(product) === "[object Object]") {
    set('product', product);
  }else{
    console.log('product数据格式不符合要求');
  }
}

export const _$configProduct = (product) => {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(product) === "[object Object]") {
      setTimeout(() => {
        try{
          set('product', product);
          resolve(product);
        }catch(err){
          reject(err);
        }
      }, 0)
    }else{
      reject('product数据格式不符合要求');
    }
  }).catch((err) => {
    console.error(err);
  })
}

/**
 * 获取配置的商品信息
 */
export const _$getProduct = () => {
  return get('product');
}


/**
 * ---- 插件消息接口 供调用方使用 ----
 * message_unread_count 记录未读数
 * message_unread 监听未读消息事件
 */

/**
 * 获取消息未读数
 */
export const _$getAllUnreadCount = () => {
  return get('message_unread_count');
}

/**
 * 监听消息未读数
 * @param {funl} cb 监听回掉函数
 * @return {object} total: 未读消息总数, message: 消息体
 */
export const _$onunread = (cb) => {
  eventbus.on('message_unread', (message) => {
    const total = get('message_unread_count');
    cb({
      total,
      message
    })
  })
}

 /**
  * 清空消息未读数量
  */
export const _$clearUnreadCount = () => {
  set('message_unread_count', 0);
  eventbus.trigger('message_unread', {
    total: 0,
    message: null
  })
}


/**
 * 监听点击事件
 * @param {fun} cb
 */
export const _$onClickAction = (cb) => {
  eventbus.on('click_action', (extralParams) => {
    cb(extralParams);
  })
}

/**
 * 内部api，虚拟appId
 */
export const __configAppId = (appId) => {
  set('bundleid', appId);
}
