"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../npm/@tarojs/redux/index.js");

var _chat = require("../../actions/chat.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = (_dec = (0, _index3.connect)(function (_ref) {
  var Message = _ref.Message;
  return Message;
}, function (dispatch) {
  return {
    createAccount: function createAccount() {
      dispatch((0, _chat.createAccount)());
    },
    sendText: function sendText(value) {
      dispatch((0, _chat.sendText)(value));
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(Chat, _BaseComponent);

  function Chat() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Chat);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Chat.__proto__ || Object.getPrototypeOf(Chat)).call.apply(_ref2, [this].concat(args))), _this), _this.$usedState = ["$compid__0", "$compid__1", "$compid__2", "createAccount", "sendText", "Message"], _this.config = {
      navigationBarTitleText: '网易七鱼'
    }, _this.handleConfirm = function (event) {
      var sendText = _this.props.sendText;

      var value = event.detail.value;

      sendText(value);
    }, _this.customComponents = ["Index", "MessageView", "ChatBox"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Chat, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Chat.prototype.__proto__ || Object.getPrototypeOf(Chat.prototype), "_constructor", this).call(this, props);
      this.createAction();
      this.$$refs = [];
    }
  }, {
    key: "createAction",
    value: function createAction() {
      var createAccount = this.props.createAccount;

      createAccount();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {}
  }, {
    key: "componentDidHide",
    value: function componentDidHide() {}
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;
      var $compid__0 = (0, _index.genCompid)(__prefix + "$compid__0");
      var $compid__1 = (0, _index.genCompid)(__prefix + "$compid__1");
      var $compid__2 = (0, _index.genCompid)(__prefix + "$compid__2");

      var Message = this.__props.Message;


      _index.propsManager.set({
        "className": "m-page-wrapper"
      }, $compid__0);
      _index.propsManager.set({
        "Message": Message
      }, $compid__1);
      _index.propsManager.set({
        "handleConfirm": this.handleConfirm
      }, $compid__2);
      Object.assign(this.__state, {
        $compid__0: $compid__0,
        $compid__1: $compid__1,
        $compid__2: $compid__2
      });
      return this.__state;
    }
  }]);

  return Chat;
}(_index.Component), _class2.$$events = [], _class2.$$componentPath = "plugin/pages/chat/chat", _temp2)) || _class);
exports.default = Chat;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Chat, true));