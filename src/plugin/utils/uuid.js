export const uuid = (function() {
  let _seed = +new Date();
  return function() {
    return '' + _seed++;
  };
})();
