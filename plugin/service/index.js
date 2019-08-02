"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryAccont = undefined;

var _ajax = require("../utils/ajax.js");

var post = function post() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return (0, _ajax.request)({
    url: url,
    data: params,
    method: 'POST',
    json: false
  });
};

var queryAccont = exports.queryAccont = function queryAccont(params) {
  return post('https://qytest.netease.com/webapi/user/create.action', params);
};