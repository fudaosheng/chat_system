const connections = require('../../app/database');
require('colors');
const { isDb, objNotEmpty, deleteEmptyField } = require('./utils');
class DbService {

  connections;
  constructor() {
    this.connections = connections;
  }
  /**
   *
   * @param {*} query Record<string, string> => SQL精确查询条件
   * @returns SQL精确查询条件
   */
  _queryCondition(query) {
    let condition = '';
    if (objNotEmpty(query)) {
      const keys = Object.keys(query);
      condition = keys.reduce((queryCondition, key, index) => {
        if (index === keys.length - 1) {
          queryCondition += `${key} = ?`;
        } else {
          queryCondition += `${key} = ? AND `;
        }
        return queryCondition;
      }, '');
    }
    return condition;
  }

  /**
   *
   * @param {*} query Record<string, string> => 模糊查询的条件语句
   * @returns name LIKE '%aa%' AND id LIKE '%12%'
   */
  _likeQueryCondition(query) {
    let condition = '';
    if (objNotEmpty(query)) {
      const keys = Object.keys(query);
      condition = keys.reduce((queryCondition, key, index) => {
        if (index === keys.length - 1) {
          queryCondition += `${key} LIKE '%${query[key]}%'`;
        } else {
          queryCondition += `${key} LIKE '%${query[key]}%' AND `;
        }
        return queryCondition;
      }, '');
    }
    return condition;
  }

  /**
   *
   * @param {*} obj Record<string,string> => 更新SQL的assignmentList
   * @returns string
   */
  _assignmentList(obj) {
    if (objNotEmpty(obj)) {
      const assignments = Object.entries(obj)
        .map(item => {
          if (typeof item[1] === 'string') {
            item[1] = `'${item[1]}'`;
          }
          return item.join(' = ');
        })
        .join(', ');
      return assignments;
    }
  }
  /**
   *
   * @param {*} query 查询条件对象
   * @param {*} db 要查询的数据库名称
   * @param {*} opt 可选配置项
   * opt = {
   *   isLikeQuery = false, 是否是模糊查询，默认精确查询
   *   columns: [col1, col2, col3]，要查询的列
   *   orderBy: [fieldname, ASC|DESC], // 排序
   * }
   * @returns array<Record<string, unknown>>
   */
  async query(query, db, opt = {}) {
    const { isLikeQuery = false, columns = [], orderBy = [] } = opt;

    if (objNotEmpty(query) && isDb(db)) {
      // 查询条件
      const queryCondition = isLikeQuery ? this._likeQueryCondition(query) : this._queryCondition(query);
      // 要查询的列
      const queryColumns = columns.length ? columns.join(', ') : '*';
      let SQL = `SELECT ${queryColumns} FROM ${db} WHERE ${queryCondition}`;
      // 排序
      if(orderBy.length) {
        SQL += ' ORDER BY ' + orderBy.join(' ');
      }
      const values = Object.values(query);

      // debug log
      console.log(`*************************************************`.green);
      if (isLikeQuery) {
        console.log(`Query SQL：${SQL}`.green);
      } else {
        console.log(`Query SQL：${SQL}, values: ${values.join(', ')}`.green);
      }
      console.log(`*************************************************`.green);

      try {
        const result = await connections.query(SQL, values);
        return result[0];
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('call query function error, please check arguments');
    }
  }

  async insert(record, db) {
    if (isDb(db) && objNotEmpty(record)) {
      record = deleteEmptyField(record);
      const keys = Object.keys(record);
      const columns = keys.join(', ');
      const placeholders = new Array(keys.length).fill('?').join(', ');
      const SQL = 'INSERT INTO ' + '`' + db + '`' + ` (${columns}) VALUES (${placeholders})`;

      const values = Object.values(record);

      console.log(`*************************************************`.green);
      console.log(`Insert SQL：${SQL}, values: ${values.join(', ')}`.green);
      console.log(`*************************************************`.green);

      try {
        const result = await connections.execute(SQL, values);
        return result[0];
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('call insert function error, please check arguments');
    }
  }

  /**
   *
   * @param {*} record 要更新的字段，type：object
   * @param {*} condition 查询条件
   * @param {*} db
   */
  async update(record, condition, db) {
    if (isDb(db) && objNotEmpty(record)) {
      const assignmentList = this._assignmentList(record);
      const queryCondition = this._queryCondition(condition);
      const SQL = `UPDATE ${db} SET ${assignmentList} WHERE ${queryCondition}`;
      const result = await connections.execute(SQL, Object.values(condition));
      return result[0];
    } else {
      throw new Error('call update function error, please check arguments');
    }
  }

  async delete(condition, db) {
    if (isDb(db) && objNotEmpty(condition)) {
      const queryCondition = this._queryCondition(condition);
      const SQL = `DELETE FROM ${db} WHERE ${queryCondition}`;
      const result = await connections.execute(SQL, Object.values(condition));
      return result[0];
    } else {
      throw new Error('call delete function error, please check arguments');
    }
  }
}

module.exports = DbService;
