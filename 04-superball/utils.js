/* jshint esversion: 6 */

function zip(arr1, arr2) {
  let len = Math.min(arr1.length, arr2.length);
  if (len) {
    let zipArr = new Array(len);
    for (let i = 0; i < len; ++i) {
      zipArr[i] = [arr1[i], arr2[i]];
    }
    return zipArr;
  }
  else {
    return []
  }
}

function bind(func, context) {
  function newfunc() {
    return func.apply(context, arguments);
  }
  return newfunc;
}
