/**
 * 计算图片及视频在限制最大宽度和高度情况下大小
 * @param {number} w 图片、视频宽度
 * @param {number} h 图片、视频高度
 * @param {number} maxWidth 最大宽度
 * @param {number} maxHeight 最大高度
 * @return {object} 计算后的宽度和高度
 */

 export const calcMsg = function (w, h, maxWidth = 120, maxHeight = 120) {
    let nWidth;
    let nHeight;
    const ratio = w / h
    if (ratio > 1) {
      nWidth = w > maxWidth ? maxWidth : w;
      nHeight = nWidth / ratio;
    } else {
      nHeight = h > maxHeight ? maxHeight : h;
      nWidth = nHeight * ratio;
    }
    return {
      width: nWidth,
      height: nHeight
    }
 }