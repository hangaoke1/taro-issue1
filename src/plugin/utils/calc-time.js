/**
 * 视频时长转换
 * @param {number} time 视频毫秒数
 */

export const calcTime = function (time) {
  const seconds = Math.round(time / 1000);
  const minites = Math.floor(seconds / 60);
  const secondsShow = seconds - minites * 60;
  return `${minites}:${secondsShow >= 10 ? secondsShow : '0' + secondsShow}`
}
