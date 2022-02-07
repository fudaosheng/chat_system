/**
 * 联系人service
 * @auther fudaosheng
 */
const connections = require('../../app/database');
const { TABLE_NAMES, COMMON_TABLE_FIELDS, CONTACTS_TABLE, USER_TABLE } = require('../../constance/tables');
const { getTableSelectColumns, userTableCommonColumns } = require('../../utils');

class ContactService {
  // 获取联系人信息
  async getContactInfo(userId, contactId) {
    // 用到的几个表
    const { CONTACTS, USERS } = TABLE_NAMES;

    // 用户信息,包含备注信息, create_time好友创建时间，update_time好友更新时间
    const userTableSelectColumns = `${getTableSelectColumns(
      userTableCommonColumns.filter(v => ![COMMON_TABLE_FIELDS.CREATE_TIME, COMMON_TABLE_FIELDS.UPDATE_TIME].includes(v)),
      TABLE_NAMES.USERS
    )}, ${getTableSelectColumns(
      [CONTACTS_TABLE.NOTE, CONTACTS_TABLE.CREATE_TIME, CONTACTS_TABLE.UPDATE_TIME],
      TABLE_NAMES.CONTACTS
    )}`;

    const SQL = `SELECT ${userTableSelectColumns} FROM ${CONTACTS} 
        JOIN ${USERS} ON ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${USERS}.${USER_TABLE.ID} WHERE ${CONTACTS}.${CONTACTS_TABLE.USER_ID} = ${userId} AND ${CONTACTS}.${CONTACTS_TABLE.CONTACT_ID} = ${contactId}`;
    const result = await connections.execute(SQL);
    return result[0][0];
  }
}

module.exports = new ContactService();
