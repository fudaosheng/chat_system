/** 时间格式化函数
 * @param date          @new Date()一个Date对象
 * @param fmt           时间格式化时间，'yy-MM-dd'
 */

function padLeftZero(str: string): string {
  return `00${str}`.substr(str.length);
}

export function formatDate(date: Date, fmt: string): string {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  const o: Record<string, any> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = `${o[k]}`;
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

// 时间格式化模版
export const dateFormat = 'yyyy-MM-dd';
export const dateTimeFormat = 'yyyy-MM-dd hh:mm:ss';

export interface DepthFirstSearchOpt {
  traversalKey?: string;
  key?: string; //利用traversalKey转换成新的key
}
// 深度优先遍历同时会修改数据
export const depthFirstSearch = <T extends Record<string, any>>(
  list: Array<T>,
  callback: (item: T) => T,
  opt?: DepthFirstSearchOpt
): Array<T> => {
  const { traversalKey = 'children', key } = opt || {};
  const s = (recordList: Array<T>) => {
    const result: Array<T> = [];
    recordList?.forEach((item, index) => {
      result[index] = callback(item);
      if (item?.[traversalKey]?.length) {
        result[index] = { ...result[index], [key || traversalKey]: s(item[traversalKey]) };
      }
    });
    return result;
  };
  return s(list);
};

export const getURLQuery = () => {
  const { href } = window.location;
  const queryString = href.split('?')[1];
  const query: Record<string, string | number> = {};
  queryString?.split('&')?.forEach(i => {
    const [key, value] = i?.split('=');
    query[key] = Number(value) || value;
  });
  return query;
};
