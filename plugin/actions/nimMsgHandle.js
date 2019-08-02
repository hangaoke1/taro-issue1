"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onfinish = exports.receiveMsg = exports.assignKefu = undefined;

var _global_config = require("../global_config.js");

var _message = require("../constants/message.js");

var _session = require("../constants/session.js");

var _date = require("../utils/date.js");

/**
 * 分配客服
 */
var assignKefu = exports.assignKefu = function assignKefu(content) {
  var dispatch = (0, _global_config.get)('store').dispatch;

  // init session
  dispatch({ type: _session.INIT_SESSION, session: content });

  var code = content.code,
      staffname = content.staffname;


  switch (code) {
    case 200:
      var time = new Date().getTime();

      var message = {
        content: staffname + "\u4E3A\u60A8\u670D\u52A1",
        type: 'systip',
        time: time
      };

      var timeTip = {
        content: (0, _date.timestamp2date)(time, 'HH:mm'),
        type: 'systip',
        time: time
      };

      dispatch({ type: _message.PUSH_MESSAGE, message: timeTip });
      dispatch({ type: _message.PUSH_MESSAGE, message: message });
      break;
    case 206:
      // 进入排队的状态

      break;
  }
};

/**
 * 
 * @param {*} msg 
 * 收到普通的消息
 */
var receiveMsg = exports.receiveMsg = function receiveMsg(msg) {
  var dispatch = (0, _global_config.get)('store').dispatch;

  if (msg.type == 'text') {

    var message = {
      "content": msg.text,
      "type": msg.type,
      "time": msg.time,
      "status": msg.status,
      "fromUser": 0
    };

    dispatch({ type: _message.PUSH_MESSAGE, message: message });
  }
};

/**
 * 收到会话结束的指令
 */
var onfinish = exports.onfinish = function onfinish(content) {
  var dispatch = (0, _global_config.get)('store').dispatch;
  var session = (0, _global_config.get)('store').getState().Session.Session;

  var close_reason = content.close_reason,
      richmessage = content.richmessage,
      message = content.message;

  var time = new Date().getTime();

  var tip = void 0;
  tip = _session.REASON_MAP[close_reason] || '会话已断开';

  if (close_reason == 0 || close_reason == 2) {
    tip = richmessage || message || _session.REASON_MAP[close_reason];
  }

  // if(session && session.kefu.isRobot && data.close_reason == 1) {
  //     tip = '本次会话已超时结束';
  // }

  var msg = {
    content: tip,
    type: 'action',
    fromUser: 0,
    time: time,
    actionText: '重新连接'
  };

  dispatch({ type: _message.PUSH_MESSAGE, message: msg });
};