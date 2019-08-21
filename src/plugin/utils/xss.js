/**
 * html转义
 * cover from nej
 * nej/src/base/util.js
 */
import { uuid } from './uuid';

/**
 * 编码字符串，
 * 编码规则对象中r正则表达式参数提取字符串需要编码的内容，
 * 然后使用编码规则对象中的映射表进行替换
 *
 * ```js
 * // 把字符串99999根据规则9替换成t，结果：ttttt
 * const str = encode({r:/\d/g,'9':'t'},'99999');
 * ```
 *
 * @param {object} _map      编码规则
 * @param {string} _content  待编码的字串
 * @return {string}          编码后的字串
 *
 */
export const encode = function(_map, _content) {
  _content = '' + _content;
  if (!_map || !_content) {
    return _content || '';
  }
  return _content.replace(_map.r, function($1) {
    let _result = _map[!_map.i ? $1.toLowerCase() : $1];
    return _result != null ? _result : $1;
  });
};

/**
 * 编码html代码，'<' -> '&amp;lt;'
 * @param {string} _content 待编码串
 * @return {string}         编码后的串
 */
export const escape = (function() {
  const _reg = /<br\/?>$/,
    _map = {
      r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      ' ': '&nbsp;',
      '"': '&quot;',
      "'": '&#39;',
      '\n': '<br/>',
      '\r': ''
    };
  return function(_content) {
    _content = encode(_map, _content);
    return _content.replace(_reg, '<br/><br/>');
  };
})();

/**
 * 反编码html代码，'&amp;lt;' -> '<'
 * @param {string} _content 待反编码串
 * @return {string}         反编码后的串
 */
export const unescape = (function() {
  const _map = {
    r: /\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&nbsp;': ' ',
    '&#39;': "'",
    '&quot;': '"',
    '<br/>': '\n'
  };
  return function(_content) {
    return encode(_map, _content);
  };
})();

const URL_SEED = uuid();
const URL_HOLD = new RegExp(
  '\\[' + URL_SEED + '\\](.+?)\\[\\/' + URL_SEED + '\\]',
  'gi'
);
const URL_FILTER = new RegExp(
  "((?:(http|https|rtsp):\\/\\/(?:(?:[a-zA-Z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,64}(?:\\:(?:[a-zA-Z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,25})?\\@)?)?(?:(([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]){0,1}\\.)+[a-zA-Z]{2,63}|((25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9]))))(?:\\:\\d{1,5})?)(\\/(?:(?:[a-zA-Z0-9\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\\;\\/\\?\\:\\@\\&\\=\\#\\~\\-\\.\\+\\!\\*\\'\\(\\)\\,\\_])|(?:\\%[a-fA-F0-9]{2}))*)?(?:\\b|$)",
  'gi'
);

/**
 * 编码URL信息
 *
 * http://a.b.com  ->  [xxxx]http://a.b.com[xxxx]
 *
 * @param content
 * @private
 */
export const encodeUrl = function(content) {
  return (content || '').replace(URL_FILTER, function($1) {
    return '[' + URL_SEED + ']' + $1 + '[/' + URL_SEED + ']';
  });
};

/**
 * 解码URL地址
 *
 * [xxxx]http://a.b.com[xxxx] -> <a target="_blank" href="http://a.b.com">http://a.b.com</a>
 *
 * @param content
 * @private
 */
export const decodeUrl = function(content) {
  RegExp.lastIndex = -1;
  return (content || '').replace(URL_HOLD, function($1, $2) {
    var url = $2 || '';
    if (url.indexOf('://') < 0) {
      url = 'http://' + url;
    }
    return '<a target="_blank" href="' + url + '">' + $2 + '</a>';
  });
};

/**
 * 过滤普通消息文本
 */
export const filterHtml = (function() {
  /**
   * 1. 保留content中的客服操作a标签
   * 2. 转义content
   * 3. 识别http/https链接地址
   * 4. 恢复客服操作a标签
   */
  const seed = uuid();
  const reg1 = new RegExp('\\[' + seed + '(.+?)' + seed + '\\]', 'gi');
  const reg2 = /<a\s+href\s*=\s*('|")qiyu:\/\/action.qiyukf.com\?command=(.+?)\1\s*>(.+?)<\/a>/gi;
  const amap = {
    applyHumanStaff: 'kefu'
  };
  return function(content = '') {
    const xmap = {};
    content = (content || '').replace(reg2, function($1, $2, $3) {
      const name = amap[$3];
      if (!name) {
        return $1;
      }
      const xid = uuid();
      xmap[xid] = $1;
      return '[' + seed + xid + seed + ']';
    });
    content = decodeUrl(escape(encodeUrl(content)));
    return content.replace(reg1, function($1, $2) {
      return xmap[$2] || $1;
    });
  };
})();
