const regexEnum = {
  intege: '^-?[1-9]\\d*$', // 整数
  intege1: '^[1-9]\\d*$', // 正整数
  intege2: '^-[1-9]\\d*$', // 负整数
  digits: '^([+-]?)\\d*\\.?\\d+$', // 数字
  num1: '^([+]?)\\d*$', // 正数（正整数 + 0）
  num2: '^-[1-9]\\d*|0$', // 负数（负整数 + 0）
  num3: '^([+]?)\\d*\\.?\\d+$', // 正数
  decmal: '^([+-]?)\\d*\\.\\d+$', // 浮点数
  decmal1: '^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$', // 正浮点数
  decmal2: '^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$', // 负浮点数
  decmal3: '^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$', // 浮点数
  decmal4: '^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$', // 非负浮点数（正浮点数 + 0）
  decmal5: '^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$', // 非正浮点数（负浮点数 +
  // 0）
  email: '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$', // 邮件
  color: '^[a-fA-F0-9]{6}$', // 颜色
  url: '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]', // url
  chinese: '^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$', // 仅中文
  ascii: '^[\\x00-\\xFF]+$', // 仅ACSII字符
  zipcode: '^\\d{6}$', // 邮编
  mobile: '^(13|15|18|14)[0-9]{9}$', // 手机
  ip4: '^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$', // ip地址
  required: '^\\S+$', // 非空
  picture: '(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$', // 图片
  jpg: '(.*)\\.(jpg|gif)$', // 图片
  rar: '(.*)\\.(rar|zip|7zip|tgz)$', // 压缩文件
  date: '^\\d{4}(\\-|\\/|.)\\d{1,2}\\1\\d{1,2}$', // 日期
  time: '([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])', // 时间
  qq: '[1-9][0-9]{4,}', // QQ号码
  tel: '^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$', // 电话号码的函数(包括验证国内区号,国际区号,分机号)
  username: '^\\w+$', // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
  password: '^(?=.*\\d)(?=.*[a-zA-Z])[\\da-zA-Z~!@#$%^&*]{6,18}$', // 密码(长度6-18位  字符串类型：数字 英文 特殊符号且必须包含数字及英文)
  letters: '^[A-Za-z]+$', // 字母
  letter_u: '^[A-Z]+$', // 大写字母
  letter_l: '^[a-z]+$', // 小写字母
  letter_num: '^\\w+$', // 匹配由数字、26个英文字母或者下划线组成的字符串
  idcard: '(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)', // 身份证
  htmlcode: '^[^\\\\\'"<>@#$&]+$', // 禁止输入html代码（特殊字符）
  uploadFile: '(.*)\\.(jpg|bmp|gif|png|jpeg|tif|pdf|doc|docx|xls|xlsx|ppt|pptx)$', // 图片
};
const errMsg = {
  required: '必填',
  digits: '请填写数字',
  letters: '请填写字母',
  date: '日期格式错误:YYYY-MM-DD',
  time: '时间格式错误:HH:mm:ss',
  email: '请输入正确的邮箱',
  url: '请输入正确的网址',
  qq: '请输入正确的QQ号码',
  IDcard: '请输入正确的身份证号码',
  mobile: '请输入正确的手机号码',
  tel: '请输入正确的座机号码',
  zipcode: '请输入正确的邮编号码',
  password: '6-18位且必须包含数字及英文',
  chinese: '请输入中文(不包含其他字符)',
  username: '数字、26个英文字母或下划线',
};

interface Res {
  isValid: boolean;
  errMsg: string;
}

const res: Res = { isValid: true, errMsg: '' };

export const validateType = (rules, val) => {
  const isValid = rules.every((item) => {
    const reg = new RegExp(regexEnum[item]);
    res.errMsg = errMsg[item];
    return reg.test(val);
  });
  res.isValid = isValid;
  if (isValid) {
    res.errMsg = '';
  }
  return res;
};
