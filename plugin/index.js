"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._$configAppKey = undefined;

var _global_config = require("./global_config.js");

var _$configAppKey = exports._$configAppKey = function _$configAppKey(key) {
  if (!key) return;
  (0, _global_config.set)('appKey', key);
};