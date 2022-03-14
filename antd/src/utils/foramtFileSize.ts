/**
 * 文件大小 字节转换单位
 * @param size
 * @returns {string|*}
 */
export const formatSize = (size) => {
  if (!size) return '';
  return size < 1024
    ? size + ' B'
    : size < pow1024(2)
    ? (size / 1024).toFixed(2) + ' KB'
    : size < pow1024(3)
    ? (size / pow1024(2)).toFixed(2) + ' MB'
    : size < pow1024(4)
    ? (size / pow1024(3)).toFixed(2) + ' GB'
    : (size / pow1024(4)).toFixed(2) + ' TB';
};

// 求次幂
function pow1024(num) {
  return Math.pow(1024, num);
}
