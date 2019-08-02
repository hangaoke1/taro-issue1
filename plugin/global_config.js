'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var globalConfig = {
  appKey: '',
  domain: 'https://qytest.netease.com',
  account: '',
  bid: '-1',
  token: '',
  deviceid: 'lusl4x7jhruzecuk6faq',
  heartbeatCycle: 8000,
  store: null
};

var get = exports.get = function get(key) {
  return globalConfig[key];
};

var set = exports.set = function set(key, value) {
  globalConfig[key] = value;
};