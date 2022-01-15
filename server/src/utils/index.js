const { TABLE_NAMES, USER_TABLE } = require('../constance/tables');

const crypto = require('crypto');

/** 时间格式化函数 */
function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = `${o[k]}`;
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return `00${str}`.substr(str.length);
}

const encryption = content => {
  const md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

// 将一个数组转换成符合SQL规范的列字符串，如： table.`status` `status`
const getTableSelectColumns = (columns = [], tableName = TABLE_NAMES.USERS) => {
  return columns.map(k => `${tableName}.` + '`' + k + '` ' + '`' + k + '`').join(', ');
}
// 将一个数组转换成符合SQL JSON_OBJECT规范的列字符串，如： `status`, table.`status`
const getJSONOBJECTColumns = (columns = [], tableName = TABLE_NAMES.USERS) => {
  return columns.map(k => "'" + k + "', " + `${tableName}.` + '`' + k + '`').join(', ');
}

// user表中不涉密的columns
const userTableCommonColumns = Object.values(USER_TABLE).filter(k => k !== USER_TABLE.PASSWORD);

module.exports = {
  formatDate,
  encryption,
  getTableSelectColumns,
  getJSONOBJECTColumns,
  userTableCommonColumns
};
