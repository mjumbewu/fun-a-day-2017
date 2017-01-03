/* jshint esversion: 6 */

function zip(arr1, arr2) {
  let len = Math.min(arr1.length, arr2.length);
  let zipArr = new Array(len);
  for (let i = 0; i < len; ++i) {
    zipArr[i] = [arr1[i], arr2[i]];
  }
  return zipArr;
}
