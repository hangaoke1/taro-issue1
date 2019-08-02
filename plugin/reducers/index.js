"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("../npm/redux/lib/redux.js");

var _chat = require("./chat.js");

var _message = require("./message.js");

var _message2 = _interopRequireDefault(_message);

var _session = require("./session.js");

var _session2 = _interopRequireDefault(_session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  chat: _chat.chat,
  Message: _message2.default,
  Session: _session2.default
});