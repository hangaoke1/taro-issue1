'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 时间戳转为日期的格式
 * @param value
 * @param format  可选 默认 'yyyy-MM-dd HH:mm'
 * @returns {*}
 */
var timestamp2date = exports.timestamp2date = function timestamp2date(value) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd HH:mm';

  if (!value) return '--';

  var fix = function fix(str) {
    str = '' + (String(str) || '');
    return str.length <= 1 ? '0' + str : str;
  };

  var maps = {
    yyyy: function yyyy(date) {
      return date.getFullYear();
    },
    MM: function MM(date) {
      return fix(date.getMonth() + 1);
    },
    dd: function dd(date) {
      return fix(date.getDate());
    },
    HH: function HH(date) {
      return fix(date.getHours());
    },
    mm: function mm(date) {
      return fix(date.getMinutes());
    },
    ss: function ss(date) {
      return fix(date.getSeconds());
    }
  };

  var trunk = new RegExp(Object.keys(maps).join('|'), 'g');

  value = new Date(value || +new Date());

  return format.replace(trunk, function (capture) {
    return maps[capture] ? maps[capture](value) : '';
  });
};