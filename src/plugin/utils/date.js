/**
 * 时间戳转为日期的格式
 * @param value
 * @param format  可选 默认 'yyyy-MM-dd HH:mm'
 * @returns {*}
 */
export const timestamp2date = (value, format = 'yyyy-MM-dd HH:mm') => {
    if (!value) return '--';

    const fix = (str) => {
        str = '' + (String(str) || '');
        return str.length <= 1 ? '0' + str : str;
    }

    let maps = {
      yyyy: function(date) {
        return date.getFullYear();
      },
      MM: function(date) {
        return fix(date.getMonth() + 1);
      },
      dd: function(date) {
        return fix(date.getDate());
      },
      HH: function(date) {
        return fix(date.getHours());
      },
      mm: function(date) {
        return fix(date.getMinutes());
      },
      ss: function(date) {
        return fix(date.getSeconds());
      },
    };
  
    let trunk = new RegExp(Object.keys(maps).join('|'), 'g');
  
    value = new Date(value || +new Date());
  
    return format.replace(trunk, function(capture) {
      return maps[capture] ? maps[capture](value) : '';
    });
  };
  