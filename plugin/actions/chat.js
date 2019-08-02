"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendText = exports.createAccount = undefined;

var _index = require("../service/index.js");

var _global_config = require("../global_config.js");

var _im = require("../utils/im.js");

var _message = require("../constants/message.js");

var applyKefuSuccess = function applyKefuSuccess(error, msg) {
  console.log('hi kefu' + msg);
};

/**
 * 
 * @param {*} param 
 * 创建云信的账户
 */
var createAccount = exports.createAccount = function createAccount() {
  var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (dispatch) {

    var appKey = (0, _global_config.get)('appKey');
    var deviceid = (0, _global_config.get)('deviceid');
    if (!appKey) return;

    (0, _index.queryAccont)({
      deviceid: deviceid,
      appKey: appKey
    }).then(function (json) {
      var info = json.info;

      info.accid && (0, _global_config.set)('account', info.accid);
      info.bid && (0, _global_config.set)('bid', info.bid);
      info.token && (0, _global_config.set)('token', info.token);

      // 申请客服
      (0, _im.applyKefu)(applyKefuSuccess);
    });
  };
};

var sendText = exports.sendText = function sendText(text) {
  return function (dispatch) {
    var message = {
      "content": text,
      "type": 'text',
      "time": new Date().getTime(),
      "status": 1,
      "fromUser": 1
    };

    dispatch({ type: _message.PUSH_MESSAGE, message: message });
    (0, _im.sendTextMsg)(text);
  };
};