"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Session = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require("../npm/redux/lib/redux.js");

var _session = require("../constants/session.js");

var initSession = {};

var Session = exports.Session = function Session() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initSession;
  var action = arguments[1];

  switch (action.type) {
    case _session.INIT_SESSION:
      return _extends({}, state, action.session);
    default:
      return state;
  }
};

exports.default = (0, _redux.combineReducers)({ Session: Session });