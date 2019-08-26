// 发送消息终端类型
export const FROM_TYPE = 'WEB';

/**
 * 发送的自定义指令 -----start------
 */

// 访客发送评价
export const SEND_EVALUATION_CMD = 51;

// 申请客服
export const APPLY_KEFU_CMD = 1;

/**
* 发送的自定义指令 ------end--------
*/



/**
 * 收到的自定义指令 -----start------
 */

// 申请客服成功后分配客服
export const ASSIGN_KEFU_CMD = 2;

// 会话结束指令
export const FINISH_SESSION_CMD = 6;

// 收到邀评指令
export const RECEIVE_EVALUATION_CMD = 50;

// 评价成功后收到评价结果通知
export const RECEIVE_EVALUATION_RESULT_CMD = 55;

// 收到机器人提示
export const REVEIVE_ROBOT_TIP_CMD = 70;

// 收到访客端分流入口推送
export const RECEIVE_SHUNT_ENTRIES_CMD = 90;

// 服务先知-机器人会话中用户输入消息时实时匹配企业接口，实时推送bot入口信息
export const RECEIVE_BOT_ENTRY_CMD = 211

/**
* 收到的自定义指令 ------end--------
*/


/**
 * 导航栏标题配置
 */
// 常态标题
export const NAVIGATIONBAR_TITLE = '网易七鱼';
// 连接中标题
export const NAVIGATIONBAR_TITLE_CONNECTING = '正在连接';
