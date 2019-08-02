'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chat = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('../npm/redux/lib/redux.js');

var corpConfig = function corpConfig() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    appKey: '7540b40c6afa96fc975ce040733ae7f6'
  };
  var action = arguments[1];

  switch (action.type) {
    case 'SET_APPKEY':
      return _extends({}, state, {
        appKey: action.appKey
      });
    default:
      return state;
  }
};

var chat = exports.chat = (0, _redux.combineReducers)({ corpConfig: corpConfig });