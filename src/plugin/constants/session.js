const namespace = 'SESSION';

export const INIT_SESSION = `${namespace}/INIT_SESSION`;

export const SET_SESSION_CODE = `${namespace}/SET_SESSION_CODE`;

export const UPDATE_SESSION = `${namespace}/UPDATE_SESSION`;

export const UPDATE_READ_TIME = `${namespace}/UPDATE_READ_TIME`

/*
* 会话关闭提示语
*/
export const REASON_MAP = {
    '-1': '会话已断开', // 账号被踢，该状态为前端维护
    '0': '客服已关闭会话',
    '1': '由于您长时间不在线，会话已结束',
    '2': '本次会话已超时结束',
    '4': '客服离开，会话已结束',
    '7': '会话已结束'
    /*0  客服关闭
        1 用户离开
        2 用户不说话 自动关闭了
        3 机器人会话转接到人工
        4 客服离开
        5 客服主动将会话转出
        6 管理员强势接管会话，或访客再次申请其他客服
        7 访客关闭
    */
};

/**
 * 默认客服头像
 */
// export const DEFAULT_KEFU_AVATAR = 'https://qiyukf.nosdn.127.net/sdk/res/default/portrait2x.png';
export const DEFAULT_KEFU_AVATAR = 'https://qiyukf.com/sdk/res/skin/default/ico-kefu@2x.png';


/**
 * 默认机器人头像
 */
export const DEFAULT_ROBOT_AVATAR = 'https://qiyukf.nosdn.127.net/sdk/res/default/robot_portrait2x.png';
