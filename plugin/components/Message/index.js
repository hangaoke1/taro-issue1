"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MessageView = (_temp2 = _class = function (_Taro$Component) {
  _inherits(MessageView, _Taro$Component);

  function MessageView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MessageView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MessageView.__proto__ || Object.getPrototypeOf(MessageView)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["loopArray1", "Message"], _this.customComponents = ["SysTipView", "TextView", "ActionView"], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MessageView, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(MessageView.prototype.__proto__ || Object.getPrototypeOf(MessageView.prototype), "_constructor", this).call(this, props);

      this.$$refs = [];
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __isRunloopRef = arguments[2];
      var __prefix = this.$prefix;
      ;
      var props = this.__props;

      var Message = props.Message;


      var loopArray1 = Message ? Message.map(function (it, _anonIdx) {
        it = {
          $original: (0, _index.internal_get_original)(it)
        };
        var $compid__7 = (0, _index.genCompid)(__prefix + "sewAbnmvGe" + _anonIdx);
        it.$original.type === 'systip' && _index.propsManager.set({
          "item": it.$original
        }, $compid__7);
        var $compid__8 = (0, _index.genCompid)(__prefix + "pEtYTwrtwD" + _anonIdx);
        it.$original.type === 'text' && _index.propsManager.set({
          "item": it.$original
        }, $compid__8);
        var $compid__9 = (0, _index.genCompid)(__prefix + "FXteIVzgBN" + _anonIdx);
        it.$original.type === 'action' && _index.propsManager.set({
          "item": it.$original
        }, $compid__9);
        return {
          $compid__7: $compid__7,
          $compid__8: $compid__8,
          $compid__9: $compid__9,
          $original: it.$original
        };
      }) : [];
      Object.assign(this.__state, {
        loopArray1: loopArray1,
        Message: Message
      });
      return this.__state;
    }
  }]);

  return MessageView;
}(_index2.default.Component), _class.$$events = [], _class.$$componentPath = "plugin/components/Message/index", _temp2);
exports.default = MessageView;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(MessageView));