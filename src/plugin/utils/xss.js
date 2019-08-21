/**
 * html转义
 * cover from nej
 * nej/src/base/util.js
 */

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
export const unescape = (function(){
  const _map = {r:/\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,'&lt;':'<','&gt;':'>','&amp;':'&','&nbsp;':' ','&#39;':"'",'&quot;':'"','<br/>':'\n'};
  return function(_content){
      return encode(_map,_content);
  };
})();
