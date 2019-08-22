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

/**
* 收到的自定义指令 ------end--------
*/