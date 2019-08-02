"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = exports.cachePromises = undefined;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cachePromises = exports.cachePromises = {}; //缓存请求的实例。key为url+params，所以当请求的参数一样时，不需要再次发送请求。

/**
 *  @param {Object}  config  https://nervjs.github.io/taro/docs/apis/network/request/request.html
 * @param {Boolean} configEx.cache 是否缓存结果，如果缓存了，当下次请求时，如果参数一样，直接返回结果
 * @param {Boolean} configEx.json  是否使用json方式提交数据 仅用于POST请求，此参数为true会指定Content-Type 为application/json
 * @return {Promise}
 */
var request = exports.request = function request(_ref) {
  var _ref$url = _ref.url,
      url = _ref$url === undefined ? "" : _ref$url,
      _ref$method = _ref.method,
      method = _ref$method === undefined ? "GET" : _ref$method,
      _ref$data = _ref.data,
      data = _ref$data === undefined ? {} : _ref$data,
      _ref$json = _ref.json,
      json = _ref$json === undefined ? true : _ref$json;

  return new Promise(function (resolve, reject) {
    var success = function success(response) {
      var data = response.data;
      var code = data.code;
      if (code == 200) {
        resolve(data);
      } else {
        reject(data);
      }
    };
    var fail = function fail(error) {
      reject({
        code: -1,
        message: error,
        httpError: true
      });
    };

    var header = {
      "content-type": "application/json"
    };

    if (!json) {
      header["content-type"] = "application/x-www-form-urlencoded";
    }

    var config = {
      url: url,
      method: method,
      data: data,
      header: header
    };

    _index2.default.request(config).then(success, fail);
  });
};