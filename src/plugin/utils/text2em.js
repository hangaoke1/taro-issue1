/**
 * 匹配关键字标红
 * @param {string} text 联想文本内容
 * @param {string} keyword 联想关键字
 */
export const text2em = function (text, keyword) {
  const reg = new RegExp(keyword, 'g');
  return text.replace(reg, '<em style="color: red;font-style: normal;">$&</em>')
}
