/**
 * 文本转换emoji表情包
 */
import data from '../assets/emoji.json';

const reg = /(\[[^\]]+\])/ig;
const prefix = 'https://qiyukf.com/sdk/res/portrait/emoji/'

export const getImgHTML = function (obj) {
  var img = '<img ignore class="portrait_icon" style="display: inline-block;width: 21px;height: 21px;vertical-align: middle;" data-id="' + obj.id +
            '" src="' + obj.src + 
            '" title="' + obj.tag + 
            '" alt="' + obj.tag + '">';
  return img;
}
export const text2emoji = function(html) {
  if (!html) return '';
  var pmap = data.pmap;
  var pmap2 = data.pmap2;
  html = html.replace(reg, function(all, $1) {
      var img = getImgHTML({
          id: pmap2[$1],
          tag: $1,
          src: prefix + pmap[pmap2[$1]].file
      });
      return img;
  });
  return html;
};
