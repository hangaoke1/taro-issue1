import { set, get, initDeviceid } from './global_config';
import { exitSession, closeSocket } from './actions/chat';
import eventbus from '@/lib/eventbus';


class DataFormatError extends Error{
  constructor(info){
    super(`${info} Data format parsing error`);
    this.name = 'DataFormatError'
  }
}

/**
 * 配饰企业的appKey
 * @param {str} key
 */
export const _$configAppKeySync = (key) => {
  if (Object.prototype.toString.call(key) === "[object String]") {
    set('appKey', key);
  } else {
    throw new DataFormatError('appkey');
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
          reject(new DataFormatError('appkey'));
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
      _$setVipLevelSync(userInfo.level);
    }

    if (userInfo && userInfo.userId) {
      set('foreignid', userInfo.userId);
    }

    set('userInfo', userInfo);
  } else {
    throw new DataFormatError('userInfo');
  }
}

export const _$setUserInfo = (userInfo) => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (Object.prototype.toString.call(userInfo) === "[object Object]" || Object.prototype.toString.call(userInfo) === "[object Null]") {
          try {
            // vip
            if (userInfo && userInfo.level) {
              _$setVipLevelSync(userInfo.level);
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
          reject(new DataFormatError('userInfo'));
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
  _$setUserInfoSync(null);
  // 注销后yunxin账户都会变化，需要断掉当前会话
  exitSession(closeSocket);
}


export const _$logout = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try{
        set('foreignid', '');
        set('deviceid', initDeviceid(true));
        _$setUserInfoSync(null);
        // 注销后yunxin账户都会变化，需要断掉当前会话
        exitSession(closeSocket);
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
    throw new DataFormatError('level');
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
      reject(new DataFormatError('level'));
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
    throw new DataFormatError('product');
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
      reject(new DataFormatError('product'));
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
 * 监听文件打开事件
 * @param {fun} cb
 */
export const _$onFileOpenAction = (cb) => {
  set('file_open_action', true)
  eventbus.on('file_open_action', (fileObj) => {
    cb(fileObj);
  })
}

/**
 * 内部api，虚拟appId
 */
export const __configAppId = (appId) => {
  set('bundleid', appId);
}

/**
 * 自定义分流设置客服id
 * @param {*} staffid
 */
export const _$configStaffId = (staffid) => {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(staffid) === "[object String]" || Object.prototype.toString.call(staffid) === "[object Number]") {
      setTimeout(() => {
        try{
          set('staffid', staffid);
          resolve({staffid});
        }catch(err){
          reject(err);
        }
      }, 0)
    }else{
      reject(new DataFormatError('staffid'));
    }
  }).catch((err) => {
    console.error(err);
  })
}

export const _$configStaffIdSync = (staffid) => {
  if (Object.prototype.toString.call(staffid) === "[object String]" || Object.prototype.toString.call(staffid) === "[object Number]") {
    set('staffid', staffid);
  }else{
    throw new DataFormatError('staffid');
  }
}

/**
 * 自定义分流设置客服组id
 * @param {*} groupid
 */
export const _$configGroupId = (groupid) => {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(groupid) === "[object String]" || Object.prototype.toString.call(groupid) === "[object Number]") {
      setTimeout(() => {
        try{
          set('groupid', groupid);
          resolve({groupid});
        }catch(err){
          reject(err);
        }
      }, 0)
    }else{
      reject(new DataFormatError('groupid'));
    }
  }).catch((err) => {
    console.error(err);
  })
}

export const _$configGroupIdSync = (groupid) => {
  if (Object.prototype.toString.call(groupid) === "[object String]" || Object.prototype.toString.call(groupid) === "[object Number]") {
    set('groupid', groupid);
  }else{
    throw new DataFormatError('groupid');
  }
}


/**
 * 设置聊天窗口的title
 * @param {*} title 
 */
export const _$configTitle = (title) => {
  return new Promise((resolve, reject) => {
    if (Object.prototype.toString.call(title) === "[object String]") {
      setTimeout(() => {
        try{
          set('title', title);
          resolve(title);
        }catch(err){
          reject(err);
        }
      }, 0)
    }else{
      reject(new DataFormatError('title'))
    }
  }).catch(err => {
    console.error(err);
  })
}

export const _$configTitleSync = title => {
  if (Object.prototype.toString.call(title) === "[object String]") {
    set('title', title);
  }else{
    throw new DataFormatError('title');
  }
}

/**
 * 人工会话下，输入框上方自定义事件类型快捷入口点击
 * @param {fun} cb
 */
export const _$onEntranceClick = (cb) => {
  eventbus.on('on_entrance_click', (data) => {
    cb(data);
  })
}

/**
 * 配置历史消息保存条数量
 * @param {Number} limit 
 */
export const _$setHistoryLimit = (limit) => {
  limit = Number(limit);
  if (!Number.isInteger(limit)) return;
  set('history_limit', limit)
}

/*
 * 配置链接点击行为
 * @param {boolean} autoCopy 是否自动处理链接点击复制行为
 */
export const _$configAutoCopy = autoCopy => {
  set('autoCopy', !!autoCopy)
}
