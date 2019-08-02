"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTextMsg = exports.applyKefu = undefined;

var _im = require("../service/im.js");

var _im2 = _interopRequireDefault(_im);

var _global_config = require("../global_config.js");

var _nimMsgHandle = require("../actions/nimMsgHandle.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imService = null;

/**
 * 
 * @param {*} msg 
 * 收到普通文本消息
 */
var onMsg = function onMsg(msg) {
  (0, _nimMsgHandle.receiveMsg)(msg);
};

/**
 * 
 * @param {*} msg 
 * 收到系统自定义消息
 */
var onCustomsysmsg = function onCustomsysmsg(msg) {
  try {
    var content = JSON.parse(msg.content);

    switch (content.cmd) {
      case 2:
        (0, _nimMsgHandle.assignKefu)(content);
        break;
      case 6:
        (0, _nimMsgHandle.onfinish)(content);
        break;
      default:
        console.log('未知指令' + JSON.stringify(msg));
        break;
    }
  } catch (e) {}
};

var sendCustomSysMsg = function sendCustomSysMsg(_ref) {
  var content = _ref.content,
      _ref$to = _ref.to,
      to = _ref$to === undefined ? -1 : _ref$to,
      _done = _ref.done;

  imService.getNim().then(function (nim) {
    nim.sendCustomSysMsg({
      to: to,
      cc: true,
      filter: true,
      scene: 'p2p',
      content: JSON.stringify(content),
      done: function done(error, msg) {
        if (error) {
          console.log(content.cmd + '--error!');
        } else {
          console.log(content.cmd + '--success!');
        }
        _done(error, msg);
      }
    });
  });
};

/**
 * 申请客服
 */
var applyKefu = exports.applyKefu = function applyKefu(done) {

  var appKey = (0, _global_config.get)('appKey');
  var account = (0, _global_config.get)('account');
  var token = (0, _global_config.get)('token');

  imService = new _im2.default({
    appKey: appKey,
    account: account,
    promise: true,
    token: token
  }, {
    onMsg: onMsg,
    onCustomsysmsg: onCustomsysmsg
  });

  var content = {
    cmd: 1,
    deviceid: 'lusl448dwwx222ecuk6faq'
  };

  sendCustomSysMsg({
    content: content,
    done: done
  });
};

/**
 * 发送普通消息
 * 
 */
var sendTextMsg = exports.sendTextMsg = function sendTextMsg(value) {
  imService.getNim().then(function (nim) {
    nim.sendText({
      scene: 'p2p',
      to: -1,
      text: value
    });
  }).catch(function (json) {});
};