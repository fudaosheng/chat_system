const connections = require('../../app/database');
const { isDb, objNotEmpty, deleteEmptyField } = require('./utils');
class DbService {
  /**
   *
   * @param {*} query 查询条件对象
   * @returns
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
   * @param {*} obj 要生成update SQL的assignmentList的对象
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
   * @returns array<Record<string, unknown>>
   */
  async query(query, db) {
    if (objNotEmpty(query) && isDb(db)) {
      const queryCondition = this._queryCondition(query);
      const SQL = `SELECT * FROM ${db} WHERE ${queryCondition}`;
      const values = Object.values(query);
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
      const SQL = `INSERT INTO ${db} (${columns}) VALUES (${placeholders})`;
      try {
        const result = await connections.execute(SQL, Object.values(record));
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
