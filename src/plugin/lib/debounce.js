export default function debounce(fn, delay, imed) {
  var timer = null
  return function () {
      var ctx = this
      var args = arguments
      if (!timer && imed) {
          fn.apply(ctx, args)
      }
      clearTimeout(timer)
      timer = setTimeout(function(){
          if (!imed) {
              fn.apply(ctx, args)
          } else {
              timer = null
          }
      }, delay)
  }
}
