export function getDateDiff(publishTime) {
  const timeNow: number = parseInt(new Date().getTime() / 1000);
  const date = new Date(publishTime * 1000);
  const Y = date.getFullYear();
  let M: number | string = date.getMonth() + 1;
  let D: number | string = date.getDate();
  let H: number | string = date.getHours();
  let m: number | string = date.getMinutes();
  let s: number | string = date.getSeconds();
  //小于10的在前面补0
  if (M < 10) {
    M = '0' + M;
  }
  if (D < 10) {
    D = '0' + D;
  }
  if (H < 10) {
    H = '0' + H;
  }
  if (m < 10) {
    m = '0' + m;
  }
  if (s < 10) {
    s = '0' + s;
  }

  const d = timeNow - publishTime;
  const d_days = parseInt(d / 86400);
  const d_hours = parseInt(d / 3600);
  const d_minutes = parseInt(d / 60);
  const d_seconds = parseInt(d);

  if (d_days > 0 && d_days < 3) {
    return d_days + '天前';
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前';
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前';
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚';
    } else {
      return d_seconds + '秒前';
    }
  } else {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
  }
}
