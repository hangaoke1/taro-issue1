"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = exports.initMessages = undefined;

var _redux = require("../npm/redux/lib/redux.js");

var _message = require("../constants/message.js");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initMessages = exports.initMessages = [];

var Message = exports.Message = function Message() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initMessages;
  var action = arguments[1];

  switch (action.type) {
    case _message.PUSH_MESSAGE:
      return [].concat(_toConsumableArray(state), [action.message]);
    default:
      return state;
  }
};

exports.default = (0, _redux.combineReducers)({ Message: Message });