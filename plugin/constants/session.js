'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var namespace = 'SESSION';

var INIT_SESSION = exports.INIT_SESSION = namespace + '/INIT_SESSION';

var REASON_MAP = exports.REASON_MAP = {
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