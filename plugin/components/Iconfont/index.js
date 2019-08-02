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

var Iconfont = (_temp2 = _class = function (_Taro$Component) {
  _inherits(Iconfont, _Taro$Component);

  function Iconfont() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Iconfont);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Iconfont.__proto__ || Object.getPrototypeOf(Iconfont)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "props"], _this.customComponents = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Iconfont, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(Iconfont.prototype.__proto__ || Object.getPrototypeOf(Iconfont.prototype), "_constructor", this).call(this, props);

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

      var _props$size = props.size,
          size = _props$size === undefined ? 28 : _props$size,
          _props$color = props.color,
          color = _props$color === undefined ? '#ccc' : _props$color;


      var anonymousState__temp = (0, _index.internal_inline_style)({
        display: 'inline-block',
        color: color,
        fontSize: size + 'px'
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        props: props
      });
      return this.__state;
    }
  }]);

  return Iconfont;
}(_index2.default.Component), _class.$$events = [], _class.$$componentPath = "plugin/components/Iconfont/index", _temp2);
exports.default = Iconfont;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(Iconfont));