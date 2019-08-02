"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import NIM from '../vendors/nim/NIM_Web_NIM_weixin_v6.6.6';


var _NIM_Web_NIM_weixin = require("../vendors/nim/NIM_Web_NIM_weixin.js");

var _NIM_Web_NIM_weixin2 = _interopRequireDefault(_NIM_Web_NIM_weixin);

var _global_config = require("../global_config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IMSERVICE = function () {
  function IMSERVICE(initer, _ref) {
    var onMsg = _ref.onMsg,
        onCustomsysmsg = _ref.onCustomsysmsg;

    _classCallCheck(this, IMSERVICE);

    this.account = initer.account;
    this.appKey = initer.appKey;
    this.token = initer.token;
    this.contenting = false;

    this.onMsg = onMsg;
    this.onCustomsysmsg = onCustomsysmsg;
  }

  _createClass(IMSERVICE, [{
    key: "getNim",
    value: function getNim() {
      var _this = this;

      return new Promise(function (resolve, reject) {

        var onConnect = function onConnect(data) {
          resolve(nim);
          _this.onConnect();
        };

        var nim = _this.nim = _NIM_Web_NIM_weixin2.default.getInstance({
          appKey: _this.appKey,
          account: _this.account,
          promise: true,
          token: _this.token,
          onconnect: onConnect,
          ondisconnect: _this.onDisconnect,
          onerror: _this.onError,
          onmsg: _this.onMsg,
          oncustomsysmsg: _this.onCustomsysmsg
        });

        if (_this.contenting) {
          resolve(nim);
        }
      });
    }
  }, {
    key: "sendHeartbeat",
    value: function sendHeartbeat() {
      this.nim.sendCustomSysMsg({
        to: -1,
        cc: true,
        filter: true,
        scene: 'p2p',
        content: JSON.stringify({
          cmd: -1000,
          deviceid: (0, _global_config.get)('deviceid')
        }),
        done: function done(error, msg) {
          if (error) {
            console.log('sendHeartbeat--error!');
          } else {
            console.log('sendHeartbeat--success!');
          }
        }
      });

      setTimeout(this.sendHeartbeat.bind(this), (0, _global_config.get)('heartbeatCycle'));
    }
  }, {
    key: "onConnect",
    value: function onConnect(data) {
      console.log('----onConnect----，data:' + data);
      this.contenting = true;
      // 连接成功后发送访客心跳
      this.sendHeartbeat();
    }
  }, {
    key: "onError",
    value: function onError(data) {
      console.log('----onError----，data:' + data);
      this.contenting = false;
    }
  }, {
    key: "onDisconnect",
    value: function onDisconnect(data) {
      console.log('----onDisconnect----，data:' + data);
      this.contenting = false;
    }
  }]);

  return IMSERVICE;
}();

exports.default = IMSERVICE;